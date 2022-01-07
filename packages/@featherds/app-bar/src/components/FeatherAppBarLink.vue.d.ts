declare const _default: import("vue").DefineComponent<{
    icon: {
        type: ObjectConstructor;
        required: true;
    };
    title: {
        type: StringConstructor;
        required: true;
    };
    url: {
        type: StringConstructor;
        required: true;
    };
    type: {
        type: StringConstructor;
        default: string;
        validator: (v: string) => boolean;
    };
}, void, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{
    icon?: unknown;
    title?: unknown;
    url?: unknown;
    type?: unknown;
} & {
    type: string;
    url: string;
    title: string;
    icon: Record<string, any>;
} & {}>, {
    type: string;
}>;
export default _default;
