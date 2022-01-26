<template>
  <div v-bind="inheritAttrs" class="feather-autocomplete-container">
    <FeatherMenu
      no-expand
      :open="showMenu"
      @outside-click="handleOutsideClick"
      @trigger-click="handleTriggerClick"
      class="feather-autocomplete-menu-container"
      :class="{ grid: gridConfig }"
      ref="menu"
    >
      <template v-slot:trigger>
        <InputWrapper
          v-bind="{ ...comboxBoxAttrs, ...inputWrapperProps }"
          :for="inputId"
          :raised="raised"
          :focused="hasFocus"
          :clear-text="clearLabel"
          :showClear="showClear"
          @clear="handleClear"
          menu-trigger
          ref="scroll"
        >
          <template v-slot:pre>
            <slot name="pre">
              <FeatherIcon :icon="searchIcon" />
            </slot>
          </template>
          <div
            class="feather-autocomplete-content"
            :class="{ disabled: disabled }"
          >
            <div
              class="alert"
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
              ref="alert"
            ></div>
            <div class="description" :id="selectedDescriptionId">
              {{ selectedDescribedByText }}
            </div>
            <Chip
              v-show="!strategy.single"
              v-for="(item, index) in modelValueList"
              :key="(item[textProp] as string)"
              role="button"
              :id="index === activeChipIndex ? activeChipId : null"
              :focused="index === activeChipIndex"
              :disabled="disabled"
              :text="(item[textProp] as string)"
              :remove-label="removeLabel"
              :pre="item._pre"
              @delete="strategy.removeItem(item)"
            />
            <textarea
              v-bind="inputAttrs"
              class="feather-autocomplete-input"
              data-ref-id="feather-input"
              :class="{ error: error }"
              v-on="inputListeners"
              ref="input"
            />
          </div>

          <template v-slot:post>
            <FeatherIcon
              :icon="dropdownIcon"
              class="feather-autocomplete-dropdown-icon"
              :class="{ rotate: showMenu }"
              @click="handleDropdownIconClick"
            />
          </template>
        </InputWrapper>
      </template>
      <AutocompleteResults
        v-if="!gridConfig"
        v-show="showResults"
        :items="internalResults"
        :value="modelValue"
        :text-prop="textProp"
        :activeId="resultItemId"
        :activeIndex="active.row"
        :aria-label="label"
        @select="clickedItem"
        class="autocomplete-results"
        :id="resultsId"
        :single="strategy.single"
        :new-label="newLabel"
        :highlight="highlight"
        :query="query"
        ref="results"
      />
      <AutocompleteResultsGrid
        v-if="gridConfig"
        v-show="showResults"
        :items="internalResults"
        :value="modelValue"
        :text-prop="textProp"
        :config="gridConfig"
        :activeId="resultItemId"
        :activeRow="active.row"
        :activeCol="active.col"
        :aria-label="label"
        @select="clickedItem"
        class="autocomplete-results"
        :id="resultsId"
        :single="strategy.single"
        :highlight="highlight"
        :query="query"
      />
      <MenuMessage v-if="showNoResults">
        <span data-ref-id="feather-autocomplete-no-results">{{
          noResultsLabel
        }}</span>
      </MenuMessage>
      <MenuMessage v-if="showSelectionLimit" class="selection-limit-warning">
        <FeatherIcon :icon="minCharIcon" />
        <span data-ref-id="feather-autocomplete-selection-limit">
          {{ selectionLimitLabel }}
        </span>
      </MenuMessage>
      <MenuMessage
        v-if="showMinCharWarning"
        class="min-char-warning"
        :id="minCharWarningId"
      >
        <FeatherIcon :icon="minCharIcon" />
        <span data-ref-id="feather-autocomplete-min-char">
          <slot name="min-char">{{ minCharText }}</slot>
        </span>
      </MenuMessage>
      <Spinner v-if="showLoading" />
    </FeatherMenu>
    <InputSubText :id="subTextId" v-bind="inputSubtTextProps"></InputSubText>
  </div>
</template>
<script lang="ts">
import {
  InputWrapper,
  useInputWrapper,
  InputWrapperProps,
  InputSubText,
  useInputSubText,
  InputSubTextProps,
  useInheritAttrs,
} from "@featherds/input-helper";
import { FeatherIcon } from "@featherds/icon";
import { FeatherMenu } from "@featherds/menu";

