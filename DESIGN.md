# Nova — Task Management App Design System

> "Manage Team Work Without Chaos" — A premium visual workspace for modern teams.

---

## 1. Design Philosophy

### Core Principles
- **Dark-first luxury** — Deep blacks with luminous accents create depth and focus
- **Glass morphism** — Frosted glass surfaces with subtle transparency
- **Ambient motion** — Subtle glows, pulses, and floating elements that feel alive but not distracting
- **Spatial clarity** — Generous whitespace, clear hierarchy, breathable layouts
- **Progressive disclosure** — Simple by default, powerful on demand

### Visual Identity
The design evokes a **premium command center** — sophisticated, focused, and powerful. Think mission control meets modern SaaS.

---

## 2. Design Tokens

### Color System

#### Base Palette
```css
--color-background: #040509;      /* Deep space black — primary bg */
--color-surface: #0B0D14;          /* Elevated surface */
--color-surface-elevated: #12151F; /* Cards, modals */
--color-surface-border: #1A1D28;   /* Subtle borders */
```

#### Brand Colors
```css
--color-primary: #3B82F6;          /* Electric blue — primary actions */
--color-primary-hover: #2563EB;    /* Primary hover state */
--color-accent: #8B5CF6;           /* Vibrant purple — accents */
--color-cyan-glow: #06B6D4;        /* Cyan — highlights */
--color-success: #10B981;           /* Emerald — success states */
--color-warning: #F59E0B;          /* Amber — warnings */
--color-danger: #EF4444;           /* Red — destructive */
```

#### Text Colors
```css
--color-text-main: #F8FAFC;       /* Primary text — near white */
--color-text-secondary: #CBD5E1;   /* Secondary text */
--color-text-muted: #94A3B8;      /* Muted/placeholder text */
--color-text-disabled: #475569;   /* Disabled text */
```

#### Gradients
```css
--gradient-brand: linear-gradient(135deg, #3B82F6, #8B5CF6, #06B6D4);
--gradient-surface: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%);
--gradient-glow: radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%);
```

### Typography

#### Font Stack
```css
--font-heading: "Bricolage Grotesque", system-ui, sans-serif;
--font-sans: "DM Sans", system-ui, sans-serif;
--font-mono: "JetBrains Mono", monospace; /* For code/data */
```

#### Type Scale
```css
--text-xs: 0.75rem;     /* 12px — labels, badges */
--text-sm: 0.875rem;    /* 14px — secondary text */
--text-base: 1rem;      /* 16px — body text */
--text-lg: 1.125rem;    /* 18px — lead text */
--text-xl: 1.25rem;     /* 20px — card titles */
--text-2xl: 1.5rem;     /* 24px — section headers */
--text-3xl: 1.875rem;   /* 30px — page titles */
--text-4xl: 2.25rem;    /* 36px — hero subheads */
--text-5xl: 3rem;       /* 48px — hero headlines */
```

#### Font Weights
```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

### Spacing System
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-20: 5rem;     /* 80px */
```

### Border Radius
```css
--radius-sm: 0.375rem;   /* 6px — buttons, inputs */
--radius-md: 0.5rem;      /* 8px — cards */
--radius-lg: 0.75rem;     /* 12px — modals */
--radius-xl: 1rem;        /* 16px — large cards */
--radius-2xl: 1.25rem;    /* 20px — panels */
--radius-full: 9999px;    /* Pills, avatars */
```

### Shadows & Effects
```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
--shadow-md: 0 4px 12px rgba(0,0,0,0.4);
--shadow-lg: 0 8px 24px rgba(0,0,0,0.5);
--shadow-glow: 0 0 40px rgba(59,130,246,0.3);
--shadow-card: 0 4px 30px rgba(0,0,0,0.1);
```

### Motion
```css
--transition-fast: 150ms ease;
--transition-base: 200ms ease;
--transition-slow: 300ms ease;
--transition-spring: 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
--duration-float: 6s ease-in-out infinite;
```

---

## 3. Component Library

### Core Components

