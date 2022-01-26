<template>
  <BaseChip
    class="focus autocomplete-chip"
    :class="{ focused: focused }"
    condensed
    :disabled="disabled"
  >
    <BaseChipPreIcon v-if="showPreIcon">
      <FeatherIcon :icon="preTyped.icon" :title="preTyped.title"> </FeatherIcon
    ></BaseChipPreIcon>
    <BaseChipLabel>{{ text }}</BaseChipLabel>
    <span class="chip-delete" @click.stop="handleClick" v-if="!disabled">
      <FeatherIcon class="delete-icon" flex :title="removeLabel"
        ><Cancel />
      </FeatherIcon>
    </span>
  </BaseChip>
</template>
<script lang="ts">
import { FeatherIcon } from "@featherds/icon";
import Cancel from "@featherds/icon/navigation/Cancel";
import { BaseChip, BaseChipLabel, BaseChipPreIcon } from "@featherds/chips";
import { DefineComponent, defineComponent, PropType } from "vue";
interface IPreIcon {
  title: string;
  icon: DefineComponent;
}
export default defineComponent({
  name: "Chip",
  emits: ["delete"],
  props: {
    focused: {
      type: Boolean,
      default: false,
    },
    removeLabel: {
      type: String,
      required: true,
    },
    text: {
      type: String,
    },
    disabled: {
      type: Boolean,
    },
    pre: {
      type: Object as PropType<unknown>,
    },
  },
  computed: {
    showPreIcon() {
      const pre = this.pre as IPreIcon;
      return pre && pre.icon && pre.title;
    },
    preTyped() {
      return this.pre as IPreIcon;
    },
  },
  methods: {
    handleClick() {
      this.$emit("delete");
    },
  },
  components: {
    FeatherIcon,
    Cancel,
    BaseChip,
    BaseChipLabel,
    BaseChipPreIcon,
  },
});
</script>

<style lang="scss" scoped>
@import "@featherds/chips/scss/mixins";
.autocomplete-chip.chip {
  margin: 4px 0;
  margin-right: 8px;
}

.chip-delete {
  @include chip-delete();
}
</style>
