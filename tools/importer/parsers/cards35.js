/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single-cell row with the block name
  const cells = [['Cards (cards35)']];
  // For each card: a direct child div in the grid
  const cardDivs = element.querySelectorAll(':scope > div');
  cardDivs.forEach(cardDiv => {
    // Try to extract the image in the card
    const img = cardDiv.querySelector('img, picture, svg');
    // Try to extract any text content (heading, description, links) from the card
    // In this HTML there are only images; in a richer card, text may exist alongside the image.
    // We'll collect all non-image/non-media nodes for the text cell.
    const textNodes = Array.from(cardDiv.childNodes).filter(node => {
      // exclude images/media
      if(node.nodeType === Node.ELEMENT_NODE) {
        const tag = node.tagName.toLowerCase();
        if(tag === 'img' || tag === 'picture' || tag === 'svg' || tag === 'video' || tag === 'iframe') return false;
        // skip the image wrapper div
        if(node.querySelector('img, picture, svg, video, iframe')) return false;
      }
      // exclude empty text nodes
      if(node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return false;
      return true;
    });
    let textCell = '';
    if (textNodes.length === 1) {
      textCell = textNodes[0];
    } else if (textNodes.length > 1) {
      textCell = textNodes;
    }
    cells.push([img, textCell]);
  });
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
