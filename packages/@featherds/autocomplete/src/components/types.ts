import { ComputedRef } from "vue";

interface IAutocompleteItem {
  [k: string]: unknown;
  _new?: string;
  _text: string;
  _pre?: unknown;
}

export type { IAutocompleteItem };

export enum TYPES {
  multi = "multi",
  single = "single",
}

interface IAutocompleteType {
  single: boolean;
  initialText: ComputedRef<string>;
  hasValue: ComputedRef<boolean>;
  selectItem: (item: IAutocompleteItem) => void;
  removeItem: (item: IAutocompleteItem) => void;
  clickedItem: () => void;
  handleInputBlur: () => void;
}
export type { IAutocompleteType };
