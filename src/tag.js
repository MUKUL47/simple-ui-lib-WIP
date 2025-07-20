function h(tag, props, ...children) {
  return { tag, props: props ?? {}, children: children.flat() };
}
export { h };
