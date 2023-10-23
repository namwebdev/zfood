import { DirectiveBinding, ObjectDirective } from "vue";
import { ElementLoading, createLoadingComponent } from "./createComponent";

const createInstance = (el: ElementLoading) =>
  (el.instance = createLoadingComponent(el));

const Loading: ObjectDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    if (binding.value) createInstance(el as ElementLoading);
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    if (binding.oldValue === binding.value) return;

    if (binding.value) {
      createInstance(el as ElementLoading);
      return;
    }
    (el as ElementLoading).instance.close();
  },
};

export default Loading;
