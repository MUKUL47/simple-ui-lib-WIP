import { render } from "./renderer.js";
import { h } from "./tag.js";
const E = (props) => {
    <p></p>
}
const MyEl = (props) => (
  <a color="red">
    <box color="red">Hello <div></div></box>
    <E/>
  </a>
);
let A = <MyEl data="123" mtWorld={123}><E/><MyEl/></MyEl>
console.log(A)
// render(element, document.querySelector('#root'));
