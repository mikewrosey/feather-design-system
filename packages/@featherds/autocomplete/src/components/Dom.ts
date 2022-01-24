import {
  ref,
  Ref,
  ComponentPublicInstance,
  computed,
  nextTick,
  watch,
} from "vue";
import { toView } from "@featherds/utils/scroll";
import { useChips } from "./Chips";
import { useState } from "./State";
import { IAutocompleteItemType } from "./types";

const useDom = (
  state: ReturnType<typeof useState>,
  chips?: ReturnType<typeof useChips>
) => {
  const input: Ref<HTMLInputElement | undefined> = ref();
  const scroll: Ref<ComponentPublicInstance | undefined> = ref();
  const menu: Ref<{ calculatePosition: () => void } | undefined> = ref();
  const alert: Ref<HTMLElement | undefined> = ref();

  const scrollContainer = computed(() => {
    if (scroll.value) {
      return (scroll.value.$el as HTMLElement).querySelector(
        ".feather-input-wrapper"
      ) as HTMLElement;
    }
    return undefined;
  });

  const adjustTextArea = () => {
    const tx = input.value;
    //if this is called before mount
    if (!tx) {
      return;
    }
    tx.style.height = "26px";
    tx.style.flexBasis = "40px";
    tx.style.whiteSpace = "nowrap";

    nextTick(() => {
      const txWidth = tx.getBoundingClientRect().width;
      if (
        tx.scrollWidth <= tx.clientWidth &&
        tx.parentElement &&
        txWidth < tx.parentElement.getBoundingClientRect().width
      ) {
        tx.style.whiteSpace = "nowrap";
      } else {
        tx.style.whiteSpace = "normal";
        tx.style.flexBasis = "100%";
      }
      nextTick(() => {
        tx.style.height = `${tx.scrollHeight}px`;
      });
    });
  };

  const setAlert = (txt: string) => {
    if (alert.value) {
      alert.value.textContent = txt;
      setTimeout(() => {
        if (alert.value) {
          alert.value.textContent = "";
        }
      }, 100);
    }
  };

  watch([state.query, input], ([v, inputElement]) => {
    if (!inputElement) {
      return;
    }
    if (v === inputElement.value) {
      return;
    }

    inputElement.value = v;
  });
  watch(
    state.modelValue,
    (v, o) => {
      //adjust if value is updated but not focused
      if (!state.hasFocus.value) {
        adjustTextArea();
      }
      //when a value is added make sure to scroll input into view
      const vArr = v as IAutocompleteItemType[];
      const oArr = o as IAutocompleteItemType[];
      if (vArr && oArr && vArr.length > oArr.length) {
        nextTick(() => {
          if (scrollContainer.value && input.value) {
            toView(input.value as HTMLElement, scrollContainer.value);
          }
        });
      }
    },
    { immediate: true }
  );
  watch(state.showResults, (v) => {
    if (v && menu.value && menu.value.calculatePosition) {
      menu.value.calculatePosition();
    }
  });
  if (chips) {
    watch(chips.activeIndex, (v) => {
      const chip = document.querySelector(
        `#${chips.activeId.value}`
      ) as HTMLElement;
      if (v > -1) {
        nextTick(() => {
          if (chip && scrollContainer.value) {
            toView(chip, scrollContainer.value);
          }
        });
      }
    });
  }

  return {
    input,
    scrollContainer,
    adjustTextArea,
    setAlert,
    alert,
    menu,
  };
};

export { useDom };
