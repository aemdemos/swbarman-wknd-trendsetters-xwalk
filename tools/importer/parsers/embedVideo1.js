/* global WebImporter */
export default function parse(element, { document }) {
  // Define the table header per block requirements
  const headerRow = ['Embed'];

  // Collect all immediate child divs, and their contained imgs (if present)
  const imageDivs = element.querySelectorAll(':scope > div');
  const images = [];
  imageDivs.forEach(div => {
    // Only consider the first img in each div (guarded)
    const img = div.querySelector('img');
    if (img) images.push(img);
  });

  // If there are no images, we should still create the table with an empty cell
  const contentRow = [images.length > 0 ? images : ''];

  // Create the Embed block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
