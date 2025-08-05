import { DOM, useState, h } from "./lib.js";
const E = (props) => {
  const  [s,cb]= useState(3);
  setTimeout(() => console.log(cb()),20)
  return <C>1{props.children}2</C>;
};
const C = (props) => {
  const  [s,cb]= useState(34);
  setTimeout(() => console.log(cb()),1000)
  return <d>{props.children}</d>;
};
const MyEl = (props) => {
  useState(1);
  return (
    <a color="red">
      <E i={2} />
      <box color="red">
        3 <div>5</div>2<h1>5</h1>
        {props.children}
      </box>
    </a>
  );
};

const D = (
  <E>55</E>
);
DOM.render(D, document.querySelector?.("#root"));
