export const useInheritAttrs = (attrs: {
  class?: string;
  "data-ref-id"?: string;
}) => {
  return {
    inheritAttrs: {
      class: attrs.class,
      "data-ref-id": attrs["data-ref-id"],
    },
  };
};
