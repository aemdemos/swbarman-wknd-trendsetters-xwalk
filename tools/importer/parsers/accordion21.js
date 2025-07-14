/* global WebImporter */
export default function parse(element, { document }) {
  // Header as required by the block spec
  const headerRow = ['Accordion (accordion21)'];
  const rows = [headerRow];

  // Get all direct children with class 'divider'
  const dividers = Array.from(element.querySelectorAll(':scope > .divider'));

  dividers.forEach((divider) => {
    // Each divider contains a .w-layout-grid grid
    const grid = divider.querySelector('.w-layout-grid');
    if (grid) {
      // Typically, grid has two children: [0]=question/title, [1]=answer/content
      const children = Array.from(grid.children);
      if (children.length >= 2) {
        const title = children[0];
        const content = children[1];
        // Both title and content are elements in the document - reference them directly
        rows.push([title, content]);
      }
      // Defensive: If not, try to find by class as fallback
      else {
        const title = grid.querySelector('.h4-heading');
        const content = grid.querySelector('.rich-text, .w-richtext, p');
        if (title && content) {
          rows.push([title, content]);
        }
      }
    }
  });

  // Only replace if at least header + one item
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
  // Else, do nothing (leave block in place if empty)
}
