declare module "@featherds/autocomplete" {
  import { DefineComponent } from "vue";
  const FeatherAutocomplete: DefineComponent<
    typeof import("./components/FeatherAutocomplete.vue").props
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
