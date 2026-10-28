// Tag palette shared by status chips and avatars. Client-safe: no imports.
export const TAG_COLORS = [
  "gray",
  "blue",
  "sky",
  "yellow",
  "orange",
  "purple",
  "green",
  "red",
] as const;
export type TagColor = (typeof TAG_COLORS)[number];

// A stable color per name, so a project's avatar never changes color.
export function colorForName(name: string): TagColor {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.codePointAt(0)!) | 0;
  // Skip gray: avatars should always have some color.
  const colors = TAG_COLORS.slice(1);
  return colors[Math.abs(hash) % colors.length];
}
