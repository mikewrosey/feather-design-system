import { computed, SetupContext } from "vue";
import { useState } from "./State";
import { useIdsAndIcons } from "./IdsAndIcons";
import { useChips } from "./Chips";
import { emits } from "./types";

const useComboBoxAttrs = (
  state: ReturnType<typeof useState>,
  ids: ReturnType<typeof useIdsAndIcons>,
  active: { row: number },
  context: SetupContext<typeof emits>,
  grid: boolean,
  chips?: ReturnType<typeof useChips>
) => {
  const comboxBoxAttrs = computed(() => {
    return {
      role: "combobox",
      "aria-expanded": state.showResults.value ? "true" : "false",
      "aria-haspopup": grid ? "grid" : "listbox",
      "aria-owns": ids.resultsId.value,
      "aria-label": state.label?.value,
    };
  });

  const inputAttrs = computed(() => {
    const describedby = [ids.selectedDescriptionId.value, ids.subTextId.value];

    let activeDescendant = "";
    if (chips && chips.activeIndex.value > -1) {
      activeDescendant = chips.activeId.value;
    }
    if (active.row > -1 && state.showResults.value) {
      activeDescendant = ids.resultItemId.value;
    }
    if (state.showMinCharWarning.value) {
      describedby.push(ids.minCharWarningId.value);
    }

    return {
      id: ids.inputId.value,
      "aria-describedby": describedby.join(" "),
      "aria-busy": state.loading.value,
      "aria-activedescendant": activeDescendant,
      disabled: state.disabled.value,
      "aria-disabled": state.disabled.value,
      "aria-autocomplete": "list" as
        | "inline"
        | "both"
        | "none"
        | "list"
        | undefined,
      autocomplete: "off",
      readonly: state.disabled.value ? true : false,
      tabindex: state.disabled.value ? -1 : 0,
      "aria-controls": ids.resultsId.value,
      "aria-invalid":
        context.attrs["aria-invalid"] === "true" || !!state.error.value,
    };
  });

  return {
    comboxBoxAttrs,
    inputAttrs,
  };
};

export { useComboBoxAttrs };
