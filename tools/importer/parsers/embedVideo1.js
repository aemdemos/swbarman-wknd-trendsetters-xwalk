/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate child divs of the grid
  const gridChildren = element.querySelectorAll(':scope > div');
  // Collect all <img> elements from each child div
  const images = [];
  gridChildren.forEach(div => {
    const img = div.querySelector('img');
    if (img) images.push(img);
  });
  // If there are no images, do not replace
  if (images.length === 0) return;
  // Create a fragment holding all images (in order)
  const frag = document.createDocumentFragment();
  images.forEach(img => frag.appendChild(img));
  // Build the table structure: header and single content row
  const cells = [
    ['Embed'],
    [frag]
  ];
  // Create table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
