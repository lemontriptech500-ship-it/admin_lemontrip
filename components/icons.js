function Icon({ children, size = 18, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  )
}

export const GridIcon = (props) => (
  <Icon {...props}>
    <rect x="3.5" y="3.5" width="7" height="7" />
    <rect x="13.5" y="3.5" width="7" height="7" />
    <rect x="3.5" y="13.5" width="7" height="7" />
    <rect x="13.5" y="13.5" width="7" height="7" />
  </Icon>
)

export const TicketIcon = (props) => (
  <Icon {...props}>
    <path d="M3 8.5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1.5a2 2 0 0 0 0 4v1.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1.5a2 2 0 0 0 0-4Z" />
    <path d="M14 6.5v11" strokeDasharray="2 2" />
  </Icon>
)

export const UsersIcon = (props) => (
  <Icon {...props}>
    <circle cx="9" cy="8.5" r="3" />
    <path d="M2.5 19c.7-3 3-4.5 6.5-4.5s5.8 1.5 6.5 4.5" />
    <circle cx="17" cy="8" r="2.2" />
    <path d="M15.5 14.7c2.3.3 3.8 1.6 4.3 4.3" />
  </Icon>
)

export const CouponIcon = (props) => (
  <Icon {...props}>
    <path d="M20.5 12.5V7a1.5 1.5 0 0 0-1.5-1.5h-5.5L4 15l7.5 7.5L21 13Z" />
    <circle cx="16" cy="9" r="1.4" fill="currentColor" stroke="none" />
  </Icon>
)

export const BlogIcon = (props) => (
  <Icon {...props}>
    <path d="M5 3.5h11.5L20.5 7.5V20a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5v-16a.5.5 0 0 1 .5-.5Z" />
    <path d="M8 10h8M8 13.5h8M8 17h5" />
  </Icon>
)

export const PackageIcon = (props) => (
  <Icon {...props}>
    <path d="m12 3 8.5 4.5v9L12 21l-8.5-4.5v-9Z" />
    <path d="m3.5 7.5 8.5 4.5 8.5-4.5M12 12v9" />
  </Icon>
)

export const PassportIcon = (props) => (
  <Icon {...props}>
    <rect x="5" y="3" width="14" height="18" rx="1.5" />
    <circle cx="12" cy="10" r="2.3" />
    <path d="M8.5 16.5c.6-2 2-3 3.5-3s2.9 1 3.5 3" />
  </Icon>
)

export const MailIcon = (props) => (
  <Icon {...props}>
    <rect x="3" y="5" width="18" height="14" rx="1.5" />
    <path d="m4 6.5 8 6.5 8-6.5" />
  </Icon>
)

export const MegaphoneIcon = (props) => (
  <Icon {...props}>
    <path d="M3 10v4a1 1 0 0 0 1 1h2l1.5 5H10l-1-5h1l9 4V6l-9 4H4a1 1 0 0 0-1 1Z" />
  </Icon>
)

export const LogoutIcon = (props) => (
  <Icon {...props}>
    <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" />
    <path d="M15 16l4-4-4-4" />
    <path d="M19 12H9" />
  </Icon>
)

export const ChevronRight = (props) => (
  <Icon {...props}>
    <path d="m9 6 6 6-6 6" />
  </Icon>
)

export const CloseIcon = (props) => (
  <Icon {...props}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
)
