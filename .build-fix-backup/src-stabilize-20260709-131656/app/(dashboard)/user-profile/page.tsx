import { AccountUsageCard } from "@/features/user-profile/components/account-usage-card";
import { ConnectedAccountsCard } from "@/features/user-profile/components/connected-accounts-card";
import { PreferencesOverviewCard } from "@/features/user-profile/components/preferences-overview-card";
import { ProfileActionsCard } from "@/features/user-profile/components/profile-actions-card";
import { ProfileDetailsCard } from "@/features/user-profile/components/profile-details-card";
import { ProfileFooter } from "@/features/user-profile/components/profile-footer";
import { ProfileSummaryCard } from "@/features/user-profile/components/profile-summary-card";
import { UserProfileHeader } from "@/features/user-profile/components/user-profile-header";

export default function UserProfilePage() {
  return (
    <div className="space-y-6">
      <UserProfileHeader />
      <ProfileSummaryCard />

      <div className="grid gap-6 xl:grid-cols-2">
        <ProfileDetailsCard />
        <ProfileActionsCard />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <ConnectedAccountsCard />
        <AccountUsageCard />
        <PreferencesOverviewCard />
      </div>

      <ProfileFooter />
    </div>
  );
}