const masterAvatarInitials = (name?: string | null) => {
  const words = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)

  if (!words.length) {
    return 'MB'
  }

  return words.map(word => word[0]?.toUpperCase() || '').join('')
}

const masterAvatarPlaceholder = (name?: string | null) => {
  const initials = masterAvatarInitials(name)

  return `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 720">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#efe5d6" />
      <stop offset="100%" stop-color="#d9c1a2" />
    </linearGradient>
  </defs>
  <rect width="720" height="720" fill="url(#bg)" />
  <circle cx="560" cy="150" r="96" fill="rgba(122,77,33,0.10)" />
  <circle cx="168" cy="560" r="132" fill="rgba(255,255,255,0.28)" />
  <circle cx="360" cy="280" r="118" fill="rgba(122,77,33,0.14)" />
  <path d="M184 600c42-98 121-148 176-148s134 50 176 148" fill="rgba(122,77,33,0.14)" />
  <text x="360" y="650" text-anchor="middle" fill="#7a4d21" font-family="Arial, sans-serif" font-size="88" font-weight="700" letter-spacing="10">${initials}</text>
</svg>
`)}`;
}

export const useMasterAvatar = () => {
  const masterAvatarSrc = (avatar?: string | null, name?: string | null) => avatar || masterAvatarPlaceholder(name)

  const onMasterAvatarError = (event: Event, name?: string | null) => {
    const target = event.target as HTMLImageElement | null

    if (!target) {
      return
    }

    const fallback = masterAvatarPlaceholder(name || target.alt)

    if (target.src !== fallback) {
      target.src = fallback
    }
  }

  return {
    masterAvatarPlaceholder,
    masterAvatarSrc,
    onMasterAvatarError,
  }
}
