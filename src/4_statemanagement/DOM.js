import { ApplyVDOM } from './fullScaleRenderer.js'
export class DOM {
    static stateBridge = [];
    static domInitialized = false;
    static render(jsx, q){
        DOM.domInitialized = true;
        return ApplyVDOM(jsx, q);
    }
}