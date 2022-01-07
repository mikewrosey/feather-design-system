import FeatherAutocomplete from "./FeatherAutocomplete.vue";
import { TYPES } from "./Strategies";
import { shallowMount, mount, config } from "@vue/test-utils";
import * as id from "@featherds/utils/id";
import axe from "@featherds/utils/test/axe";
import { nextTick } from "vue";

config.renderStubDefaultSlot = true;

import "@featherds/input-helper/test/MutationObserver";
jest.spyOn(id, "getSafeId").mockImplementation((x) => x);

const getProps = (type) => (props) => {
  return {
    label: "Users",
    type,
    ...props,
  };
};

const getResultsType = (type) => () => {
  if (type === TYPES.multi || type === TYPES.single) {
    return [
      {
        _text: "Item 1",
      },
      {
        _text: "Item 2",
      },
    ];
  }
};
const getValueType = (type) => () => {
  if (type === TYPES.multi) {
    return [
      {
        _text: "Item 1",
      },
      {
        _text: "Item 2",
      },
    ];
  }
  if (type === TYPES.single) {
    return { _text: "Item 1" };
  }
};
const handleUpdateValueType = (type) => (args) => {
  if (type === TYPES.multi) {
    return args[0][0];
  }
  if (type === TYPES.single) {
    return args[0];
  }
};
const getWrapperType = (type) =>
  function (options = {}) {
    options.props = getProps(type)(options.props || {});
    return shallowMount(FeatherAutocomplete, options);
  };

const getFullWrapperType = (type) =>
  function (options = {}) {
    options.props = getProps(type)(options.props || {});
    return mount(FeatherAutocomplete, options);
  };

