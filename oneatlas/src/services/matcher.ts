type Template = {
  id: string
  name: string
  slug: string
  tags: string[]
  schemaDefaults: unknown
}

type MatchResult = {
  template: Template | null
  confidence: number
  matchedKeywords: string[]
}

export function matchTemplate(prompt: string, templates: Template[]): MatchResult {
  const words = prompt.toLowerCase().split(/\s+/)

  let bestMatch: Template | null = null
  let bestScore = 0
  let bestKeywords: string[] = []

  for (const template of templates) {
    const matched: string[] = []

    for (const tag of template.tags) {
      if (words.some((word) => word.includes(tag) || tag.includes(word))) {
        matched.push(tag)
      }
    }

    const score = matched.length / template.tags.length

    if (score > bestScore) {
      bestScore = score
      bestMatch = template
      bestKeywords = matched
    }
  }

  if (bestKeywords.length === 0) {
    return { template: null, confidence: 0, matchedKeywords: [] }
  }

  return {
    template: bestMatch,
    confidence: Math.round(bestScore * 100),
    matchedKeywords: bestKeywords,
  }
}