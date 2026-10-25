"use client";

import { Button } from "@/components/ui/button";
import { CreateTripDialog } from "@/components/dashboard/create-trip-dialog";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { GettingStartedCard } from "@/components/dashboard/getting-started-card";
import { useSessionAccount } from "@/lib/hooks/auth/use-session";
import { useDashboard } from "@/lib/hooks/dashboard/use-dashboard";
import { MobileNavigation } from "@/components/dashboard/mobile-navigation";
import { TripsSection } from "@/components/dashboard/trips-section";
import { WelcomeCard } from "@/components/dashboard/welcome-card";

export function DashboardShell() {
  const dashboard = useDashboard();
  const account = useSessionAccount();

  return (
    <div className="dashboard-mobile-font min-h-dvh bg-[#f7f7f3] text-[#11120f]">
      <DashboardHeader
        onCreateTrip={dashboard.openCreateTrip}
        canCreate={dashboard.canCreate}
        displayName={account.session.user.displayName}
        onLogout={account.logout}
        loggingOut={account.loggingOut}
      />
      {account.logoutError && (
        <p role="alert" className="mx-auto max-w-7xl px-6 pt-3 text-sm text-red-700">
          {account.logoutError}
        </p>
      )}

      <main className="mx-auto w-full max-w-7xl px-4 pt-4 pb-32 sm:px-6 sm:pt-6 lg:px-8 lg:pt-9 lg:pb-14">
        {dashboard.status === "loading" && (
          <p role="status" className="mb-5">
            กำลังโหลดทริป…
          </p>
        )}
        {(dashboard.loadError || dashboard.uncertain) && (
          <div className="mb-5 space-y-3">
            <p role="alert">{dashboard.loadError || dashboard.createDisabledMessage}</p>
            <Button onClick={dashboard.retry}>โหลดรายการใหม่</Button>
          </div>
        )}
        <WelcomeCard totalLabel={dashboard.totalLabel} />
        <GettingStartedCard
          onCreateTrip={dashboard.openCreateTrip}
          canCreate={dashboard.canCreate}
        />
        <TripsSection
          trips={dashboard.trips}
          tripCount={dashboard.tripCount}
          maxTrips={dashboard.maxTrips}
          sortLabel={dashboard.sortLabel}
          onToggleSort={dashboard.toggleSort}
          onCreateTrip={dashboard.openCreateTrip}
          canCreate={dashboard.canCreate}
          disabledMessage={dashboard.createDisabledMessage}
          empty={dashboard.status === "ready" && dashboard.tripCount === 0}
          createButtonRef={dashboard.createButtonRef}
        />
      </main>

      <MobileNavigation onCreateTrip={dashboard.openCreateTrip} canCreate={dashboard.canCreate} />

      {dashboard.isCreateOpen && (
        <CreateTripDialog
          name={dashboard.name}
          currency={dashboard.currency}
          saving={dashboard.saving}
          canSubmit={dashboard.canSubmit}
          currencyOptions={dashboard.currencyOptions}
          error={dashboard.error}
          tripCount={dashboard.tripCount}
          maxTrips={dashboard.maxTrips}
          inputRef={dashboard.inputRef}
          dialogRef={dashboard.dialogRef}
          titleId={dashboard.dialogTitleId}
          descriptionId={dashboard.dialogDescriptionId}
          errorId={dashboard.dialogErrorId}
          onNameChange={dashboard.onNameChange}
          onCurrencyChange={dashboard.onCurrencyChange}
          onClose={dashboard.closeCreateTrip}
          onSubmit={dashboard.submitCreateTrip}
          onBackdropMouseDown={dashboard.handleBackdropMouseDown}
        />
      )}
    </div>
  );
}
