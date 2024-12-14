import { visit } from 'unist-util-visit';

// 把 --xxx-- 替换成 <mark>xxx</mark>
export default function remarkHighlightSyntax() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || index === null) return;

      const matches = node.value.match(/--(.+?)--/g);
      if (!matches) return;

      const parts = node.value.split(/(--.+?--)/g);
      const children = parts
        .map((part) => {
          const highlightMatch = part.match(/^--(.+?)--$/);
          if (highlightMatch) {
            return {
              type: 'mdxJsxTextElement',
              name: 'mark',
              attributes: [],
              children: [
                {
                  type: 'text',
                  value: highlightMatch[1]
                }
              ]
            };
          }
          return {
            type: 'text',
            value: part
          };
        })
        .filter((part) => part.value !== '');

      parent.children.splice(index, 1, ...children);
    });
  };
}
