// Only basic editorial markup and safe link destinations are retained by the prototype.
export function cleanResourceHtml(html: string): string {
  const document = new DOMParser().parseFromString(html, 'text/html')
  const allowed = new Set(['P', 'H2', 'H3', 'UL', 'OL', 'LI', 'STRONG', 'B', 'EM', 'I', 'U', 'BR', 'A', 'DIV'])
  for (const element of [...document.body.querySelectorAll('*')]) {
    if (['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT'].includes(element.tagName)) { element.remove(); continue }
    if (!allowed.has(element.tagName)) { element.replaceWith(...element.childNodes); continue }
    const href = element.getAttribute('href')
    for (const attribute of [...element.attributes]) element.removeAttribute(attribute.name)
    if (element.tagName === 'A' && href && /^(https?:\/\/|mailto:)/i.test(href)) {
      element.setAttribute('href', href)
      element.setAttribute('target', '_blank')
      element.setAttribute('rel', 'noopener noreferrer')
    }
  }
  return document.body.innerHTML
}

