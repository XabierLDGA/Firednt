import { describe, expect, test } from "vitest";
import { BACKUP_VERSION, parseBackup } from "./schema";

const date = "2026-10-28T10:00:00.000Z";

function validBackup() {
  return {
    app: "firednt",
    version: BACKUP_VERSION,
    exportedAt: date,
    projects: [
      { id: 1, name: "firedn't", description: null, status: "IN_PROGRESS", createdAt: date, updatedAt: date },
    ],
    tasks: [
      {
        id: 1,
        projectId: 1,
        title: "Tarea",
        description: null,
        status: "TODO",
        position: 0,
        createdAt: date,
        updatedAt: date,
      },
    ],
    learningTopics: [{ id: 1, name: "Docker", description: null, createdAt: date, updatedAt: date }],
    learningItems: [
      {
        id: 1,
        topicId: 1,
        title: "Compose",
        url: "https://docs.docker.com/compose/",
        done: false,
        position: 0,
        createdAt: date,
        updatedAt: date,
      },
    ],
  };
}

function errorOf(value: unknown): string {
  const result = parseBackup(typeof value === "string" ? value : JSON.stringify(value));
  if (result.success) throw new Error("expected the backup to be rejected");
  return result.error;
}

describe("parseBackup", () => {
  test("accepts a valid backup and turns dates into Date objects", () => {
    const result = parseBackup(JSON.stringify(validBackup()));

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.projects[0].createdAt).toEqual(new Date(date));
    expect(result.data.learningItems[0].done).toBe(false);
  });

  test("rejects text that is not JSON", () => {
    expect(errorOf("{ esto no es json")).toBe("El archivo no es un JSON válido.");
  });

  test("rejects JSON from another app", () => {
    expect(errorOf({ ...validBackup(), app: "otra" })).toContain(
      "app: No es una copia de seguridad de firedn't.",
    );
    expect(errorOf([1, 2, 3])).toContain("El archivo no es una copia válida.");
  });

  test("rejects another format version", () => {
    expect(errorOf({ ...validBackup(), version: 2 })).toContain(
      `Versión de copia no compatible (se esperaba ${BACKUP_VERSION}).`,
    );
  });

  test("says where an invalid value is, in Spanish", () => {
    const backup = validBackup();
    backup.tasks[0].status = "MAYBE";

    expect(errorOf(backup)).toMatch(/^tasks\[0\]\.status: Opción inválida/m);
  });

  test("rejects a task whose project is not in the backup", () => {
    const backup = validBackup();
    backup.tasks[0].projectId = 99;

    expect(errorOf(backup)).toContain("tasks[0].projectId: El proyecto no existe en la copia.");
  });

  test("rejects an item whose topic is not in the backup", () => {
    const backup = validBackup();
    backup.learningItems[0].topicId = 99;

    expect(errorOf(backup)).toContain("learningItems[0].topicId: El tema no existe en la copia.");
  });

  test("rejects repeated ids", () => {
    const backup = validBackup();
    backup.learningTopics.push({ ...backup.learningTopics[0], name: "Otro" });

    expect(errorOf(backup)).toContain("learningTopics[1].id: Id repetido.");
  });

  test("rejects a javascript: link and a blank name", () => {
    const backup = validBackup();
    backup.learningItems[0].url = "javascript:alert(1)";
    backup.projects[0].name = "  ";

    const error = errorOf(backup);
    expect(error).toContain("projects[0].name: No puede estar vacío.");
    expect(error).toContain("learningItems[0].url:");
  });

  test("lists at most five problems", () => {
    const backup = validBackup();
    backup.tasks = Array.from({ length: 7 }, (_, index) => ({
      ...backup.tasks[0],
      id: index + 1,
      status: "MAYBE",
    }));

    const lines = errorOf(backup).split("\n");
    expect(lines).toHaveLength(7); // heading + 5 problems + "… y 2 problemas más."
    expect(lines.at(-1)).toBe("… y 2 problemas más.");
  });
});
