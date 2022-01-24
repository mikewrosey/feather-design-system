import { computed, watch, SetupContext, Ref } from "vue";
import { useState } from "../State";
import { IAutocompleteItemType, IAutocompleteType } from "../types";

const useMulti = (
  state: ReturnType<typeof useState>,
  context: SetupContext<("new" | "update:modelValue" | "search")[]>
): IAutocompleteType => {
  const modelValue = state.modelValue as Ref<IAutocompleteItemType[]>;
  const initialText = computed(() => "");
  const hasValue = computed(() => {
    return !!(modelValue.value && modelValue.value.length > 0);
  });

  const setSelectionLimit = (results: IAutocompleteItemType[]) => {
    if (
      state.selectionLimit.value &&
      results.length >= state.selectionLimit.value
    ) {
      state.selectionLimitReached.value = true;
    } else {
      state.selectionLimitReached.value = false;
    }
  };

  watch(
    state.modelValue,
    (v) => {
      const arr = v as IAutocompleteItemType[];
      if (arr && arr.length) {
        setSelectionLimit(arr);
      }
    },
    { immediate: true }
  );
  return {
    single: false,
    initialText,
    hasValue,
    selectItem(item: IAutocompleteItemType) {
      const value = modelValue.value;
      if (
        value &&
        value.filter(
          (x) => x[state.textProp.value] === item[state.textProp.value]
        ).length
      ) {
        return;
      }
      const result = value ? [...value, item] : [item];
      context.emit("update:modelValue", result);
      setSelectionLimit(result);
    },
    removeItem(item: IAutocompleteItemType) {
      const value = modelValue.value;
      const index = value.indexOf(item);
      if (index > -1) {
        const result = value.slice(0);
        result.splice(index, 1);
        context.emit("update:modelValue", result);
        setSelectionLimit(result);
      }
    },
    clickedItem() {
      state.query.value = "";
      //emitsearch
    },
    handleInputBlur() {},
  };
};

export { useMulti };
