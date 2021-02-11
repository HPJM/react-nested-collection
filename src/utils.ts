import {
  ULPropsObjOrFunc,
  LIPropsObjOrFunc,
  NCEvent,
  ButtonPropsObjOrFunc,
  Child,
  LIProps,
  ULProps,
  ButtonProps,
  StyleObjOrFunc,
} from "./types";

export const hasChildren = <T>(child: Child<T>, childKey?: string) => {
  const children = childKey ? child[childKey] : child.children;
  return Boolean(children && children.length);
};

export const generateULProps = <T>(
  props: ULPropsObjOrFunc<T>,
  event: NCEvent<T>
): ULProps => {
  if (typeof props === "function") {
    return props(event);
  }
  return props;
};
export const generateLIProps = <T>(
  props: LIPropsObjOrFunc<T>,
  event: NCEvent<T>
): LIProps => {
  if (typeof props === "function") {
    return props(event);
  }
  return props;
};
export const generateButtonProps = <T>(
  props: ButtonPropsObjOrFunc<T>,
  event: NCEvent<T>
): ButtonProps => {
  if (typeof props === "function") {
    return props(event);
  }
  return props;
};

export const generateStyle = <T>(
  obj: StyleObjOrFunc<T>,
  event: NCEvent<T>
): React.CSSProperties => {
  if (typeof obj === "function") {
    return obj(event);
  }
  return obj;
};
export const generateClassName = <T>(
  className: string | ((event: NCEvent<T>) => string),
  event: NCEvent<T>
): string => {
  if (typeof className === "function") {
    return className(event);
  }
  return className;
};