#### Button
**Variants**: primary, secondary, ghost, danger
**Sizes**: sm (32px), md (40px), lg (48px)

```tsx
// Primary
<Button variant="primary" size="md">
  <Plus weight="bold" /> Create Board
</Button>

// Ghost
<Button variant="ghost" size="sm">
  <DotsThree weight="bold" />
</Button>
```

**States**:
- Default: Solid background, visible
- Hover: Brightness increase, subtle scale
- Active: Pressed state, darker
- Disabled: 50% opacity, no pointer
- Loading: Spinner, disabled interaction

#### Card (Glass)
```tsx
<div className="glass-card p-6">
  <CardHeader>
    <CardTitle>Project Alpha</CardTitle>
    <CardDescription>Q4 Launch</CardDescription>
  </CardHeader>
  <CardContent>...</CardContent>
</div>
```

#### Input
```tsx
<Input
  placeholder="Enter task title..."
  icon={<Plus />}
  error="Title is required"
/>
```

#### Avatar
```tsx
<Avatar src={user.image} name="Jane Doe" size="md" />
// Sizes: xs(24), sm(32), md(40), lg(56), xl(80)
```

#### Badge
```tsx
<Badge variant="primary" size="sm">In Progress</Badge>
// Variants: primary, success, warning, danger, neutral
```

#### Modal
```tsx
<Modal isOpen={isOpen} onClose={onClose} title="Create Task">
  <TaskForm />
</Modal>
```

#### Dropdown Menu
```tsx
<DropdownMenu>
  <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem variant="danger">Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## 4. Application Layout

### Overall Structure

```
┌─────────────────────────────────────────────────────────────┐
│  Top Bar (64px)                                             │
│  [Logo] [Search] [Notifications] [User Menu]                │
├────────────┬────────────────────────────────────────────────┤
│            │                                                │
│  Sidebar   │  Main Content Area                             │
│  (260px)   │                                                │
│            │  ┌─────────────────────────────────────────┐   │
│  Workspaces│  │  Board View / Workspace Settings / etc  │   │
│  - Board 1 │  │                                         │   │
│  - Board 2 │  │                                         │   │
│            │  └─────────────────────────────────────────┘   │
│            │                                                │
└────────────┴────────────────────────────────────────────────┘
```

### Page Hierarchy

1. **Landing Page** (Public)
   - Hero, Features, Pricing, CTA
   - Sign Up / Login redirects

2. **Dashboard** (`/dashboard`)
   - Workspace list
   - Recent boards
   - Quick actions

3. **Workspace** (`/workspace/[id]`)
   - Workspace overview
   - Board grid
   - Member list
   - Settings

4. **Board** (`/board/[id]`)
   - Kanban columns
   - Task cards
   - Board header with actions

5. **Task Detail** (Modal or `/board/[id]/task/[taskId]`)
   - Full task information
   - Comments
   - Activity log

---

## 5. Page Specifications

### 5.1 Authentication Pages

#### Login Page (`/login`)
```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│              [Nova Logo]                                    │
│                                                            │
│         ┌──────────────────────────────┐                  │
│         │                              │                  │
│         │   Welcome back               │                  │
│         │   Sign in to continue        │                  │
│         │                              │                  │
│         │   [Email Input]              │                  │
│         │                              │                  │
│         │   [Password Input]           │                  │
│         │                              │                  │
│         │   [    Sign In Button    ]   │                  │
│         │                              │                  │
│         │   Forgot password?           │                  │
│         │                              │                  │
│         │   ─── or ───                 │                  │
│         │                              │                  │
│         │   [Google] [GitHub]          │                  │
│         │                              │                  │
│         │   Don't have an account?     │                  │
│         │   Sign up →                  │                  │
│         │                              │                  │
│         └──────────────────────────────┘                  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Specs**:
- Centered card, max-width 420px
- Glass card with 32px padding
- Social auth buttons as secondary
- Gradient border accent on focus

#### Register Page (`/register`)
- Same layout as login
- Additional "Name" field
- "Already have account?" link

