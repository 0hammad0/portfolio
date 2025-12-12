import { ProjectForm } from "@/components/admin/projects/ProjectForm";

export default function NewProjectPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">New Project</h1>
        <p className="text-foreground-muted mt-1">
          Create a new portfolio project
        </p>
      </div>

      {/* Form */}
      <ProjectForm />
    </div>
  );
}
