import { permanentRedirect } from 'next/navigation'

interface PageProps {
  params: { slug: string }
}

export default function LegacyArticleSlugPage({ params }: PageProps) {
  permanentRedirect(`/projects/${params.slug}`)
}
