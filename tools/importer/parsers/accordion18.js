/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const cells = [
    ['Accordion (accordion18)']
  ];

  // Get all accordion items (each .w-dropdown)
  const accordions = element.querySelectorAll(':scope > .accordion.w-dropdown');
  accordions.forEach(acc => {
    // Find title cell: look for .paragraph-lg inside the toggle
    const toggle = acc.querySelector('.w-dropdown-toggle');
    let titleCell = null;
    if (toggle) {
      const para = toggle.querySelector('.paragraph-lg');
      titleCell = para ? para : toggle;
    } else {
      // fallback: maybe just the first child
      titleCell = acc.firstElementChild;
    }

    // Find content cell: inside nav.accordion-content .w-richtext or the nav itself
    const nav = acc.querySelector('nav.accordion-content');
    let contentCell = null;
    if (nav) {
      // Try to get the rich text content, but fall back to nav's children
      const rich = nav.querySelector('.w-richtext');
      if (rich) {
        contentCell = rich;
      } else {
        // fallback: include all content of nav
        // Remove outer wrappers if present (e.g., .utility-padding-all-1rem)
        let child = nav.firstElementChild;
        if (child && child.children.length === 1) {
          contentCell = child.firstElementChild;
        } else if (child) {
          contentCell = child;
        } else {
          contentCell = nav;
        }
      }
    }

    cells.push([
      titleCell,
      contentCell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