### 5.2 Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  Top Bar                                                    │
├────────────┬────────────────────────────────────────────────┤
│            │                                                │
│  Sidebar   │  Dashboard                                     │
│            │                                                │
│  [User]    │  ┌─ Quick Actions ────────────────────────┐   │
│            │  │  [+ Create Workspace] [+ Join Workspace] │   │
│  ────────  │  └──────────────────────────────────────────┘   │
│            │                                                │
│  Workspaces│  ┌─ Your Workspaces ──────────────────────┐   │
│  > Work 1  │  │  ┌─────┐ ┌─────┐ ┌─────┐               │   │
│    - B1    │  │  │ WS1 │ │ WS2 │ │ WS3 │ [+ New]       │   │
│    - B2    │  │  └─────┘ └─────┘ └─────┘               │   │
│  > Work 2  │  └──────────────────────────────────────────┘   │
│  > School  │                                                │
│            │  ┌─ Recent Boards ─────────────────────────┐   │
│  ────────  │  │  Board name → Workspace                  │   │
│            │  │  Board name → Workspace                  │   │
│  Settings  │  └──────────────────────────────────────────┘   │
│  Logout     │                                                │
└────────────┴────────────────────────────────────────────────┘
```

**Empty State**:
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    [Illustration]                            │
│                                                             │
│              No workspaces yet                               │
│                                                             │
│         Create your first workspace to get started.          │
│                                                             │
│              [+ Create Workspace]                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5.3 Workspace Page (`/workspace/[id]`)

```
┌─────────────────────────────────────────────────────────────┐
│  Workspace Header                                           │
│  [← Back] [Icon] Workspace Name [Members] [⚙ Settings]     │
├────────────┬────────────────────────────────────────────────┤
│            │                                                │
│  Sidebar   │  Boards Grid                                   │
│            │                                                │
│  Workspace │  ┌────────┐ ┌────────┐ ┌────────┐ ┌───────┐  │
│  Overview  │  │ Board  │ │ Board  │ │ Board  │ │  +    │  │
│  Boards    │  │  Card  │ │  Card  │ │  Card  │ │ Create │  │
│  Members   │  └────────┘ └────────┘ └────────┘ └───────┘  │
│  Settings  │                                                │
│            │                                                │
└────────────┴────────────────────────────────────────────────┘
```

**Board Card**:
- 280px width
- Color accent bar at top (board color)
- Board name, task count, last activity
- Member avatars (stacked, max 3 + overflow)
- Hover: Subtle lift + glow

### 5.4 Board View (`/board/[id]`) — The Core

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  Board Header                                                                │
│  [←] Board Name          [Filter ▼] [Members] [Share] [⋮]                     │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────┐ │
│  │  Todo   │  │In Prog. │  │ Review  │  │  Done   │  │         │  │  +    │ │
│  │  (4)    │  │  (2)    │  │  (1)    │  │  (8)    │  │         │  │ Add  │ │
│  ├─────────┤  ├─────────┤  ├─────────┤  ├─────────┤  │         │  │ Col  │ │
│  │ ┌─────┐ │  │ ┌─────┐ │  │ ┌─────┐ │  │ ┌─────┐ │  │         │  │      │ │
│  │ │Task │ │  │ │Task │ │  │ │Task │ │  │ │Task │ │  │         │  └──────┘ │
│  │ │Card │ │  │ │Card │ │  │ │Card │ │  │ │Card │ │  │         │           │
│  │ └─────┘ │  │ └─────┘ │  │ └─────┘ │  │ └─────┘ │  │         │           │
│  │ ┌─────┐ │  │ ┌─────┐ │  │         │  │ ┌─────┐ │  │         │           │
│  │ │Task │ │  │ │Task │ │  │ [+ Add] │  │ │Task │ │  │         │           │
│  │ │Card │ │  │ │Card │ │  │         │  │ │Card │ │  │         │           │
│  │ └─────┘ │  │ └─────┘ │  │         │  │ └─────┘ │  │         │           │
│  │         │  │         │  │         │  │         │  │         │           │
│  │ [+ Add] │  │ [+ Add] │  │         │  │ [+ Add] │  │         │           │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘           │
│                                                                                │
│  ← Horizontal scroll for overflow columns →                                   │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

**Column Specifications**:
- Width: 300px fixed
- Background: surface with 5% opacity
- Header: Column name, task count, add button, menu
- Drag handle for reordering
- Max height with vertical scroll
- Drop zone highlighting on drag-over

**Task Card**:
```
┌──────────────────────────────────┐
│ [Priority Badge]          [⋮]   │
│                                  │
│ Task Title Here                 │
│ A brief description or label... │
│                                  │
│ [📅 Due] [👤 Assignee]           │
└──────────────────────────────────┘
```

**States**:
- Default: Subtle border, surface bg
- Hover: Elevated shadow, border glow
- Dragging: Rotation (3deg), scale(1.02), shadow-lg
- Drop target: Blue dashed border

### 5.5 Task Detail Modal

```
┌────────────────────────────────────────────────────────────────┐
│                                                    [×]        │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ [Priority Badge]  Board Name > Column Name               │ │
│  │                                                          │ │
│  │ # Task Title Here                                        │ │
│  │                                                          │ │
│  │ ┌────────────────────┐  ┌─────────────────────────────┐ │ │
│  │ │ Status             │  │ Description                  │ │ │
│  │ │ [In Progress ▼]   │  │                              │ │ │
│  │ │                    │  │ Add a more detailed...      │ │ │
│  │ │ Assignee           │  │                              │ │ │
│  │ │ [👤 Select...]     │  │                              │ │ │
│  │ │                    │  │                              │ │ │
│  │ │ Due Date           │  │                              │ │ │
│  │ │ [📅 Select date]   │  │                              │ │ │
│  │ │                    │  │                              │ │ │
│  │ │ Labels             │  │                              │ │ │
│  │ │ [+] Add label      │  │                              │ │ │
│  │ │                    │  │                              │ │ │
│  │ │ Attachments        │  │                              │ │ │
│  │ │ [+ Drop files]     │  │                              │ │ │
│  │ │                    │  │                              │ │ │
│  │ └────────────────────┘  └─────────────────────────────┘ │ │
│  │                                                          │ │
│  │ ─── Activity ────────────────────────────────────────── │ │
│  │ @Jane changed status to In Progress • 2h ago            │ │
│  │ @John added this task • 1d ago                           │ │
│  │                                                          │ │
│  │ [Add comment...]                                        │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 5.6 Create/Edit Modals

