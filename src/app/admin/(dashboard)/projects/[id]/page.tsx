import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProjectForm } from "@/components/admin/projects/ProjectForm";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

async function getProject(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) return null;

  return {
    ...project,
    technologies: JSON.parse(project.technologies) as string[],
  };
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Edit Project</h1>
        <p className="text-foreground-muted mt-1">
          Update project details
        </p>
      </div>

      {/* Form */}
      <ProjectForm project={project} />
    </div>
  );
}
