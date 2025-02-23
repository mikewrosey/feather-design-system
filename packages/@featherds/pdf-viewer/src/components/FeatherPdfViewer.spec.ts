import FeatherPdfViewer from "./FeatherPdfViewer.vue";
import { shallowMount } from "@vue/test-utils";
import { getCalls } from "@featherds/utils/test/calls";
import { vi, expect, describe, it, beforeEach } from "vitest";
const focusTrap = {
  template: "<div><slot /></div>",
};

const getWrapper = function (options: Record<string, unknown> = {}) {
  options.stubs = {
    "focus-trap": focusTrap,
  };
  const props = (options.props as Record<string, unknown>) || {};
  options.props = {
    ...props,
    labels: {
      title: "Test",
      viewerTitle: "Test2",
    },
  };
  return shallowMount(FeatherPdfViewer, options);
};

describe("FeatherPdfViewer.vue", () => {
  const xhrMock = {
    open: vi.fn(),
    send: vi.fn(),
    status: 200,
    onload: () => {},
  };
  const xhrRequestMock = xhrMock as unknown as XMLHttpRequest;
  beforeEach(() => {
    xhrMock.open.mockReset();
    xhrMock.send.mockReset();
    vi.spyOn(
      window as unknown as { XMLHttpRequest: () => void },
      "XMLHttpRequest"
    ).mockImplementation(() => xhrRequestMock);
  });
  it("should use document url when extension is pdf", () => {
    const url = "test.pdf";
    getWrapper({
      propsData: {
        modelValue: true,
        documentUrl: url,
        documentExtension: "pdf",
      },
    });
    expect(xhrMock.open.mock.calls[0][1]).toBe(url);
  });
  it("should use preview url when extension is not pdf", () => {
    const url = "test.pdf";
    getWrapper({
      propsData: {
        modelValue: true,
        documentUrl: "test.docx",
        documentExtension: "docx",
        previewUrl: url,
      },
    });
    expect(xhrMock.open.mock.calls[0][1]).toBe(url);
  });
  it("should display error when no preview url and not pdf", async () => {
    const wrapper = getWrapper({
      propsData: {
        modelValue: true,
        documentUrl: "test.docx",
        documentExtension: "docx",
      },
    });
    xhrMock.status = 200;
    xhrMock.onload();
    await wrapper.vm.$nextTick();
    expect(wrapper.element).toMatchSnapshot();
  });
  it("should display preview when the preview url exists", async () => {
    const wrapper = getWrapper({
      propsData: {
        modelValue: true,
        documentUrl: "test.pdf",
        documentExtension: "pdf",
      },
    });
    xhrMock.status = 200;
    xhrMock.onload();
    await wrapper.vm.$nextTick();
    expect(wrapper.element).toMatchSnapshot();
  });
  it("should display error when preview url doesn't return 200", async () => {
    const wrapper = getWrapper({
      propsData: {
        modelValue: true,
        documentUrl: "test.pdf",
        documentExtension: "pdf",
      },
    });
    xhrMock.status = 404;
    xhrMock.onload();
    await wrapper.vm.$nextTick();
    expect(wrapper.element).toMatchSnapshot();
  });
  it("should display original download when extension is not pdf", async () => {
    const wrapper = getWrapper({
      propsData: {
        modelValue: true,
        documentUrl: "test.docx",
        documentExtension: "docx",
      },
    });
    xhrMock.status = 200;
    xhrMock.onload();
    await wrapper.vm.$nextTick();
    expect(wrapper.element).toMatchSnapshot();
  });
  it("should show viewer when visible prop changes", async () => {
    const wrapper = getWrapper({
      propsData: {
        modelValue: false,
        documentUrl: "test.docx",
        documentExtension: "docx",
      },
    });
    expect(wrapper.find(".content").isVisible()).toBe(false);
    await wrapper.setProps({ modelValue: true });
    expect(wrapper.find(".content").isVisible()).toBe(true);
    await wrapper.setProps({ modelValue: false });
    expect(wrapper.find(".content").isVisible()).toBe(false);
  });

  it("should close on when close button clicked", async () => {
    const wrapper = getWrapper({
      propsData: {
        modelValue: true,
        documentUrl: "test.docx",
        documentExtension: "docx",
      },
    });
    await wrapper.find(".close-icon").trigger("click");
    expect(getCalls<[boolean]>(wrapper, "update:modelValue")[0][0]).toBe(false);
  });

  it("should always show error state when force-error is true and can preview", async () => {
    const wrapper = getWrapper({
      propsData: {
        modelValue: true,
        forceError: true,
        documentUrl: "test.pdf",
        documentExtension: "pdf",
      },
    });
    expect(wrapper.element).toMatchSnapshot();
    xhrMock.status = 200;
    xhrMock.onload();
    await wrapper.vm.$nextTick();
    expect(wrapper.element).toMatchSnapshot();
  });
  it("should always show error state when force-error is true and should show no preview", async () => {
    const wrapper = getWrapper({
      propsData: {
        modelValue: true,
        forceError: true,

        documentUrl: "test.docx",
        documentExtension: "docx",
      },
    });
    expect(wrapper.element).toMatchSnapshot();

    xhrMock.status = 200;
    xhrMock.onload();
    await wrapper.vm.$nextTick();
    expect(wrapper.element).toMatchSnapshot();
  });

  it("should hide download button when hide-actions is true", async () => {
    const wrapper = getWrapper({
      propsData: {
        modelValue: true,
        hideActions: true,
        documentUrl: "test.docx",
        documentExtension: "docx",
      },
    });
    xhrMock.status = 200;
    xhrMock.onload();
    await wrapper.vm.$nextTick();
    expect(wrapper.element).toMatchSnapshot();
  });
});
