<template>
  <a
    @click.prevent.stop="handleClick"
    class="password-icon hide-when-disabled"
    :title="title"
    href="#"
    data-ref-id="feather-input-password-icon"
  >
    <FeatherIcon :icon="icon" />
  </a>
</template>
<script lang="ts">
import { FeatherIcon } from "@featherds/icon";
import passwordHide from "@featherds/icon/action/Hide";
import passwordShow from "@featherds/icon/action/View";
import { defineComponent } from "vue";
export const props = {
  modelValue: {
    type: Boolean,
    required: true,
  },
  show: {
    type: String,
    required: true,
  },
  hide: {
    type: String,
    required: true,
  },
} as const;
export const emits = {
  "update:modelValue": (_v: boolean) => true,
};
export default defineComponent({
  model: {
    prop: "modelValue",
    event: "update:modelValue",
  },
  emits,
  props,
  computed: {
    title() {
      if (this.modelValue) {
        return this.hide;
      }

      return this.show;
    },
    icon() {
      if (this.modelValue) {
        return passwordHide;
      }

      return passwordShow;
    },
  },
  methods: {
    handleClick() {
      this.$emit("update:modelValue", !this.modelValue);
    },
  },
  components: {
    FeatherIcon,
  },
});
</script>
<style lang="scss" scoped>
@import "@featherds/styles/themes/variables";
.password-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var($secondary-text-on-surface);
  &:visited,
  &:active {
    color: var($secondary-text-on-surface);
  }
  font-size: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  &:hover {
    color: var($primary-text-on-surface);
  }
}
</style>
