declare module "@featherds/menu" {
  import { DefineComponent, Directive } from "vue";
  const FeatherMenu: DefineComponent;
  let MenuFocusLoop: Directive;
  export { FeatherMenu, MenuFocusLoop };
}
