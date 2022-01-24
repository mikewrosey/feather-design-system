declare module "@featherds/ripple" {
  import { DefineComponent } from "vue";
  const Props: typeof import("./components/FeatherRipple.vue").props;
  const FeatherRipple: DefineComponent<typeof Props>;
  export { FeatherRipple };
}