import AutocompleteResults from "./Results/AutocompleteResults.vue";
import AutocompleteResultsGrid from "./Results/AutocompleteResultsGrid.vue";
import MenuMessage from "./MenuMessage.vue";
import Chip from "./Chip.vue";
import Spinner from "./Spinner.vue";
import { useLabelProperty } from "@featherds/composables/LabelProperty";
import {
  defineComponent,
  toRef,
  PropType,
  computed,
  watch,
  onMounted,
} from "vue";
import { useResultList } from "./Results/ResultList";
import { useResultGrid } from "./Results/ResultGrid";
import HighlightProps from "./Highlight/HighlightProps";
import { useSingle, useMulti } from "./Type/";
import { useIdsAndIcons } from "./IdsAndIcons";
import { useState } from "./State";
import { useComboBoxAttrs } from "./ComboBoxAttrs";
import { useChips } from "./Chips";
import { useInputListeners } from "./InputListeners";
import { useDom } from "./Dom";
import {
  IAutocompleteItemType,
  TYPES,
  IAutocompleteType,
  IAutocompleteGridColumn,
} from "./types";

const LABELS = {
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

export default defineComponent({
  model: {
    prop: "modelValue",
    event: "update:modelValue",
  },
  emits: ["update:modelValue", "search", "new"],
  props,
  methods: {},
  setup(props, context) {
    const labels = useLabelProperty<typeof LABELS>(
      toRef(props, "labels"),
      LABELS
    );
    const idsAndIcons = useIdsAndIcons();
    const state = useState(props);

    let chips: ReturnType<typeof useChips> | undefined;
    let results:
      | ReturnType<typeof useResultGrid>
      | ReturnType<typeof useResultList>;

    if (props.gridConfig) {
      results = useResultGrid(props.gridConfig);
    } else {
      results = useResultList();
    }

    let strategy: IAutocompleteType;
    if (props.type === TYPES.multi) {
      strategy = useMulti(state, context);
      chips = useChips();
    } else {
      strategy = useSingle(state, context, results);
    }

    const dom = useDom(state, chips);

    const emitSearch = () => {
      if (state.hasFocus.value && !state.selectionLimitReached.value) {
        if (
          state.query.value &&
          state.query.value.length >= state.minChar.value
        ) {
          context.emit("search", state.query.value);
        }
        if (state.minChar.value <= 0) {
          context.emit("search", state.query.value || "");
        }
        state.internalResults.value = [];
        results.reset();
      }
    };

    const { listeners: inputListeners, handleOutsideClick } = useInputListeners(
      state,
      dom,
      emitSearch,
      strategy,
      results,
      chips
    );
    const { comboxBoxAttrs, inputAttrs } = useComboBoxAttrs(
      state,
      idsAndIcons,
      results.active,
      context,
      !!props.gridConfig,
      chips
    );
    //inputwrappper
    const raised = computed(
      () => strategy.hasValue.value || state.hasFocus.value
    );
    const showClear = computed(
      () => strategy.single && strategy.hasValue.value
    );

    const minCharText = computed(() => {
      if (labels.minCharLabel.value) {
        return labels.minCharLabel.value.replace(
          "${min}",
          props.minChar.toString()
        );
      }
      return "";
    });
    const allowNewEnabled = computed(
      () => strategy.single && state.allowNew.value
    );
    const modelValueList = computed(() => {
      if (strategy.single) {
        return [];
      }
      return state.modelValue.value as IAutocompleteItemType[];
    });

    const selectedDescribedByText = computed(() => {
      if (
        state.modelValue.value &&
        (state.modelValue.value as IAutocompleteItemType[]).length
      ) {
        return (state.modelValue.value as IAutocompleteItemType[])
          .map((x) => x[state.textProp.value])
          .join(", ");
      }
      return "";
    });

    watch(
      () => props.results,
      (v) => {
        if (!strategy.single && !props.gridConfig && v && v.length > 0) {
          results.first();
        }
        state.forceCloseResults.value = false; // should no longer force close
        //alert for no results
        if (
          v &&
          v.length === 0 &&
          state.query.value &&
          state.query.value.length > 0 &&
          !allowNewEnabled.value
        ) {
          dom.setAlert(labels.noResultsLabel.value);
        }

        //create new element if allowed.
        if (allowNewEnabled.value && state.query.value.length) {
          const found = v.some((item) => {
            return props.newMatcher(item, state.query.value, {
              textProp: state.textProp.value,
            });
          });
          if (!found) {
            v = [
              {
                _text: "",
                [props.textProp]: state.query.value,
                _new: state.query.value,
              },
              ...v,
            ];
          }
        }
        state.internalResults.value = v;
      }
    );
    watch(state.selectionLimitReached, (v) => {
      if (v) {
        dom.setAlert(labels.selectionLimitLabel.value);
      }
    });

    const handleClear = () => {
      state.query.value = "";
      if (dom.input.value) {
        dom.input.value.focus();
      }
      emitSearch();
      context.emit("update:modelValue", undefined);
    };
    const handleTriggerClick = () => {
      if (state.disabled.value) {
        return;
      }
      if (dom.input.value) {
        dom.input.value.focus();
      }
    };

    const clickedItem = (item: IAutocompleteItemType) => {
      strategy.selectItem(item);
      //clear everything and re focus
      state.internalResults.value = [];
      if (dom.input.value) {
        dom.input.value.focus();
      }
      strategy.clickedItem();
      dom.adjustTextArea();
      if (!strategy.single) {
        emitSearch();
      }
    };

    const handleDropdownIconClick = () => {
      if (state.showMenu.value) {
        state.forceCloseResults.value = true;
        return;
      }
      if (state.forceCloseResults.value) {
        emitSearch();
      }
    };
    onMounted(() => dom.adjustTextArea());

    return {
      ...labels,
      ...idsAndIcons,
      ...state,
      ...dom,
      ...useInputSubText(props),
      ...useInputWrapper(props),
      ...useInheritAttrs(context.attrs),
      activeChipIndex: chips ? chips.activeIndex : -1,
      activeChipId: chips ? chips.activeId : "",
      active: results.active,
      selectFirst: results.first,
      strategy,
      inputListeners,
      comboxBoxAttrs,
      inputAttrs,
      raised,
      showClear,
      handleClear,
      minCharText,
      modelValueList,
      selectedDescribedByText,
      clickedItem,
      handleDropdownIconClick,
      handleTriggerClick,
      handleOutsideClick,
    };
  },
  components: {
    InputWrapper,
    InputSubText,
    AutocompleteResults,
    AutocompleteResultsGrid,
    Chip,
    MenuMessage,
    FeatherIcon,
    FeatherMenu,
    Spinner,
  },
});
</script>

<style lang="scss" scoped>
@import "@featherds/styles/mixins/typography";
@import "@featherds/styles/themes/variables";
@import "@featherds/input-helper/scss/spacing";
.feather-autocomplete-container {
  @include input-spacing;
}

.alert,
.description {
  @include screen-reader();
}

.feather-autocomplete-container {
  :deep(.post) {
    min-width: 80px;
    justify-content: flex-end;
  }
  :deep(.prefix),
  :deep(.post) {
    align-self: flex-start;
    margin-top: 10px;
  }
}

.min-char-warning,
.selection-limit-warning {
  :deep(.feather-icon) {
    color: var($primary);
    font-size: 20px;
    margin-right: 12px;
  }
}
.chip-list {
  vertical-align: middle;
}
.feather-autocomplete-input {
  border: none;
  margin: 3px 0;
  display: inline-block;
  vertical-align: middle;
  height: 26px;
  resize: none;
  background-color: transparent;
  flex: 1 1 40px;
  width: 0;
  @include body-small();
  line-height: 1.5em; //IE has an issue with the mixin lineheight when typing
  color: var($primary-text-on-surface);
  caret-color: var($primary);
  overflow: auto;
  &::-ms-clear {
    display: none;
  }
  &:focus {
    outline: 0;
  }
  &.error {
    caret-color: var($error);
  }
  [disabled] {
    color: var($disabled-text-on-surface);
  }
}

.disabled {
  .feather-autocomplete-dropdown-icon,
  .feather-autocomplete-input {
    color: var($disabled-text-on-surface);
    cursor: default;
  }
}
.feather-autocomplete-dropdown-icon {
  color: var($secondary-text-on-surface);
  transition: transform 280ms ease-in-out;
  transform-origin: center center;
  font-size: 20px;
  cursor: pointer;
  &.rotate {
    transform: rotate(180deg);
  }
}

.feather-autocomplete-menu-container {
  width: 100%;
  position: relative;
  :deep(.feather-menu-dropdown) {
    width: 100%;
  }
  &.grid :deep(.feather-menu-dropdown) {
    width: auto;
    min-width: 100%;
  }
}
.feather-autocomplete-content {
  flex: 1;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  min-width: 0;
  margin-top: 4px;
  margin-bottom: 2px;
}
</style>
