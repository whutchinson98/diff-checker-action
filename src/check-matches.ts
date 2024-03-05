export function check_matches(
  diffMap: { [name: string]: string[] },
  fileNames: string[],
): { [name: string]: boolean } {
  const resultMap: { [name: string]: boolean } = {};
  for (const key in diffMap) {
    const regexPatterns: string[] = [];
    for (const pattern of diffMap[key]) {
      regexPatterns.push(pattern);
    }
    let matches = false;
    for (const pattern of regexPatterns) {
      const regexPattern = pattern
        .replace('./', '')
        .replaceAll(/\//g, '\\/')
        .replaceAll(/\./g, '\\.')
        .replaceAll(/\*/g, '.*');
      const regex = new RegExp(`^${regexPattern}$`);
      if (fileNames.some(f => regex.test(f))) {
        matches = true;
        break;
      }
    }
    resultMap[key] = matches;
  }
  return resultMap;
}
