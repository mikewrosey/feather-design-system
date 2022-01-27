declare module "@featherds/autocomplete" {
  import { DefineComponent } from "vue";
  const FeatherAutocomplete: DefineComponent<
    typeof import("./components/types").props,
    {},
    {},
    {},
    {},
    {},
    {},
    typeof import("./components/types").emits
  >;
  export {
    TYPES,
    IAutocompleteItem,
    IAutocompleteItemType,
    IAutocompleteGridColumn,
    IAutocompleteType,
  } from "./components/types";
  export { FeatherAutocomplete };
}
