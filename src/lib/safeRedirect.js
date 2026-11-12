// Empêche les redirections vers un autre site (ex: ?redirect=//site-pirate.com)
export function safeRedirect(value, fallback = '/transfer') {
  if (typeof value !== 'string') return fallback
  // doit commencer par un seul "/" et ne pas contenir de "//", "\\" ni de schéma
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('\\') || /^\/[a-z]+:/i.test(value)) return fallback
  return value
}
