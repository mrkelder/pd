import React from 'react';
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "components/Button";
import "@testing-library/jest-dom";

describe("Testing the behavior a click event", () => {
  test("After 7 clicks we should see 7 calls", () => {
    const buttonMock = jest.fn();
    render(<Button click={buttonMock} children="Button" />);
    for (let i = 0; i < 7; i++) fireEvent.click(screen.getByRole("button"));
    expect(buttonMock.mock.calls.length).toBe(7);
  });
});