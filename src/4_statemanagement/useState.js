import { DOM } from "./DOM.js";

export const useState = (value) => {
  if (!DOM.domInitialized) throw new Error("Cannot use outside DOM render fn");
  //update trigger with internal patch dom context
  //value doesnt matter since new vdom will be created post patch
  const state = {
    value,
    triggerRef: () => {}
  }
  DOM.stateBridge.push(state);
  return [state.value, () => state.triggerRef?.()];
};
