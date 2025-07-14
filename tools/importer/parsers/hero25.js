/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main inner grid that has the text and the image as direct children
  const mainGrid = element.querySelector('.grid-layout.grid-gap-xxl');
  let image = null;
  let textBlock = null;

  if (mainGrid) {
    // Find direct children: image and left content
    for (const child of mainGrid.children) {
      if (!image && child.tagName === 'IMG') {
        image = child;
      } else if (!textBlock && child.tagName === 'DIV') {
        // This div contains the left column with text/buttons
        // Drill down if needed to find the actual content block
        // Try to find the div with the h2 heading
        let sectionWithText = child.querySelector('h2') ? child : child.querySelector('div.section');
        if (sectionWithText) {
          textBlock = sectionWithText;
        }
      }
    }
  }

  // Fallbacks in case the above detection fails
  if (!image) image = element.querySelector('img');
  if (!textBlock) {
    // Try to find a section with h2 anywhere
    textBlock = element.querySelector('div.section');
  }

  // Compose rows according to spec: [header, image, text]
  const rows = [
    ['Hero (hero25)'],
    [image],
    [textBlock],
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
