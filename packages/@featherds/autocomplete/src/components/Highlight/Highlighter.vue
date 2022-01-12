<template>
  <span>
    <span>{{ beginning }}</span>
    <span class="highlight" v-if="highlighted">{{ highlighted }}</span>
    <span v-if="end">{{ end }}</span>
  </span>
</template>

<script lang="ts">
import { defineComponent, computed, toRef } from "vue";
import HighlightProps from "./HighlightProps";
import HighlighterProps from "./HighlighterProps";
export default defineComponent({
  props: {
    ...HighlightProps,
    ...HighlighterProps,
    text: {
      type: String,
      required: true,
    },
    highlight: {
      type: String,
      default: "off",
      validator: (v: string) => {
        // The value must match either
        return ["off", "ignore-case"].indexOf(v) !== -1;
      },
    },
    query: {
      type: String,
    },
  },
  setup(props) {
    const query = toRef(props, "query");
    const highlight = toRef(props, "highlight");
    const text = toRef(props, "text");
    const index = computed(() => {
      if (!query.value) {
        return -1;
      }
      if (query.value && query.value.length === 0) {
        return -1;
      }
      switch (highlight.value.toLowerCase()) {
        case "ignore-case":
          return text.value.toLowerCase().indexOf(query.value.toLowerCase());
        default:
          return -1;
      }
    });

    const beginning = computed(() => {
      if (index.value === -1) {
        return text.value;
      }
      return text.value.slice(0, index.value);
    });
    const highlighted = computed(() => {
      if (index.value === -1) {
        return;
      }
      return text.value.slice(
        index.value,
        index.value + (query.value ? query.value.length : 0)
      );
    });
    const end = computed(() => {
      if (index.value === -1) {
        return;
      }
      return text.value.slice(
        index.value + (query.value ? query.value.length : 0)
      );
    });
    return {
      beginning,
      highlighted,
      end,
    };
  },
});
</script>
<style lang="scss" scoped>
@import "@featherds/styles/themes/variables";
.highlight {
  font-weight: var($font-bold);
}
</style>
