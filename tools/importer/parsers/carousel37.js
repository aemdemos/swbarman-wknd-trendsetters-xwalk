/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must exactly match the block name
  const cells = [
    ['Carousel (carousel37)']
  ];

  // Find the grid with the images (second .w-layout-grid)
  const container = element.querySelector('.container');
  let imageGrid = null;
  let textArea = null;
  if (container) {
    const grids = container.querySelectorAll('.w-layout-grid');
    // Defensive: look for a grid with at least 2 children and some images
    for (const grid of grids) {
      const imgs = grid.querySelectorAll('img');
      if (imgs.length >= 2) {
        imageGrid = grid;
        break;
      }
    }
    // First .w-layout-grid child is text
    for (const grid of grids) {
      // Looking for child with heading (h1), subheading (p), and buttons
      const h1 = grid.querySelector('h1');
      const sub = grid.querySelector('p');
      const btns = grid.querySelector('.button-group');
      if (h1 && btns) {
        textArea = grid;
        break;
      }
    }
  }
  // Fallbacks if something is missing
  if (!imageGrid) {
    imageGrid = element.querySelectorAll('.w-layout-grid')[1] || element;
  }
  if (!textArea) {
    textArea = element.querySelector('h1')?.parentElement || element;
  }
  // Get all images for slides
  const slides = [];
  const imgEls = imageGrid.querySelectorAll('img');
  imgEls.forEach((img, i) => {
    if (i === 0) {
      // First slide gets textArea content in second cell
      // Only include heading, subheading, and button group in order, if present
      const textContent = [];
      const heading = textArea.querySelector('h1');
      if (heading) textContent.push(heading);
      const subheading = textArea.querySelector('p');
      if (subheading) textContent.push(subheading);
      const buttonGroup = textArea.querySelector('.button-group');
      if (buttonGroup) textContent.push(buttonGroup);
      // If none found, leave cell empty
      slides.push([
        img,
        textContent.length === 0 ? '' : (textContent.length === 1 ? textContent[0] : textContent)
      ]);
    } else {
      // Image only
      slides.push([img]);
    }
  });
  slides.forEach(row => cells.push(row));
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
