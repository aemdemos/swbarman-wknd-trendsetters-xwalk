/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const headerRow = ['Carousel (carousel37)'];

  // Locate the image grid: grid-layout with multiple img elements
  const grids = element.querySelectorAll('.grid-layout');
  let imagesGrid = null;
  for (const grid of grids) {
    if (grid.querySelectorAll('img').length > 1) {
      imagesGrid = grid;
      break;
    }
  }
  const imgs = imagesGrid ? Array.from(imagesGrid.querySelectorAll('img')) : [];

  // Gather text content for the first slide
  let firstSlideTitle = null, firstSlideDesc = null, firstSlideButtons = null;
  // The left column div (contains heading, subheading, buttons)
  const contentCols = element.querySelectorAll('.w-layout-grid > div');
  let textCol = null;
  for (const col of contentCols) {
    if (col.querySelector('h1, .h1-heading')) {
      textCol = col;
      break;
    }
  }
  if (textCol) {
    firstSlideTitle = textCol.querySelector('h1, .h1-heading');
    firstSlideDesc = textCol.querySelector('p, .subheading');
    firstSlideButtons = textCol.querySelector('.button-group');
  }

  // Compose content for first slide's text column
  const textCell = [];
  if (firstSlideTitle) textCell.push(firstSlideTitle);
  if (firstSlideDesc) textCell.push(firstSlideDesc);
  if (firstSlideButtons) textCell.push(firstSlideButtons);

  // Build table rows
  const rows = [headerRow];
  imgs.forEach((img, idx) => {
    if (idx === 0) {
      rows.push([img, textCell]);
    } else {
      rows.push([img, '']);
    }
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
