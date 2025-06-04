# Migrate to HeroUI

We plan to move our UI components from **shadcn/ui** to [HeroUI](https://www.heroui.com/).
This migration will happen gradually to avoid large breaking changes.

## Steps
1. Install `@heroui/react` and wrap the app with `HeroUIProvider`.
2. Replace simple components first (e.g. `Button`).
3. Update remaining components and remove old `shadcn` code.

Follow-up tasks will handle more complex components.
