/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate <a> children (each tab selector)
  const tabLinks = Array.from(element.querySelectorAll(':scope > a'));
  // Build rows: each row is [Tab Label, Tab Content (empty)]
  const tabRows = tabLinks.map(a => {
    let label = '';
    const labelDiv = a.querySelector('div');
    if (labelDiv) {
      label = labelDiv.textContent.trim();
    } else {
      label = a.textContent.trim();
    }
    return [label, ''];
  });
  // Header row: exactly one cell, per guidelines and example
  const tableCells = [ ['Tabs'], ...tabRows ];
  // Create and replace
  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
