export const defaultPreferences = {
  theme: "system",
  currency: "AUD",
  dateFormat: "DD/MM/YYYY",
  compactMode: false
};

export function getUserPreferences() {
  return defaultPreferences;
}
