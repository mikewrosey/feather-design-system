import { SetupContext, Ref } from "vue";
import { KEYCODES } from "@featherds/utils/keys";
import { useState } from "./State";
import { useDom } from "./Dom";
import { useChips } from "./Chips";
import { IAutocompleteItemType, IAutocompleteType } from "./types";

const useInputListeners = (
  state: ReturnType<typeof useState>,
  dom: ReturnType<typeof useDom>,
  emitSearch: () => void,
  strategy: IAutocompleteType,
  results: {
    reset: () => void;
    active: { row: number };
    handleKeyPress: (
      e: KeyboardEvent,
      internalResults: IAutocompleteItemType[]
    ) => boolean;
  },
  chips?: ReturnType<typeof useChips>
) => {
  let typingTimeout: number = -1;

  const resetChipIndex = () => {
    if (chips) chips.reset();
  };
  const selectItem = (item: IAutocompleteItemType) => {
    strategy.selectItem(item);
    dom.adjustTextArea();
  };

  const handleTextInput = (e: KeyboardEvent) => {
    dom.adjustTextArea();

    const str = (e.target as HTMLInputElement).value;
    if (str === undefined) {
      return;
    }
    window.clearTimeout(typingTimeout);
    typingTimeout = window.setTimeout(() => {
      state.query.value = str;
      emitSearch();
    }, 250);
  };

  const handleInputBlur = () => {
    strategy.handleInputBlur();
    if (state.forceCloseResults.value || state.showMenu.value) {
      handleOutsideClick();
    }
  };

  const handleOutsideClick = () => {
    state.hasFocus.value = false;
    state.forceCloseResults.value = false;
    resetChipIndex();
    results.reset();
    state.query.value = strategy.initialText.value;
    state.internalResults.value = [];
    dom.adjustTextArea();
  };

  const handleInputFocus = () => {
    if (state.disabled.value) {
      return;
    }
    dom.adjustTextArea();
    if (state.hasFocus.value) {
      return;
    }

    state.hasFocus.value = true;
    if (state.modelValue.value && strategy.single && dom.input.value) {
      dom.input.value.select();
    }

    emitSearch();
  };

  const handleInputKeyDown = (e: KeyboardEvent) => {
    const resetMenuIndex = () => {
      results.reset();
    };
    //stop enter form taking a new line
    if (e.keyCode === KEYCODES.ENTER) {
      e.preventDefault();
    }

    //menu navigation
    if (state.internalResults.value && state.internalResults.value.length) {
      const handled = results.handleKeyPress(e, state.internalResults.value);
      if (handled) {
        resetChipIndex();
        state.forceCloseResults.value = false;
        return;
      }
    }

    if (e.keyCode === KEYCODES.ENTER && results.active.row > -1) {
      e.preventDefault();
      selectItem(state.internalResults.value[results.active.row]);
      return;
    }

    if (chips) {
      //cast model to array
      const modelValue = state.modelValue as Ref<IAutocompleteItemType[]>;
      //chip deletion via enter
      if (e.keyCode === KEYCODES.ENTER && chips.activeIndex.value > -1) {
        e.preventDefault();
        strategy.removeItem(modelValue.value[chips.activeIndex.value]);
        chips.reset();
        return true;
      }

      ///chip navigation
      if (
        !state.query.value &&
        state.modelValue.value &&
        (state.modelValue.value as unknown[]).length
      ) {
        if (chips.handleKeyPress(e, state.modelValue.value as unknown[])) {
          resetMenuIndex();
          return;
        }
      }

      if (
        (e.keyCode === KEYCODES.DELETE || e.keyCode === KEYCODES.BACKSPACE) &&
        chips.activeIndex.value !== -1
      ) {
        strategy.removeItem(modelValue.value[chips.activeIndex.value]);
        resetChipIndex();
        return true;
      }
    }

    if (e.keyCode === KEYCODES.ESCAPE) {
      state.forceCloseResults.value = true;
      resetMenuIndex();
      resetChipIndex();
      return;
    }
  };

  return {
    listeners: {
      input: handleTextInput,
      blur: handleInputBlur,
      focus: handleInputFocus,
      keydown: handleInputKeyDown,
    },
    handleOutsideClick,
  };
};

export { useInputListeners };
