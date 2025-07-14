/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract a card's [image, content] from a card element
  function parseCard(cardEl) {
    // Image extraction: get the first img, include its direct wrapper if present
    let img = cardEl.querySelector('img');
    let imgContainer = img ? img.closest('div') : null;
    // Compose the text content: heading, description, call-to-action
    // Find first heading (h2/h3/h4 etc) inside the card
    let heading = cardEl.querySelector('h1, h2, h3, h4, h5, h6');
    // Find all paragraphs inside the card
    let paragraphs = Array.from(cardEl.querySelectorAll('p'));
    // Find call-to-action button or link
    let cta = cardEl.querySelector('a.button, .button:not(a):not(button), button');
    let frag = document.createDocumentFragment();
    if (heading) frag.appendChild(heading);
    paragraphs.forEach(p => frag.appendChild(p));
    if (cta) {
      // For non-a elements, wrap in <a> if parent <a> exists
      let asLink = cta.tagName.toLowerCase() === 'a';
      if (asLink) {
        frag.appendChild(cta);
      } else {
        // Try to get parent anchor's href, else '#'
        let parentA = cardEl.closest('a');
        let href = parentA && parentA.href ? parentA.href : (cardEl.href ? cardEl.href : '#');
        let a = document.createElement('a');
        a.textContent = cta.textContent;
        a.href = href;
        frag.appendChild(a);
      }
    }
    // For image cell, always prefer the containing div (for aspect-ratio wrappers)
    let imageCell = imgContainer || img;
    return [imageCell, frag];
  }

  // Find the outer grid containing the cards
  let outerGrid = element.querySelector('.w-layout-grid.grid-layout');
  if (!outerGrid) return;

  // The top-level grid may have direct cards and/or nested grids with more cards
  const cardElements = [];
  Array.from(outerGrid.children).forEach(child => {
    if (child.classList.contains('utility-link-content-block')) {
      cardElements.push(child);
    } else if (child.classList.contains('w-layout-grid')) {
      // Nested grid: extract all card links
      Array.from(child.querySelectorAll('a.utility-link-content-block')).forEach(card => cardElements.push(card));
    }
  });

  // Build table rows
  const rows = [];
  rows.push(['Cards (cards38)']);
  cardElements.forEach(card => {
    rows.push(parseCard(card));
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
