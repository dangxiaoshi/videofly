import { cn } from "@/components/ui";
import Marquee from "@/components/ui/marquee";

const reviews = [
  {
    name: "Fast setup",
    username: "Product highlight",
    body: "Launch text-to-video and image-to-video flows quickly without stitching multiple tools together.",
    img: "https://avatar.vercel.sh/feature-setup",
  },
  {
    name: "Flexible workflows",
    username: "Product highlight",
    body: "Support a mix of prompt-based generation, reference inputs, and dashboard-based history management.",
    img: "https://avatar.vercel.sh/feature-workflow",
  },
  {
    name: "Credit controls",
    username: "Product highlight",
    body: "Built-in freezing, settlement, and recovery flows help keep billing behavior predictable.",
    img: "https://avatar.vercel.sh/feature-credits",
  },
  {
    name: "Storage ready",
    username: "Product highlight",
    body: "Generated assets can be pushed to object storage and served from your own public domain.",
    img: "https://avatar.vercel.sh/feature-storage",
  },
  {
    name: "Localization",
    username: "Product highlight",
    body: "Marketing and app flows are structured for multilingual rollout from the start.",
    img: "https://avatar.vercel.sh/feature-i18n",
  },
  {
    name: "Operations",
    username: "Product highlight",
    body: "Admin views and recovery tooling make it easier to inspect tasks and resolve failed runs.",
    img: "https://avatar.vercel.sh/feature-ops",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

const Comments = () => {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background py-4 sm:py-20 md:py-20 xl:py-20">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background" />
    </div>
  );
};

export { Comments };
