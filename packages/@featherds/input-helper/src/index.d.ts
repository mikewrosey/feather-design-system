declare module "@featherds/input-helper" {
  import { DefineComponent } from "vue";
  export const ActionIcon: DefineComponent;

  //input wrapper
  export const useInputWrapper: typeof import("./components/InputWrapper.vue").use;
  export const InputWrapperProps: typeof import("./components/InputWrapper.vue").props;
  export const InputWrapper: DefineComponent<typeof InputWrapperProps>;
  //subtext
  export const useInputSubText: typeof import("./components/InputSubText.vue").use;
  export const InputSubTextProps: typeof import("./components/InputSubText.vue").props;
  export const InputSubText: DefineComponent<typeof InputSubTextProps>;

  export const useInheritAttrs: typeof import("./composables/useInheritAttrs").useInheritAttrs;

  const InputSubTextMixin: typeof import("./mixins/InputSubTextMixin").default;
  const InputWrapperMixin: typeof import("./mixins/InputWrapperMixin").default;
  const InputInheritAttrsMixin: typeof import("./mixins/InputInheritAttrsMixin").default;

  export { InputWrapperMixin, InputSubTextMixin, InputInheritAttrsMixin };
}
