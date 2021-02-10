import React from "react";

export interface ChildSpec<T> {
  data: T;
  children?: ChildSpec<T>[];
  id?: number | string;
}

type CreateChild<T> = (child: T, meta: Meta<T>) => JSX.Element | string;

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

interface Meta<T> {
  depth?: number;
  parent?: ChildSpec<T>;
  position?: number;
}

type ULPropsObjOrFunc<T> = ULProps | ((meta: Meta<T>) => ULProps);
type LIPropsObjOrFunc<T> =
  | LIProps
  | ((child: ChildSpec<T>, meta: Meta<T>) => LIProps);

interface NestedCollectionProps<T> {
  data: ChildSpec<T>[];
  parentClass?: string;
  childClass?: string;
  parentStyle?: React.CSSProperties;
  childStyle?: React.CSSProperties;
  createChild: CreateChild<T>;
  parentProps?: ULPropsObjOrFunc<T>;
  childProps?: LIPropsObjOrFunc<T>;
  depth?: number;
  parent?: ChildSpec<T>;
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
  child: ChildSpec<T>,
  meta: Meta<T>
): LIProps => {
  if (typeof props === "function") {
    return props(child, meta);
  }
  return props;
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
  } = props;

  const meta: Meta<T> = { depth, parent };

  return (
    <ul
      className={parentClass}
      style={parentStyle}
      {...generateULProps(parentProps, meta)}
    >
      {data.map((child, index) => {
        const updatedMeta = {
          ...meta,
          position: index,
        };
        return (
          <>
            <li
              key={child.id || index}
              data-id="string"
              className={childClass}
              style={childStyle}
              {...generateLIProps(childProps, child, updatedMeta)}
            >
              {createChild(child.data, updatedMeta)}
            </li>
            {hasChildren(child) && (
              <NestedCollection
                {...props}
                data={child.children}
                parent={child}
                depth={depth + 1}
              />
            )}
          </>
        );
      })}
    </ul>
  );
};
