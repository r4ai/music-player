import "./global.css"

import { HeroUIProvider } from "@heroui/react"
import { RouterProvider, createRouter } from "@tanstack/react-router"
import { StrictMode } from "react"
import ReactDOM from "react-dom/client"

// Import the generated route tree
import { routeTree } from "./routeTree.gen"

// Create a new router instance
// `import.meta.env.BASE_URL` is set by Vite's `base` option and is used here to
// ensure the router works correctly when deployed to a sub-path, such as
// GitHub Pages.
const router = createRouter({
  routeTree,
  basepath: import.meta.env.BASE_URL,
})

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

// Render the app
// biome-ignore lint/style/noNonNullAssertion: #root must exist in the HTML
const rootElement = document.getElementById("root")!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <HeroUIProvider>
        <RouterProvider router={router} />
      </HeroUIProvider>
    </StrictMode>,
  )
}
