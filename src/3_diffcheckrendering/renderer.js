export const isNode = typeof global === "object";
export const render = (app, node) => {
  if (!node && !isNode) throw new Error("node is invalid");
  const headNode = {
    type: "_HEAD",
    children: [],
  };
  const iterator = (chunk, previousNode, treeNode) => {
    const isFunctional = typeof chunk.tag === "function";
    let currentTag = chunk.tag;
    let currentNode;
    let nextNode;
    if (isFunctional) {
      //recursively visit all node until we find a proper tag
      currentTag = iterator(chunk.tag(chunk.props), previousNode, treeNode);
    } else {
      if (chunk?.tag) {
        //proper tag is found while iterating
        currentNode = document.createElement?.(chunk?.tag); // ?? chunk?.tag;
        nextNode = {
          type: chunk?.tag,
          children: [],
        };
      }
      //previous node will always be valid;
      previousNode?.appendChild?.(
        currentNode ?? document.createTextNode?.(chunk)
      );
      treeNode?.push(
        nextNode ?? {
          type: chunk?.tag ?? chunk,
        }
      );
    }
    const finalNode = currentNode ?? previousNode;
    const finalTree = nextNode ?? treeNode;
    chunk.children?.forEach((c) => {
      if (typeof c.tag === "function") {
        iterator(
          c.tag({ ...chunk?.props, ...c?.props }), //override current props from previous if any
          finalNode,
          finalTree.children
        );
        return;
      }
      //visit childen either tags or raw values
      iterator(c, finalNode, finalTree?.children);
    });
    //return current node or previous if current is function which doesnt hold tag property or is functional/fragment
    return finalNode;
  };
  iterator(app, node, headNode.children);
  console.log(JSON.stringify(headNode));
  return node;
};