const baseFunctionality = (type) => {
  const getFullWrapper = getFullWrapperType(type);
  const getWrapper = getWrapperType(type);
  const getValue = getValueType(type);
  const getResults = getResultsType(type);
  const handleUpdateValue = handleUpdateValueType(type);
  describe(type, () => {
    it("should perform search with empty string when clicked and min char is 0", async () => {
      const wrapper = getFullWrapper();
      await wrapper.find(".feather-autocomplete-input").trigger("click");
      await wrapper.find(".feather-autocomplete-input").trigger("focus");
      expect(wrapper.emitted("search")[0][0]).toBe("");
    });
    it("should perform search with empty string when focused and min char is 0", async () => {
      const wrapper = getFullWrapper();
      await wrapper.find(".feather-autocomplete-input").trigger("focus");
      expect(wrapper.emitted("search")[0][0]).toBe("");
    });
    it("should not search when clicked an min char is >0", async () => {
      const wrapper = getFullWrapper({
        props: { minChar: 3 },
      });
      await wrapper.find(".feather-autocomplete-input").trigger("click");
      expect(wrapper.emitted("search")).toBeUndefined();
    });
    it("should not search when focused an min char is >0", async () => {
      const wrapper = getFullWrapper({
        props: { minChar: 3 },
      });
      await wrapper.find(".feather-autocomplete-input").trigger("focus");
      expect(wrapper.emitted("search")).toBeUndefined();
    });
    it("should perform search with text when characters are entered > min char", async () => {
      jest.useFakeTimers();

      const wrapper = getFullWrapper({
        props: { minChar: 3 },
      });
      const result = "est";
      const input = wrapper.find(".feather-autocomplete-input");
      input.element.value = result;
      await input.trigger("input");
      await input.trigger("focus");
      jest.runAllTimers();
      expect(wrapper.emitted("search")[0][0]).toBe(result);
    });
    it("should throttle search queries", async () => {
      jest.useFakeTimers();

      const wrapper = getFullWrapper({
        props: { minChar: 3 },
      });
      const result = "est";
      const input = wrapper.find(".feather-autocomplete-input");
      await input.trigger("focus");
      input.element.value = result;
      await input.trigger("input");
      jest.advanceTimersByTime(100);
      expect(wrapper.emitted("search")).toBeUndefined();
      jest.advanceTimersByTime(200);
      expect(wrapper.emitted("search")[0][0]).toBe(result);
    });
    it("should show loading spinner when search is performed", async () => {
      const wrapper = getFullWrapper();
      await wrapper.find(".feather-autocomplete-input").trigger("focus");
      await wrapper.setProps({
        loading: true,
      });
      expect(wrapper.wrapperElement).toMatchSnapshot();
    });
    it("should show no results text when search returns no results", async () => {
      jest.useFakeTimers();

      const results = [];
      const wrapper = getFullWrapper();
      await wrapper.find(".feather-autocomplete-input").trigger("focus");

      wrapper.vm.query = "j";
      await wrapper.setProps({
        results,
      });

      jest.runAllTimers();
      await nextTick();
      expect(wrapper.wrapperElement).toMatchSnapshot();
      expect(wrapper.vm.showNoResults).toBe(true);
    });
    it("should not leave previous search results visible whilst new search is being performed", async () => {
      const wrapper = getFullWrapper();
      await wrapper.find(".feather-autocomplete-input").trigger("focus");
      await wrapper.setProps({
        results: getResults(),
      });
      await wrapper.setProps({
        loading: true,
      });
      expect(wrapper.wrapperElement).toMatchSnapshot();
    });
    it("should raise the label when the autocomplete has a value", () => {
      const wrapper = getFullWrapper({
        props: {
          modelValue: getValue(),
        },
      });
      expect(wrapper.wrapperElement).toMatchSnapshot();
    });
    it("should lower label when there is no value and autocomplete doesnt have focus", () => {
      const wrapper = getFullWrapper();
      expect(wrapper.wrapperElement).toMatchSnapshot();
    });

    describe("disabled state", () => {
      it("should render in a disabled state with no value", () => {
        const wrapper = getFullWrapper({
          props: {
            disabled: true,
          },
        });
        expect(wrapper.wrapperElement).toMatchSnapshot();
      });
      it("should render in a disabled state with a value", () => {
        const wrapper = getFullWrapper({
          props: {
            modelValue: getValue(),
            disabled: true,
          },
        });
        expect(wrapper.wrapperElement).toMatchSnapshot();
      });
    });
    describe("Accessibility", () => {
      beforeEach(() => jest.setTimeout(60000));

      it("should be accessible in default state", async () => {
        jest.useRealTimers();
        const wrapper = getFullWrapper();

        expect(await axe(wrapper.element)).toHaveNoViolations();
      });
      it("should be accessible in loading state", async () => {
        jest.useRealTimers();
        const wrapper = getFullWrapper();
        await wrapper.find(".feather-autocomplete-input").trigger("focus");

        await wrapper.setProps({
          loading: true,
        });

        expect(await axe(wrapper.element)).toHaveNoViolations();
      });

      it("should be accessible in minchar state", async () => {
        jest.useRealTimers();
        const wrapper = getFullWrapper();

        await wrapper.setProps({
          minChar: 3,
        });
        await wrapper.find(".feather-autocomplete-input").trigger("focus");
        expect(await axe(wrapper.element)).toHaveNoViolations();
      });
      it("should be accessible with menu open", async () => {
        jest.useRealTimers();
        const results = getResults();
        const wrapper = getFullWrapper();
        await wrapper.find(".feather-autocomplete-input").trigger("focus");

        await wrapper.setProps({
          results,
        });

        expect(await axe(wrapper.element)).toHaveNoViolations();
      });
      it("should be accessible in default state with value", async () => {
        jest.useRealTimers();
        const modelValue = getValue();
        const wrapper = getFullWrapper({
          props: {
            modelValue,
          },
        });
        expect(await axe(wrapper.element)).toHaveNoViolations();
      });
      it("should be accessible with menu open and a value", async () => {
        jest.useRealTimers();
        const results = getResults();
        const wrapper = getFullWrapper({
          props: {
            modelValue: results,
          },
        });
        await wrapper.find(".feather-autocomplete-input").trigger("focus");

        await wrapper.setProps({
          results,
        });

        expect(await axe(wrapper.element)).toHaveNoViolations();
      });
    });
    describe("menu selection", () => {
      it("should set active descendant when row is active", async () => {
        const results = getResults();
        const wrapper = getFullWrapper();
        await wrapper.find(".feather-autocomplete-input").trigger("focus");

        await wrapper.setProps({
          results,
        });
        wrapper.vm.active.row = 0;
        await nextTick();
        expect(
          wrapper
            .find(".feather-autocomplete-input")
            .attributes("aria-activedescendant")
        ).toBe(wrapper.vm.resultItemId);
      });

      it("should close the menu when escape key is pressed", async () => {
        const results = getResults();
        const wrapper = getFullWrapper();
        await wrapper.find(".feather-autocomplete-input").trigger("focus");

        await wrapper.setProps({
          results,
        });
        await wrapper.setData({
          active: { row: 0 },
        });

        await wrapper
          .find(".feather-autocomplete-input")
          .trigger("keydown.esc");
        expect(wrapper.vm.active.row).toBe(-1);
        expect(wrapper.vm.showMenu).toBe(false);
      });
      it("should select an element when enter is pressed on it", async () => {
        const results = getResults();
        const wrapper = getFullWrapper();
        await wrapper.find(".feather-autocomplete-input").trigger("focus");

        await wrapper.setProps({
          results,
        });
        wrapper.vm.active.row = 0;

        await wrapper
          .find(".feather-autocomplete-input")
          .trigger("keydown.enter");
        const emitted = handleUpdateValue(
          wrapper.emitted("update:modelValue")[0]
        );
        expect(emitted._text).toBe(results[0]._text);
      });
      it("should select an element when clicked", async () => {
        const results = getResults();
        const wrapper = getFullWrapper();
        await wrapper.find(".feather-autocomplete-input").trigger("focus");

        await wrapper.setProps({
          results,
        });

        wrapper
          .findComponent({ ref: "results" })
          .vm.$emit("select", results[0]);
        let emitted = handleUpdateValue(
          wrapper.emitted("update:modelValue")[0]
        );
        expect(emitted._text).toBe(results[0]._text);
        await wrapper.find(".feather-autocomplete-input").trigger("blur");
        const events = wrapper.emitted("update:modelValue");
        emitted = handleUpdateValue(events[events.length - 1]);
        expect(emitted._text).toBe(results[0]._text);
      });
    });
  });
};

