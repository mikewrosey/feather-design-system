<template>
  <div class="feather-input-sub-text" :id="id" v-show="hasContent">
    <div
      class="feather-input-hint"
      v-if="hint && !error"
      data-ref-id="feather-form-element-hint"
    >
      {{ hint }}
    </div>
    <div
      class="feather-input-error"
      v-if="error"
      data-ref-id="feather-form-element-error"
      aria-live="assertive"
    >
      {{ error }}
    </div>
    <slot name="right"></slot>
  </div>
</template>
<script lang="ts">
import { defineComponent, ExtractPropTypes, inject } from "vue";

export const props = {
  hint: {
    type: String,
  },
  error: {
    type: String,
  },
};

export const use = (p: ExtractPropTypes<typeof props>) => {
  const newProps = {} as ExtractPropTypes<typeof props>;
  let key: keyof typeof props;
  for (key in props) {
    if (p[key] !== undefined) {
      newProps[key] = p[key];
    }
  }
  return { inputSubtTextProps: newProps };
};
export const privateProps = {
  id: {
    type: String,
    required: true,
  },
};
export default defineComponent({
  computed: {
    hasContent() {
      const hasRightSlot =
        this.$slots.right &&
        this.$slots
          .right()
          .findIndex((o) => o.children && o.children.length !== 0) !== -1;
      return !!this.error || !!this.hint || hasRightSlot;
    },
  },
  props: { ...props, ...privateProps },
  setup() {
    const options = inject("subTextOptions", {});

    return options;
  },
});
</script>
<style lang="scss" scoped>
@import "@featherds/styles/themes/variables";
@import "@featherds/styles/mixins/typography";
.feather-input-sub-text {
  display: flex;
  padding: 4px 12px 4px 16px;
}
.feather-input-hint {
  @include caption();
  color: var($secondary-text-on-surface);
}
.feather-input-error {
  @include caption();
  color: var($error);
}

.feather-input-hint,
.feather-input-error {
  flex: 1;
}
</style>
