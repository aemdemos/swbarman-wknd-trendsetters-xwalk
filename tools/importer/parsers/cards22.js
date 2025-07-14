/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract cards from a grid section
  function extractCards(grid) {
    const cards = Array.from(grid.children).filter((el) => el.tagName === 'A');
    return cards.map((card) => {
      // Image (may not exist on every card)
      let imgDiv = card.querySelector('.utility-aspect-3x2');
      let img = imgDiv ? imgDiv.querySelector('img') : '';
      // Heading and description (may be wrapped in utility-text-align-center for some cards)
      let heading = card.querySelector('h3');
      let desc = card.querySelector('.paragraph-sm');

      // Compose the text cell as an array to preserve structure if both are present
      let textParts = [];
      if (heading) textParts.push(heading);
      if (desc && desc !== heading) textParts.push(desc);
      let textCell = textParts.length > 1 ? textParts : (textParts[0] || '');

      return [img || '', textCell];
    });
  }

  // Find all tab panes (each contains a grid of cards)
  const tabPanes = element.querySelectorAll(':scope > div');
  let allCards = [];
  tabPanes.forEach((tabPane) => {
    const grid = tabPane.querySelector('.w-layout-grid');
    if (grid) {
      const cards = extractCards(grid);
      allCards = allCards.concat(cards);
    }
  });

  // If there are no cards, do nothing
  if (!allCards.length) return;

  // Build the table
  const rows = [['Cards (cards22)']];
  allCards.forEach((row) => rows.push(row));
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
