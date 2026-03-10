import { buildMetadata } from '@/lib/utils/metadata'

export const metadata = buildMetadata({
  title: 'Create Account — WeLoveDaily',
  description: 'Join WeLoveDaily for free. Save projects, follow studios, and stay sharp on consumer brand design.',
  path: '/signup',
  noIndex: true,
})

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children
}
