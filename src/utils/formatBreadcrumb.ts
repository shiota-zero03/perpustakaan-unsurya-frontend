const formatBreadcrumb = (pathname: string): string[] => {
  return pathname
    .split("/")
    .filter(Boolean)
    .map((part, index, array) => {
      if (index === array.length - 1 && !isNaN(Number(part))) {
        return "";
      }

      const dataSegment = part === 'dashboard' ? '' : ((part.includes('dosen')) ? 'Data ' : '')

      return `${dataSegment} ${part
        .split("-")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ")
      }`;
        
    })
    .filter(Boolean);
};

export default formatBreadcrumb;
