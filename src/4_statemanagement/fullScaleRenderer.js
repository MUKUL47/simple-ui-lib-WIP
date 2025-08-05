import { DOM } from "./DOM.js";

export function ApplyVDOM(node, domRef) {
  const headNode = {
    children: [],
  };
  function iterator(node, parent) {
    // console.log('PARENT---',parent)
    let newNode = {};
    if (typeof node?.tag === "function") {
      console.log(`FUNC - ${node.tag.name}`);
      const r = node.tag({ ...node.props, children: node.children });
      newNode = {
        ...node,
        type: "func",
        name: node.tag.name,
        children: [],
      };
      DOM.stateBridge.forEach((v) => {
        v.triggerRef = () => console.log(newNode)
        return v;
      })
      DOM.stateBridge = [];
      iterator(r, newNode.children);
      parent.push(newNode);
      return;
    } else {
      newNode = {
        ...node,
        type: "node",
        name: node.tag,
        children: [],
      };
      newNode.states = DOM.stateBridge.forEach((v) => {
        v.triggerRef = () => console.log(newNode)
        return v;
      })
      DOM.stateBridge = [];
      console.log(`TAG - ${node?.tag}`);
    }
    node.children?.forEach((c) => {
      if (!c) return;
      if (typeof c === "string") {
        console.log(`${node.tag.name ?? node.tag} RAW - ${c}`);
        newNode.children.push({
          type: "raw",
          value: c,
        });
        return;
      }
      iterator(c, newNode.children);
    });
    parent.push(newNode);
  }
  window.a = node;
  const head = {
    type: "HEAD",
    children: [],
  };
  iterator(node, head.children);
  console.log(head);
}
