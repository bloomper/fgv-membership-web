/** A path on this site to come back to after login; anything else, such as another site, becomes the front page. */
export function returnPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return "/";
  }
  return value;
}
