/* global WebImporter */
export default function parse(element, { document }) {
  // Table Header EXACT match
  const headerRow = ['Cards (cards38)'];

  // Find the cards grid: could be inside .container > .w-layout-grid
  let grid = element.querySelector('.container > .w-layout-grid');
  if (!grid) return;

  // Flatten one level of nested grids for cards (cards may be direct children or in a nested grid)
  let cardEls = [];
  Array.from(grid.children).forEach((child) => {
    if (child.classList.contains('w-layout-grid')) {
      cardEls.push(...Array.from(child.children));
    } else {
      cardEls.push(child);
    }
  });

  // Filter to only card links/blocks
  cardEls = cardEls.filter(el =>
    el.matches('a.utility-link-content-block, .utility-link-content-block')
  );

  // Helper: get first image inside card (mandatory)
  function getCardImage(card) {
    return card.querySelector('img');
  }

  // Helper: get the text content container inside card
  function getCardTextContent(card) {
    // For the first (featured) card, text is inside .utility-padding-all-2rem
    const special = card.querySelector('.utility-padding-all-2rem');
    if (special) return special;
    // For standard cards, text is all children that are not image containers
    const textParts = [];
    Array.from(card.children).forEach(child => {
      // Skip image containers
      if (
        child.querySelector('img') ||
        child.classList.contains('utility-aspect-2x3') ||
        child.classList.contains('utility-aspect-1x1')
      ) {
        return;
      }
      textParts.push(child);
    });
    // If just one, return it. Else, wrap in a div
    if (textParts.length === 1) return textParts[0];
    if (textParts.length > 1) {
      const wrapper = document.createElement('div');
      textParts.forEach(part => wrapper.appendChild(part));
      return wrapper;
    }
    // Fallback to null (shouldn't happen)
    return null;
  }

  // Build table rows: [image, text-content] for each card
  const rows = cardEls.map(card => {
    const img = getCardImage(card);
    const text = getCardTextContent(card);
    return [img, text];
  }).filter(row => row[0] && row[1]); // Remove incomplete cards

  // Compose the table
  const tableCells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(block);
}
