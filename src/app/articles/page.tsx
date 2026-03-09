import { permanentRedirect } from 'next/navigation'

export default function ArticlesIndexPage() {
  permanentRedirect('/projects')
}
