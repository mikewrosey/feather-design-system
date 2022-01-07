import { PropType, Ref } from "vue";
declare const LABELS: {
    skip: string;
    expand: string;
};
declare const _default: import("vue").DefineComponent<{
    content: {
        type: StringConstructor;
        required: true;
    };
    labels: {
        type: PropType<{
            skip: string;
            expand: string;
        }>;
        default: () => {
            skip: string;
            expand: string;
        };
        validator: (v: typeof LABELS) => boolean;
    };
    fullWidth: {
        type: BooleanConstructor;
        default: boolean;
    };
    scrollHide: {
        type: BooleanConstructor;
        default: boolean;
    };
}, {
    canShowExpand: Ref<boolean>;
    expand: () => void;
    transitionClass: Ref<string>;
    displayClass: Ref<string>;
    wrapper: Ref<any>;
    skipLabel: import("vue").ComputedRef<string>;
    expandLabel: import("vue").ComputedRef<string>;
    full: boolean;
}, unknown, {
    contentId(): string;
    menu(): import("vue").DefineComponent<{}, {}, {}, import("vue").ComputedOptions, import("vue").MethodOptions, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{} & {} & {}>, {}>;
}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{
    content?: unknown;
    labels?: unknown;
    fullWidth?: unknown;
    scrollHide?: unknown;
} & {
    content: string;
    labels: {
        skip: string;
        expand: string;
    };
    fullWidth: boolean;
    scrollHide: boolean;
} & {}>, {
    labels: {
        skip: string;
        expand: string;
    };
    fullWidth: boolean;
    scrollHide: boolean;
}>;
export default _default;