#### Create Workspace
```
┌─────────────────────────────────┐
│ Create Workspace         [×]  │
├─────────────────────────────────┤
│                                 │
│ Workspace Name                  │
│ [________________________]      │
│                                 │
│ Description (optional)          │
│ [________________________]      │
│ [________________________]      │
│                                 │
│ Icon                            │
│ [🚀] [💼] [🎨] [📚] [⚡] [+]    │
│                                 │
│ Color                           │
│ [●] [●] [●] [●] [●] [●] [+]    │
│                                 │
│         [Cancel] [Create]       │
│                                 │
└─────────────────────────────────┘
```

#### Create Board
```
┌─────────────────────────────────┐
│ Create Board              [×]  │
├─────────────────────────────────┤
│                                 │
│ Board Name                      │
│ [________________________]      │
│                                 │
│ Description (optional)          │
│ [________________________]      │
│                                 │
│ Board Color                     │
│ [●] [●] [●] [●] [●] [●] [+]    │
│                                 │
│ Initial Columns                 │
│ [Todo                  ] [×]   │
│ [In Progress          ] [×]   │
│ [Done                 ] [×]   │
│ [+ Add column]                  │
│                                 │
│         [Cancel] [Create]       │
│                                 │
└─────────────────────────────────┘
```

---

## 6. Interaction Patterns

### Drag & Drop (Kanban)
- **Library**: `@dnd-kit/core` + `@dnd-kit/sortable`
- **Column drag**: Horizontal reorder
- **Task drag**: Move between columns, reorder within
- **Visual feedback**:
  - Dragging: Card lifts, slight rotation, cursor: grabbing
  - Over column: Column highlights with dashed border
  - Drop: Smooth animation to new position

