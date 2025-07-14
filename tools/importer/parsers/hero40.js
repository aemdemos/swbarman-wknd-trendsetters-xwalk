/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header: strictly from requirements
  const headerRow = ['Hero (hero40)'];

  // 2. Extract background image (image row)
  // There may be multiple images, but we want the most prominent/biggest (the absolute one)
  let img = null;
  // Find first image inside header that is not decorative (should have src)
  const images = element.querySelectorAll('img');
  for (const image of images) {
    if (image.src && image.offsetWidth !== 1) { // offsetWidth for decorative/small non-background images
      img = image;
      break;
    }
  }
  // Fallback: use first image if none matched
  if (!img && images.length) img = images[0];
  const imageRow = [img || ''];

  // 3. Extract headline, subheading, CTA (content row)
  // Find the content area containing headings, paragraphs, and cta
  let contentDiv = null;
  // Try to find the right grid cell by traversing immediate child divs
  const gridDivs = element.querySelectorAll(':scope > div > div');
  for (const div of gridDivs) {
    if (div.querySelector('h1, h2, h3, h4, h5, h6')) {
      contentDiv = div;
      break;
    }
  }
  // Fallback: look deeper if not found (shouldn't happen in provided HTML)
  if (!contentDiv) contentDiv = element;

  // Compose all text elements: heading, subheading, paragraph(s), CTAs
  const parts = [];
  // Headline (highest-level heading)
  const heading = contentDiv.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) parts.push(heading);
  // Paragraph(s)
  const paragraphs = contentDiv.querySelectorAll('p');
  paragraphs.forEach(p => parts.push(p));
  // CTA(s), only direct a tags (ignore navigation links, etc)
  const ctas = contentDiv.querySelectorAll('a');
  ctas.forEach(a => parts.push(a));
  // The order above matches the content visually: heading, text, then button

  const contentRow = [parts.length ? parts : ''];

  // 4. Build the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow
  ], document);

  // 5. Replace original element
  element.replaceWith(table);
}
