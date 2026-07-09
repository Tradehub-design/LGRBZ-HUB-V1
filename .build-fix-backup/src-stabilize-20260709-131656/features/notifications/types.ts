export type NotificationType = "Price Alert" | "Dividend" | "Report" | "System";

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: string;
  read: boolean;
};