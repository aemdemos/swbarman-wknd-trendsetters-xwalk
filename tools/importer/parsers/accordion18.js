/* global WebImporter */
export default function parse(element, { document }) {
  // Compose header row as per instructions, matching block/component name
  const rows = [['Accordion (accordion18)']];

  // Select all direct children that are accordion items
  const accordionItems = element.querySelectorAll(':scope > .accordion.w-dropdown');

  accordionItems.forEach((item) => {
    // Title: Find the .w-dropdown-toggle direct child, then .paragraph-lg
    let titleCell = '';
    const toggle = item.querySelector(':scope > .w-dropdown-toggle');
    if (toggle) {
      const titleEl = toggle.querySelector('.paragraph-lg') || toggle;
      titleCell = titleEl;
    }

    // Content: Find nav.accordion-content direct child, then descend for main content
    let contentCell = '';
    const nav = item.querySelector(':scope > nav.accordion-content');
    if (nav) {
      // Grab the entire content region inside nav
      // Specifically, the first .utility-padding-all-1rem, or the nav itself
      const contentContainer = nav.querySelector('.utility-padding-all-1rem, .rich-text') || nav;
      contentCell = contentContainer;
    }

    rows.push([
      titleCell,
      contentCell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
