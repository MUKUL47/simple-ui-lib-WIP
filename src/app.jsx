import {  render } from "./3_diffcheckrendering/renderer.js";
import { h } from "./tag.js";
const E = (props) => {
    return <C children={<p>12</p>}></C>
}
const C = (props) => {
  return <d>{props.children}</d>
}
const MyEl = (props) => (
  <a color="red">
    {props.children}
    <box color="red">3 <div>5</div>2<h1>5</h1></box>
    <E i={2}/>
  </a>
);
let A = <MyEl data="123" mtWorld={123} children={<E/>}></MyEl>
// console.log(<E/>)
render(A, document.querySelector?.('#root'));
// render(element, document.querySelector('#root'));
