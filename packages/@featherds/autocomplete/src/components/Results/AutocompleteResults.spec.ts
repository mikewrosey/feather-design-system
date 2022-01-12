import AutocompleteResults from "./AutocompleteResults.vue";
import { IAutocompleteItem } from "../types";
import { getCalls } from "@featherds/utils/test/calls";
import { FeatherListItem } from "@featherds/list";
import { shallowMount, config } from "@vue/test-utils";

config.renderStubDefaultSlot = true;

const activeId = "ACTIVE";
const items = [
  {
    _text: "Test1",
  },
  {
    _text: "Test2",
  },
  {
    _text: "Test3",
  },
  {
    _text: "Test4",
  },
];
const defaultProps = {
  activeId,
  items: items.slice(0),
  query: "t",
};

describe("Autocomplete Results", () => {
  it("should support single select", () => {
    const wrapper = shallowMount(AutocompleteResults, {
      props: {
        ...defaultProps,
        single: true,
        activeIndex: -1,
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });
  it("should support no item active", () => {
    const wrapper = shallowMount(AutocompleteResults, {
      props: {
        ...defaultProps,
        activeIndex: -1,
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });
  it("should support active index being out of range", () => {
    const wrapper = shallowMount(AutocompleteResults, {
      props: {
        ...defaultProps,
        activeIndex: items.length + 1,
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });
  it("should support active index within results range", () => {
    const wrapper = shallowMount(AutocompleteResults, {
      props: {
        ...defaultProps,
        activeIndex: 0,
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });
  it("should mark items as selected that appear in value array", () => {
    const wrapper = shallowMount(AutocompleteResults, {
      props: {
        ...defaultProps,
        activeIndex: -1,
        value: [items[0]],
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });
  it("should mark items as selected that appear in value array and active when active index is set.", () => {
    const wrapper = shallowMount(AutocompleteResults, {
      props: {
        ...defaultProps,
        activeIndex: 0,
        value: [items[0]],
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });
  it("should emit select event with item when item is clicked", async () => {
    const wrapper = shallowMount(AutocompleteResults, {
      props: {
        ...defaultProps,
        activeIndex: -1,
      },
    });
    await wrapper.findComponent(FeatherListItem).trigger("mousedown");
    const calls = getCalls<[IAutocompleteItem]>(wrapper, "select");
    expect(calls[0][0]._text).toBe(items[0]._text);
  });
});
