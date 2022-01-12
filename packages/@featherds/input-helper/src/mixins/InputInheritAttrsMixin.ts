export default {
  inheritAttrs: false,
  computed: {
    inherittedAttrs(this: IComponent) {
      return {
        class: this.$attrs.class,
        "data-ref-id": this.$attrs["data-ref-id"],
      };
    },
  },
};

interface IComponent {
  $attrs: Record<string, string>;
}
