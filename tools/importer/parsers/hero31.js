/* global WebImporter */
export default function parse(element, { document }) {
  // Block header
  const headerRow = ['Hero (hero31)'];
  // No background image present in the provided HTML
  const bgRow = [''];

  // Get grid that contains all the hero content
  const grid = element.querySelector('.grid-layout');

  // Defensive: If grid is missing, extract all content for fallback
  let contentCellItems = [];
  if (grid) {
    // There are 4 child divs in grid:
    // 0: left author (Taylor Brooks)
    // 1: tag list
    // 2: h2 (main heading)
    // 3: right rich text
    const leftName = grid.children[0];
    const tagList = grid.children[1];
    const heading = grid.children[2];
    const richText = grid.children[3];
    // Only push if exists and has content
    if (leftName && leftName.textContent.trim()) contentCellItems.push(leftName);
    if (tagList && tagList.children.length > 0) contentCellItems.push(tagList);
    if (heading && heading.textContent.trim()) contentCellItems.push(heading);
    if (richText && richText.textContent.trim()) contentCellItems.push(richText);
  } else {
    // Fallback: push all non-empty children of element
    const children = Array.from(element.children).filter(e => e.textContent.trim());
    contentCellItems = children;
  }

  // Always wrap in array for single column
  const contentRow = [contentCellItems];
  // Compose block table
  const cells = [headerRow, bgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
