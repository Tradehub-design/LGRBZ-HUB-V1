export const productionChecklist = [
  { id: "branding", title: "LGRBZ branding", complete: true },
  { id: "routes", title: "Routes compile", complete: false },
  { id: "build", title: "Production build", complete: false },
  { id: "deploy", title: "Vercel deploy", complete: false }
];

export function getProductionChecklist() {
  return productionChecklist;
}
