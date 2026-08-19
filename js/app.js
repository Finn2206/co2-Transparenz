/* ===========================================================
   CO₂-Transparenz – Anwendungslogik
   - Tabelle rendern
   - nach Land und Unternehmen filtern
   - über Spaltenköpfe sortieren
   - Eingaben gegen Code-Injektion (XSS) absichern
   - Leserichtung (LTR/RTL) je nach Schriftkultur umschalten
   =========================================================== */

document.addEventListener("DOMContentLoaded", () => {

  // --- DOM-Referenzen ---------------------------------------------------
  const tableBody     = document.getElementById("tableBody");
  const filterCountry = document.getElementById("filterCountry");
  const filterCompany = document.getElementById("filterCompany");
  const resetBtn      = document.getElementById("resetBtn");
  const rowCount      = document.getElementById("rowCount");
  const filterEcho    = document.getElementById("filterEcho");
  const langSelect    = document.getElementById("langSelect");
  const headers       = document.querySelectorAll('#co2Table thead th[data-key]');

  // Sortierzustand
  let sortKey = null;
  let sortDir = 1; // 1 = aufsteigend, -1 = absteigend

  /* -------------------------------------------------------------------
     SICHERHEIT: Eingaben gegen Code-Injektion absichern
     1) escapeHTML() wandelt Sonderzeichen in harmlose Entities um.
     2) Beim Schreiben in die Tabelle wird ausschließlich textContent
        genutzt – so wird eingegebener Code niemals als HTML ausgeführt.
     ------------------------------------------------------------------- */
  function escapeHTML(str) {
    return String(str).replace(/[&<>"'`]/g, ch => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;",
      '"': "&quot;", "'": "&#39;", "`": "&#96;"
    }[ch]));
  }

  // Eingabe säubern: nur unbedenkliche Zeichen für die Suche zulassen
  function sanitizeInput(value) {
    return value
      .replace(/[<>]/g, "")          // spitze Klammern entfernen (Tag-Anfang)
      .slice(0, 40)                  // Länge begrenzen
      .trimStart();
  }

  /* -------------------------------------------------------------------
     Länder-Auswahlliste aus den Daten aufbauen (alphabetisch)
     ------------------------------------------------------------------- */
  function fillCountryOptions() {
    const countries = [...new Set(CO2_DATA.map(d => d.country))].sort((a, b) =>
      a.localeCompare(b, "de"));
    countries.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;              // sicher: textContent statt innerHTML
      filterCountry.appendChild(opt);
    });
  }

  /* -------------------------------------------------------------------
     Daten nach aktiven Filtern zusammenstellen
     ------------------------------------------------------------------- */
  function getFilteredData() {
    const country = filterCountry.value;
    const company = sanitizeInput(filterCompany.value).toLowerCase();

    return CO2_DATA.filter(d => {
      const matchCountry = !country || d.country === country;
      const matchCompany = !company || d.company.toLowerCase().includes(company);
      return matchCountry && matchCompany;
    });
  }

  /* -------------------------------------------------------------------
     Sortierung anwenden
     ------------------------------------------------------------------- */
  function applySort(rows) {
    if (!sortKey) return rows;
    return [...rows].sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey];
      if (typeof va === "string") { va = va.toLowerCase(); vb = vb.toLowerCase(); }
      if (va < vb) return -1 * sortDir;
      if (va > vb) return  1 * sortDir;
      return 0;
    });
  }

  /* -------------------------------------------------------------------
     Tabelle rendern
     ------------------------------------------------------------------- */
  function render() {
    const rows = applySort(getFilteredData());
    tableBody.textContent = ""; // leeren

    if (rows.length === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 5;
      td.className = "text-center text-muted py-3";
      td.textContent = "Keine Datensätze für die aktuelle Auswahl.";
      tr.appendChild(td);
      tableBody.appendChild(tr);
    } else {
      rows.forEach(d => {
        const tr = document.createElement("tr");
        // Jede Zelle wird über textContent gesetzt -> kein HTML-/Code-Einschleusen möglich
        [
          { v: d.country,  cls: "" },
          { v: d.company,  cls: "" },
          { v: d.sector,   cls: "" },
          { v: d.emissions.toLocaleString("de-DE", { minimumFractionDigits: 1 }), cls: "text-end" },
          { v: d.year,     cls: "text-end" }
        ].forEach(cell => {
          const td = document.createElement("td");
          td.className = cell.cls;
          td.textContent = cell.v;
          tr.appendChild(td);
        });
        tableBody.appendChild(tr);
      });
    }

    rowCount.textContent = `${rows.length} von ${CO2_DATA.length} Datensätzen angezeigt.`;
    updateFilterEcho();
  }

  /* -------------------------------------------------------------------
     Rückmeldung zum Suchbegriff – bewusst mit textContent,
     um zu zeigen, dass eingegebener Code NICHT ausgeführt wird.
     ------------------------------------------------------------------- */
  function updateFilterEcho() {
    const raw = filterCompany.value;
    if (raw.trim() === "") { filterEcho.textContent = ""; return; }
    // Anzeige des (gesäuberten) Suchbegriffs als reiner Text
    filterEcho.textContent = `Aktive Suche: „${sanitizeInput(raw)}"`;
  }

  /* -------------------------------------------------------------------
     Sortier-Indikatoren der Kopfzeile aktualisieren
     ------------------------------------------------------------------- */
  function updateHeaderIndicators() {
    headers.forEach(th => {
      if (th.dataset.key === sortKey) {
        th.setAttribute("aria-sort", sortDir === 1 ? "ascending" : "descending");
      } else {
        th.setAttribute("aria-sort", "none");
      }
    });
  }

  /* -------------------------------------------------------------------
     Leserichtung je nach gewählter Schriftkultur setzen
     LTR (Deutsch/English): lokales Menü links
     RTL (Arabisch):        lokales Menü rechts  -> vom Grid automatisch
     ------------------------------------------------------------------- */
  function setDirection(lang) {
    const rtl = (lang === "ar");
    document.documentElement.lang = lang;
    document.documentElement.dir  = rtl ? "rtl" : "ltr";
  }

  // --- Ereignisse -------------------------------------------------------
  filterCountry.addEventListener("change", render);
  filterCompany.addEventListener("input", () => {
    // Feldwert direkt säubern (verhindert sichtbares Einfügen von Tags)
    filterCompany.value = sanitizeInput(filterCompany.value);
    render();
  });

  resetBtn.addEventListener("click", () => {
    filterCountry.value = "";
    filterCompany.value = "";
    sortKey = null; sortDir = 1;
    updateHeaderIndicators();
    render();
  });

  headers.forEach(th => {
    th.addEventListener("click", () => {
      const key = th.dataset.key;
      if (sortKey === key) { sortDir *= -1; }   // Richtung umkehren
      else { sortKey = key; sortDir = 1; }
      updateHeaderIndicators();
      render();
    });
  });

  langSelect.addEventListener("change", e => setDirection(e.target.value));

  // --- Initialisierung --------------------------------------------------
  fillCountryOptions();
  render();
});