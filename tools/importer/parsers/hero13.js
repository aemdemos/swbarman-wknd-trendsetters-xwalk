/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find top-level grid divs (section > div > div)
  const topLevelDivs = Array.from(element.querySelectorAll(':scope > div > div'));

  // 2. First div: background image (absolute positioned cover-image)
  let bgImg = null;
  if (topLevelDivs.length > 0) {
    bgImg = topLevelDivs[0].querySelector('img.cover-image');
  }

  // 3. Second div: card with content
  let contentCell = '';
  if (topLevelDivs.length > 1) {
    // Find the .card-body inside this div
    const cardBody = topLevelDivs[1].querySelector('.card-body');
    if (cardBody) {
      contentCell = cardBody;
    }
  }

  // 4. Prepare rows for block table
  const rows = [];
  rows.push(['Hero (hero13)']); // header row
  rows.push([bgImg ? bgImg : '']);
  rows.push([contentCell || '']);

  // 5. Create and replace table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
