/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards26) header row
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  // Get all direct card containers
  const cardElements = Array.from(element.querySelectorAll(':scope > div'));
  cardElements.forEach((card) => {
    // Image: first <img> descendant in the card
    const img = card.querySelector('img');
    // Text: prefer .utility-padding-all-2rem, else h3/p directly
    let textEl = null;
    const pad = card.querySelector('.utility-padding-all-2rem');
    if (pad) {
      textEl = pad;
    } else {
      // Fallback for cards that are just an image, or just h3/p
      // Check for h3 or p as children
      const h3 = card.querySelector('h3');
      const p = card.querySelector('p');
      if (h3 || p) {
        const frag = document.createElement('div');
        if (h3) frag.appendChild(h3);
        if (p) frag.appendChild(p);
        textEl = frag;
      }
    }
    // fallback: if no textEl, use empty div
    if (!textEl) {
      textEl = document.createElement('div');
    }
    // Row: [img, text]
    rows.push([img, textEl]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
