import { render, getRawTree, updateDiff } from "./3_diffcheckrendering/renderer.js";
import { h } from "./tag.js";
const E = (props) => {
  return <C children={<p>12</p>}></C>;
};
const C = (props) => {
  return <d>{props.children}</d>;
};
const MyEl = (props) => (
  <a color="red">
    {props.children}
    <box color="red">
      3 <div>5</div>2<h1>5</h1>
    </box>
    <E i={2} />
  </a>
);
let A = (
  <section>
    <header id='123' v='12331'>
      <h1>Title</h1>
    </header>
    <main>
      <p>Hello</p>
      <p>World</p>
    </main>
    <footer>
      <span>2024</span>
    </footer>
  </section>
);
const targetNode = (
  <section>
    <header id='1223'>
      <h2>Title Changed</h2> {/* tag changed from h1 → h2 + text updated */}
    </header>
    <main id='12a23'>
      <p>Hello</p>           {/* same */}
      <div>New Content</div> {/* tag changed from p → div + text changed */}
      <p>Another</p>         {/* new node added */}
    </main>
    <aside >Sidebar</aside>   {/* new sibling added */}
  </section>
);
// console.log(<E/>)
const [treeNode, rootNode] = render(A, document.querySelector?.("#root"));
const V = render(targetNode, document.createElement('div'));
updateDiff(treeNode, V[0])
// updateDiff(treeNode, render(targetNode, document.createElement('div'))[0])
// render(element, document.querySelector('#root'));
