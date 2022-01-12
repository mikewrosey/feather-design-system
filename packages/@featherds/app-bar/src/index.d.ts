declare module "@featherds/app-bar" {
  import { DefineComponent } from "vue";
  const BarProps: typeof import("./components/FeatherAppBar.vue").props;
  const LinkProps: typeof import("./components/FeatherAppBarLink.vue").props;
  const FeatherAppBar: DefineComponent<typeof BarProps>;
  const FeatherAppBarLink: DefineComponent<typeof LinkProps>;
  export { FeatherAppBar, FeatherAppBarLink };
}
