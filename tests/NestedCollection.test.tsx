import React from "react";
import { NestedCollection } from "../src";
import { Child, CollapseChildren } from "../src/types";
import "@testing-library/jest-dom";

import { render, fireEvent } from "@testing-library/react";

interface Comment {
  comment: string;
  id?: string | number;
  replies?: Comment[];
}

let id = 0;

const genComment = (data: Comment, replies?: Comment[]): Child<Comment> => ({
  ...data,
  replies,
  id: ++id,
});

const comment1reply1 = genComment({ comment: "not funny" }, []);
const comment1reply2 = genComment({ comment: "lol" });
const comment1 = genComment({ comment: "haha" }, [
  comment1reply1,
  comment1reply2,
]);
const comment2reply1 = genComment({ comment: "oh rly" }, []);
const comment2reply2reply1 = genComment({ comment: "I disagree" });
const comment2reply2 = genComment({ comment: "I agree" }, [
  comment2reply2reply1,
]);
const comment2 = genComment({ comment: "js is cool" }, [
  comment2reply1,
  comment2reply2,
]);

const data: Child<Comment>[] = [comment1, comment2];

const TestComponent = ({
  onCollapsed,
}: {
  onCollapsed?: CollapseChildren<Comment>;
}) => {
  return (
    <div>
      <NestedCollection
        data={data}
        childKey="replies"
        onCollapsed={onCollapsed}
        createChild={({ comment }, { position, depth }) =>
          `${position + 1}. ${comment} (${depth})`
        }
        createCollapseButton={(isCollapsed, { position, depth }) =>
          `${isCollapsed ? "Show" : "Hide"} ${depth}:${position + 1}`
        }
        childProps={(meta) => ({
          "data-testid": `${meta.depth}-${meta.position}`,
        })}
        collapseButtonPosition="before"
      />
    </div>
  );
};

describe("NestedCollection", () => {
  test("renders all children", () => {
    const { queryByText } = render(<TestComponent />);
    // Top level
    expect(queryByText(`1. ${comment1.comment} (0)`)).toBeInTheDocument();
    expect(queryByText(`2. ${comment2.comment} (0)`)).toBeInTheDocument();
    // Comment 1 children
    expect(queryByText(`1. ${comment1reply1.comment} (1)`)).toBeInTheDocument();
    expect(queryByText(`2. ${comment1reply2.comment} (1)`)).toBeInTheDocument();
    // Comment 2 children
    expect(queryByText(`1. ${comment2reply1.comment} (1)`)).toBeInTheDocument();
    expect(queryByText(`2. ${comment2reply2.comment} (1)`)).toBeInTheDocument();
    // Comment 2 reply 1 children
    expect(
      queryByText(`1. ${comment2reply2reply1.comment} (2)`)
    ).toBeInTheDocument();
  });
  test("collapse hides children", () => {
    const { queryByText } = render(<TestComponent />);
    // Initially visible
    expect(queryByText(`1. ${comment1.comment} (0)`)).toBeInTheDocument();
    expect(queryByText(`2. ${comment2.comment} (0)`)).toBeInTheDocument();
    // Hide children of 1 by clicking collapse
    fireEvent.click(queryByText("Hide 0:1"));
    // Shouldn't be visible
    expect(
      queryByText(`1. ${comment1reply1.comment} (1)`)
    ).not.toBeInTheDocument();
    expect(
      queryByText(`2. ${comment1reply2.comment} (1)`)
    ).not.toBeInTheDocument();
    // Comment 2 children still visible
    expect(queryByText(`1. ${comment2reply1.comment} (1)`)).toBeInTheDocument();
    expect(queryByText(`2. ${comment2reply2.comment} (1)`)).toBeInTheDocument();
    expect(
      queryByText(`1. ${comment2reply2reply1.comment} (2)`)
    ).toBeInTheDocument();
  });
  test("collapse hides children at depth", () => {
    const { queryByText } = render(<TestComponent />);
    expect(queryByText(`2. ${comment2.comment} (0)`)).toBeInTheDocument();
    fireEvent.click(queryByText("Hide 1:2"));
    // Comment 2 children still visible, but not children of reply 2
    expect(queryByText(`1. ${comment2reply1.comment} (1)`)).toBeInTheDocument();
    expect(queryByText(`2. ${comment2reply2.comment} (1)`)).toBeInTheDocument();
    expect(
      queryByText(`1. ${comment2reply2reply1.comment} (2)`)
    ).not.toBeInTheDocument();
  });
});
