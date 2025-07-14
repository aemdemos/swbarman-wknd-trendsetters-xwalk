/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards4)'];
  const cells = [headerRow];

  // Find the main grid
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;
  const children = Array.from(grid.children);

  // --- CARD 1: Main card on the left ---
  const mainCard = children[0];
  if (mainCard) {
    // Image
    let imgEl = null;
    const imgDiv = mainCard.querySelector('.utility-aspect-1x1');
    if (imgDiv) imgEl = imgDiv.querySelector('img');
    // Text cell
    const tagGroup = mainCard.querySelector('.tag-group');
    const heading = mainCard.querySelector('h3');
    const desc = mainCard.querySelector('p');
    const textCellContent = [];
    if (tagGroup) textCellContent.push(tagGroup);
    if (heading) textCellContent.push(heading);
    if (desc) textCellContent.push(desc);
    cells.push([imgEl || '', textCellContent]);
  }

  // --- CARDS 2 & 3: Two vertical cards with images ---
  const imageCardsGroup = children[1];
  if (imageCardsGroup) {
    const cards = imageCardsGroup.querySelectorAll(':scope > a.utility-link-content-block');
    cards.forEach(card => {
      let imgEl = null;
      const imgDiv = card.querySelector('.utility-aspect-3x2');
      if (imgDiv) imgEl = imgDiv.querySelector('img');
      const tagGroup = card.querySelector('.tag-group');
      const heading = card.querySelector('h3');
      const desc = card.querySelector('p');
      const textCellContent = [];
      if (tagGroup) textCellContent.push(tagGroup);
      if (heading) textCellContent.push(heading);
      if (desc) textCellContent.push(desc);
      cells.push([imgEl || '', textCellContent]);
    });
  }

  // --- CARDS 4+ : text-only cards in the rightmost column ---
  const textCardsGroup = children[2];
  if (textCardsGroup) {
    const cards = textCardsGroup.querySelectorAll(':scope > a.utility-link-content-block');
    cards.forEach(card => {
      const heading = card.querySelector('h3');
      const desc = card.querySelector('p');
      const textCellContent = [];
      if (heading) textCellContent.push(heading);
      if (desc) textCellContent.push(desc);
      cells.push(['', textCellContent]);
    });
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
