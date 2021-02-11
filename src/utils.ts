import {
  ULPropsObjOrFunc,
  LIPropsObjOrFunc,
  NCEvent,
  ButtonPropsObjOrFunc,
  ChildSpec,
  LIProps,
  ULProps,
  ButtonProps,
  StyleObjOrFunc,
} from "./types";

export const hasChildren = <T>(child: ChildSpec<T>) =>
  Boolean(child.children && child.children.length);

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
