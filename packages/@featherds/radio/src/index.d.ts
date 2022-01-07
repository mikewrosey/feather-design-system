declare module "@featherds/radio" {
  import { DefineComponent } from "vue";
  const FeatherRadio: DefineComponent;
  const FeatherRadioGroup: DefineComponent;

  const useRadioGroup: (
    modelValue: any,
    emit: any
  ) => {
    focus: () => void;
    selectPrevious(): void;
    selectNext(): void;
    keydown: (e: any) => void;
  };
  export { FeatherRadio, FeatherRadioGroup, useRadioGroup };
}
