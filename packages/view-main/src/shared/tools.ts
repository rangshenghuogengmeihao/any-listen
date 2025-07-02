import { workers } from '@/worker'

export const parseMarkdown = async (content: string) => {
  const [html, { default: DOMPurify }] = await Promise.all([workers.main.parseMarkdown(content), import('dompurify')])
  if (!html) return null
  try {
    return DOMPurify.sanitize(html)
  } catch (err) {
    console.error('Markdown parsing error:', err)
    return null
  }
}

export const parseMarkdowns = async (contents: string[]) => {
  const [htmls, { default: DOMPurify }] = await Promise.all([workers.main.parseMarkdowns(contents), import('dompurify')])
  try {
    return htmls.map((html) => (html == null ? null : DOMPurify.sanitize(html)))
  } catch (err) {
    console.error('Markdown parsing error:', err)
    return null
  }
}
