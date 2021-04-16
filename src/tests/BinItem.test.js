import React from 'react';
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import BinItem from "components/BinItem";

describe("Testing the behavior of a quantity label", () => {
  test("Testing normal state when amount is 42", () => {
    render(<BinItem amount={42}/>);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  test("Testing state when amount is more than 99", () => {
    render(<BinItem amount={235}/>);
    expect(screen.getByText("+99")).toBeInTheDocument();
    expect(screen.queryByText("235")).toBeNull();
  });
});