/**
 * Opens the GhostChat widget with a pre-filled message.
 * Falls back to WhatsApp if widget not loaded.
 */
export function openChatWithMessage(message) {
  try {
    // GhostChat exposes a global API after widget loads
    if (window.GhostChat && typeof window.GhostChat.open === 'function') {
      window.GhostChat.open(message)
      return
    }
    // Some versions use different API
    if (window.ghostchat && typeof window.ghostchat.open === 'function') {
      window.ghostchat.open(message)
      return
    }
    // Try dispatching a custom event (widget listens for this)
    const event = new CustomEvent('ghostchat:open', {
      detail: { message }
    })
    window.dispatchEvent(event)

    // Pre-fill the chat input if widget is in DOM
    setTimeout(() => {
      const input = document.querySelector(
        '[data-ghostchat] textarea, .ghostchat-input, #ghostchat-input, [class*="ghostchat"] textarea'
      )
      if (input) {
        input.value = message
        input.dispatchEvent(new Event('input', { bubbles: true }))
      }
    }, 500)
  } catch (e) {
    // Ultimate fallback: WhatsApp
    const waNumber = '221776997546'
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, '_blank')
  }
}

export const WHATSAPP_FALLBACK = '221776997546'
