/* global WebImporter */
export default function parse(element, { document }) {
  // Block header: must match exactly as Accordion (accordion21)
  const headerRow = ['Accordion (accordion21)'];

  // Prepare table rows for each accordion item
  const rows = [];

  // Each child .divider is an accordion item
  // Need to also handle the case where the first child is a .divider or contains a .divider
  // Some structures include a wrapper div first

  // Check if the block has a non-divider wrapper: if so, get all .divider inside
  let dividerEls = [];
  if (element.classList.contains('divider')) {
    dividerEls = [element];
  } else {
    dividerEls = Array.from(element.querySelectorAll(':scope > .divider'));
    // Some structures nest .divider within another container
    if (dividerEls.length === 0 && element.querySelector(':scope > div')) {
      const childDivs = Array.from(element.querySelectorAll(':scope > div'));
      childDivs.forEach(div => {
        dividerEls.push(...div.querySelectorAll(':scope > .divider'));
      });
    }
  }

  dividerEls.forEach(dividerEl => {
    // Each .divider has a grid with two children: [title, content]
    const grid = dividerEl.querySelector('.w-layout-grid');
    if (grid) {
      // Find the title: typically heading class (.h4-heading) or first child
      let titleEl = grid.querySelector('.h4-heading');
      if (!titleEl) {
        // fallback: first div
        titleEl = grid.querySelector(':scope > div');
      }
      // Content: typically .w-richtext, or the next div
      let contentEl = grid.querySelector('.w-richtext, .rich-text');
      if (!contentEl) {
        // fallback: second div
        const children = grid.querySelectorAll(':scope > div');
        if (children.length > 1) {
          contentEl = children[1];
        }
      }
      // Only push if both title and content exist
      if (titleEl && contentEl) {
        rows.push([titleEl, contentEl]);
      }
    }
  });

  // Only create table if there are any accordion items
  if (rows.length > 0) {
    const cells = [headerRow, ...rows];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
