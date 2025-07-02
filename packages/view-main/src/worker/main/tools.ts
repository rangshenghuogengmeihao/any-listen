export const parseMarkdown = async (content: string) => {
  const { marked } = await import('marked')
  try {
    // eslint-disable-next-line no-misleading-character-class
    return marked.parse(content.replace(/[\u200B\u200C\u200D\u200E\u200F\uFEFF]/g, ''), {
      breaks: true,
    }) as string
  } catch (err) {
    console.error('Markdown parsing error:', err)
    return null
  }
}

export const parseMarkdowns = async (contents: string[]) => {
  return Promise.all(contents.map(async (content) => parseMarkdown(content)))
}
