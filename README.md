# `NestedCollection`

This is a React component to make it easier to render a nested collection as a list.

## Usage

You can pass in any array of objects as `data` which have the following properties:

- An array containing more of the same objects, representing a nested level, which may contain more of the same objects etc. Specify this as the `childKey`
- A unique `id` (within the collection), either a `string` or a `number`

Assuming you have a nested list of `comments`, with each `comment` having a `replies` array full of more comments:

```jsx
const YourComponent = ({ data }) => {
  return (
    <div>
      <h1>Comments</h1>
      <NestedCollection
        data={data}
        childKey="replies"
        createChild={({ comment }) => comment}
        childStyle={({ depth }) => ({
          marginLeft: `${depth * 5}px`,
        })}
        createCollapseButton={(isCollapsed, { child }) => {
          const replies = child.replies;
          const numReplies = replies ? replies.length : 0;
          return isCollapsed ? `Show ${numReplies} replies` : "Hide";
        }}
      />
    </div>
  );
};
```

## Reference

Generic events will be like this:

```ts
interface NCEvent<T> {
  depth: number;
  parent?: Child<T>;
  child?: Child<T>;
  position?: number;
}
```

Props:

```ts
interface Props<T> {
  childKey: string;
  data: Child<T>[];
  // Classes: you can pass in a string or a function which is invoked with the `NCEvent`, which must return a class name
  parentClass?: string | ((event: NCEvent<T>) => string);
  childClass?: string | ((event: NCEvent<T>) => string);
  buttonClass?: string | ((event: NCEvent<T>) => string);
  // Styles: you can pass in a style object or a function which is invoked with the `NCEvent`, which must return a style object
  parentStyle?:
    | React.CSSProperties
    | ((event: NCEvent<T>) => React.CSSProperties);
  childStyle?:
    | React.CSSProperties
    | ((event: NCEvent<T>) => React.CSSProperties);
  buttonStyle?:
    | React.CSSProperties
    | ((event: NCEvent<T>) => React.CSSProperties);
  // Function which creates a child node, passed the current child's data and the `NCEvent`, should return a React element or a string
  // and is inserted into a `li` tag
  createChild: (child: Child<T>, event: NCEvent<T>) => JSX.Element | string;
  // Prop to create the collapse button, called with `isCollapsed`, whether current state is collapsed and the `NCEvent`
  createCollapseButton?: (
    isCollapsed: boolean,
    event: NCEvent<T>
  ) => JSX.Element | string;
  // Props merged into the `ul` tag: can be object or function
  parentProps?: ULProps | ((event: NCEvent<T>) => ULProps);
  // Props merged into the `li` tag: can be object or function
  childProps?: LIProps | ((event: NCEvent<T>) => LIProps);
  // Props merged into collapse button
  buttonProps?: ButtonProps | ((event: NCEvent<T>) => ButtonProps);
  // How deep in the tree this node is
  depth?: number;
  parent?: Child<T>;
  // Whether collapse button should go before or after children
  collapseButtonPosition?: "before" | "after";
  // Callback invoked whether the collapse button is clicked
  onCollapseClick?: (event: NCEvent<T>) => void;
}
```