describe("Feather Autocomplete", () => {
  describe("base functionality", () => {
    baseFunctionality(TYPES.multi);
    baseFunctionality(TYPES.single);
  });
  describe("multi:specific", () => {
    const getFullWrapper = getFullWrapperType(TYPES.multi);
    const getResults = getResultsType(TYPES.multi);
    const getValue = getValueType(TYPES.multi);
    it("should activate first item in menu on initial load", async () => {
      const results = getResults();
      const wrapper = getFullWrapper();
      await wrapper.find(".feather-autocomplete-input").trigger("focus");

      await wrapper.setProps({
        results,
      });

      expect(wrapper.vm.active.row).toBe(0);
      expect(
        wrapper
          .find(".feather-autocomplete-input")
          .attributes("aria-activedescendant")
      ).toBe(wrapper.vm.resultItemId);
    });

    it("should leave the menu open when enter is used to select an item", async () => {
      const results = getResults();

      const wrapper = getFullWrapper();
      const input = wrapper.find(".feather-autocomplete-input");
      const search = "test";
      input.element.value = search;
      await input.trigger("focus");

      await wrapper.setProps({
        results,
      });

      await input.trigger("keydown.down");
      await input.trigger("keydown.enter");
      //should still be at first index.
      expect(wrapper.vm.active.row).toBe(1);
      expect(input.element.value).toBe(search);

      expect(wrapper.vm.showResults).toBe(true);
    });
    it("should leave the menu open when enter is used to select an item and minchar set", async () => {
      const results = getResults();

      const wrapper = getFullWrapper({
        props: {
          minChar: 2,
        },
      });
      const input = wrapper.find(".feather-autocomplete-input");
      const search = "test";
      wrapper.vm.query = search;
      await input.trigger("focus");

      await wrapper.setProps({
        results,
      });

      await input.trigger("keydown.down");
      await input.trigger("keydown.enter");
      //should still be at first index.
      expect(wrapper.vm.active.row).toBe(1);
      //make sure query isnt being reset
      expect(wrapper.vm.query).toBe(search);

      //make sure correct menus show
      expect(wrapper.vm.showResults).toBe(true);
      expect(wrapper.vm.showMinCharWarning).toBe(false);
    });
    it("should hide/reset menu and clear text input when it loses focus", async () => {
      jest.useFakeTimers();
      const wrapper = getFullWrapper();
      const input = wrapper.find(".feather-autocomplete-input");
      input.element.value = "test";
      await input.trigger("input");
      await wrapper.setProps({
        results: getResults(),
      });

      jest.runAllTimers();
      await wrapper.find(".feather-autocomplete-input").trigger("blur");
      await nextTick();
      expect(wrapper.wrapperElement).toMatchSnapshot();
    });

    describe("chip selection", () => {
      it("should select the right most chip when left arrow is pressed and input has no text", async () => {
        const modelValue = [
          {
            _text: "Test1",
          },
          {
            _text: "Test2",
          },
        ];
        const wrapper = getFullWrapper({
          props: {
            modelValue,
          },
        });
        await wrapper
          .find(".feather-autocomplete-input")
          .trigger("keydown.left");
        expect(wrapper.vm.activeChipIndex).toBe(modelValue.length - 1);
        expect(wrapper.wrapperElement).toMatchSnapshot();
      });
      it("should move chip selection left when left arrow is pressed, so long it is not the left most token", async () => {
        const modelValue = [
          {
            _text: "Test1",
          },
          {
            _text: "Test2",
          },
        ];
        const wrapper = getFullWrapper({
          props: {
            modelValue,
          },
        });
        await wrapper
          .find(".feather-autocomplete-input")
          .trigger("keydown.left");
        await wrapper
          .find(".feather-autocomplete-input")
          .trigger("keydown.left");
        expect(wrapper.vm.activeChipIndex).toBe(modelValue.length - 2);
        expect(wrapper.wrapperElement).toMatchSnapshot();
      });
      it("should move chip selection right when right arrow is pressed, so long it is not the right most token", async () => {
        const modelValue = [
          {
            _text: "Test1",
          },
          {
            _text: "Test2",
          },
        ];
        const wrapper = getFullWrapper({
          props: {
            modelValue,
          },
        });
        await wrapper
          .find(".feather-autocomplete-input")
          .trigger("keydown.left");
        await wrapper
          .find(".feather-autocomplete-input")
          .trigger("keydown.left");
        await wrapper
          .find(".feather-autocomplete-input")
          .trigger("keydown.right");
        expect(wrapper.vm.activeChipIndex).toBe(modelValue.length - 1);
        expect(wrapper.wrapperElement).toMatchSnapshot();
      });
      it("should not move chip selection when left is pressed on the left most token", async () => {
        const modelValue = [
          {
            _text: "Test1",
          },
          {
            _text: "Test2",
          },
        ];
        const wrapper = getFullWrapper({
          props: {
            modelValue,
          },
        });
        await wrapper
          .find(".feather-autocomplete-input")
          .trigger("keydown.left");
        await wrapper
          .find(".feather-autocomplete-input")
          .trigger("keydown.left");
        await wrapper
          .find(".feather-autocomplete-input")
          .trigger("keydown.left");
        expect(wrapper.vm.activeChipIndex).toBe(0);
        expect(wrapper.wrapperElement).toMatchSnapshot();
      });
      it("should should deselect chip when right arrow is pressed on right most token", async () => {
        const modelValue = [
          {
            _text: "Test1",
          },
          {
            _text: "Test2",
          },
        ];
        const wrapper = getFullWrapper({
          props: {
            modelValue,
          },
        });
        await wrapper
          .find(".feather-autocomplete-input")
          .trigger("keydown.left");
        await wrapper
          .find(".feather-autocomplete-input")
          .trigger("keydown.right");
        expect(wrapper.vm.activeChipIndex).toBe(-1);
        expect(wrapper.wrapperElement).toMatchSnapshot();
      });
      it("should not perform any chip navigation when there is text", async () => {
        const modelValue = [
          {
            _text: "Test1",
          },
          {
            _text: "Test2",
          },
        ];
        const wrapper = getFullWrapper({
          props: {
            modelValue,
          },
        });
        const input = wrapper.find(".feather-autocomplete-input");

        input.element.value = "test";
        await input.trigger("input");

        await wrapper
          .find(".feather-autocomplete-input")
          .trigger("keydown.left");
        await wrapper
          .find(".feather-autocomplete-input")
          .trigger("keydown.right");
        await wrapper
          .find(".feather-autocomplete-input")
          .trigger("keydown.delete");
        await wrapper
          .find(".feather-autocomplete-input")
          .trigger("keydown.backspace");
        expect(wrapper.vm.activeChipIndex).toBe(-1);
        expect(wrapper.wrapperElement).toMatchSnapshot();
      });
      it("should delete a chip when chip is active and delete is pressed", async () => {
        const modelValue = [
          {
            _text: "Test1",
          },
          {
            _text: "Test2",
          },
        ];
        const wrapper = getFullWrapper({
          props: {
            modelValue,
          },
        });
        await wrapper
          .find(".feather-autocomplete-input")
          .trigger("keydown.left");
        await wrapper
          .find(".feather-autocomplete-input")
          .trigger("keydown.delete");
        expect(wrapper.emitted("update:modelValue")[0][0][0]._text).toBe(
          modelValue[0]._text
        );
        expect(wrapper.vm.activeChipIndex).toBe(-1);
      });
      it("should delete a chip when chip is active and backspace is pressed", async () => {
        const modelValue = [
          {
            _text: "Test1",
          },
          {
            _text: "Test2",
          },
        ];
        const wrapper = getFullWrapper({
          props: {
            modelValue,
          },
        });
        await wrapper
          .find(".feather-autocomplete-input")
          .trigger("keydown.left");
        await wrapper
          .find(".feather-autocomplete-input")
          .trigger("keydown.backspace");
        expect(wrapper.emitted("update:modelValue")[0][0][0]._text).toBe(
          modelValue[0]._text
        );
        expect(wrapper.vm.activeChipIndex).toBe(-1);
      });
      it("should not have any active tokens when one is deleted", async () => {
        const modelValue = [
          {
            _text: "Test1",
          },
          {
            _text: "Test2",
          },
        ];
        const wrapper = getFullWrapper({
          props: {
            modelValue,
          },
        });
        await wrapper
          .find(".feather-autocomplete-input")
          .trigger("keydown.left");
        await wrapper
          .find(".feather-autocomplete-input")
          .trigger("keydown.backspace");
        expect(wrapper.emitted("update:modelValue")[0][0][0]._text).toBe(
          modelValue[0]._text
        );
        expect(wrapper.vm.activeChipIndex).toBe(-1);
      });
      it("should delete a chip when the delete x is clicked", async () => {
        const modelValue = [
          {
            _text: "Test1",
          },
          {
            _text: "Test2",
          },
        ];
        const wrapper = getFullWrapper({
          props: {
            modelValue,
          },
        });
        wrapper.findComponent({ name: "Chip" }).vm.$emit("delete");
        expect(wrapper.emitted("update:modelValue")[0][0][0]._text).toBe(
          modelValue[1]._text
        );
      });
      it("should select rightmost token if left is pressed whilst navigating the menu and there is no search text", async () => {
        const results = [
          {
            _text: "Test1",
          },
          {
            _text: "Test2",
          },
        ];
        const modelValue = [
          {
            _text: "Test11",
          },
          {
            _text: "Test21",
          },
        ];
        const wrapper = getFullWrapper({
          props: {
            modelValue,
          },
        });
        await wrapper.find(".feather-autocomplete-input").trigger("focus");

        await wrapper.setProps({
          results,
        });
        await wrapper
          .find(".feather-autocomplete-input")
          .trigger("keydown.left");
        expect(wrapper.vm.activeChipIndex).toBe(modelValue.length - 1);
        expect(wrapper.vm.active.row).toBe(-1);

        expect(wrapper.wrapperElement).toMatchSnapshot();
      });
    });
    describe("selection limit", () => {
      it("should display a warning when selection limit is from initial value and has focus", async () => {
        const modelValue = getValue();
        const wrapper = getFullWrapper({
          props: {
            modelValue,
            selectionLimit: modelValue.length,
          },
        });
        await wrapper.find(".feather-autocomplete-input").trigger("focus");
        expect(wrapper.wrapperElement).toMatchSnapshot();
        expect(wrapper.vm.showSelectionLimit).toBe(true);
      });
      it("should display a warning when selection limit is reached and has focus", async () => {
        const modelValue = getValue();
        const wrapper = getFullWrapper({
          props: {
            selectionLimit: modelValue.length,
          },
        });
        await wrapper.find(".feather-autocomplete-input").trigger("focus");
        expect(wrapper.vm.showSelectionLimit).toBe(false);
        await wrapper.setProps({
          modelValue,
        });
        expect(wrapper.wrapperElement).toMatchSnapshot();
        expect(wrapper.vm.showSelectionLimit).toBe(true);
      });
      it("should display a warning when selection limit is reached from menu selection", async () => {
        const wrapper = getFullWrapper({
          props: {
            selectionLimit: 1,
          },
        });
        await wrapper.find(".feather-autocomplete-input").trigger("focus");
        await wrapper.setProps({
          results: getResults(),
        });
        wrapper.vm.active.row = 0;

        await wrapper
          .find(".feather-autocomplete-input")
          .trigger("keydown.enter");
        expect(wrapper.wrapperElement).toMatchSnapshot();
        expect(wrapper.vm.showSelectionLimit).toBe(true);
      });
      it("should clear warning when item is removed", async () => {
        const modelValue = getValue();
        const wrapper = getFullWrapper({
          props: {
            selectionLimit: modelValue.length,
            modelValue,
          },
        });
        await wrapper.find(".feather-autocomplete-input").trigger("focus");
        expect(wrapper.vm.showSelectionLimit).toBe(true);
        wrapper.vm.removeFromValue(modelValue[0]);
        await nextTick();
        expect(wrapper.wrapperElement).toMatchSnapshot();
        expect(wrapper.vm.showSelectionLimit).toBe(false);
      });
    });
  });

  describe("single:specific", () => {
    const getFullWrapper = getFullWrapperType(TYPES.single);
    const getResults = getResultsType(TYPES.single);
    const getValue = getResultsType(TYPES.single);
    it("should not activate first item in menu on initial load", async () => {
      const results = getResults();
      const wrapper = getFullWrapper();
      await wrapper.find(".feather-autocomplete-input").trigger("focus");

      await wrapper.setProps({
        results,
      });

      expect(wrapper.vm.active.row).toBe(-1);
    });
    it("should display value text in the input when a value is selected", async () => {
      const wrapper = getFullWrapper();
      const input = wrapper.find(".feather-autocomplete-input");
      expect(input.value).toBeFalsy();
      const modelValue = getValue();
      await wrapper.setProps({
        modelValue,
      });
      expect(input.value).toBe(modelValue._text);
    });
    it("should display value text in the input when a value is preselected", async () => {
      const modelValue = getValue();
      const wrapper = getFullWrapper({
        props: {
          modelValue,
        },
      });
      const input = wrapper.find(".feather-autocomplete-input");
      expect(input.value).toBe(modelValue._text);
    });
    it("should select the current active menu item on blur", async () => {
      const results = getResults();
      const wrapper = getFullWrapper();
      const input = wrapper.find(".feather-autocomplete-input");
      await input.trigger("focus");

      await wrapper.setProps({
        results,
      });

      await input.trigger("keydown.down");
      const index = wrapper.vm.active.row;
      await input.trigger("blur");
      expect(wrapper.emitted("update:modelValue")[0][0]).toStrictEqual(
        results[index]
      );
    });
    it("should display the current selected value if no new selection is made", async () => {
      const modelValue = getValue();
      const wrapper = getFullWrapper({
        props: {
          modelValue,
        },
      });
      const input = wrapper.find(".feather-autocomplete-input");
      await input.trigger("focus");
      input.element.value = modelValue._text + "dasdasd";
      await wrapper.find(".feather-autocomplete-input").trigger("blur");
      await nextTick();
      expect(input.value).toBe(modelValue._text);
    });
    it("should close menu when enter is pressed on a menu item to select it", async () => {
      const results = getResults();
      const wrapper = getFullWrapper();
      await wrapper.find(".feather-autocomplete-input").trigger("focus");

      await wrapper.setProps({
        results,
      });

      await wrapper
        .find(".feather-autocomplete-input")
        .trigger("keydown.enter");
      expect(wrapper.wrapperElement).toMatchSnapshot();
    });

    it("should handle a null property on value", async () => {
      const modelValue = getValue();
      modelValue.test = null;
      const wrapper = getFullWrapper({
        props: {
          modelValue,
        },
      });
      expect(wrapper.wrapperElement).toMatchSnapshot();
    });
    it("should clear selection when clear icon is clicked", async () => {
      const modelValue = getValue();
      const wrapper = getFullWrapper({
        props: {
          modelValue,
        },
      });

      wrapper.vm.handleClear();
      await nextTick();
      expect(wrapper.emitted("update:modelValue")[0][0]).toBe(undefined);
    });

    it("should emit new event when add new element is clicked", async () => {
      jest.useFakeTimers();

      const results = [];
      const wrapper = getFullWrapper({
        props: {
          allowNew: true,
        },
      });
      await wrapper.find(".feather-autocomplete-input").trigger("focus");
      const query = "j";
      wrapper.vm.query = query;
      wrapper.setProps({
        results,
      });

      jest.runAllTimers();
      await nextTick();
      const resultsList = wrapper.findComponent({ ref: "results" });
      resultsList.vm.$emit("select", resultsList.vm.items[0]);
      expect(wrapper.emitted("new")[0][0]).toBe(query);
    });
    it("should show add new element when in add-new mode", async () => {
      jest.useFakeTimers();

      const results = [];
      const wrapper = getFullWrapper({
        props: {
          allowNew: true,
        },
      });
      await wrapper.find(".feather-autocomplete-input").trigger("focus");

      wrapper.vm.query = "j";
      wrapper.setProps({
        results,
      });

      jest.runAllTimers();
      await nextTick();
      expect(wrapper.wrapperElement).toMatchSnapshot();
      expect(wrapper.vm.showNoResults).toBe(false);
      expect(wrapper.vm.showResults).toBe(true);
    });
    it("should add new item on blur when it is highlighted", async () => {
      jest.useFakeTimers();
      const results = getResults();
      const wrapper = getFullWrapper({
        props: {
          allowNew: true,
        },
      });
      const input = wrapper.find(".feather-autocomplete-input");
      await input.trigger("focus");
      const query = "xxx";
      wrapper.vm.query = query;
      await nextTick();

      await wrapper.setProps({
        results,
      });
      await wrapper.find(".feather-autocomplete-input").trigger("keydown.down");
      await input.trigger("blur");
      await nextTick();
      expect(wrapper.emitted("new")[0][0]).toBe(query);
    });
  });
});
