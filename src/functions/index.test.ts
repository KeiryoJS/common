import test from "ava";
import { mergeObject } from "../index";

test("mergeObject merges successfully", () => {
  const DEFAULT = {
    foo: "bar",
    hello: "world",
  };

  const given = {
    foo: 0,
    hello: null,
  };

  // @ts-expect-error
  const merged = mergeObject(given, DEFAULT);
  console.log(merged);
});
