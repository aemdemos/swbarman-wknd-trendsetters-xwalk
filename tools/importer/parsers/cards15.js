/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified in the example
  const headerRow = ['Cards (cards15)'];
  const rows = [headerRow];

  // Select all card links (each card is an <a> block child)
  const cardAnchors = element.querySelectorAll(':scope > a.utility-link-content-block');

  cardAnchors.forEach((anchor) => {
    // Extract image (the first img inside .utility-aspect-2x3)
    let image = null;
    const imgContainer = anchor.querySelector('.utility-aspect-2x3');
    if (imgContainer) {
      image = imgContainer.querySelector('img');
    }

    // Compose the text content cell
    const textCell = document.createElement('div');
    // Tag and date
    const meta = anchor.querySelector('.flex-horizontal');
    if (meta) textCell.appendChild(meta);
    // Title
    const title = anchor.querySelector('h3');
    if (title) textCell.appendChild(title);

    // Build the row: [image, text content]
    rows.push([image, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
