import { useSearch } from "wouter";
import { BriefFlow } from "@/components/brief/BriefFlow";
import { PageShell } from "@/components/site/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { siteCopy } from "@/content/siteCopy";
import { formatMetaTitle } from "@shared/siteSeo";

export default function Brief() {
  const seed = new URLSearchParams(useSearch()).get("seed");
  return (
    <PageShell>
      <SeoHead
        title={formatMetaTitle(siteCopy.brief.metaTitle, "Atla")}
        description={siteCopy.brief.metaDescription}
        pathname="/brief"
      />
      <BriefFlow seed={seed} />
    </PageShell>
  );
}
