import { computed, Ref } from "vue";

export interface IRadio {
  first: boolean;
  focus: () => void;
  checked: boolean;
  disabled: boolean;
  value: unknown;
}
const useSelection = (
  current: Ref<IRadio>,
  radios: Ref<IRadio[]>,
  select: (r: IRadio) => void
) => {
  const notDisabled = computed(() => {
    return radios.value.filter((x) => !x.disabled);
  });
  const index = computed(() => notDisabled.value.indexOf(current.value));

  return {
    selectPrevious() {
      if (current.value && current.value.disabled) {
        return;
      }
      if (index.value === 0) {
        select(notDisabled.value[notDisabled.value.length - 1]);
      } else {
        select(notDisabled.value[index.value - 1]);
      }
    },
    selectNext() {
      if (current.value && current.value.disabled) {
        return;
      }
      if (index.value === notDisabled.value.length - 1) {
        select(notDisabled.value[0]);
      } else {
        select(notDisabled.value[index.value + 1]);
      }
    },
  };
};

export { useSelection };
