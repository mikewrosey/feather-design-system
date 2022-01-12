<template>
  <FeatherList
    class="feather-autocomplete-results-list"
    tabindex="-1"
    aria-hidden="false"
    aria-live="polite"
    role="listbox"
    :aria-multiselectable="single ? 'false' : 'true'"
    ref="list"
  >
    <!-- eslint-disable -->
    <template v-for="(item, index) in items" :key="item[textProp]">
      <FeatherListItem
        as-li
        :id="getId(index)"
        tabindex="-1"
        role="option"
        class="result-item hover"
        :aria-selected="isSelected(item)"
        :highlighted="isActive(index)"
        :selected="isSelected(item)"
        @mousedown.stop.prevent="select(item)"
      >
        <Highlighter
          :highlight="highlight"
          :query="query"
          :text="item[textProp] as string"
        />
        <span class="autocomplete-item-new-label" v-if="item._new">
          {{ newLabel }}
        </span>
      </FeatherListItem>
      <li
        v-if="items.length !== 1 && item._new"
        role="presentation"
        :key="item[textProp] + 'hr'"
        class="hr"
      ></li>
    </template>
  </FeatherList>
</template>
<script lang="ts">
import {
  defineComponent,
  nextTick,
  PropType,
  Ref,
  toRef,
  watch,
  ref,
  ComponentPublicInstance,
} from "vue";
import { toView } from "@featherds/utils/scroll";
import { FeatherListItem, FeatherList } from "@featherds/list";
import Highlighter from "../Highlight/Highlighter.vue";
import HighlightProps from "../Highlight/HighlightProps";
import HighlighterProps from "../Highlight/HighlighterProps";
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
    activeIndex: {
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
    newLabel: {
      type: String,
      default: "new",
    },
  },
  setup(props, context) {
    const activeIndex = toRef(props, "activeIndex");
    const activeId = toRef(props, "activeId");
    const list: Ref<ComponentPublicInstance | undefined> = ref();
    watch(
      () => props.activeIndex,
      (index) => {
        if (index > -1) {
          nextTick(() => {
            if (list.value) {
              const el = Array.from(
                (list.value.$el as HTMLElement).querySelectorAll("li")
              )[index];
              toView(el, list.value.$el as HTMLElement);
            }
          });
        }
      }
    );

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
      return activeIndex.value === index;
    };
    const getId = (index: number) => {
      return index === activeIndex.value ? activeId.value : undefined;
    };
    const select = (item: unknown) => {
      context.emit("select", item);
    };
    return { list, isSelected, isActive, getId, select };
  },

  components: {
    FeatherList,
    FeatherListItem,
    Highlighter,
  },
});
</script>
<style lang="scss" scoped>
@import "@featherds/styles/mixins/typography";
@import "@featherds/styles/themes/variables";
@import "@featherds/styles/themes/utils";

.feather-autocomplete-results-list {
  overflow-y: auto;
  width: 100%;
  li {
    &.hr {
      height: 0;
      margin: 8px 0;
      border-bottom: 1px solid var($border-light-on-surface);
    }
  }
  .autocomplete-item-new-label {
    background-color: var($border-on-surface);
    color: var($primary);
    padding: 4px 8px;
    display: inline-block;
    margin-left: 6px;
  }
}
</style>
<style lang="scss">
@import "../../../scss/mixins";
.feather-autocomplete-results-list {
  @include autocomplete-results-height(6);
}
</style>
