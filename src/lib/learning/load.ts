import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { getTopic } from "@/lib/db/learning";
import type { LearningTopic } from "@/lib/db/schema";
import { parseId } from "@/lib/ids";

// Resolves a learning topic from a route param, or renders the 404 page.
export async function loadTopicOrNotFound(rawId: string): Promise<LearningTopic> {
  const id = parseId(rawId);
  const topic = id === null ? undefined : await getTopic(getDb(), id);
  if (!topic) notFound();
  return topic;
}
