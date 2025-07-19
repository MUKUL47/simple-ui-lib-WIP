import {  render } from "./2_functionalrendering/renderer.js";
import { h } from "./tag.js";
function ListItem(props) {
  return <li>{props.text}</li>;
}

function List(props) {
  return <ul>{props.items.map(item => <ListItem text={item} />)}</ul>;
}

const tree = <List items={["Apple", "Banana", "Cherry"]} />;
// console.log(A)
// console.log(<E/>)
render(tree, document.querySelector?.('#root'));
// render(element, document.querySelector('#root'));
