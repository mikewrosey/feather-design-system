import { watch, onBeforeUnmount, ref, onMounted, Ref } from "vue";

const useOutsideClick = (
  elementRef: Ref<HTMLElement>,
  listener: (e?: FocusEvent) => void
) => {
  const active = ref(false);
  const windowBlurChecker = (e: FocusEvent) => {
    if (e.target === window) {
      listener(e);
    }
  };
  const outSideClick = (e: FocusEvent) => {
    if (!elementRef.value.contains(e.target as HTMLElement)) {
      listener(e);
    }
  };
  const removeEvents = () => {
    if (document && window) {
      document.removeEventListener("click", outSideClick);
      document.removeEventListener("focus", outSideClick, true);
      window.removeEventListener("blur", windowBlurChecker);
    }
  };
  onMounted(() => {
    const unwatch = watch(
      [elementRef, active],
      ([el, enabled]) => {
        if (el && document && window && enabled) {
          document.addEventListener("click", outSideClick);
          document.addEventListener("focus", outSideClick, true);
          window.addEventListener("blur", windowBlurChecker);
        } else {
          removeEvents();
        }
      },
      {
        immediate: true,
      }
    );

    onBeforeUnmount(() => {
      unwatch();
      removeEvents();
    });
  });

  return active;
};

export { useOutsideClick };
