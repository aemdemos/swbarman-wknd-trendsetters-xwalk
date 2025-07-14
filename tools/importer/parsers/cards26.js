/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Cards (cards26)'];
  const rows = [];
  // Loop through direct children of the grid
  Array.from(element.children).forEach((child) => {
    // Try to find image
    const img = child.querySelector('img');
    // Try to find a text content block with h3 (title) or p (desc)
    let textContent = null;
    // Prefer the .utility-padding-all-2rem if present for text content
    textContent = child.querySelector('.utility-padding-all-2rem');
    // If not, see if there is any div with h3 or p
    if (!textContent) {
      textContent = child.querySelector('div:has(h3, p)');
    }
    // If still not found and there is just an img, leave text cell empty
    // Only add to cards if at least image
    if (img) {
      // If textContent found, use it; else empty string
      rows.push([img, textContent || '']);
    }
  });
  // Only add header and card rows if there is at least one row
  if (rows.length > 0) {
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      ...rows
    ], document);
    element.replaceWith(table);
  }
}