### Hover States
- Cards: translateY(-2px), shadow increase
- Buttons: Brightness increase
- Links: Underline or color shift
- Sidebar items: Background highlight

### Loading States
- Skeleton screens for content
- Button spinner for actions
- Progress bar for uploads
- Pulse animation for empty loads

### Empty States
- Centered illustration
- Clear headline
- Action button
- Helpful hint text

### Toast Notifications
- Bottom-right position
- Auto-dismiss (4s)
- Types: success (green), error (red), info (blue), warning (amber)
- Action buttons for undo

---

## 7. Responsive Strategy

### Breakpoints
```css
--screen-sm: 640px;   /* Mobile landscape */
--screen-md: 768px;   /* Tablet */
--screen-lg: 1024px;  /* Desktop */
--screen-xl: 1280px;  /* Large desktop */
```

### Layout Changes

**Desktop (≥1024px)**
- Full sidebar visible
- All columns visible
- Multi-column layouts

**Tablet (768-1023px)**
- Collapsible sidebar (hamburger)
- Horizontal scroll for columns
- Stacked layouts where needed

**Mobile (<768px)**
- Bottom navigation
- Full-screen views
- Single column focus
- Swipe gestures for actions

---

## 8. Accessibility

- **Focus visible**: Custom focus ring matching brand
- **ARIA labels**: All interactive elements
- **Keyboard navigation**: Full support (Tab, Enter, Escape, Arrows)
- **Color contrast**: WCAG AA minimum
- **Screen reader**: Proper heading hierarchy, alt text
- **Motion**: Respect `prefers-reduced-motion`

---

## 9. Technical Implementation

### Stack
- **Framework**: Next.js 16 (App Router)
- **Database**: MongoDB with Mongoose
- **Auth**: NextAuth.js with credentials + OAuth
- **Drag & Drop**: @dnd-kit
- **State**: Zustand for client state
- **Styling**: Tailwind CSS 4
- **Icons**: Phosphor Icons

### API Design

#### Auth
```
POST /api/auth/register    — Create account
POST /api/auth/login       — Sign in
POST /api/auth/logout      — Sign out
GET  /api/auth/me          — Get current user
```

#### Workspaces
```
GET    /api/workspaces              — List user's workspaces
POST   /api/workspaces              — Create workspace
GET    /api/workspaces/:id          — Get workspace
PUT    /api/workspaces/:id          — Update workspace
DELETE /api/workspaces/:id          — Delete workspace
POST   /api/workspaces/:id/members  — Add member
DELETE /api/workspaces/:id/members/:userId — Remove member
```

#### Boards
```
GET    /api/boards                  — List boards (query: workspaceId)
POST   /api/boards                  — Create board
GET    /api/boards/:id              — Get board with columns & tasks
PUT    /api/boards/:id              — Update board
DELETE /api/boards/:id              — Delete board
PUT    /api/boards/:id/columns      — Update column order
```

#### Columns
```
POST   /api/columns                 — Create column
PUT    /api/columns/:id             — Update column
DELETE /api/columns/:id             — Delete column
PUT    /api/columns/reorder         — Reorder columns
```

#### Tasks
```
GET    /api/tasks?columnId=         — List tasks by column
POST   /api/tasks                   — Create task
GET    /api/tasks/:id                — Get task details
PUT    /api/tasks/:id                — Update task
DELETE /api/tasks/:id                — Delete task
PUT    /api/tasks/:id/move           — Move task to column/position
```

### Data Models

