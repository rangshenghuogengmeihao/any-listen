import { workers } from '@/worker'
import type { DOMPurify } from 'dompurify'

export const sanitizeHtml = (DOMPurify: DOMPurify, str?: string) => {
  if (!str || typeof str !== 'string') return ''
  return DOMPurify.sanitize(str, {
    // ALLOWED_TAGS: ['b', 'q', 'br', 'i', 'u', 's', 'strong', 'em', 'p', 'span', 'div', 'a', 'code', 'pre', 'img'],
    // ALLOWED_ATTR: ['style', 'href', 'title', 'src'],
    USE_PROFILES: { html: true },
    ALLOW_DATA_ATTR: false,
  })
}

export const parseMarkdown = async (content: string) => {
  const [html, { default: DOMPurify }] = await Promise.all([workers.main.parseMarkdown(content), import('dompurify')])
  if (!html) return null
  try {
    return sanitizeHtml(DOMPurify, html)
  } catch (err) {
    console.error('Markdown parsing error:', err)
    return null
  }
}

export const parseMarkdowns = async (contents: string[]) => {
  const [htmls, { default: DOMPurify }] = await Promise.all([workers.main.parseMarkdowns(contents), import('dompurify')])
  try {
    return htmls.map((html) => (html == null ? null : sanitizeHtml(DOMPurify, html)))
  } catch (err) {
    console.error('Markdown parsing error:', err)
    return null
  }
}
