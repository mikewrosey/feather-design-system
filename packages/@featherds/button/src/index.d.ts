declare module "@featherds/button" {
  import { DefineComponent } from "vue";
  const PROPS: typeof import("./components/FeatherButton.vue").props;
  const FeatherButton: DefineComponent<typeof PROPS>;
  export { FeatherButton };
}
