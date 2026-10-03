"use client";

import { CreateTripDialog } from "@/components/dashboard/create-trip-dialog";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { GettingStartedCard } from "@/components/dashboard/getting-started-card";
import { useDashboard } from "@/lib/hooks/dashboard/use-dashboard";
import { MobileNavigation } from "@/components/dashboard/mobile-navigation";
import { SummarySection } from "@/components/dashboard/summary-section";
import { TripsSection } from "@/components/dashboard/trips-section";
import { WelcomeCard } from "@/components/dashboard/welcome-card";

export function DashboardShell() {
  const dashboard = useDashboard();

  return (
    <div className="dashboard-mobile-font min-h-dvh bg-[#f7f7f3] text-[#11120f]">
      <DashboardHeader
        profile={dashboard.profile}
        onCreateTrip={dashboard.openCreateTrip}
        canCreate={dashboard.canCreate}
      />

      <main className="mx-auto w-full max-w-7xl px-4 pt-4 pb-32 sm:px-6 sm:pt-6 lg:px-8 lg:pt-9 lg:pb-14">
        <WelcomeCard profileName={dashboard.profile.name} totalLabel={dashboard.totalLabel} />
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
          createButtonRef={dashboard.createButtonRef}
        />
        <SummarySection />
      </main>

      <MobileNavigation onCreateTrip={dashboard.openCreateTrip} canCreate={dashboard.canCreate} />

      {dashboard.isCreateOpen && (
        <CreateTripDialog
          name={dashboard.name}
          currency={dashboard.currency}
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

      <span className="sr-only" role="status" aria-live="polite">
        {dashboard.notice}
      </span>
    </div>
  );
}
