## About this app

シンプルな音楽再生プレーヤー

### 導線

#### Minimal User Flow

1. 起動時に、`/`でホームが画面が表示される

2. 音楽ファイルをドラック&ドロップすると、`/player`に遷移し、音楽ファイルの再生画面が表示される

3. `/player`では、音楽ファイルの再生、停止、音量調整などが可能

## Tech Stack

- **Framework**: Tauri
- **Package Manager**: Bun
- **Linter**: Biome
- **Frontend**:
  - **Language**: TypeScript
  - **UI Library**: React
  - **Components**: shadcn/ui
  - **Styling**: Tailwind CSS v4
  - **Routing**: TanStack Router
- **Backend**:
  - **Language**: Rust

## Development Guide

### Commands

- **Start Development Server**: `bun run dev`
- **Build for Production**: `bun run build`
- **Check with Biome**: `bun run check:write`
- **Type Check**: `bun run typecheck`
- **Run Tests**: `bun run test:ci`

実装が完了したら、次を実行して、コードの品質をチェックすること：

```sh
bun run check:write && bun run typecheck && bun run test:ci
```

### Best Practices

- コミットメッセージはconventional commitに従い、英語で記述する

  ```sh
  // OK
  $ git commit -m "feat: add new feature"

  // NG
  $ git commit -m "●●の機能を追加した"
  ```

- プログラム内のコメントアウトは英語で記述する

  ```ts
  // OK
  // This function handles the click event

  // NG
  // この関数はクリックイベントを処理します
  ```

- 関数にはアロー関数を使い、return文は省略する

  ```ts
  // NG
  function handleClick() {
    return "clicked";
  }

  // OK
  const handleClick = () => "clicked";
  ```

- importのパスの指定には`@/`を積極的に利用する

  ```ts
  // NG
  import { MyComponent } from "../../components/my-component";

  // OK
  import { MyComponent } from "@/components/my-component";
  ```

- interfaceよりtypeを使う

  ```ts
  // NG
  interface User {
    name: string;
    age: number;
  }

  // OK
  type User = {
    name: string;
    age: number;
  };
  ```

- 必要な場合を除き、基本的にnamed exportを使用する

  ```ts
  // NG
  export default const MyComponent = () => {
    return <div>Hello World</div>;
  };

  // OK
  export const MyComponent = () => {
    return <div>Hello World</div>;
  };
  ```

- shadcn/uiのコンポーネントを利用する

  コンポーネント一覧：

  ```txt
  src/components/ui/
  ├── accordion.tsx
  ├── alert-dialog.tsx
  ├── alert.tsx
  ├── aspect-ratio.tsx
  ├── avatar.tsx
  ├── badge.tsx
  ├── breadcrumb.tsx
  ├── button.tsx
  ├── calendar.tsx
  ├── card.tsx
  ├── carousel.tsx
  ├── chart.tsx
  ├── checkbox.tsx
  ├── collapsible.tsx
  ├── command.tsx
  ├── context-menu.tsx
  ├── dialog.tsx
  ├── drawer.tsx
  ├── dropdown-menu.tsx
  ├── form.tsx
  ├── hover-card.tsx
  ├── input-otp.tsx
  ├── input.tsx
  ├── label.tsx
  ├── menubar.tsx
  ├── navigation-menu.tsx
  ├── pagination.tsx
  ├── popover.tsx
  ├── progress.tsx
  ├── radio-group.tsx
  ├── resizable.tsx
  ├── scroll-area.tsx
  ├── select.tsx
  ├── separator.tsx
  ├── sheet.tsx
  ├── sidebar.tsx
  ├── skeleton.tsx
  ├── slider.tsx
  ├── sonner.tsx
  ├── switch.tsx
  ├── table.tsx
  ├── tabs.tsx
  ├── textarea.tsx
  ├── toggle-group.tsx
  ├── toggle.tsx
  └── tooltip.tsx
  ```

- `src/global.css`にて定義済みのデザインシステムを最大限利用する

  ```css
  @theme inline {
    --radius-sm;
    --radius-md;
    --radius-lg;
    --radius-xl;
    --color-background;
    --color-foreground;
    --color-card;
    --color-card-foreground;
    --color-popover;
    --color-popover-foreground;
    --color-primary;
    --color-primary-foreground;
    --color-secondary;
    --color-secondary-foreground;
    --color-muted;
    --color-muted-foreground;
    --color-accent;
    --color-accent-foreground;
    --color-destructive;
    --color-border;
    --color-input;
    --color-ring;
    --color-chart-1;
    --color-chart-2;
    --color-chart-3;
    --color-chart-4;
    --color-chart-5;
    --color-sidebar;
    --color-sidebar-foreground;
    --color-sidebar-primary;
    --color-sidebar-primary-foreground;
    --color-sidebar-accent;
    --color-sidebar-accent-foreground;
    --color-sidebar-border;
    --color-sidebar-ring;
  }
  ```

- ファイル名には常に絶対kebab-caseを使用する

  - NG: `MyComponent.tsx`, `my_context.tsx`
  - OK: `my-component.tsx`, `my-context.tsx`

### Library Usage

#### TanStack Router

- ルーティングは`src/routes`ディレクトリ内で定義する

  ```tsx
  // src/routes/index.tsx
  import { createFileRoute } from "@tanstack/react-router";

  export const Route = createFileRoute("/posts")({
    component: PostsComponent,
  });
  ```

  ファイルベースルーティングの例：

  ```tsx
  src/routes/
  ├── index.tsx              ✅ /
  ├── player/                ✅ /player
  │   ├── route.tsx          👈 layout route
  │   ├── index.tsx          ✅ /player
  │   └── $id.tsx            ✅ /player/:id
  ├── -components/           👈 dirs and files with a `-` prefix is ignored
  │   ├── PlayerControls.tsx 👈 ignored
  │   └── PlayerProgress.tsx 👈 ignored
  └── _pathless/             👈 dirs and files with a `_` prefix is pathless routes
      └── settings/
          └── index.tsx      ✅ /settings
  ```

- Dynamic Routes Segments:

  ```tsx
  // src/routes/posts/$postId.tsx --> /posts/:postId
  import { createFileRoute } from "@tanstack/react-router";

  const PostComponent = () => {
    // In a component!
    const { postId } = Route.useParams();
    return <div>Post ID: {postId}</div>;
  };

  export const Route = createFileRoute("/posts/$postId")({
    // In a loader
    loader: ({ params }) => fetchPost(params.postId),
    // Or in a component
    component: PostComponent,
  });
  ```

- Layout Routes:

  ```tsx
  // src/routes/app/route.tsx
  import { Outlet, createFileRoute } from "@tanstack/react-router";

  const AppLayoutComponent = () => {
    return (
      <div>
        <h1>App Layout</h1>
        <Outlet />
      </div>
    );
  };

  export const Route = createFileRoute("/app")({
    component: AppLayoutComponent,
  });
  ```

  This `AppLayoutComponent` will render for all routes under `/app`, and the `Outlet` will render the child routes.
