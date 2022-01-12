<template>
  <div class="feather-autocomplete-results-grid" ref="grid">
    <table
      class="feather-autocomplete-results-grid-container"
      :class="cls"
      tabindex="-1"
      aria-hidden="false"
      aria-live="polite"
      role="grid"
      :aria-multiselectable="single ? 'false' : 'true'"
    >
      <thead>
        <tr role="row">
          <th v-for="item in config" :key="item.title">{{ item.title }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          role="row"
          v-for="(item, index) in items"
          :key="getText(item, textProp)"
          :aria-selected="isSelected(item)"
          :class="{ focus: isActive(index), selected: isSelected(item) }"
          @mousedown.prevent.stop="select(item)"
        >
          <td
            v-for="(col, colIndex) in config"
            :key="item[textProp] + col.prop.toString()"
            :id="getId(index, colIndex)"
            :class="{ 'focus-cell': isActiveCell(index, colIndex) }"
          >
            <Highlighter
              v-if="col.prop === textProp"
              :highlight="highlight"
              :query="query"
              :text="getText(item, col.prop)"
            />
            <p v-else>{{ item[col.prop] }}</p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts">
import { toView } from "@featherds/utils/scroll";
import Highlighter from "../Highlight/Highlighter.vue";
import HighlightProps from "../Highlight/HighlightProps";
import HighlighterProps from "../Highlight/HighlighterProps";
import {
  defineComponent,
  nextTick,
  PropType,
  watch,
  ref,
  Ref,
  toRef,
  computed,
} from "vue";
import { IAutocompleteGridColumn } from "./ResultGrid";
import { IAutocompleteItem } from "../types";

export default defineComponent({
  emits: ["select"],
  props: {
    ...HighlighterProps,
    ...HighlightProps,
    activeId: {
      type: String,
      required: true,
    },
    activeRow: {
      type: Number,
      required: true,
    },
    activeCol: {
      type: Number,
      required: true,
    },
    items: {
      type: Array as PropType<IAutocompleteItem[]>,
      required: true,
    },
    value: {
      type: [Array, Object] as PropType<
        IAutocompleteItem[] | IAutocompleteItem
      >,
      default: () => [],
    },
    textProp: {
      type: String as unknown as PropType<keyof IAutocompleteItem>,
      default: "_text",
    },
    single: {
      type: Boolean,
      default: false,
    },
    config: {
      type: Array as PropType<IAutocompleteGridColumn[]>,
      required: true,
    },
  },
  setup(props, context) {
    const grid: Ref<HTMLElement | undefined> = ref();
    const config = toRef(props, "config");
    watch(
      () => props.activeRow,
      (index) => {
        if (index > -1) {
          nextTick(() => {
            if (grid.value) {
              const el = Array.from(grid.value.querySelectorAll("tr"))[
                index + 1
              ]; //+1 for header
              toView(el, grid.value);
            }
          });
        }
      }
    );
    const cls = computed(() => {
      return config.value.map((item, index) => {
        if (item.align && item.align.toLowerCase() === "right") {
          return `tr${index + 1}`;
        }
        if (item.align && item.align.toLowerCase() === "center") {
          return `tc${index + 1}`;
        }
        return `tl${index + 1}`;
      });
    });

    const isSelected = (item: IAutocompleteItem) => {
      const value = props.value as IAutocompleteItem[];
      if (value && value.length) {
        return value.some(
          (x) =>
            (x[props.textProp] as string) === (item[props.textProp] as string)
        );
      }
      return (
        ((props.value as IAutocompleteItem)[props.textProp] as string) ===
        (item[props.textProp] as string)
      );
    };
    const isActive = (index: number) => {
      return props.activeRow === index;
    };
    const isActiveCell = (row: number, col: number) => {
      return props.activeRow === row && props.activeCol === col;
    };
    const getId = (index: number, col: number) => {
      return index === props.activeRow && props.activeCol === col
        ? props.activeId
        : undefined;
    };
    const select = (item: IAutocompleteItem) => {
      context.emit("select", item);
    };

    const getText = (
      item: IAutocompleteItem,
      prop: keyof IAutocompleteItem
    ) => {
      return item[prop] as string;
    };

    return {
      cls,
      isSelected,
      isActive,
      isActiveCell,
      getId,
      select,
      getText,
      grid,
    };
  },
  components: {
    Highlighter,
  },
});
</script>
<style lang="scss" scoped>
@import "@featherds/styles/mixins/typography";
@import "@featherds/styles/themes/variables";
@import "@featherds/styles/themes/utils";
@import "@featherds/table/scss/_table";
.feather-autocomplete-results-grid {
  overflow-y: scroll;
}
.feather-autocomplete-results-grid-container {
  @include table();
  @include table-condensed();
  @include row-hover();
  @include row-select();
  width: 100%;
  tr {
    &.selected {
      color: var($primary-text-on-surface);
    }

    &.focus td:first-child {
      box-shadow: inset 3px 0 0px 0px var($primary);
    }
    td {
      border: 1px solid transparent;
    }
    td.focus-cell {
      border: 1px solid var($primary);
    }
  }
  tbody tr {
    cursor: pointer;
  }
}
</style>
<style lang="scss">
@import "../../../scss/mixins";
.feather-autocomplete-results-grid {
  @include autocomplete-results-height(6);
}
</style>
