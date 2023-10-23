import {
  Transition,
  createApp,
  createVNode,
  defineComponent,
  h,
  withCtx,
} from "vue";

export interface ElementLoading extends HTMLElement {
  instance: LoadingComponent;
}

export function createLoadingComponent(target: ElementLoading) {
  const loadingComponent = defineComponent({
    name: "ZLoading",
    setup() {
      return () => {
        const spinner = h("div", {
          class: "z-loading",
          title: "Loading",
        });

        return h(
          Transition,
          {
            name: "fade",
            type: "transition",
            enterFromClass: "opacity-0",
            enterToClass: "opacity-100",
          },
          {
            default: withCtx(() => [
              createVNode(
                "div",
                { class: "absolute inset-0 bg-white opacity-90" },
                [
                  h("div", { class: "opacity-50" }),
                  h("i", { class: "fal fa-spinner-third fa-spin fa-lg" }),
                ]
              ),
            ]),
          }
        );
      };
    },
  });

  const loadingInstance = createApp(loadingComponent);
  const vm = loadingInstance.mount(document.createElement("div"));

  if (target) {
    target.style.position = "relative";
    target.appendChild(vm.$el);
  }

  function close() {
    if (target?.instance?.$el) target.removeChild(target.instance.$el);
  }
  return {
    close,
    get $el() {
      return vm.$el as HTMLElement;
    },
  };
}

export type LoadingComponent = ReturnType<typeof createLoadingComponent>;
