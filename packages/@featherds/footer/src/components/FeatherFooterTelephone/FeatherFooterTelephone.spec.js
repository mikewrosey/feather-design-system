import FeatherFooterTelephone from "./FeatherFooterTelephone.vue";
import { mount } from "@vue/test-utils";
const number = "1-(800)-2828-2 0";
const getWrapper = function (options = {}) {
  options.props = {
    number,
  };
  return mount(FeatherFooterTelephone, options);
};

describe("FeatherFooterTelephone", () => {
  it("should render number correctly", () => {
    const wrapper = getWrapper();
    const anchor = wrapper.find("a");
    const result = "tel:+1800282820";
    expect(anchor.attributes("href")).toBe(result);
    expect(anchor.text()).toBe(number);
  });
});
