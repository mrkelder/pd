import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CartItem from "components/CartItem";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import store from "app/store";
import { BrowserRouter as Router } from "react-router-dom";

describe("Testing the behavior of a quantity input", () => {
  test("Testing when we try to make the quantity lower than 0", () => {
    render(<Router> <Provider store={store}> <CartItem /> </Provider> </Router>);
    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("spinbutton"), { target: { value: -200 } });
    expect(screen.getByRole("spinbutton")).toHaveValue(1);
  });
  
  test("Testing when we try to make the quantity bigger", () => {
    render(<Router> <Provider store={store}> <CartItem /> </Provider> </Router>);
    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("spinbutton"), { target: { value: 9 } });
    expect(screen.getByRole("spinbutton")).toHaveValue(9);
  });
});