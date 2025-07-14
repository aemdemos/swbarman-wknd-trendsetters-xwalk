/* global WebImporter */
export default function parse(element, { document }) {
  // Header row EXACT match
  const headerRow = ['Hero (hero10)'];

  // === BACKGROUND IMAGES ===
  // Find the image grid (contains collage images)
  const grid = element.querySelector('.grid-layout.desktop-3-column.utility-min-height-100dvh');
  let images = [];
  if (grid) {
    images = Array.from(grid.querySelectorAll('img')).filter(img => !!img.src);
  }
  // Insert all images as direct references (preserve alt text etc.)
  let backgroundCell;
  if (images.length > 0) {
    // If only one image, just use it. If multiple, group in a div for clarity
    if (images.length === 1) {
      backgroundCell = images[0];
    } else {
      const collageDiv = document.createElement('div');
      images.forEach(img => collageDiv.appendChild(img));
      backgroundCell = collageDiv;
    }
  } else {
    backgroundCell = '';
  }

  // === TEXT CONTENT ===
  // Find the content container (with h1, subheading, cta buttons)
  const content = element.querySelector('.ix-hero-scale-3x-to-1x-content .container');
  let textCell;
  if (content) {
    // Create a fragment to hold content
    const frag = document.createDocumentFragment();
    // Title (h1)
    const h1 = content.querySelector('h1');
    if (h1) frag.appendChild(h1);
    // Subheading (p.subheading)
    const subheading = content.querySelector('p.subheading');
    if (subheading) frag.appendChild(subheading);
    // CTAs (anchor tags inside .button-group)
    const buttonGroup = content.querySelector('.button-group');
    if (buttonGroup) {
      // Only keep anchor tags
      buttonGroup.querySelectorAll('a').forEach(a => frag.appendChild(a));
    }
    textCell = frag.childNodes.length > 0 ? frag : '';
  } else {
    textCell = '';
  }

  // Build the block table as per requirements
  const rows = [
    headerRow,
    [backgroundCell],
    [textCell],
  ];

  // Create block table with WebImporter helper
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element only (do not return anything)
  element.replaceWith(block);
}
