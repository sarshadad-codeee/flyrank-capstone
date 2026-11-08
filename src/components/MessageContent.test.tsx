// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { MessageContent } from "./MessageContent";

function view(text: string) {
  return render(<MessageContent text={text} />).container;
}

describe("MessageContent", () => {
  it("renders bold text", () => {
    expect(view("This is **bold**").querySelector("strong")?.textContent).toBe("bold");
  });

  it("renders an unfinished bold span as bold, not as raw asterisks", () => {
    const container = view("This is **import");
    expect(container.querySelector("strong")).not.toBeNull();
    expect(container.textContent).not.toContain("*");
  });

  it("hides a dangling bold marker", () => {
    expect(view("Careful **").textContent).not.toContain("*");
  });

  it("renders an unfinished code fence as a code block", () => {
    const container = view("Look:\n```\ncode here");
    expect(container.querySelector("pre")).not.toBeNull();
    expect(container.querySelector("pre")?.textContent).toContain("code here");
  });

  it("opens links in a new tab safely", () => {
    const link = view("[site](https://example.com)").querySelector("a");
    expect(link?.getAttribute("target")).toBe("_blank");
    expect(link?.getAttribute("rel")).toContain("noopener");
  });

  it("does not render images", () => {
    expect(view("![x](https://example.com/a.png)").querySelector("img")).toBeNull();
  });

  it("does not render raw HTML as elements", () => {
    const container = view("<script>alert(1)</script> <b>x</b>");
    expect(container.querySelector("script")).toBeNull();
    expect(container.querySelector("b")).toBeNull();
  });

  it("does not keep a javascript link", () => {
    const link = view("[x](javascript:alert(1))").querySelector("a");
    expect(link?.getAttribute("href") ?? "").not.toContain("javascript");
  });
});
