/* global WebImporter */
export default function parse(element, { document }) {
  // The block header must match the component name exactly
  const headerRow = ['Cards'];

  // Get all immediate child divs of the grid layout (each is a card)
  const cardDivs = element.querySelectorAll(':scope > div');

  // Each card: extract just the description text (<p>), as per block guidance
  // If <p> is missing, include the card div for resilience
  const rows = Array.from(cardDivs).map((cardDiv) => {
    const p = cardDiv.querySelector('p');
    if (p) {
      return [p];
    } else {
      return [cardDiv];
    }
  });

  // Build the full table data
  const cells = [headerRow, ...rows];

  // Create table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
