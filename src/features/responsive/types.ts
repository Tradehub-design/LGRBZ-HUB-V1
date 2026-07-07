export type BreakpointStatus = "Optimised" | "Needs Review";

export type ResponsiveCheck = {
  id: string;
  area: string;
  mobile: BreakpointStatus;
  tablet: BreakpointStatus;
  desktop: BreakpointStatus;
};