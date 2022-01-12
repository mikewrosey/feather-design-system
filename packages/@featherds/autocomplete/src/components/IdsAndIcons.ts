import { computed } from "vue";
import { getSafeId } from "@featherds/utils/id";
import Search from "@featherds/icon/action/Search";
import Info from "@featherds/icon/action/Info";
import KeyboardArrowDown from "@featherds/icon/navigation/ExpandMore";

const useIdsAndIcons = () => {
  return {
    resultItemId: computed(() => {
      return getSafeId("result-item");
    }),

    minCharWarningId: computed(() => {
      return getSafeId("min-char-warning");
    }),
    subTextId: computed(() => {
      return getSafeId("feather-autocomplete-description");
    }),
    inputId: computed(() => {
      return getSafeId("feather-autocomplete-input");
    }),
    resultsId: computed(() => {
      return getSafeId("feather-autocomplete-input-results");
    }),
    selectedDescriptionId: computed(() => {
      return getSafeId("feather-autocomplete-input-selected");
    }),
    searchIcon: computed(() => {
      return Search;
    }),
    minCharIcon: computed(() => {
      return Info;
    }),
    dropdownIcon: computed(() => {
      return KeyboardArrowDown;
    }),
  };
};

export { useIdsAndIcons };
