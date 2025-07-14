/* global WebImporter */
export default function parse(element, { document }) {
  // Header row, per block name
  const headerRow = ['Cards (cards5)'];
  const rows = [];
  // Each card is a direct <a> child of the grid
  const cards = element.querySelectorAll(':scope > a');
  cards.forEach((card) => {
    // First cell: image or icon
    let imageCell = '';
    // Try finding the image container (always has a utility-aspect-3x2 class)
    const imageContainer = card.querySelector('.utility-aspect-3x2');
    if (imageContainer) {
      imageCell = imageContainer;
    } else {
      // fallback: just in case the structure is off (rare)
      const img = card.querySelector('img');
      if (img) imageCell = img;
    }
    // Second cell: text content (title, tag, description, etc)
    let textCell = '';
    const textContainer = card.querySelector('.utility-padding-all-1rem');
    if (textContainer) {
      textCell = textContainer;
    } else {
      // fallback: try all non-image children
      const nonImageChildren = Array.from(card.children).filter(child => child !== imageContainer);
      if (nonImageChildren.length === 1) {
        textCell = nonImageChildren[0];
      } else if (nonImageChildren.length > 1) {
        textCell = nonImageChildren;
      } // else remain ''
    }
    rows.push([imageCell, textCell]);
  });
  // Compose the table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
