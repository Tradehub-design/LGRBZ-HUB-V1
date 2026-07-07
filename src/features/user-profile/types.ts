export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Viewer";
  baseCurrency: string;
  timezone: string;
  plan: string;
};