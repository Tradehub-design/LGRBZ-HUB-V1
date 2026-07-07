import { NotificationActionsCard } from "@/features/notifications/components/notification-actions-card";
import { NotificationHistoryCard } from "@/features/notifications/components/notification-history-card";
import { NotificationPreferencesCard } from "@/features/notifications/components/notification-preferences-card";
import { NotificationsFooter } from "@/features/notifications/components/notifications-footer";
import { NotificationsHeader } from "@/features/notifications/components/notifications-header";
import { NotificationsList } from "@/features/notifications/components/notifications-list";
import { NotificationsSummaryCards } from "@/features/notifications/components/notifications-summary-cards";
import { PriceAlertsCard } from "@/features/notifications/components/price-alerts-card";

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <NotificationsHeader />

      <NotificationsSummaryCards />

      <div className="grid gap-6 xl:grid-cols-3">
        <NotificationPreferencesCard />
        <PriceAlertsCard />
        <NotificationHistoryCard />
      </div>

      <NotificationActionsCard />

      <NotificationsList />

      <NotificationsFooter />
    </div>
  );
}