import { colorForName } from "@/lib/colors";
import { TAG_CLASSES } from "./tag";

const SIZES = {
  sm: "size-4 text-[0.7rem]",
  md: "size-5 text-xs",
  lg: "size-10 text-lg",
};

// First letter of a name on its own stable color, like Twenty's record avatars.
export function Avatar({ name, size = "sm" }: { name: string; size?: keyof typeof SIZES }) {
  const letter = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-sm font-medium ${SIZES[size]} ${TAG_CLASSES[colorForName(name)]}`}
    >
      {letter}
    </span>
  );
}
