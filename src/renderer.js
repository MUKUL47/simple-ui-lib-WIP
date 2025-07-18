export const render = (app, node) => {
  console.log(JSON.stringify(app, null, 1));
  if (!node) throw new Error("node is invalid");
  const el = document.createElement(app.tag);
  node.appendChild(el);
  let children = [{ node: app, el }];
  while (children.length > 0) {
    const { node, el } = children.pop();
    children = [
      ...children,
      ...(node?.children ?? [])
        .filter((v) => {
          if (typeof v != "object") {
            el.appendChild(document.createTextNode(v));
            return false;
          }
          return true;
        })
        .map((v) => {
          const newNode = document.createElement(v.tag);
          el.appendChild(newNode);
          return { node: v, el: newNode };
        }),
    ];
  }
  console.log(node);
};
