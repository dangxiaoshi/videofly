import type { Locale } from "@/config/i18n-config";
import { buildAlternates } from "@/lib/seo";

interface ModelPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

const modelInfo: Record<string, { name: string; description: string }> = {
  "sora-2": {
    name: "Lite Model",
    description: "Fast prompt-to-video generation for lightweight creative drafts",
  },
  "veo-3-1": {
    name: "Visual Model",
    description: "Reference-friendly video generation for polished visual outputs",
  },
  "seedance-1-5": {
    name: "Studio Model",
    description: "Balanced video generation for everyday creative work",
  },
  "wan-2-6": {
    name: "Motion Model",
    description: "Long-form scene generation with flexible framing options",
  },
};
const pathSegment = "sora-2";

export async function generateMetadata({ params }: ModelPageProps) {
  const { locale } = await params;
  const alternates = buildAlternates(`/${pathSegment}`, locale);
  const info = modelInfo[pathSegment];

  return {
    title: `${info?.name || "Model"} - PodVid`,
    description: info?.description || "AI Video Generation Platform",
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
  };
}

export default async function ModelPage({ params }: ModelPageProps) {
  const { locale } = await params;

  // Get the model name from the file path (we'll use a simpler approach)
  const info = modelInfo[pathSegment];
  const modelName = info?.name || "Model";

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          {modelName}
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          {info?.description || "Coming soon..."}
        </p>
        <div className="flex justify-center gap-4">
          <a
            href={`/${locale}/image-to-video`}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Image to Video
          </a>
          <a
            href={`/${locale}/text-to-video`}
            className="px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors"
          >
            Try Text to Video
          </a>
        </div>
      </div>
    </div>
  );
}
