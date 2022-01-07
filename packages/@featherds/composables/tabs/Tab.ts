import { ref, inject, computed, onMounted, Ref, ExtractPropTypes } from "vue";
import { ITab } from "./TabContainer";

const stockProps = {
  id: {
    type: String,
  },
  controls: {
    type: String,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
};

const useTab = (props: ExtractPropTypes<typeof stockProps>) => {
  const selected = ref(false);
  const tab: Ref<HTMLElement> = ref();
  const _controls = ref(props.controls);
  const _id = ref(props.id);
  const focus = () => {
    tab.value.focus();
  };
  const register = inject<(ITab) => void>("registerTab");
  let thisEl: HTMLElement,
    parent: HTMLElement,
    childNodes: HTMLElement[],
    index: number;
  onMounted(() => {
    thisEl = tab.value.parentElement;
    parent = thisEl && thisEl.parentElement ? thisEl.parentElement : [];
    childNodes = [].filter.call(parent.children, function (el: HTMLElement) {
      return el.querySelectorAll("[role=tab]").length;
    });
    index = thisEl ? [].indexOf.call(childNodes, thisEl) : -1;
    register({
      el: tab.value,
      focus,
      disabled: props.disabled,
      selected,
      id: _id,
      controls: _controls,
      index: index,
    });
  });

  const attrs = computed(() => {
    return {
      role: "tab",
      ref: "tab",
      tabindex: selected.value ? 0 : -1,
      id: _id.value,
      "aria-selected": selected.value ? "true" : "false",
      "aria-controls": _controls.value,
      "aria-disabled": props.disabled ? "true" : "false",
      "data-ref-id": "feather-tab",
    };
  });
  return {
    selected,
    attrs,
    tab,
  };
};
export { useTab, stockProps };
