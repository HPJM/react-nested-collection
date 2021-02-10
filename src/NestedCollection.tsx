import React, { useState } from "react";

export interface ChildSpec<T> {
  data: T;
  children?: ChildSpec<T>[];
  id: number | string;
}

type CreateChild<T> = (data: T, meta: Meta<T>) => JSX.Element | string;
type CreateCollapseButton<T> = (
  isCollapsed: boolean,
  meta: Meta<T>
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

interface Meta<T> {
  depth: number;
  parent?: ChildSpec<T>;
  child?: ChildSpec<T>;
  position?: number;
}

type ULPropsObjOrFunc<T> = ULProps | ((meta: Meta<T>) => ULProps);
type LIPropsObjOrFunc<T> = LIProps | ((meta: Meta<T>) => LIProps);
type ButtonPropsObjOrFunc<T> = ButtonProps | ((meta: Meta<T>) => ButtonProps);

export type CollapseChildren<T> = (meta: Meta<T>) => boolean | void;

type StyleObjOrFunc<T> =
  | React.CSSProperties
  | ((meta: Meta<T>) => React.CSSProperties);

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
  meta: Meta<T>
): ULProps => {
  if (typeof props === "function") {
    return props(meta);
  }
  return props;
};
const generateLIProps = <T,>(
  props: LIPropsObjOrFunc<T>,
  meta: Meta<T>
): LIProps => {
  if (typeof props === "function") {
    return props(meta);
  }
  return props;
};
const generateButtonProps = <T,>(
  props: ButtonPropsObjOrFunc<T>,
  meta: Meta<T>
): ButtonProps => {
  if (typeof props === "function") {
    return props(meta);
  }
  return props;
};

type CollapseButtonPosition = "before" | "after";

const generateStyle = <T,>(
  obj: StyleObjOrFunc<T>,
  meta: Meta<T>
): React.CSSProperties => {
  if (typeof obj === "function") {
    return obj(meta);
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

  const meta: Meta<T> = { depth, parent };

  const renderCollapseButton = (meta: Meta<T>) => {
    const { child } = meta;
    if (!createCollapseButton) {
      return null;
    }
    return (
      <button
        onClick={() => {
          if (onCollapsed) {
            onCollapsed(meta);
          }
          setCollapsed((collapsed) =>
            collapsed.includes(child.id)
              ? collapsed.filter((id) => id !== child.id)
              : [...collapsed, child.id]
          );
        }}
        style={generateStyle(buttonStyle, meta)}
        className={buttonClass}
        {...generateButtonProps(buttonProps, meta)}
      >
        {createCollapseButton(collapsed.includes(child.id), meta)}
      </button>
    );
  };

  return (
    <ul
      className={parentClass}
      style={generateStyle(parentStyle, meta)}
      {...generateULProps(parentProps, meta)}
    >
      {data.map((child, index) => {
        const updatedMeta = {
          ...meta,
          child,
          position: index,
        };

        const childrenExist = hasChildren(child);
        const showChildren = !collapsed.includes(child.id) && childrenExist;

        return (
          <React.Fragment key={child.id}>
            <li
              className={childClass}
              style={generateStyle(childStyle, meta)}
              {...generateLIProps(childProps, updatedMeta)}
            >
              {createChild(child.data, updatedMeta)}
              {collapseButtonPosition === "before" &&
                childrenExist &&
                renderCollapseButton(updatedMeta)}
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
                renderCollapseButton(updatedMeta)}
            </li>
          </React.Fragment>
        );
      })}
    </ul>
  );
};
