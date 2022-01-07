export namespace props {
    namespace center {
        export const type: BooleanConstructor;
        const _default: boolean;
        export { _default as default };
    }
}
declare var _default: import("vue").DefineComponent<{
    center: {
        type: BooleanConstructor;
        default: boolean;
    };
}, any, {
    pressed: boolean;
    active: boolean;
    styles: {};
    failsafe: number;
}, {
    parent(): any;
}, {
    onClick($event: any): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{
    center?: unknown;
} & {
    center: boolean;
} & {}>, {
    center: boolean;
}>;
export default _default;
