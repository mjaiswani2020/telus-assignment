"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/stores/project-store";
import { useToast } from "@/components/ui/toast";

const avatarColors: Record<string, string> = {
  H: "#005151",
  S: "#D97706",
  C: "#2563EB",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ProjectsPage() {
  const projects = useProjectStore((s) => s.projects);
  const { toast } = useToast();

  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle="Alignment Lab"
        action={
          <Button icon={<Plus className="h-4 w-4" />} onClick={() => toast("Project creation wizard coming soon", "info")}>New Project</Button>
        }
      />

      <div className="stagger-children mt-4 grid grid-cols-3 gap-3">
        {projects.map((project) => {
          const initial = project.name.charAt(0).toUpperCase();
          const color = avatarColors[initial] ?? "#005151";

          return (
            <div key={project.id}>
              <Link href={`/projects/${project.id}`}>
                <div className="rounded-comfortable border border-level-2 bg-white p-4 transition-colors duration-150 hover:bg-level-1">
                  {/* Header row */}
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-inter text-[14px] font-medium text-white"
                      style={{ backgroundColor: color }}
                    >
                      {initial}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-inter text-[16px] font-medium text-ink">
                        {project.name}
                      </p>
                      <p className="font-inter text-[12px] text-tertiary-text">
                        {formatDate(project.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-3 line-clamp-2 font-inter text-[13px] text-tertiary-text">
                    {project.description}
                  </p>

                  {/* Bottom stats */}
                  <p className="mt-4 font-inter text-[12px] text-tertiary-text">
                    {project.campaignCount} Campaigns{" "}
                    <span className="text-level-2">&middot;</span>{" "}
                    {project.activeRounds} Active{" "}
                    <span className="text-level-2">&middot;</span>{" "}
                    {project.totalAnnotations.toLocaleString()} annotations
                  </p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
