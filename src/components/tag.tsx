import type { TagColor } from "@/lib/colors";

// Full class names so Tailwind can find them in the source.
export const TAG_CLASSES: Record<TagColor, string> = {
  gray: "bg-tag-gray text-tag-gray-fg",
  blue: "bg-tag-blue text-tag-blue-fg",
  sky: "bg-tag-sky text-tag-sky-fg",
  yellow: "bg-tag-yellow text-tag-yellow-fg",
  orange: "bg-tag-orange text-tag-orange-fg",
  purple: "bg-tag-purple text-tag-purple-fg",
  green: "bg-tag-green text-tag-green-fg",
  red: "bg-tag-red text-tag-red-fg",
};

// The tag's text color as a solid fill, for bars and charts.
export const TAG_SOLID_CLASSES: Record<TagColor, string> = {
  gray: "bg-tag-gray-fg",
  blue: "bg-tag-blue-fg",
  sky: "bg-tag-sky-fg",
  yellow: "bg-tag-yellow-fg",
  orange: "bg-tag-orange-fg",
  purple: "bg-tag-purple-fg",
  green: "bg-tag-green-fg",
  red: "bg-tag-red-fg",
};

// A colored chip, like Twenty's select values.
export function Tag({ color, children }: { color: TagColor; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex h-5 shrink-0 items-center rounded-sm px-1.5 text-sm font-medium whitespace-nowrap ${TAG_CLASSES[color]}`}
    >
      {children}
    </span>
  );
}
