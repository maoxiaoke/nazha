import {visit} from 'unist-util-visit';

export default function highlight() {
    return (tree) => {
        visit(tree, 'text', (node) => {
            console.log('node-value', tree);
          // 使用正则表达式查找 '==xxx==' 样式的文本
          node.value = node.value.replace(/==([^=]+)==/g, (match, p1) => {
            // 将 '==xxx==' 转换为 <mark>xxx</mark>
            return `<mark>${p1}</mark>`;
          });
        });
    }
}