```typescript
// User
{
  _id: ObjectId,
  name: string,
  email: string,
  password: string (hashed),
  avatar?: string,
  createdAt: Date,
  updatedAt: Date
}

// Workspace
{
  _id: ObjectId,
  name: string,
  description?: string,
  icon: string,
  color: string,
  owner: ObjectId (ref: User),
  members: ObjectId[] (ref: User),
  createdAt: Date,
  updatedAt: Date
}

// Board
{
  _id: ObjectId,
  name: string,
  description?: string,
  color: string,
  workspace: ObjectId (ref: Workspace),
  columns: ObjectId[] (ref: Column, ordered),
  createdAt: Date,
  updatedAt: Date
}

// Column
{
  _id: ObjectId,
  name: string,
  board: ObjectId (ref: Board),
  position: number,
  createdAt: Date,
  updatedAt: Date
}

// Task
{
  _id: ObjectId,
  title: string,
  description?: string,
  column: ObjectId (ref: Column),
  board: ObjectId (ref: Board),
  position: number,
  priority: 'low' | 'medium' | 'high',
  dueDate?: Date,
  assignee?: ObjectId (ref: User),
  labels: string[],
  attachments: { name, url, type }[],
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 10. File Structure

```
├── app/                          # Next.js App Router
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (app)/
│   │   ├── layout.tsx           # App shell with sidebar
│   │   ├── dashboard/page.tsx
│   │   ├── workspace/[id]/page.tsx
│   │   └── board/[id]/page.tsx
│   ├── api/                      # API Routes
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── workspaces/route.ts
│   │   ├── workspaces/[id]/route.ts
│   │   ├── boards/route.ts
│   │   ├── boards/[id]/route.ts
│   │   ├── columns/route.ts
│   │   ├── columns/[id]/route.ts
│   │   ├── tasks/route.ts
│   │   └── tasks/[id]/route.ts
│   ├── layout.tsx
│   ├── page.tsx                 # Landing page
│   └── globals.css
│
├── components/                   # React Components
│   ├── ui/                      # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Avatar.tsx
│   │   ├── Badge.tsx
│   │   ├── Dropdown.tsx
│   │   └── ...
│   ├── layout/                  # Layout components
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   └── AppShell.tsx
│   ├── board/                  # Board-specific
│   │   ├── Column.tsx
│   │   ├── TaskCard.tsx
│   │   ├── BoardHeader.tsx
│   │   └── TaskDetail.tsx
│   └── auth/                   # Auth components
│       ├── LoginForm.tsx
│       └── RegisterForm.tsx
│
├── lib/                         # Backend
│   ├── db/connection.ts
│   ├── models/                  # Mongoose models
│   ├── services/                # Business logic
│   ├── utils/                   # Helpers
│   └── types/                   # TypeScript types
│
├── stores/                      # Zustand stores
│   ├── authStore.ts
│   ├── workspaceStore.ts
│   ├── boardStore.ts
│   └── uiStore.ts
│
└── hooks/                       # Custom hooks
    ├── useAuth.ts
    ├── useWorkspaces.ts
    ├── useBoard.ts
    └── useDragAndDrop.ts
```

---

## 11. Design in Motion

### Micro-interactions

**Task Card Drag Start**
```css
transform: rotate(3deg) scale(1.02);
box-shadow: 0 20px 40px rgba(0,0,0,0.3);
transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
```

**Button Click**
```css
transform: scale(0.98);
transition: transform 0.1s ease;
```

**Modal Enter**
```css
opacity: 0 → 1;
transform: scale(0.95) → scale(1);
transition: all 0.2s ease-out;
```

**Toast Enter**
```css
transform: translateX(100%) → translateX(0);
transition: transform 0.3s ease-out;
```

### Page Transitions
- Fade + slide between routes
- Skeleton → content on load
- Staggered list animations

---

## 12. Implementation Priority

### Phase 1: Foundation
1. Design tokens + CSS setup
2. Base UI components
3. Authentication (login/register)
4. App shell (sidebar, topbar)

### Phase 2: Core Features
5. Workspaces CRUD
6. Boards CRUD
7. Columns CRUD
8. Tasks CRUD
9. Drag & drop

### Phase 3: Polish
10. Task detail modal
11. Activity feed
12. Empty states
13. Loading states
14. Responsive refinements

### Phase 4: Collaboration
15. Invite members
16. Real-time updates (optional for MVP)
17. Comments (optional for MVP)
