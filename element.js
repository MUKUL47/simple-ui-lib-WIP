class Component {
  static #nodeTree = {};
  static create(type, props) {
    const value = {
      type,
      ...props,
    };
    let branch = {
      value,
      ...(Component.nodeTree ? Component.nodeTree : {}),
    };
    Component.nodeTree = { branch };
    return value;
  }
  static addEvent(name, callback) {
    return { [name]: callback };
  }
  static #getNodeChildren(children) {
    return !!children ? (Array.isArray(children) ? children : [children]) : [];
  }
  static render(target) {
    let nodes = [Component.nodeTree.branch.value];
    let topNode = null;
    const parentNodes = []; //{e : topNode, count : 0}]
    while (nodes.length > 0) {
      const currentNode = nodes.shift();
      const childrenNodes = this.#getNodeChildren(currentNode.children);
      const children = childrenNodes.filter(
        (child) => typeof child.type === "string"
      );
      if (currentNode.type) {
        const childrenCount = children.length;
        const newElement = this.#createElement(currentNode.type);
        if (parentNodes.length === 0) {
          topNode = newElement;
          parentNodes.push({ e: newElement, c: childrenCount });
        } else {
          const parentElement = parentNodes[parentNodes.length - 1].e;
          currentNode.parentNode = parentElement;
          currentNode.e = newElement;
          parentElement.appendChild(newElement);
          this.#addEvents(newElement, currentNode);
          this.#updateNode(newElement, currentNode);
          if (childrenCount > 0) {
            parentNodes.push({ e: newElement, c: childrenCount });
          } else {
            const lastParent = parentNodes[parentNodes.length - 1];
            lastParent.c -= 1;
            if (lastParent.c <= 0) {
              parentNodes.pop();
              childrenCount > 0 &&
                parentNodes.push({ e: newElement, c: childrenCount });
            }
          }
        }
        nodes = children.concat(nodes);
      }
    }
    target.appendChild(topNode);
  }

  static #createElement(type) {
    return document.createElement(type);
  }

  static #updateNode(e, node) {
    if (node.hasOwnProperty("children") && typeof node.children !== "object") {
      e.textContent = node.children;
    }
  }

  static #addEvents(e, node) {
    if (node.hasOwnProperty("events")) {
      const events = node.events;
      for (let event in events) {
        e.addEventListener(event, events[event]);
      }
    }
  }
}
