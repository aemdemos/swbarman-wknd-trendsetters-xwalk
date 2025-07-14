/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards34)'];
  const rows = [headerRow];
  // Each card is a direct <a> child
  const cardLinks = Array.from(element.querySelectorAll(':scope > a'));
  cardLinks.forEach(card => {
    // First cell: the image element (reference only)
    const img = card.querySelector('img');
    // Second cell: all card text content (reference only)
    let textContent = null;
    // Find the div that contains the text: it's always a div sibling after the img, inside the card
    if (img) {
      // The parent of the img and text div is always the first grid div inside each card link
      const gridDiv = img.closest('div');
      // The text content div is the second child of gridDiv (first is the img)
      if (gridDiv && gridDiv.children.length > 1) {
        textContent = gridDiv.children[1];
      }
    }
    // Fallback: if not found use the whole card minus the image
    if (!textContent) {
      // Use the card link as base
      textContent = card.cloneNode(true);
      const imgInClone = textContent.querySelector('img');
      if (imgInClone) imgInClone.remove();
    }
    rows.push([img, textContent]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
