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
- **Frontend**:
  - **Language**: TypeScript
  - **UI Library**: React
  - **Components**: shadcn/ui
  - **Styling**: Tailwind CSS v4
  - **Routing**: TanStack Router
- **Backend**:
  - **Language**: Rust

## Development Guide

### Best Practices

- 関数にはアロー関数を使い、return文は省略する

  ```ts
  // NG
  function handleClick() {
    return "clicked";
  }

  // OK
  const handleClick = () => "clicked";
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
