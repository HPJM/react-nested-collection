type CreateChild<T> = (
  child: Child<T>,
  event: NCEvent<T>
) => JSX.Element | string;
type CreateCollapseButton<T> = (
  isCollapsed: boolean,
  event: NCEvent<T>
) => JSX.Element | string;

interface JSXAttributeProps {
  "data-testid"?: string;
  "data-id"?: string;
}

export type CollapseChildren<T> = (event: NCEvent<T>) => boolean | void;

export interface WithChildren<T> {
  children?: T[];
}

export interface WithId {
  id?: string | number;
}

export type Child<T> = WithChildren<T> & T & WithId;

export type ULProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLUListElement>,
  HTMLUListElement
>;

export type LIProps = React.DetailedHTMLProps<
  React.LiHTMLAttributes<HTMLLIElement>,
  HTMLLIElement
> &
  JSXAttributeProps;

export type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export interface NCEvent<T> {
  depth: number;
  parent?: Child<T>;
  child?: Child<T>;
  position?: number;
}

export type CollapseButtonPosition = "before" | "after";

export type ULPropsObjOrFunc<T> = ULProps | ((event: NCEvent<T>) => ULProps);
export type LIPropsObjOrFunc<T> = LIProps | ((event: NCEvent<T>) => LIProps);
export type ButtonPropsObjOrFunc<T> =
  | ButtonProps
  | ((event: NCEvent<T>) => ButtonProps);

export type StyleObjOrFunc<T> =
  | React.CSSProperties
  | ((event: NCEvent<T>) => React.CSSProperties);

export interface NestedCollectionProps<T> {
  childKey: string;
  data: Child<T>[];
  parentClass?: string;
  childClass?: string;
  parentStyle?: StyleObjOrFunc<T>;
  childStyle?: StyleObjOrFunc<T>;
  buttonStyle?: StyleObjOrFunc<T>;
  buttonClass?: string;
  createChild: CreateChild<T>;
  createCollapseButton?: CreateCollapseButton<T>;
  parentProps?: ULPropsObjOrFunc<T>;
  childProps?: LIPropsObjOrFunc<T>;
  buttonProps?: ButtonPropsObjOrFunc<T>;
  depth?: number;
  parent?: Child<T>;
  collapseButtonPosition?: CollapseButtonPosition;
  onCollapsed?: CollapseChildren<T>;
}
