import { useResultGrid } from "./ResultGrid";
import { IAutocompleteGridColumn } from "../types";
import { KEYCODES } from "@featherds/utils/keys";
import { nextTick } from "vue";
import { mount } from "@vue/test-utils";

const LEFTEVENT = {
  keyCode: KEYCODES.LEFT,
  preventDefault: () => {},
} as unknown as KeyboardEvent;
const RIGHTEVENT = {
  keyCode: KEYCODES.RIGHT,
  preventDefault: () => {},
} as unknown as KeyboardEvent;
const DOWNEVENT = {
  keyCode: KEYCODES.DOWN,
  preventDefault: () => {},
} as unknown as KeyboardEvent;
const UPEVENT = {
  keyCode: KEYCODES.UP,
  preventDefault: () => {},
} as unknown as KeyboardEvent;
const HOMEEVENT = {
  keyCode: KEYCODES.HOME,
  preventDefault: () => {},
} as unknown as KeyboardEvent;
const ENDEVENT = {
  keyCode: KEYCODES.END,
  preventDefault: () => {},
} as unknown as KeyboardEvent;
const CTRL = (key: KeyboardEvent) => {
  (key as unknown as Record<string, boolean>).ctrlKey = true;
  return key as unknown as KeyboardEvent;
};
const getResults = () => [
  {
    text: "Test1",
    number: 1,
  },
  {
    text: "Test2",
    number: 2,
  },
  {
    text: "Test3",
    number: 3,
  },
  {
    text: "Test4",
    number: 4,
  },
];
const config = [
  { title: "TEXT", prop: "text" },
  { title: "NUMBER", prop: "number", align: "right" },
] as IAutocompleteGridColumn[];
const createWrapper = () => {
  return mount({
    template: `<div></div>`,
    setup: () => {
      return useResultGrid(config);
    },
  });
};

