/* ===========================================================
   Fiktive CO₂-Emissionsdaten
   Alle Werte sind frei erfunden und dienen nur der Demonstration.
   emissions = Mt CO₂ pro Jahr (Megatonnen)
   =========================================================== */
const CO2_DATA = [
  { country: "Deutschland",  company: "Nordwind Energie AG",       sector: "Energie",     emissions: 58.4, year: 2024 },
  { country: "Deutschland",  company: "Rheintal Stahl GmbH",       sector: "Industrie",   emissions: 42.1, year: 2024 },
  { country: "Deutschland",  company: "AlpTransport SE",           sector: "Verkehr",     emissions: 19.7, year: 2023 },
  { country: "Frankreich",   company: "Lumière Power S.A.",        sector: "Energie",     emissions: 33.9, year: 2024 },
  { country: "Frankreich",   company: "Acier du Sud",              sector: "Industrie",   emissions: 27.5, year: 2023 },
  { country: "Polen",        company: "Wisła Coal Group",          sector: "Bergbau",     emissions: 71.2, year: 2024 },
  { country: "Polen",        company: "Baltyk Chemie",             sector: "Chemie",      emissions: 15.3, year: 2022 },
  { country: "Spanien",      company: "Sol y Mar Cementos",        sector: "Baustoffe",   emissions: 24.8, year: 2023 },
  { country: "Spanien",      company: "Iberia Aviación",           sector: "Verkehr",     emissions: 12.6, year: 2024 },
  { country: "Italien",      company: "Vesuvio Petrol",            sector: "Öl & Gas",    emissions: 49.0, year: 2024 },
  { country: "Italien",      company: "Toscana Ceramica",          sector: "Baustoffe",   emissions:  8.9, year: 2022 },
  { country: "Niederlande",  company: "Delta Refinery BV",         sector: "Öl & Gas",    emissions: 38.7, year: 2024 },
  { country: "Niederlande",  company: "Polder AgriFood",           sector: "Landwirtschaft", emissions: 11.4, year: 2023 },
  { country: "Schweden",     company: "Norrland Papper AB",        sector: "Papier",      emissions:  6.2, year: 2023 },
  { country: "Österreich",   company: "Tauern Zement AG",          sector: "Baustoffe",   emissions: 14.1, year: 2024 },
  { country: "Belgien",      company: "Meuse Chemicals",           sector: "Chemie",      emissions: 21.3, year: 2022 },
  { country: "Tschechien",   company: "Vltava Kohle a.s.",         sector: "Bergbau",     emissions: 36.5, year: 2023 },
  { country: "Portugal",     company: "Atlântico Energia",         sector: "Energie",     emissions:  9.8, year: 2024 }
];