export function parseCsv(csv: string): { headers: string[]; rows: string[][] } {
  if (!csv) return { headers: [], rows: [] };

  const lines = csv.trim().split(/\r?\n/);
  if (lines.length === 0) return { headers: [], rows: [] };

  // This regex handles quoted fields, including commas and escaped quotes ("") inside.
  const regex = /(?:"((?:[^"]|"")*)"|([^,]*))(?:,|$)/g;

  const parseRow = (row: string): string[] => {
    const cells: string[] = [];
    let match;
    // Reset regex from previous row
    regex.lastIndex = 0;
    // Execute regex repeatedly to capture all cells
    while ((match = regex.exec(row)) && match[0] !== '') {
      // match[1] is the quoted value, match[2] is the unquoted value
      const value = match[1] !== undefined ? match[1].replace(/""/g, '"') : match[2];
      cells.push(value.trim());
    }

    // The regex might leave a trailing empty string if the line ends with a comma.
    // Let's check if the original row string ends with a comma and if the last parsed cell is empty.
    if (row.endsWith(',') && (cells.length === 0 || cells[cells.length -1] !== '')) {
      cells.push('');
    }
    
    return cells;
  };

  const headers = parseRow(lines[0]);
  
  const rows = lines
    .slice(1)
    .map(line => parseRow(line))
    // Filter out rows that are completely empty or just contain a single empty string
    .filter(row => row.length > 0 && (row.length > 1 || row[0] !== ''));

  return { headers, rows };
}
