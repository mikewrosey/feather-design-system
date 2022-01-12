export default {
  props: {
    hint: {
      type: String,
    },
    error: {
      type: String,
    },
  },
  provide(this: IComponent) {
    return {
      subTextOptions: this.$props,
    };
  },
};

interface IComponent {
  $props: unknown;
}
