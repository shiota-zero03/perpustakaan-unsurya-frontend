export default function formatTitle(url: string): string {
  const lastSegment = (url.split("/")[2] || url.split("/")[1] || "")
  
  if (lastSegment) {
    return `
      ${lastSegment !== 'dashboard' ? 'Data ' : ''}
      ${
        lastSegment
          ?.split("-")
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
          )
          .join(" ") || ""
        }
    `;
  }

  return 'Not found page';
}
  