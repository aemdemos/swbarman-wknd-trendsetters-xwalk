/* global WebImporter */
export default function parse(element, { document }) {
  // Block header
  const headerRow = ['Tabs'];

  // Get all immediate child tab anchors (each represents a tab label tab)
  const tabLinks = Array.from(element.querySelectorAll(':scope > a'));

  // Each tab: first cell - label (as element), second cell - content (none in this markup)
  const rows = tabLinks.map((tabLink) => {
    // Find tab label (should be the first div, use the element itself for referencing)
    let labelCell;
    const labelDiv = tabLink.querySelector('div');
    if (labelDiv) {
      labelCell = labelDiv;
    } else {
      labelCell = tabLink;
    }
    // No tab content present, so cell is empty string
    return [labelCell, ''];
  });

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
