import React from 'react';
import Item from "components/Item";
import { render, screen, cleanup } from '@testing-library/react';
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { infoContext as InfoContext } from 'app/context';
import axios from 'axios';

jest.mock("axios");
afterEach(cleanup);

describe("Testing Item component", () => {
  test("The item should render a default component", async () => {
    render(<Router> <Item /> </Router>);
    // Testing base info
    expect(screen.getByText(/T-shirt/i)).toBeInTheDocument();
    expect(screen.getByText("999.00")).toBeInTheDocument();
    // Testing an image
    expect(screen.getByAltText("item_photo")).toHaveAttribute("src", "imageNotFound.png");
    // Testing links
    expect(screen.getByTestId("item_link1")).toHaveAttribute("href", "/item/none");
    expect(screen.getByTestId("item_link2")).toHaveAttribute("href", "/item/none")
  });

  test("The item should render with a name of \"Purple Hoodie\" and the price of 732.90", () => {
    render(<Router> <Item _id="jh27bdiui1hd832" name="Purple Hoodie" price={732.9} /> </Router>);
    // Testing base info
    expect(screen.getByText("Purple Hoodie")).toBeInTheDocument();
    expect(screen.getByText("732.90")).toBeInTheDocument();
    // Testing an image
    expect(screen.getByAltText("item_photo")).toHaveAttribute("src", "imageNotFound.png");
    // Testing links
    expect(screen.getByTestId("item_link1")).toHaveAttribute("href", "/item/jh27bdiui1hd832");
    expect(screen.getByTestId("item_link2")).toHaveAttribute("href", "/item/jh27bdiui1hd832")
  });

  test("The item should render only one photo", () => {
    render(<InfoContext.Provider value={"coolsite.com"}><Router> <Item _id="jh27bdiui1hd832" name="Purple Hoodie" price={732.9} img="testPhoto.webp" /> </Router></InfoContext.Provider>);
    // Testing base info
    expect(screen.getByText("Purple Hoodie")).toBeInTheDocument();
    expect(screen.getByText("732.90")).toBeInTheDocument();
    // Testing an image
    expect(screen.getByAltText("item_photo")).toHaveAttribute("src", "http://coolsite.com/static/testPhoto.webp");
    expect(screen.queryAllByRole("img")).toHaveLength(1);
    // Testing links
    expect(screen.getByTestId("item_link1")).toHaveAttribute("href", "/item/jh27bdiui1hd832");
    expect(screen.getByTestId("item_link2")).toHaveAttribute("href", "/item/jh27bdiui1hd832")
  });

  test("The item should render itself", async () => {
    const mockItem = [{ _id: "jh27bdiui1hd832", name: "Purple Hoodie", price: 732.9, photos: ["photo1.png", "photo2.png"] }];
    axios.get.mockImplementationOnce(() => Promise.resolve({ data: mockItem }));
    render(<InfoContext.Provider value={"coolsite.com"}><Router> <Item loadSelf _id="jh27bdiui1hd832" /> </Router></InfoContext.Provider>);
    // Testing base info
    expect(screen.queryByText(/Purple Hoodie/i)).toBeNull();
    expect(await screen.findByText(/Purple Hoodie/i)).toBeInTheDocument();
    // Testing an image
    expect(screen.getByAltText("item_photo")).toBeInTheDocument();
    expect(screen.getByAltText("item_photo")).toHaveAttribute("src", "http://coolsite.com/static/photo1.png");
    // Testing links
    expect(screen.getByTestId("item_link1")).toHaveAttribute("href", "/item/jh27bdiui1hd832");
    expect(screen.getByTestId("item_link2")).toHaveAttribute("href", "/item/jh27bdiui1hd832");
  });
});