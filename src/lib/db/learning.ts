import { asc, count, desc, eq, max, sql } from "drizzle-orm";
import type { Db } from "./client.ts";
import {
  learningItems,
  learningTopics,
  type LearningItem,
  type LearningTopic,
  type NewLearningItem,
  type NewLearningTopic,
} from "./schema.ts";
import type { TaskCounts } from "./tasks.ts";

export type TopicInput = Pick<NewLearningTopic, "name" | "description">;
export type ItemInput = Pick<NewLearningItem, "title" | "url">;

export function listTopics(db: Db): Promise<LearningTopic[]> {
  return db
    .select()
    .from(learningTopics)
    .orderBy(desc(learningTopics.updatedAt), desc(learningTopics.id));
}

export async function getTopic(db: Db, id: number): Promise<LearningTopic | undefined> {
  const [topic] = await db.select().from(learningTopics).where(eq(learningTopics.id, id));
  return topic;
}

export async function createTopic(db: Db, input: TopicInput): Promise<LearningTopic> {
  const [topic] = await db.insert(learningTopics).values(input).returning();
  return topic;
}

export async function updateTopic(
  db: Db,
  id: number,
  input: Partial<TopicInput>,
): Promise<LearningTopic | undefined> {
  const [topic] = await db
    .update(learningTopics)
    .set(input)
    .where(eq(learningTopics.id, id))
    .returning();
  return topic;
}

// Items are removed by the database (ON DELETE CASCADE).
export async function deleteTopic(db: Db, id: number): Promise<boolean> {
  const deleted = await db
    .delete(learningTopics)
    .where(eq(learningTopics.id, id))
    .returning({ id: learningTopics.id });
  return deleted.length > 0;
}

// Learned and total items per topic, in one query. Topics without items
// are not in the map.
export async function countItemsByTopic(db: Db): Promise<Map<number, TaskCounts>> {
  const rows = await db
    .select({
      topicId: learningItems.topicId,
      total: count(),
      done: sql<number>`sum(${learningItems.done})`,
    })
    .from(learningItems)
    .groupBy(learningItems.topicId);
  return new Map(rows.map(({ topicId, done, total }) => [topicId, { done, total }]));
}

export function listItems(db: Db, topicId: number): Promise<LearningItem[]> {
  return db
    .select()
    .from(learningItems)
    .where(eq(learningItems.topicId, topicId))
    .orderBy(asc(learningItems.position), asc(learningItems.id));
}

export async function getItem(db: Db, id: number): Promise<LearningItem | undefined> {
  const [item] = await db.select().from(learningItems).where(eq(learningItems.id, id));
  return item;
}

// New items go to the end of the topic's checklist.
export async function createItem(
  db: Db,
  topicId: number,
  input: ItemInput,
): Promise<LearningItem> {
  const [{ last }] = await db
    .select({ last: max(learningItems.position) })
    .from(learningItems)
    .where(eq(learningItems.topicId, topicId));

  const [item] = await db
    .insert(learningItems)
    .values({ ...input, topicId, position: (last ?? -1) + 1 })
    .returning();
  return item;
}

export async function setItemDone(
  db: Db,
  id: number,
  done: boolean,
): Promise<LearningItem | undefined> {
  const [item] = await db
    .update(learningItems)
    .set({ done })
    .where(eq(learningItems.id, id))
    .returning();
  return item;
}

export async function deleteItem(db: Db, id: number): Promise<boolean> {
  const deleted = await db
    .delete(learningItems)
    .where(eq(learningItems.id, id))
    .returning({ id: learningItems.id });
  return deleted.length > 0;
}
