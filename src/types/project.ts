export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  imageUrl: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectCardProps {
  project: Project;
  index?: number;
}
