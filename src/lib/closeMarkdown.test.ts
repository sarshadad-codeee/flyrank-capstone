import { describe, it, expect } from "vitest";
import { closeOpenMarkdown } from "./closeMarkdown";

describe("closeOpenMarkdown", () => {
  it("returns an empty string unchanged", () => {
    expect(closeOpenMarkdown("")).toBe("");
  });

  it("leaves complete markdown unchanged", () => {
    const text = "Hello **world** and `code`.\n\n```js\nlet a = 1;\n```\n";
    expect(closeOpenMarkdown(text)).toBe(text);
  });

  it("closes an open code fence", () => {
    expect(closeOpenMarkdown("Here:\n```js\nconst a = 1")).toBe(
      "Here:\n```js\nconst a = 1\n```"
    );
  });

  it("closes an open fence when the text ends with a newline", () => {
    expect(closeOpenMarkdown("```\ncode\n")).toBe("```\ncode\n```");
  });

  it("closes a tilde fence with tildes", () => {
    expect(closeOpenMarkdown("~~~\ncode")).toBe("~~~\ncode\n~~~");
  });

  it("does not treat a different fence marker as the closer", () => {
    expect(closeOpenMarkdown("~~~\nx\n```")).toBe("~~~\nx\n```\n~~~");
  });

  it("ignores backticks and asterisks inside a closed fence", () => {
    const text = "```\na`b **c\n```";
    expect(closeOpenMarkdown(text)).toBe(text);
  });

  it("closes an open inline code span", () => {
    expect(closeOpenMarkdown("Use `npm run")).toBe("Use `npm run`");
  });

  it("closes an open bold span", () => {
    expect(closeOpenMarkdown("This is **important")).toBe(
      "This is **important**"
    );
  });

  it("does not leave a space before the closing bold marker", () => {
    expect(closeOpenMarkdown("This is **important ")).toBe(
      "This is **important**"
    );
  });

  it("drops a dangling bold marker at the very end", () => {
    expect(closeOpenMarkdown("Note **")).toBe("Note");
  });

  it("ignores bold markers inside inline code", () => {
    const text = "Use `**` for bold";
    expect(closeOpenMarkdown(text)).toBe(text);
  });

  it("leaves single-asterisk bullets alone", () => {
    const text = "* one\n* two";
    expect(closeOpenMarkdown(text)).toBe(text);
  });
});
