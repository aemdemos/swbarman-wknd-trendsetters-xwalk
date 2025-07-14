/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: EXACT match to spec
  const header = ['Cards (cards5)'];
  const rows = [];
  // Each card is a direct child anchor
  const cards = element.querySelectorAll(':scope > a.card-link');
  cards.forEach(card => {
    // First cell: image (always present)
    let imgCell = null;
    const imgContainer = card.querySelector('.utility-aspect-3x2');
    if (imgContainer) {
      // Use the actual <img> element if present (reference it directly)
      const img = imgContainer.querySelector('img');
      imgCell = img ? img : imgContainer;
    }
    // Second cell: text content (may include tag, heading, description)
    const paddingDiv = card.querySelector('.utility-padding-all-1rem');
    const textCellContent = [];
    if (paddingDiv) {
      // Tag group (optional, may have multiple tags, use the whole container if exists)
      const tagGroup = paddingDiv.querySelector('.tag-group');
      if (tagGroup) {
        textCellContent.push(tagGroup);
      }
      // Heading (may be h3 or have the .h4-heading class)
      const heading = paddingDiv.querySelector('h3, .h4-heading');
      if (heading) {
        textCellContent.push(heading);
      }
      // Description (p)
      const para = paddingDiv.querySelector('p');
      if (para) {
        textCellContent.push(para);
      }
    }
    // If textCellContent is empty, fallback to null, else array or single element
    let textCell = null;
    if (textCellContent.length === 1) {
      textCell = textCellContent[0];
    } else if (textCellContent.length > 1) {
      textCell = textCellContent;
    }
    rows.push([imgCell, textCell]);
  });
  const table = WebImporter.DOMUtils.createTable([
    header,
    ...rows
  ], document);
  element.replaceWith(table);
}
