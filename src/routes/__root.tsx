import { Outlet, createRootRoute } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { AudioPlayerProvider } from "../contexts/audio-player-context"

export const Route = createRootRoute({
  component: () => (
    <AudioPlayerProvider>
      <Outlet />
      <TanStackRouterDevtools />
    </AudioPlayerProvider>
  ),
})
