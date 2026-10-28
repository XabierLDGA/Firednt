// Outline icons drawn in the style of Tabler Icons (the set Twenty uses),
// inlined so the app needs no icon dependency. Decorative by default.
type IconProps = { size?: number; className?: string };

function icon(paths: string[]) {
  return function Icon({ size = 16, className }: IconProps) {
    return (
      <svg
        aria-hidden
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`shrink-0 ${className ?? ""}`}
      >
        {paths.map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>
    );
  };
}

export const IconDashboard = icon([
  "M5 4h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1",
  "M5 16h4a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1",
  "M15 12h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1",
  "M15 4h4a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1",
]);

export const IconBriefcase = icon([
  "M5 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2z",
  "M8 7v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2",
  "M12 12v.01",
  "M3 13a20 20 0 0 0 18 0",
]);

export const IconPlus = icon(["M12 5v14", "M5 12h14"]);

export const IconKanban = icon([
  "M4 4h6",
  "M14 4h6",
  "M6 8h2a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2v-8a2 2 0 0 1 2 -2z",
  "M16 8h2a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2v-2a2 2 0 0 1 2 -2z",
]);

export const IconList = icon(["M9 6h11", "M9 12h11", "M9 18h11", "M5 6v.01", "M5 12v.01", "M5 18v.01"]);

export const IconListCheck = icon([
  "M3.5 5.5l1.5 1.5l2.5 -2.5",
  "M3.5 11.5l1.5 1.5l2.5 -2.5",
  "M3.5 17.5l1.5 1.5l2.5 -2.5",
  "M11 6h9",
  "M11 12h9",
  "M11 18h9",
]);

export const IconPencil = icon([
  "M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4",
  "M13.5 6.5l4 4",
]);

export const IconTrash = icon([
  "M4 7h16",
  "M10 11v6",
  "M14 11v6",
  "M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12",
  "M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3",
]);

export const IconCalendar = icon([
  "M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2z",
  "M16 3v4",
  "M8 3v4",
  "M4 11h16",
]);

export const IconClock = icon(["M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0", "M12 7v5l3 3"]);

export const IconText = icon(["M4 6h16", "M4 12h10", "M4 18h14"]);

export const IconTrendingUp = icon(["M3 17l6 -6l4 4l8 -8", "M14 7h7v7"]);

export const IconStatus = icon([
  "M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",
  "M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0",
]);

export const IconAbc = icon([
  "M3 16v-6a2 2 0 1 1 4 0v6",
  "M3 13h4",
  "M10 8v6a2 2 0 1 0 4 0v-1a2 2 0 1 0 -4 0v1",
  "M20.732 12a2 2 0 0 0 -3.732 1v1a2 2 0 0 0 3.726 1.01",
]);

export const IconArrowLeft = icon(["M5 12h14", "M5 12l6 6", "M5 12l6 -6"]);

export const IconArrowRight = icon(["M5 12h14", "M13 18l6 -6", "M13 6l6 6"]);

export const IconSchool = icon([
  "M22 9l-10 -4l-10 4l10 4l10 -4v6",
  "M6 10.6v5.4a6 3 0 0 0 12 0v-5.4",
]);

export const IconCheck = icon(["M5 12l5 5l10 -10"]);

export const IconExternalLink = icon([
  "M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6",
  "M11 13l9 -9",
  "M15 4h5v5",
]);

export const IconDatabase = icon([
  "M12 6m-8 0a8 3 0 1 0 16 0a8 3 0 1 0 -16 0",
  "M4 6v6a8 3 0 0 0 16 0v-6",
  "M4 12v6a8 3 0 0 0 16 0v-6",
]);

export const IconDownload = icon([
  "M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2",
  "M7 11l5 5l5 -5",
  "M12 4l0 12",
]);

export const IconUpload = icon([
  "M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2",
  "M7 9l5 -5l5 5",
  "M12 4l0 12",
]);
