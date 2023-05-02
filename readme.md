# An **ATTEMPT** to create simple UI library step-by-step...

## Done

`Simple static DOM tree rendering`

## In Progress

#### State manager

```
Simple state manager class handling handling state array and makeState(method?) will invoked while e.create('div',{ children }), keep a track of index while adding states to an array, this will later help in identifying to return memozied state if we want to re-render the tree on state changes.
```

```js
class S {
  static states = [];
  static isDone = false;
  static index = 0;
  static makeState = (value) => {
    if (this.isDone) {
      return S.states[S.index++];
    }
    const state = {
      value,
      onchange: ({ i }) => {
        this.reset();
        parse(tree);
      },
      i: S.index++,
    };
    state.set = (v) => {
      state.value = v;
      state.onchange(state);
    };
    const get = () => state.value;
    get.isState = true;
    S.states.push(state);
    return [get, state.set];
  };
  static reset() {
    S.index = 0;
  }
}
function component() {
  const [get, set] = S.makeState(5);
  return e.create("div", {});
}
parse(tree); //first render
S.isDone = true;
S.index = 0;
//state changes
parse(tree); //now makestate() wont be return new state instead stored referenced states from the state array
```

```
PROBLEM : If while rendering there's a conditional render change index will be out of sync...
Also need to render from top, to have a perfect index sync or find a way to render from changed branch (identify the branch index & subtract from the remaining )

Conclusion : Gotta find a different way...
```

## Pending

#### Re-render tree on state changes from any specific tree branch

#### conditional rendering
