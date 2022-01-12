import Highlighter from "./Highlighter.vue";
import { shallowMount, config } from "@vue/test-utils";

config.renderStubDefaultSlot = true;

describe("Highlighter", () => {
  describe("ignore case", () => {
    it("should highlight text in the middle of the string", () => {
      const wrapper = shallowMount(Highlighter, {
        props: {
          text: "abcd",
          highlight: "ignore-case",
          query: "bc",
        },
      });
      expect(wrapper.element).toMatchSnapshot();
    });
    it("should highlight text at the start of the string", () => {
      const wrapper = shallowMount(Highlighter, {
        props: {
          text: "abcd",
          highlight: "ignore-case",
          query: "ab",
        },
      });
      expect(wrapper.element).toMatchSnapshot();
    });
    it("should highlight text at the end of the string", () => {
      const wrapper = shallowMount(Highlighter, {
        props: {
          text: "abcd",
          highlight: "ignore-case",
          query: "cd",
        },
      });
      expect(wrapper.element).toMatchSnapshot();
    });
    it("should not highlight when there isn't a match", () => {
      const wrapper = shallowMount(Highlighter, {
        props: {
          text: "abcd",
          highlight: "ignore-case",
          query: "xx",
        },
      });
      expect(wrapper.element).toMatchSnapshot();
    });
    it("should highlight reglardless of case", () => {
      const wrapper = shallowMount(Highlighter, {
        props: {
          text: "aBCd",
          highlight: "ignore-case",
          query: "bc",
        },
      });
      expect(wrapper.element).toMatchSnapshot();
    });
  });
  it("should not highlight when turned off", () => {
    const wrapper = shallowMount(Highlighter, {
      props: {
        text: "abcd",
        highlight: "off",
        query: "bc",
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });
});
