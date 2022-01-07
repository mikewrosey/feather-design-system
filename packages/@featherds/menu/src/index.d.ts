declare module "@featherds/menu" {
  import { defineComponent, Directive } from "vue";
  const FeatherMenu: DefineComponent;
  let MenuFocusLoop: Directive;
  export { FeatherMenu, MenuFocusLoop };
}
