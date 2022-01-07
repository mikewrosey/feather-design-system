import { nextTick } from "vue";
import { mount } from "@vue/test-utils";
import axe from "@featherds/utils/test/axe";
import FeatherMenu from "./FeatherMenu.vue";
const getWrapper = async (options = {}) => {
  const wrapper = mount(FeatherMenu, options);
  await nextTick();
  await nextTick();
  return wrapper;
};

const getTrigger = (id = "") => ({
  template: `<a menu-trigger id="${id}">TEST</a>`,
  methods: {
    focus: () => {},
  },
});
const getContent = () => ({
  template: "<p>Ich bin ein Content</p>",
});

describe("FeatherMenu.vue", () => {
  it("should set trigger attributes initially", async () => {
    const slots = {
      trigger: getTrigger(),
      default: [getContent()],
    };
    const wrapper = await getWrapper({ slots });

    const trigger = wrapper.find("[menu-trigger]").element;
    expect(trigger.getAttribute("aria-haspopup")).toBe("true");
    expect(trigger.getAttribute("aria-controls")).toBe(wrapper.vm.menuId);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });
  it("should set trigger attributes but not override id", async () => {
    const id = "preset";
    const slots = {
      trigger: getTrigger(id),
      default: [getContent()],
    };
    const wrapper = await getWrapper({ slots });
    const trigger = wrapper.find("[menu-trigger]").element;
    expect(trigger.getAttribute("aria-haspopup")).toBe("true");
    expect(trigger.getAttribute("aria-controls")).toBe(wrapper.vm.menuId);
    expect(trigger.getAttribute("id")).toBe(id);
    expect(wrapper.find("[menu-trigger]").element.id).toBe(id);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });
  it("should set trigger attributes after open", async () => {
    const slots = {
      trigger: getTrigger(),
      default: [getContent()],
    };
    const wrapper = await getWrapper({ slots });
    await wrapper.setProps({ open: true });
    await nextTick();
    const trigger = wrapper.find("[menu-trigger]").element;
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
  });
  it("should not set expanded when no-expand property is set.", async () => {
    const slots = {
      trigger: getTrigger(),
      default: [getContent()],
    };
    const wrapper = await getWrapper({
      slots,
      props: {
        open: false,
        noExpand: true,
      },
    });
    const trigger = wrapper.find("[menu-trigger]").element;
    expect(trigger.getAttribute("aria-expanded")).toBe(null);
    wrapper.setProps({ open: true });
    expect(trigger.getAttribute("aria-expanded")).toBe(null);
  });
  it("should emit trigger-click when trigger is clicked", async () => {
    const slots = {
      trigger: getTrigger(),
      default: [getContent()],
    };
    const wrapper = await getWrapper({ slots });
    await wrapper.find("[menu-trigger]").trigger("click");
    await nextTick();
    expect(wrapper.emitted()["trigger-click"].length).toBe(1);
  });

  it("should remove necessary event listeners on unmount", async () => {
    const slots = {
      trigger: getTrigger(),
      default: [getContent()],
    };
    const wrapper = await getWrapper({ slots });
    const documentRemove = jest.spyOn(
      document,
      "removeEventListener"
    );
    wrapper.unmount();
    expect(documentRemove).toHaveBeenCalled();
  });
  it("should add covered class for cover property", async () => {
    const slots = {
      trigger: getTrigger(),
      default: [getContent()],
    };
    const wrapper = await getWrapper({ slots, props: { cover: true } });
    expect(
      wrapper.find(".feather-menu-dropdown").classes().includes("covered")
    ).toBe(true);
  });
  describe("calculatePosition", () => {
    describe("right", () => {
      it("should stay bottom right if space allows", async () => {
        const slots = {
          trigger: getTrigger(),
          default: [getContent()],
        };
        const wrapper = await getWrapper({ slots, props: { right: true } });
        jest.spyOn(wrapper.vm.$refs.menu, "getBoundingClientRect").mockReturnValue({
          height: 100,
          width: 100,
        });
        jest.spyOn(
          wrapper.find("[menu-trigger]").element,
          "getBoundingClientRect"
        ).mockReturnValue({
          top: 50,
          bottom: 60,
          left: 50,
          right: 120,
        });
        wrapper.vm.calculatePosition();
        await nextTick();
        expect(wrapper.vm.position).toBe("bottom-right");
      });
      it("should flip to top right if not bottom space and enough top space", async () => {
        const slots = {
          trigger: getTrigger(),
          default: [getContent()],
        };
        const wrapper = await getWrapper({ slots, props: { right: true } });
        const height = 100;
        const width = 100;
        const windowHeight = window.innerHeight;
        jest.spyOn(wrapper.vm.$refs.menu, "getBoundingClientRect").mockReturnValue({
          height,
          width,
        });
        jest.spyOn(
          wrapper.find("[menu-trigger]").element,
          "getBoundingClientRect"
        ).mockReturnValue({
          top: windowHeight - height,
          bottom: windowHeight - height + 10,
          left: 50,
          right: 120,
        });
        wrapper.vm.calculatePosition();
        await nextTick();
        expect(wrapper.vm.position).toBe("top-right");
      });
      it("should flip to bottom left if not right space and enough left space", async () => {
        const slots = {
          trigger: getTrigger(),
          default: [getContent()],
        };
        const wrapper = await getWrapper({ slots, props: { right: true } });
        const height = 100;
        const width = 100;
        jest.spyOn(wrapper.vm.$refs.menu, "getBoundingClientRect").mockReturnValue({
          height,
          width,
        });
        jest.spyOn(
          wrapper.find("[menu-trigger]").element,
          "getBoundingClientRect"
        ).mockReturnValue({
          top: 50,
          bottom: 60,
          left: 10,
          right: 30,
        });
        wrapper.vm.calculatePosition();
        await nextTick();
        expect(wrapper.vm.position).toBe("bottom-left");
      });
      it("should stay bottom right if not enough room anywhere", async () => {
        const slots = {
          trigger: getTrigger(),
          default: [getContent()],
        };
        const wrapper = await getWrapper({ slots, props: { right: true } });
        const height = 100;
        const width = 100;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        jest.spyOn(wrapper.vm.$refs.menu, "getBoundingClientRect").mockReturnValue({
          height,
          width,
        });
        jest.spyOn(
          wrapper.find("[menu-trigger]").element,
          "getBoundingClientRect"
        ).mockReturnValue({
          top: 50,
          bottom: windowHeight - 50,
          left: 50,
          right: windowWidth - 50,
        });
        wrapper.vm.calculatePosition();
        await nextTick();
        expect(wrapper.vm.position).toBe("bottom-right");
      });
      it("should flip to top left if there is no space right and bottom but enough top and left", async () => {
        const slots = {
          trigger: getTrigger(),
          default: [getContent()],
        };
        const wrapper = await getWrapper({ slots });
        const height = 100;
        const width = 100;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        jest.spyOn(wrapper.vm.$refs.menu, "getBoundingClientRect").mockReturnValue({
          height,
          width,
        });
        jest.spyOn(
          wrapper.find("[menu-trigger]").element,
          "getBoundingClientRect"
        ).mockReturnValue({
          top: windowHeight - height,
          bottom: windowHeight - height + 10,
          left: 10,
          right: 30,
        });
        wrapper.vm.calculatePosition();
        await nextTick();
        expect(wrapper.vm.position).toBe("top-left");
      });
    });
    describe("left", () => {
      it("should stay bottom left if space allows", async () => {
        const slots = {
          trigger: getTrigger(),
          default: [getContent()],
        };
        const wrapper = await getWrapper({ slots });
        jest.spyOn(wrapper.vm.$refs.menu, "getBoundingClientRect").mockReturnValue({
          height: 100,
          width: 100,
        });
        jest.spyOn(
          wrapper.find("[menu-trigger]").element,
          "getBoundingClientRect"
        ).mockReturnValue({
          top: 50,
          bottom: 60,
          left: 50,
          right: 80,
        });
        wrapper.vm.calculatePosition();
        await nextTick();
        expect(wrapper.vm.position).toBe("bottom-left");
      });
      it("should flip to top left if not bottom space and enough top space", async () => {
        const slots = {
          trigger: getTrigger(),
          default: [getContent()],
        };
        const wrapper = await getWrapper({ slots });
        const height = 100;
        const width = 100;
        const windowHeight = window.innerHeight;
        jest.spyOn(wrapper.vm.$refs.menu, "getBoundingClientRect").mockReturnValue({
          height,
          width,
        });
        jest.spyOn(
          wrapper.find("[menu-trigger]").element,
          "getBoundingClientRect"
        ).mockReturnValue({
          top: windowHeight - height,
          bottom: windowHeight - height + 10,
          left: 50,
          right: 80,
        });
        wrapper.vm.calculatePosition();
        await nextTick();
        expect(wrapper.vm.position).toBe("top-left");
      });
      it("should flip to bottom right if not right space and enough right space", async () => {
        const slots = {
          trigger: getTrigger(),
          default: [getContent()],
        };
        const wrapper = await getWrapper({ slots });
        const height = 100;
        const width = 100;
        const windowWidth = window.innerWidth;
        jest.spyOn(wrapper.vm.$refs.menu, "getBoundingClientRect").mockReturnValue({
          height,
          width,
        });
        jest.spyOn(
          wrapper.find("[menu-trigger]").element,
          "getBoundingClientRect"
        ).mockReturnValue({
          top: 50,
          bottom: 60,
          left: windowWidth - 30,
          right: windowWidth,
        });
        wrapper.vm.calculatePosition();
        await nextTick();
        expect(wrapper.vm.position).toBe("bottom-right");
      });
      it("should stay bottom left if not enough room anywhere", async () => {
        const slots = {
          trigger: getTrigger(),
          default: [getContent()],
        };
        const wrapper = await getWrapper({ slots });
        const height = 100;
        const width = 100;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        jest.spyOn(wrapper.vm.$refs.menu, "getBoundingClientRect").mockReturnValue({
          height,
          width,
        });
        jest.spyOn(
          wrapper.find("[menu-trigger]").element,
          "getBoundingClientRect"
        ).mockReturnValue({
          top: 50,
          bottom: windowHeight - 50,
          left: 50,
          right: windowWidth - 50,
        });
        wrapper.vm.calculatePosition();
        await nextTick();
        expect(wrapper.vm.position).toBe("bottom-left");
      });
      it("should flip to top right if there is no space right and bottom but enough top and left", async () => {
        const slots = {
          trigger: getTrigger(),
          default: [getContent()],
        };
        const wrapper = await getWrapper({ slots });
        const height = 100;
        const width = 100;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        jest.spyOn(wrapper.vm.$refs.menu, "getBoundingClientRect").mockReturnValue({
          height,
          width,
        });
        jest.spyOn(
          wrapper.find("[menu-trigger]").element,
          "getBoundingClientRect"
        ).mockReturnValue({
          top: windowHeight - height,
          bottom: windowHeight - height + 10,
          left: windowWidth - 30,
          right: windowWidth,
        });
        wrapper.vm.calculatePosition();
        await nextTick();
        expect(wrapper.vm.position).toBe("top-right");
      });
    });
  });
  describe("a11y", () => {
    it("should be accessible when open", async () => {
      const slots = {
        trigger: getTrigger(),
        default: [getContent()],
      };
      const wrapper = await getWrapper({ slots });
      await wrapper.setProps({ open: true });
      expect(await axe(wrapper.element)).toHaveNoViolations();
    });
  });
});
