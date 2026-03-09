import { permanentRedirect } from 'next/navigation'

interface PageProps {
  params: { slug: string }
}

export default function LegacyProjectRoute({ params }: PageProps) {
  permanentRedirect(`/projects/${params.slug}`)
}
