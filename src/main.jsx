import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import Blog from "./Blog.jsx";
import Admin from "./Admin.jsx";

const path = window.location.pathname;

let Component = App;
if (path.startsWith("/blog")) Component = Blog;
if (path.startsWith("/admin")) Component = Admin;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Component />
  </StrictMode>
);
