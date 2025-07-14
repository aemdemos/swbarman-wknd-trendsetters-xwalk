/* global WebImporter */
export default function parse(element, { document }) {
  // Build header row as specified
  const headerRow = ['Cards (cards34)'];
  const rows = [headerRow];
  // Get all direct card links
  const cards = Array.from(element.querySelectorAll(':scope > a'));
  cards.forEach(card => {
    // Card image (first img under this card)
    const img = card.querySelector('img');
    // Card text content
    const gridInner = card.querySelector(':scope > div');
    let textCell = [];
    if (gridInner) {
      // Find the div holding all the content except the image
      // Usually the second child (the first is img)
      const contentDivs = Array.from(gridInner.children).filter(el => el !== img);
      if (contentDivs.length > 0) {
        // It's usually one div with all the details
        const mainContentDiv = contentDivs[0];
        // Tag row (optional)
        const tagRow = mainContentDiv.querySelector('.flex-horizontal');
        if (tagRow) textCell.push(tagRow);
        // Heading (h3)
        const heading = mainContentDiv.querySelector('h3');
        if (heading) textCell.push(heading);
        // Description (p)
        const desc = mainContentDiv.querySelector('p');
        if (desc) textCell.push(desc);
        // CTA (the last div, usually 'Read')
        const divs = mainContentDiv.querySelectorAll('div');
        if (divs.length > 1) {
          // We already used tagRow; the last div is likely the CTA
          textCell.push(divs[divs.length - 1]);
        } else if (divs.length === 1 && !tagRow) {
          // If only one div and it's not tagRow, treat it as possible CTA
          textCell.push(divs[0]);
        }
      }
    }
    // Fallback if textCell is empty: just use the whole content div (very rare)
    if (textCell.length === 0 && gridInner) textCell = [gridInner];
    rows.push([
      img,
      textCell
    ]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
