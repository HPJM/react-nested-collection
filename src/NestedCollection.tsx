import React, { useState } from "react";
import { NCEvent, NestedCollectionProps, Child } from "./types";

import {
  generateButtonProps,
  generateLIProps,
  generateStyle,
  generateULProps,
  generateClassName,
  hasChildren,
} from "./utils";

const renderChildren = <T,>(child: Child<T>, childKey?: string): Child<T>[] => {
  if (childKey && childKey in child) {
    return child[childKey];
  }
  return child.children;
};

export const NestedCollection = <T,>(
  props: NestedCollectionProps<T>
): JSX.Element => {
  const {
    data,
    childKey,
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
      className={generateClassName(parentClass, event)}
      style={generateStyle(parentStyle, event)}
      {...generateULProps(parentProps, event)}
    >
      {data.map((child, index) => {
        const updatedEvent = {
          ...event,
          child,
          position: index,
        };

        const childrenExist = hasChildren(child, childKey);
        const showChildren = !collapsed.includes(child.id) && childrenExist;
        const button = childrenExist && renderCollapseButton(updatedEvent);

        const beforeButton = collapseButtonPosition === "before" && button;
        const afterButton = collapseButtonPosition === "after" && button;

        return (
          <React.Fragment key={child.id}>
            <li
              className={generateClassName(childClass, event)}
              style={generateStyle(childStyle, event)}
              {...generateLIProps(childProps, updatedEvent)}
            >
              {createChild(child, updatedEvent)}
              {beforeButton}
              {showChildren && (
                <NestedCollection
                  {...props}
                  data={renderChildren(child, childKey)}
                  parent={child}
                  depth={depth + 1}
                />
              )}
              {afterButton}
            </li>
          </React.Fragment>
        );
      })}
    </ul>
  );
};
