/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero (hero6)'];

  // 2. Background image row (image is optional)
  // Per instructions, use the image element directly if present
  const img = element.querySelector('img');
  const imgRow = [img ? img : ''];

  // 3. Content row (headline, subheading, CTA(s))
  let contentArr = [];
  // Find the card that contains the content (headline, subheading, ctas)
  const card = element.querySelector('.card');
  if (card) {
    // Headline (typically h1)
    const headline = card.querySelector('h1, .h1-heading, h2, h3');
    if (headline) contentArr.push(headline);
    // Subheading (optional)
    // Only include if not same as headline and not empty
    const subheading = card.querySelector('.subheading, p');
    if (subheading && subheading !== headline) contentArr.push(subheading);
    // CTA buttons (optional)
    const buttonGroup = card.querySelector('.button-group');
    if (buttonGroup) contentArr.push(buttonGroup);
  }
  // Fallback: if card missing, grab all direct headings, paragraphs, and buttons
  if (!card) {
    const possible = element.querySelectorAll('h1, h2, h3, p, a');
    possible.forEach(el => contentArr.push(el));
  }
  // If no content, push an empty string to keep row count correct
  if (contentArr.length === 0) contentArr = [''];
  const contentRow = [contentArr];

  // 4. Compose the table
  const cells = [
    headerRow,
    imgRow,
    contentRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // 5. Replace the original element
  element.replaceWith(table);
}
