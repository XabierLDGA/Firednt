import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { getProject } from "@/lib/db/projects";
import type { Project } from "@/lib/db/schema";
import { parseId } from "@/lib/ids";

// Resolves a project from a route param, or renders the 404 page.
// Dynamic routes stream a prerendered shell first, so the response status
// stays 200 ("soft 404"); Next.js marks the page noindex.
export async function loadProjectOrNotFound(rawId: string): Promise<Project> {
  const id = parseId(rawId);
  const project = id === null ? undefined : await getProject(getDb(), id);
  if (!project) notFound();
  return project;
}
