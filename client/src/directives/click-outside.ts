import { DirectiveBinding, ObjectDirective } from "vue";

type DocumentHandler = <T extends Event>(mouseup: T, mousedown: T) => void;

type FlushList = Map<
  HTMLElement,
  {
    documentHandler: DocumentHandler;
    bindingFn: (...args: unknown[]) => unknown;
  }
>;
const nodeList: FlushList = new Map();
let startClick: MouseEvent;

document.addEventListener("mousedown", (e: MouseEvent) => (startClick = e));
document.addEventListener("mouseup", (e: MouseEvent) => {
  for (const { documentHandler } of nodeList.values()) {
    documentHandler(e, startClick);
  }
});

const createDocumentHandler = (el: HTMLElement, binding: DirectiveBinding) => {
  return function (mouseup: any, mousedown: any) {
    if (
      el.contains(mouseup?.target as Node) ||
      el.contains(mousedown?.target as Node) ||
      el === mouseup.target
    )
      return;
    binding.value();
  };
};

const ClickOutside: ObjectDirective = {
  beforeMount(el: HTMLElement, binding: DirectiveBinding) {
    if (!nodeList.has(el))
      nodeList.set(el, {
        documentHandler: createDocumentHandler(el, binding),
        bindingFn: binding.value,
      });
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    nodeList.set(el, {
      documentHandler: createDocumentHandler(el, binding),
      bindingFn: binding.value,
    });
  },
};

export default ClickOutside;
