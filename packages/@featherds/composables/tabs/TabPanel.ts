import { ref, inject, computed, onMounted, Ref, ExtractPropTypes } from "vue";
import { ITabPanel } from "./TabContainer";

const stockProps = {
  id: {
    type: String,
  },
  tab: {
    type: String,
  },
};

const useTabPanel = (props: ExtractPropTypes<typeof stockProps>) => {
  const selected = ref(false);
  const panel: Ref<HTMLElement> = ref();
  const _tab = ref(props.tab);
  const _id = ref(props.id);

  const register = inject<(ITabPanel) => void>("registerPanel");
  let thisEl, parent, index;
  onMounted(() => {
    thisEl = panel.value;
    parent = thisEl && thisEl.parentElement ? thisEl.parentElement : [];
    index = thisEl ? Array.prototype.indexOf.call(parent.children, thisEl) : -1;
    register({
      selected,
      id: _id,
      tab: _tab,
      el: panel.value,
      index: index,
    });
  });

  const attrs = computed(() => {
    return {
      role: "tabpanel",
      id: _id.value,
      ref: "panel",
      tabindex: "0",
      "aria-expanded": selected.value ? "true" : "false",
      "aria-labelledby": _tab.value,
      "data-ref-id": "feather-tab-panel",
    };
  });

  return {
    selected,
    attrs,
    panel,
  };
};
export { useTabPanel, stockProps };
