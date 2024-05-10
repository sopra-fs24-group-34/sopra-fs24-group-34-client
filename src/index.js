import React from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.scss";
import App from "./App";

// Override console.error to filter out the specific warning
//disabled characterGrid errors for the moment
const originalConsoleError = console.error;
console.error = function () {
  if (
    arguments[0] &&
    arguments[0].includes("Encountered two children with the same key")
  ) {
    // Do nothing or log a custom message if needed
    return;
  }
  // Call the original console.error with original arguments
  originalConsoleError.apply(console, arguments);
};

/**
 * This is the entry point of your React application where the root element is in the public/index.html.
 * We call this a “root” DOM node because everything inside it will be managed by React DOM.
 * Applications built with just React usually have a single root DOM node.
 * More: https://react.dev/reference/react-dom/client/createRoot
 */
const container = document.getElementById("app");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App tab="home" />);
