export const isNode = typeof global === "object";
export const render = (app, node) => {
  if (!node && !isNode) throw new Error("node is invalid");
  const finalTree = [];
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
        for (const key in chunk?.props ?? {}) {
          currentNode.setAttribute?.(key, (chunk?.props ?? {})[key]);
        }
        nextNode = {
          tagName: chunk?.tag,
          children: [],
          el: currentNode,
          previousEl: previousNode,
          isRaw: false,
        };
      }
      //previous node will always be valid;
      const e = currentNode ?? document.createTextNode?.(chunk);
      previousNode?.appendChild?.(e);
      treeNode?.push(
        nextNode ?? {
          ...(!!chunk?.tag ? {} : { textValue: chunk }),
          isRaw: !chunk?.tag,
          el: e,
          previousEl: previousNode,
          children: [],
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
  iterator(app, node, finalTree);
  return [finalTree[0], node];
};

export const getRawTree = (app) => {
  const finalTree = [];
  const iterator = (chunk, treeNode) => {
    const isFunctional = typeof chunk.tag === "function";
    let nextNode;
    if (isFunctional) {
      iterator(chunk.tag(chunk.props), treeNode);
    } else {
      if (chunk?.tag) {
        nextNode = {
          nodeType: "element",
          type: chunk?.tag,
          children: [],
        };
      }
      treeNode?.push(
        nextNode ?? {
          nodeType: chunk?.tag ? "element" : "raw",
          type: chunk?.tag ?? chunk,
        }
      );
    }
    const finalTree = nextNode ?? treeNode;
    chunk.children?.forEach((c) => {
      if (typeof c.tag === "function") {
        iterator(c.tag({ ...chunk?.props, ...c?.props }), finalTree.children);
        return;
      }
      iterator(c, finalTree?.children);
    });
  };
  iterator(app, finalTree);
  return finalTree[0];
};

export const updateDiff = (originalTree, targetTree) => {
  const iterate = (oldNode, newNode) => {
    //we want to splice oldNode children with newNode
    if (oldNode.children.length > newNode.children.length) {
      //remove extra unwanted children for oldNode if they exceed
      for (let i = newNode.children.length; i < oldNode.children.length; i++) {
        oldNode.children[i].el.remove();
      }
    }
    oldNode.children.length = newNode.children.length;

    for (let i = 0; i < newNode.children.length; i++) {
      const original = oldNode.children[i] ?? {};
      const newN = newNode.children[i] ?? {};
      if (!original.el) {
        //since there's no children - index will always be last for a new node no need to iterate again
        oldNode.el.appendChild(newN.el.cloneNode(true));
        continue;
      }
      if (
        (!newN.isRaw && original.tagName != newN.tagName && !!newN.tagName) ||
        (newN.isRaw && original.textValue != newN.textValue)
      ) {
        //tagName is different update the whole node
        //or
        //text node found and doesnt match
        oldNode.children[i].el.replaceWith(newN.el.cloneNode(true));
        continue;
      }

      //attributes
      const oldAttributes = original.el.attributes;
      const newAttributes = newN.el.attributes;
      //find new attributes or update new ones
      const ignoreAttributes = new Set()
      for (const attr of newAttributes) {
        if (
          (oldAttributes[attr.name] &&
            attr.value !== oldAttributes[attr.name].value) ||
          !oldAttributes[attr.name]
        ) {
          ignoreAttributes.add(attr.name)
          original.el.setAttribute(attr.name, attr.value);
        }
      }
      //now remove the ones not there in new node
      for (const attr of oldAttributes) {
        if (!newAttributes[attr.name] ) {
          original.el.removeAttribute(attr.name);
        }
      }
      //

      iterate(original, newN);
    }
  };
  if (originalTree.nodeType !== targetTree.nodeType) {
    throw `...nodeType = ${originalTree.nodeType} expected by found ${targetTree.nodeType}`;
  }
  if (originalTree.type !== targetTree.type) {
    throw `...type = ${originalTree.nodeType} expected by found ${targetTree.nodeType}`;
  }
  iterate(originalTree, targetTree);
};
