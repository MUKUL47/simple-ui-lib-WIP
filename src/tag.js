function h(tag, props, ...children) {
  return { tag, props, children: children.flat() };
}
export { h };
