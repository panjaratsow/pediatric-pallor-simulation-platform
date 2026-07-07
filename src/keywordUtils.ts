export function normalize(text: string): string {
  return text.trim().toLowerCase();
}

export function hasAnyKeyword(text: string, keywords: string[]): boolean {
  const normalized = normalize(text);
  return keywords.some((keyword) => normalized.includes(keyword.toLowerCase()));
}
