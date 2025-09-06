import Link from 'next/link'
import { useRouter } from 'next/router'

interface NavLinkProps {
  href: string
  exact?: boolean
  children: React.ReactNode
  className?: string
  activeClassName?: string
}

export function NavLink ({
  href,
  exact = false,
  children,
  className = '',
  activeClassName = ''
}: NavLinkProps): JSX.Element {
  const { pathname } = useRouter()
  const isActive = exact ? pathname === href : pathname.startsWith(href)

  const combinedClassName = isActive
    ? `${className} ${activeClassName}`
    : className

  return (
    <Link href={href} passHref legacyBehavior>
      <a {...{ href, className: combinedClassName }}>{children}</a>
    </Link>
  )
}