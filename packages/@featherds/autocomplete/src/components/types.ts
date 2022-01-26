import { ComputedRef } from "vue";

interface IAutocompleteItem extends IAutocompleteItemType {
  _new?: string;
  _text: string;
  _pre?: unknown;
}
interface IAutocompleteItemType {
  [k: string]: unknown;
}

export enum TYPES {
  multi = "multi",
  single = "single",
}

interface IAutocompleteGridColumn {
  prop: keyof IAutocompleteItemType;
  title: string;
  align?: "right" | "left" | "center";
}

interface IAutocompleteType {
  single: boolean;
  initialText: ComputedRef<string>;
  hasValue: ComputedRef<boolean>;
  selectItem: (item: IAutocompleteItemType) => void;
  removeItem: (item: IAutocompleteItemType) => void;
  clickedItem: () => void;
  handleInputBlur: () => void;
}
export type {
  IAutocompleteType,
  IAutocompleteGridColumn,
  IAutocompleteItemType,
  IAutocompleteItem,
};