describe("useResultList", () => {
  it("should select first row/col when down is pressed with no active row/col", async () => {
    const wrapper = createWrapper();
    const processed = wrapper.vm.handleKeyPress(DOWNEVENT, getResults());
    await nextTick();
    expect(wrapper.vm.active.row).toBe(0);
    expect(wrapper.vm.active.col).toBe(0);
    expect(processed).toBe(true);
  });
  it("should move row down one when down arrow is pressed", async () => {
    const wrapper = createWrapper();
    wrapper.vm.active.row = 0;
    wrapper.vm.active.col = 0;
    const processed = wrapper.vm.handleKeyPress(DOWNEVENT, getResults());
    await nextTick();
    expect(processed).toBe(true);
    expect(wrapper.vm.active.row).toBe(1);
    expect(wrapper.vm.active.col).toBe(0);
  });
  it("should not wrap when down is pressed on last item", async () => {
    const wrapper = createWrapper();
    const results = getResults();
    wrapper.vm.active.row = results.length - 1;
    wrapper.vm.active.col = 0;
    const processed = wrapper.vm.handleKeyPress(DOWNEVENT, results);
    await nextTick();
    expect(processed).toBe(true);
    expect(wrapper.vm.active.row).toBe(results.length - 1);
    expect(wrapper.vm.active.col).toBe(0);
  });
  it("should move row up one when up arrow is pressed", async () => {
    const wrapper = createWrapper();
    const results = getResults();
    wrapper.vm.active.row = 1;
    wrapper.vm.active.col = 0;
    const processed = wrapper.vm.handleKeyPress(UPEVENT, results);
    await nextTick();
    expect(processed).toBe(true);
    expect(wrapper.vm.active.row).toBe(0);
    expect(wrapper.vm.active.col).toBe(0);
  });
  it("should reset row/col when up arrow is pressed on first item", async () => {
    const wrapper = createWrapper();
    const results = getResults();
    wrapper.vm.active.row = 0;
    wrapper.vm.active.col = 1;
    const processed = wrapper.vm.handleKeyPress(UPEVENT, results);
    await nextTick();
    expect(processed).toBe(true);
    expect(wrapper.vm.active.row).toBe(-1);
    expect(wrapper.vm.active.col).toBe(-1);
  });
  it("should select first row/col when first is called", async () => {
    const wrapper = createWrapper();
    wrapper.vm.active.row = -1;
    wrapper.vm.active.col = -1;
    wrapper.vm.first();
    await nextTick();
    expect(wrapper.vm.active.row).toBe(0);
    expect(wrapper.vm.active.col).toBe(0);
  });
  it("should reset row/col when reset is called", async () => {
    const wrapper = createWrapper();
    wrapper.vm.active.row = 1;
    wrapper.vm.active.col = 1;
    wrapper.vm.reset();
    await nextTick();
    expect(wrapper.vm.active.row).toBe(-1);
    expect(wrapper.vm.active.col).toBe(-1);
  });
  it("should not wrap when left is pressed when first col/row is active", async () => {
    const wrapper = createWrapper();
    const results = getResults();
    wrapper.vm.active.row = 0;
    wrapper.vm.active.col = 0;
    const processed = wrapper.vm.handleKeyPress(LEFTEVENT, results);
    await nextTick();
    expect(processed).toBe(true);
    expect(wrapper.vm.active.row).toBe(0);
    expect(wrapper.vm.active.col).toBe(0);
  });
  it("should wrap to end of previous row when left is pressed on first column", async () => {
    const wrapper = createWrapper();
    const results = getResults();
    wrapper.vm.active.row = 1;
    wrapper.vm.active.col = 0;
    const processed = wrapper.vm.handleKeyPress(LEFTEVENT, results);
    await nextTick();
    expect(processed).toBe(true);
    expect(wrapper.vm.active.row).toBe(0);
    expect(wrapper.vm.active.col).toBe(config.length - 1);
  });
  it("should move left one cell when left is pressed", async () => {
    const wrapper = createWrapper();
    const results = getResults();
    wrapper.vm.active.row = 0;
    wrapper.vm.active.col = config.length - 1;
    const processed = wrapper.vm.handleKeyPress(LEFTEVENT, results);
    await nextTick();
    expect(processed).toBe(true);
    expect(wrapper.vm.active.row).toBe(0);
    expect(wrapper.vm.active.col).toBe(config.length - 2);
  });
  it("should not wrap when right is pressed on bottom right", async () => {
    const wrapper = createWrapper();
    const results = getResults();
    wrapper.vm.active.row = results.length - 1;
    wrapper.vm.active.col = config.length - 1;
    const processed = wrapper.vm.handleKeyPress(RIGHTEVENT, results);
    await nextTick();
    expect(processed).toBe(true);
    expect(wrapper.vm.active.row).toBe(results.length - 1);
    expect(wrapper.vm.active.col).toBe(config.length - 1);
  });
  it("should move to the first column in the next row when right is pressed one the last column", async () => {
    const wrapper = createWrapper();
    const results = getResults();
    wrapper.vm.active.row = 0;
    wrapper.vm.active.col = config.length - 1;
    const processed = wrapper.vm.handleKeyPress(RIGHTEVENT, results);
    await nextTick();
    expect(processed).toBe(true);
    expect(wrapper.vm.active.row).toBe(1);
    expect(wrapper.vm.active.col).toBe(0);
  });
  it("should move right one cell when right is pressed", async () => {
    const wrapper = createWrapper();
    const results = getResults();
    wrapper.vm.active.row = 0;
    wrapper.vm.active.col = 0;
    const processed = wrapper.vm.handleKeyPress(RIGHTEVENT, results);
    await nextTick();
    expect(processed).toBe(true);
    expect(wrapper.vm.active.row).toBe(0);
    expect(wrapper.vm.active.col).toBe(1);
  });
  it("should move to last cell when end is pressed", async () => {
    const wrapper = createWrapper();
    const results = getResults();
    wrapper.vm.active.row = 0;
    wrapper.vm.active.col = 0;
    const processed = wrapper.vm.handleKeyPress(ENDEVENT, results);
    await nextTick();
    expect(processed).toBe(true);
    expect(wrapper.vm.active.row).toBe(0);
    expect(wrapper.vm.active.col).toBe(config.length - 1);
  });
  it("should move to last cell in last row when ctrl + end is pressed", async () => {
    const wrapper = createWrapper();
    const results = getResults();
    wrapper.vm.active.row = 0;
    wrapper.vm.active.col = 0;
    const processed = wrapper.vm.handleKeyPress(CTRL(ENDEVENT), results);
    await nextTick();
    expect(processed).toBe(true);
    expect(wrapper.vm.active.row).toBe(results.length - 1);
    expect(wrapper.vm.active.col).toBe(config.length - 1);
  });
  it("should move to first cell when home is pressed", async () => {
    const wrapper = createWrapper();
    const results = getResults();
    wrapper.vm.active.row = 0;
    wrapper.vm.active.col = config.length - 1;
    const processed = wrapper.vm.handleKeyPress(HOMEEVENT, results);
    await nextTick();
    expect(processed).toBe(true);
    expect(wrapper.vm.active.row).toBe(0);
    expect(wrapper.vm.active.col).toBe(0);
  });
  it("should move to first cell in first row when CTRL + home is pressed", async () => {
    const wrapper = createWrapper();
    const results = getResults();
    wrapper.vm.active.row = 1;
    wrapper.vm.active.col = config.length - 1;
    const processed = wrapper.vm.handleKeyPress(CTRL(HOMEEVENT), results);
    await nextTick();
    expect(processed).toBe(true);
    expect(wrapper.vm.active.row).toBe(0);
    expect(wrapper.vm.active.col).toBe(0);
  });
});
