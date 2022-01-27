import { computed, watch, SetupContext, Ref } from "vue";
import { useState } from "../State";
import { emits, IAutocompleteItemType, IAutocompleteType } from "../types";

const useSingle = (
  state: ReturnType<typeof useState>,
  context: SetupContext<typeof emits>,
  results: { active: { row: number } }
): IAutocompleteType => {
  const modelValue = state.modelValue as Ref<IAutocompleteItemType>;

  const initialText = computed(() =>
    modelValue.value ? (modelValue.value[state.textProp.value] as string) : ""
  );
  const hasValue = computed(() => {
    return !!modelValue.value;
  });
  watch(
    state.modelValue,
    () => {
      //set query to display new value
      state.query.value = initialText.value;
    },
    { immediate: true }
  );
  return {
    single: true,
    initialText,
    hasValue,
    selectItem(item: IAutocompleteItemType) {
      results.active.row = -1;
      state.forceCloseResults.value = true;
      if (item && item._new && state.allowNew.value) {
        context.emit("new", item._new as string);
      } else {
        context.emit("update:modelValue", item);
      }
    },
    removeItem() {},
    clickedItem() {
      state.forceCloseResults.value = true;
    },
    handleInputBlur() {
      //select active index
      if (results.active.row > -1) {
        const item = state.internalResults.value[results.active.row];
        if (item && item._new && state.allowNew.value) {
          context.emit("new", item._new as string);
        } else {
          context.emit("update:modelValue", item);
        }
      }
    },
  };
};

export { useSingle };
