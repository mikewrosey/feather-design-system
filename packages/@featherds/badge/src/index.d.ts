declare module "@featherds/badge" {
  import { DefineComponent } from "vue";
  const FeatherBadge: DefineComponent;
  const FeatherTextBadge: DefineComponent;

  export { FeatherBadge, FeatherTextBadge };

  export enum TYPES {
    INFO = "info",
    ERROR = "error",
  }
}
