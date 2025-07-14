/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid layout containing the slides
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Each direct child div of .grid-layout represents a slide
  const slideDivs = Array.from(grid.children);

  // Each slide: image in first cell, second cell empty (no text content in sample)
  const rows = slideDivs.map((slide) => {
    const img = slide.querySelector('img');
    return [img || '', ''];
  });

  // The header row must have two columns to match the data rows for structural consistency
  // We use the block name as first cell, and empty string for the second cell
  const headerRow = ['Carousel (carousel17)', ''];
  const cells = [headerRow, ...rows];

  // Ensure the header row is rendered as one cell spanning two columns
  // by creating a header row with two cells, and then merge them after the table is created
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Merge the header row to span two columns
  const firstRow = table.querySelector('tr');
  if (firstRow && firstRow.children.length === 2) {
    firstRow.children[0].setAttribute('colspan', '2');
    firstRow.removeChild(firstRow.children[1]);
  }
  element.replaceWith(table);
}
