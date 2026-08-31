/**
 * Opens the GhostChat widget and pre-fills the message.
 * Tries multiple strategies to open the widget.
 */
export function openChatWithMessage(message) {
  // Strategy 1: Try GhostChat official API
  if (window.GhostChat && typeof window.GhostChat.open === 'function') {
    window.GhostChat.open()
    prefillChatInput(message)
    return
  }
  // Strategy 2: Click the GhostChat bubble button in DOM
  const selectors = [
    '[data-ghostchat-widget]',
    '.ghostchat-widget-btn',
    '[class*="ghostchat"] button',
    '[id*="ghostchat"] button',
    'iframe[src*="ghostchat"]',
  ]
  let clicked = false
  for (const sel of selectors) {
    const el = document.querySelector(sel)
    if (el) { el.click(); clicked = true; break }
  }
  // Strategy 3: Click any floating chat button that appeared (widget injects a button)
  if (!clicked) {
    const allBtns = document.querySelectorAll('button, div[role="button"]')
    for (const btn of allBtns) {
      const style = window.getComputedStyle(btn)
      const pos = style.position
      if ((pos === 'fixed') && btn.offsetWidth < 80) {
        btn.click(); clicked = true; break
      }
    }
  }
  // Pre-fill after a short delay to let the widget open
  if (clicked) {
    prefillChatInput(message, 800)
  } else {
    // Ultimate fallback: WhatsApp
    window.open(
      `https://wa.me/221776997546?text=${encodeURIComponent(message)}`,
      '_blank'
    )
  }
}

function prefillChatInput(message, delay = 500) {
  setTimeout(() => {
    // Look inside iframes too
    const inputs = document.querySelectorAll(
      'textarea, input[type="text"], [contenteditable="true"], [class*="chat"] textarea, [class*="ghost"] textarea'
    )
    for (const inp of inputs) {
      const style = window.getComputedStyle(inp.closest?.('[class]') || inp)
      inp.focus()
      inp.value = message
      inp.textContent = message
      inp.dispatchEvent(new Event('input', { bubbles: true }))
      inp.dispatchEvent(new Event('change', { bubbles: true }))
    }
    // Also try inside iframes
    try {
      document.querySelectorAll('iframe').forEach(iframe => {
        try {
          const doc = iframe.contentDocument || iframe.contentWindow?.document
          if (!doc) return
          const textarea = doc.querySelector('textarea, input[type="text"]')
          if (textarea) {
            textarea.focus()
            textarea.value = message
            textarea.dispatchEvent(new Event('input', { bubbles: true }))
          }
        } catch(e) {}
      })
    } catch(e) {}
  }, delay)
}
