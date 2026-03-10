import { buildMetadata } from '@/lib/utils/metadata'

export const metadata = buildMetadata({
  title: 'Sign In — WeLoveDaily',
  description: 'Sign in to your WeLoveDaily account to save projects, follow studios, and access your personalised feed.',
  path: '/login',
  noIndex: true,
})

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
