/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Remove margin/bloat classes from a node (for clean import)
  function cleanClasses(node) {
    if (!node) return;
    if (node.classList) {
      node.classList.remove(
        'utility-margin-bottom-2rem',
        'utility-margin-bottom-1rem',
        'utility-margin-bottom-0-5rem',
        'utility-margin-bottom-0'
      );
    }
  }

  // ===========
  // TABLE HEADER
  // ===========
  const headerRow = ['Cards (cards4)'];
  const cells = [headerRow];

  // Main Card Groups
  const container = element.querySelector('.container');
  if (!container) return;
  const grid = container.querySelector('.w-layout-grid.grid-layout');
  if (!grid) return;

  // First card: Large Feature Card (first a.utility-link-content-block)
  const featureCard = grid.querySelector('a.utility-link-content-block');
  if (featureCard) {
    // 1st cell: IMAGE (first img inside aspect)
    let imgCell = '';
    const imgWrap = featureCard.querySelector('[class*="utility-aspect"]');
    if (imgWrap) {
      const img = imgWrap.querySelector('img');
      if (img) imgCell = img;
    }
    // 2nd cell: All text content (tag, heading, paragraph)
    const textElements = [];
    const tagGroup = featureCard.querySelector('.tag-group');
    if (tagGroup) cleanClasses(tagGroup), textElements.push(tagGroup);
    const heading = featureCard.querySelector('h3');
    if (heading) cleanClasses(heading), textElements.push(heading);
    const para = featureCard.querySelector('p');
    if (para) cleanClasses(para), textElements.push(para);
    cells.push([imgCell, textElements]);
  }

  // Second group: 2 cards with image and text
  const flexGroups = grid.querySelectorAll('div.flex-horizontal.flex-vertical.flex-gap-sm');
  if (flexGroups[0]) {
    const flexCards = flexGroups[0].querySelectorAll('a.utility-link-content-block');
    flexCards.forEach(card => {
      // IMAGE
      let imgCell = '';
      const imgWrap = card.querySelector('[class*="utility-aspect"]');
      if (imgWrap) {
        const img = imgWrap.querySelector('img');
        if (img) imgCell = img;
      }
      // TEXT
      const textElements = [];
      const tagGroup = card.querySelector('.tag-group');
      if (tagGroup) cleanClasses(tagGroup), textElements.push(tagGroup);
      const heading = card.querySelector('h3');
      if (heading) cleanClasses(heading), textElements.push(heading);
      const para = card.querySelector('p');
      if (para) cleanClasses(para), textElements.push(para);
      cells.push([imgCell, textElements]);
    });
  }

  // Third group: Text-only cards separated by dividers
  if (flexGroups[1]) {
    Array.from(flexGroups[1].children).forEach(child => {
      if (child.matches('a.utility-link-content-block')) {
        // No image
        const imgCell = '';
        // Text
        const textElements = [];
        const heading = child.querySelector('h3');
        if (heading) cleanClasses(heading), textElements.push(heading);
        const para = child.querySelector('p');
        if (para) cleanClasses(para), textElements.push(para);
        cells.push([imgCell, textElements]);
      }
    });
  }

  // Build the table and swap in the DOM
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
