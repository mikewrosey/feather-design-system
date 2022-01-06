declare module "@featherds/ripple" {
  import { DefineComponent } from "vue";
  const PROPS: typeof import("./components/FeatherRipple.vue").props;
  const FeatherRipple: DefineComponent<typeof PROPS>;
  export { FeatherRipple };
}
