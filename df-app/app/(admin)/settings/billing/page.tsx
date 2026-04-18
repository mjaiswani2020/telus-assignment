"use client";

import { PageHeader } from "@/components/admin/page-header";
import { SettingsNav } from "@/components/admin/settings-nav";

export default function BillingSettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" />

      <div className="mt-4">
        <SettingsNav />
      </div>

      <div className="mt-12 text-center">
        <p className="font-inter text-body-lg text-tertiary-text">
          Coming soon
        </p>
      </div>
    </div>
  );
}
