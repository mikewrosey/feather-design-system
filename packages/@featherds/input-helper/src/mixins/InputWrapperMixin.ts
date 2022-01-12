export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    error: {
      type: String,
    },
    clear: {
      type: String,
      default: "",
    },
    background: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    inline: {
      type: Boolean,
      default: false,
    },
    hideLabel: {
      type: Boolean,
      default: false,
    },
  },
  provide(this: IComponent) {
    return {
      wrapperOptions: this.$props,
    };
  },
};

interface IComponent {
  $props: unknown;
}
