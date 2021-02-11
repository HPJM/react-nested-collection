import React, { useState } from "react";

export interface ChildSpec<T> {
  data: T;
  children?: ChildSpec<T>[];
  id: number | string;
}

type CreateChild<T> = (data: T, event: NCEvent<T>) => JSX.Element | string;
type CreateCollapseButton<T> = (
  isCollapsed: boolean,
  event: NCEvent<T>
) => JSX.Element | string;

interface JSXAttributeProps {
  "data-testid"?: string;
  "data-id"?: string;
}

type ULProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLUListElement>,
  HTMLUListElement
>;

type LIProps = React.DetailedHTMLProps<
  React.LiHTMLAttributes<HTMLLIElement>,
  HTMLLIElement
> &
  JSXAttributeProps;

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

interface NCEvent<T> {
  depth: number;
  parent?: ChildSpec<T>;
  child?: ChildSpec<T>;
  position?: number;
}

type ULPropsObjOrFunc<T> = ULProps | ((event: NCEvent<T>) => ULProps);
type LIPropsObjOrFunc<T> = LIProps | ((event: NCEvent<T>) => LIProps);
type ButtonPropsObjOrFunc<T> =
  | ButtonProps
  | ((event: NCEvent<T>) => ButtonProps);

export type CollapseChildren<T> = (event: NCEvent<T>) => boolean | void;

type StyleObjOrFunc<T> =
  | React.CSSProperties
  | ((event: NCEvent<T>) => React.CSSProperties);

interface NestedCollectionProps<T> {
  data: ChildSpec<T>[];
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
  parent?: ChildSpec<T>;
  collapseButtonPosition?: CollapseButtonPosition;
  onCollapsed?: CollapseChildren<T>;
}

const hasChildren = <T,>(child: ChildSpec<T>) =>
  Boolean(child.children && child.children.length);

const generateULProps = <T,>(
  props: ULPropsObjOrFunc<T>,
  event: NCEvent<T>
): ULProps => {
  if (typeof props === "function") {
    return props(event);
  }
  return props;
};
const generateLIProps = <T,>(
  props: LIPropsObjOrFunc<T>,
  event: NCEvent<T>
): LIProps => {
  if (typeof props === "function") {
    return props(event);
  }
  return props;
};
const generateButtonProps = <T,>(
  props: ButtonPropsObjOrFunc<T>,
  event: NCEvent<T>
): ButtonProps => {
  if (typeof props === "function") {
    return props(event);
  }
  return props;
};

type CollapseButtonPosition = "before" | "after";

const generateStyle = <T,>(
  obj: StyleObjOrFunc<T>,
  event: NCEvent<T>
): React.CSSProperties => {
  if (typeof obj === "function") {
    return obj(event);
  }
  return obj;
};

export const NestedCollection = <T,>(
  props: NestedCollectionProps<T>
): JSX.Element => {
  const {
    data,
    parentClass,
    parentStyle,
    createChild,
    childClass,
    childStyle,
    parentProps = {},
    childProps = {},
    depth = 0,
    parent = null,
    collapseButtonPosition = "before",
    createCollapseButton,
    onCollapsed,
    buttonClass,
    buttonStyle,
    buttonProps,
  } = props;

  const [collapsed, setCollapsed] = useState([]);

  const event: NCEvent<T> = { depth, parent };

  const renderCollapseButton = (event: NCEvent<T>) => {
    const { child } = event;
    if (!createCollapseButton) {
      return null;
    }
    return (
      <button
        onClick={() => {
          if (onCollapsed) {
            onCollapsed(event);
          }
          setCollapsed((collapsed) =>
            collapsed.includes(child.id)
              ? collapsed.filter((id) => id !== child.id)
              : [...collapsed, child.id]
          );
        }}
        style={generateStyle(buttonStyle, event)}
        className={buttonClass}
        {...generateButtonProps(buttonProps, event)}
      >
        {createCollapseButton(collapsed.includes(child.id), event)}
      </button>
    );
  };

  return (
    <ul
      className={parentClass}
      style={generateStyle(parentStyle, event)}
      {...generateULProps(parentProps, event)}
    >
      {data.map((child, index) => {
        const updatedEvent = {
          ...event,
          child,
          position: index,
        };

        const childrenExist = hasChildren(child);
        const showChildren = !collapsed.includes(child.id) && childrenExist;

        return (
          <React.Fragment key={child.id}>
            <li
              className={childClass}
              style={generateStyle(childStyle, event)}
              {...generateLIProps(childProps, updatedEvent)}
            >
              {createChild(child.data, updatedEvent)}
              {collapseButtonPosition === "before" &&
                childrenExist &&
                renderCollapseButton(updatedEvent)}
              {showChildren && (
                <NestedCollection
                  {...props}
                  data={child.children}
                  parent={child}
                  depth={depth + 1}
                />
              )}
              {collapseButtonPosition === "after" &&
                childrenExist &&
                renderCollapseButton(updatedEvent)}
            </li>
          </React.Fragment>
        );
      })}
    </ul>
  );
};
