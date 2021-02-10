import React from "react";
import { NestedCollection, ChildSpec } from "../src";
import "@testing-library/jest-dom";

import { render, fireEvent } from "@testing-library/react";

interface Comment {
  comment?: string;
}

const genComment = (
  data: Comment,
  children?: ChildSpec<Comment>[]
): ChildSpec<Comment> => ({
  data,
  children,
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

const data: ChildSpec<Comment>[] = [comment1, comment2];

const TestComponent = () => {
  return (
    <div>
      <NestedCollection
        data={data}
        createChild={({ comment }, { position, depth }) =>
          `${position + 1}. ${comment} (${depth})`
        }
        childProps={(child, meta) => {
          return {
            "data-testid": `${meta.depth}-${meta.position}`,
          };
        }}
      />
    </div>
  );
};

describe("NestedCollection", () => {
  test("renders all children", () => {
    const { queryByText, debug } = render(<TestComponent />);
    console.log(debug());
    // Top level
    expect(queryByText(`1. ${comment1.data.comment} (0)`)).toBeInTheDocument();
    expect(queryByText(`2. ${comment2.data.comment} (0)`)).toBeInTheDocument();
    // Comment 1 children
    expect(
      queryByText(`1. ${comment1reply1.data.comment} (1)`)
    ).toBeInTheDocument();
    expect(
      queryByText(`2. ${comment1reply2.data.comment} (1)`)
    ).toBeInTheDocument();
    // Comment 2 children
    expect(
      queryByText(`1. ${comment2reply1.data.comment} (1)`)
    ).toBeInTheDocument();
    expect(
      queryByText(`2. ${comment2reply2.data.comment} (1)`)
    ).toBeInTheDocument();
    // Comment 2 reply 1 children
    expect(
      queryByText(`1. ${comment2reply2reply1.data.comment} (2)`)
    ).toBeInTheDocument();
  });
});
