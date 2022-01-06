export default function axe(el: Element): void;

declare global {
  namespace jest {
    // noinspection JSUnusedGlobalSymbols
    interface Matchers<R> {
      toHaveNoViolations(): R;
    }
  }
}
