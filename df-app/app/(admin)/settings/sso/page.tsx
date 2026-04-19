"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Upload, CheckCircle2, Users } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { SettingsNav } from "@/components/admin/settings-nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { fadeSlideUp } from "@/lib/animations";

const providers = [
  { id: "saml", name: "SAML 2.0", description: "Enterprise SSO standard" },
  { id: "oidc", name: "OIDC", description: "OpenID Connect protocol" },
  {
    id: "google",
    name: "Google Workspace",
    description: "Google enterprise SSO",
  },
  { id: "okta", name: "Okta", description: "Identity management platform" },
];

export default function SSOPage() {
  const [selectedProvider, setSelectedProvider] = useState("okta");
  const [enforceSso, setEnforceSso] = useState(true);
  const [connectionTested, setConnectionTested] = useState(true);
  const [entityId, setEntityId] = useState(
    "https://dataforge.app/saml/metadata"
  );
  const [ssoUrl, setSsoUrl] = useState(
    "https://telus.okta.com/app/dataforge/sso/saml"
  );

  return (
    <div>
      <PageHeader title="Settings" />

      <div className="mt-4">
        <SettingsNav />
      </div>

      <div className="stagger-children mt-4 space-y-6">
        {/* Active SSO status */}
        <motion.div
          className="flex items-center gap-3"
          variants={fadeSlideUp}
          initial="hidden"
          animate="visible"
        >
          <Badge variant="success" dot>
            SSO Active — Okta
          </Badge>
          <span className="flex items-center gap-1.5 font-inter text-[12px] text-tertiary-text">
            <Users className="h-3.5 w-3.5" />
            28 users synced · Last sync: 2 hours ago
          </span>
        </motion.div>

        {/* Provider Selection */}
        <div>
          <h3 className="mb-3 font-inter text-[14px] font-semibold text-ink">
            Identity Provider
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {providers.map((provider) => {
              const isSelected = selectedProvider === provider.id;
              return (
                <button
                  key={provider.id}
                  onClick={() => setSelectedProvider(provider.id)}
                  className={cn(
                    "flex items-start gap-3 rounded-comfortable border p-4 text-left transition-all duration-150",
                    isSelected
                      ? "border-[#005151] bg-[#E6F2F2] ring-2 ring-[#005151]/20"
                      : "border-level-2 bg-white hover:border-level-3"
                  )}
                >
                  <div
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                      isSelected
                        ? "border-[#005151] bg-[#005151]"
                        : "border-level-3 bg-white"
                    )}
                  >
                    {isSelected && (
                      <span className="block h-2 w-2 rounded-full bg-white" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-[#005151]" />
                      <span className="font-inter text-[14px] font-medium text-ink">
                        {provider.name}
                      </span>
                    </div>
                    <p className="mt-1 font-inter text-[12px] text-tertiary-text">
                      {provider.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Configuration */}
        <div>
          <h3 className="mb-3 font-inter text-[14px] font-semibold text-ink">
            Configuration
          </h3>
          <div className="space-y-4 rounded-comfortable border border-level-2 bg-white p-5">
            <Input
              label="Entity ID"
              value={entityId}
              onChange={(e) => setEntityId(e.target.value)}
              placeholder="https://your-app.com/saml/metadata"
            />
            <Input
              label="SSO URL"
              value={ssoUrl}
              onChange={(e) => setSsoUrl(e.target.value)}
              placeholder="https://your-idp.com/sso/saml"
            />
            <div className="flex flex-col gap-1.5">
              <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
                Certificate
              </label>
              <div className="flex items-center justify-center rounded-standard border-2 border-dashed border-level-3 bg-level-1 px-4 py-6 transition-colors hover:border-[#005151]">
                <div className="flex flex-col items-center gap-2 text-center">
                  <Upload className="h-6 w-6 text-tertiary-text" />
                  <p className="font-inter text-[13px] text-tertiary-text">
                    Drop your X.509 certificate here, or{" "}
                    <span className="cursor-pointer text-[#005151] underline">
                      browse
                    </span>
                  </p>
                  <p className="font-inter text-[11px] text-tertiary-text">
                    .pem or .crt files accepted
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Test Connection & Enforce SSO */}
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setConnectionTested(true)}
            variant="secondary"
          >
            Test Connection
          </Button>
          {connectionTested && (
            <span className="flex items-center gap-1.5 font-inter text-[13px] font-medium text-[#059669]">
              <CheckCircle2 className="h-4 w-4" />
              Connection successful
            </span>
          )}
        </div>

        {/* Enforce SSO Toggle */}
        <div className="flex items-center justify-between rounded-comfortable border border-level-2 bg-white p-4">
          <div>
            <p className="font-inter text-[14px] font-medium text-ink">
              Enforce SSO
            </p>
            <p className="mt-0.5 font-inter text-[12px] text-tertiary-text">
              Require all users to authenticate via SSO. Password login will be
              disabled.
            </p>
          </div>
          <button
            onClick={() => setEnforceSso(!enforceSso)}
            className={cn(
              "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200",
              enforceSso ? "bg-[#059669]" : "bg-level-3"
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200",
                enforceSso ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <Button>Save SSO Configuration</Button>
        </div>
      </div>
    </div>
  );
}
