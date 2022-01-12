import { ref, toRef, computed } from "vue";

import { IAutocompleteItem } from "./types";
interface IProps {
  loading: boolean;
  minChar: number;
  modelValue: IAutocompleteItem[] | IAutocompleteItem | undefined;
  disabled: boolean;
  textProp: keyof IAutocompleteItem;
  allowNew: boolean;
  error: string | undefined;
  label: string | undefined;
  selectionLimit: number | undefined;
}
const useState = (props: IProps) => {
  const loading = toRef(props, "loading");
  const minChar = toRef(props, "minChar");
  const modelValue = toRef(props, "modelValue");
  const textProp = toRef(props, "textProp");
  const allowNew = toRef(props, "allowNew");
  const error = toRef(props, "error");
  const label = toRef(props, "label");
  const selectionLimit = toRef(props, "selectionLimit");
  const disabled = toRef(props, "disabled");

  const query = ref("");
  const hasFocus = ref(false);

  const internalResults = ref([] as IAutocompleteItem[]);
  const forceCloseResults = ref(false);
  const selectionLimitReached = ref(false);

  const showMenu = computed(() => {
    return (
      (showResults.value ||
        showNoResults.value ||
        showLoading.value ||
        showSelectionLimit.value ||
        showMinCharWarning.value) &&
      !disabled.value
    );
  });
  const showResults = computed(() => {
    if (
      forceCloseResults.value ||
      selectionLimitReached.value ||
      showMinCharWarning.value
    ) {
      return false;
    }
    return !!(
      hasFocus.value &&
      internalResults.value &&
      internalResults.value.length &&
      !loading.value
    );
  });

  const showNoResults = computed(() => {
    return (
      !forceCloseResults.value &&
      hasFocus.value &&
      !selectionLimitReached.value &&
      internalResults.value &&
      internalResults.value.length === 0 &&
      query.value &&
      query.value.length > 0 &&
      query.value.length >= minChar.value &&
      !loading.value
    );
  });

  const showSelectionLimit = computed(() => {
    return (
      !forceCloseResults.value &&
      hasFocus.value &&
      selectionLimitReached.value &&
      !loading.value
    );
  });
  const showLoading = computed(() => {
    return hasFocus.value && loading.value;
  });
  const showMinCharWarning = computed(() => {
    return (
      minChar.value > 0 &&
      !selectionLimitReached.value &&
      !loading.value &&
      hasFocus.value &&
      query.value.length < minChar.value
    );
  });

  return {
    loading,
    minChar,
    modelValue,
    disabled,
    textProp,
    error,
    label,
    query,
    selectionLimit,
    allowNew,
    hasFocus,
    internalResults,
    forceCloseResults,
    selectionLimitReached,
    showMenu,
    showResults,
    showNoResults,
    showSelectionLimit,
    showLoading,
    showMinCharWarning,
  };
};

export { useState };
