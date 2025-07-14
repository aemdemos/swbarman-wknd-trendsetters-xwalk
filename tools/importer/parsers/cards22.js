/* global WebImporter */
export default function parse(element, { document }) {
  // Collect all the .w-tab-pane children (each tab content)
  const tabPanes = element.querySelectorAll('.w-tab-pane');
  const allCards = [];

  tabPanes.forEach((pane) => {
    const grid = pane.querySelector('.w-layout-grid.grid-layout');
    if (!grid) return;
    // All direct <a> children (cards)
    const cards = Array.from(grid.querySelectorAll('a'));
    cards.forEach((card) => {
      // Image (first cell):
      let img = '';
      const imgWrapper = card.querySelector('.utility-aspect-3x2');
      if (imgWrapper) {
        const foundImg = imgWrapper.querySelector('img');
        if (foundImg) img = foundImg;
      }
      // Text (second cell): heading + description
      const textCell = [];
      const heading = card.querySelector('h3');
      const desc = card.querySelector('div.paragraph-sm');
      if (heading) textCell.push(heading);
      if (desc) textCell.push(desc);
      // Row: [image or '', text array or '']
      allCards.push([
        img || '',
        textCell.length ? (textCell.length === 1 ? textCell[0] : textCell) : ''
      ]);
    });
  });

  // If there are no cards, do nothing
  if (!allCards.length) return;

  const cells = [
    ['Cards (cards22)'],
    ...allCards
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
