import { ComputedRef, PropType } from "vue";
import { InputWrapperProps, InputSubTextProps } from "@featherds/input-helper";
import HighlightProps from "./Highlight/HighlightProps";

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

export const emits = {
  "update:modelValue": (
    value: IAutocompleteItemType | IAutocompleteItemType[] | undefined
  ) => true,
  new: (value: string) => true,
  search: (value: string) => true,
};
export const LABELS = {
  noResults: "No results found",
  minChar: "Enter ${min} characters to search",
  clear: "Clear value",
  selectionLimit: "Selection limit reached",
  new: "New",
  remove: "Remove",
};
export const props = {
  ...HighlightProps,
  ...InputWrapperProps,
  ...InputSubTextProps,
  modelValue: {
    type: [Array, Object] as PropType<
      Array<IAutocompleteItemType> | IAutocompleteItemType
    >,
  },
  results: {
    type: Array as PropType<Array<IAutocompleteItemType>>,
    default: () => [] as IAutocompleteItemType[],
  },
  textProp: {
    type: String,
    default: "_text",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  minChar: {
    type: Number,
    default: 0,
  },
  allowNew: {
    type: Boolean,
    default: false,
  },
  selectionLimit: {
    type: Number,
  },
  newMatcher: {
    type: Function,
    default: (
      item: IAutocompleteItemType,
      query: string,
      comp: { textProp: string }
    ) => {
      return (
        (item[comp.textProp] as string).toLowerCase() === query.toLowerCase()
      );
    },
  },
  type: {
    type: String as PropType<keyof typeof TYPES>,
    required: true,
    validator: (v: TYPES) => {
      // The value must match either
      return [TYPES.multi, TYPES.single].indexOf(v) !== -1;
    },
  },
  labels: {
    type: Object as PropType<typeof LABELS>,
    default: () => {
      return LABELS;
    },
  },
  gridConfig: {
    type: Array as PropType<IAutocompleteGridColumn[]>,
  },
};
