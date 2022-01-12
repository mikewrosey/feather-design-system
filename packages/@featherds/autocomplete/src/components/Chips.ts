import { computed, ref, Ref } from "vue";
import { getSafeId } from "@featherds/utils/id";
import { KEYCODES } from "@featherds/utils/keys";

const useChips = () => {
  const activeId = computed(() => {
    return getSafeId("active-chip");
  });
  const activeIndex = ref(-1);
  const handleKeyPress = (e: KeyboardEvent, modelValue: unknown[]) => {
    if (e.keyCode === KEYCODES.LEFT) {
      //left
      //if nothing selected select first (aka last element in array);
      e.preventDefault();
      if (activeIndex.value === -1) {
        activeIndex.value = modelValue.length - 1;
        return true;
      } else if (activeIndex.value - 1 >= 0) {
        activeIndex.value = activeIndex.value - 1;
        return true;
      }
    }
    if (e.keyCode === KEYCODES.RIGHT) {
      //right
      //if in rightmost chip remove activity from chip list
      e.preventDefault();

      if (activeIndex.value === modelValue.length - 1) {
        activeIndex.value = -1;
        return true;
      } else if (
        activeIndex.value < modelValue.length - 1 &&
        activeIndex.value > -1
      ) {
        activeIndex.value = activeIndex.value + 1;
        return true;
      }
    }

    return false;
  };
  const reset = () => (activeIndex.value = -1);

  return {
    reset,
    activeId,
    activeIndex,
    handleKeyPress,
  };
};

export { useChips };
