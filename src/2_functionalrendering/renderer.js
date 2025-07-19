export const isNode = typeof global === "object";
export const render = (app, node) => {
  if (!node && !isNode) throw new Error("node is invalid");
  const iterator = (chunk, previousNode) => {
    const isFunctional = typeof chunk.tag === "function";
    let currentTag = chunk.tag;
    let currentNode;
    if (isFunctional) {
      //recursively visit all node until we find a proper tag
      currentTag = iterator(chunk.tag(chunk.props), previousNode);
    } else {
      if (chunk?.tag) {
        //proper tag is found while iterating 
        currentNode = document.createElement?.(chunk?.tag);// ?? chunk?.tag;
      }
      //previous node will always be valid;
      previousNode?.appendChild?.(
        currentNode ?? document.createTextNode?.(chunk)
      );
    }
    chunk.children?.forEach((c) => {
      if (typeof c.tag === "function") {
        iterator(
          c.tag({ ...chunk?.props, ...c?.props }), //override current props from previous if any
          currentNode ?? previousNode
        );
        return;
      }
      //visit childen either tags or raw values
      iterator(c, currentNode ?? previousNode);
    });
    //return current node or previous if current is function which doesnt hold tag property or is functional/fragment
    return currentNode ?? previousNode;
  };
  iterator(app, node);
  return node;
};
