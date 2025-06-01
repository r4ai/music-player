import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { MusicProvider } from '../contexts/music-context'

export const Route = createRootRoute({
  component: () => (
    <MusicProvider>
      <Outlet />
      <TanStackRouterDevtools />
    </MusicProvider>
  ),
})