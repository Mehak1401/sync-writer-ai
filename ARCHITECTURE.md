# Architecture Diagrams

## System Overview

```mermaid
flowchart TB
    subgraph Frontend["Frontend (React + Vite)"]
        direction TB
        Pages["Pages (React Router)"]
        Components["Components"]
        Hooks["Custom Hooks"]
        QueryClient["TanStack Query Client"]

        subgraph PagesSub["/src/pages"]
            Index["Index.tsx"]
            Auth["Auth.tsx"]
            Editor["Editor.tsx"]
            Dashboard["Dashboard.tsx"]
        end

        subgraph ComponentsSub["/src/components"]
            EditorPane["EditorPane.tsx"]
            AICopilot["AICopilotPane.tsx"]
            VersionSidebar["VersionSidebar.tsx"]
            UIShared["UI Components (shadcn)"]
        end

        subgraph HooksSub["/src/hooks"]
            useAuth["useAuth.tsx"]
            usePapers["usePapers.ts"]
        end
    end

    subgraph Backend["Backend (Supabase)"]
        direction TB
        Auth2["Auth (GoTrue)"]
        DB["PostgreSQL Database"]
        RLS["Row Level Security"]

        subgraph Tables["Database Tables"]
            profiles["profiles"]
            user_roles["user_roles"]
            papers["papers"]
            paper_versions["paper_versions"]
            student_advisor["student_advisor"]
        end
    end

    Frontend <-->|"HTTP / WebSocket"| Backend
    HooksSub -->|"uses"| QueryClient
    QueryClient <-->|"Supabase Client"| DB
    useAuth -->|"auth state"| Auth2
```

## Component Hierarchy - Editor Page

```mermaid
flowchart TB
    Editor["Editor Page (/editor/:id)"]

    subgraph EditorLayout["Editor Layout"]
        Header["Header"]
        MainContent["Main Content Area"]

        subgraph HeaderContent["Header"]
            BackBtn["Back Button"]
            Title["Paper Title"]
            WordCount["Word Count / Versions"]
            SaveBtn["Save Version Button"]
        end

        subgraph MainArea["Three-Pane Layout"]
            VersionPanel["VersionSidebar (left)"]
            EditorPanel["EditorPane (center)"]
            AIPanel["AICopilotPane (right)"]
        end
    end

    Editor --> Header
    Editor --> MainContent
    MainContent --> VersionPanel
    MainContent --> EditorPanel
    MainContent --> AIPanel
```

## Authentication & Role System

```mermaid
flowchart LR
    subgraph AuthFlow["Authentication Flow"]
        direction TB
        Login["User Login"]
        Session["Supabase Session"]
        AuthProvider["AuthProvider Context"]

        Login --> Session
        Session --> AuthProvider
    end

    subgraph UserData["User Data Loading"]
        direction TB
        FetchProfile["Fetch Profile"]
        FetchRoles["Fetch Roles"]
        AuthContext["AuthContext State"]

        FetchProfile --> AuthContext
        FetchRoles --> AuthContext
    end

    subgraph Roles["Role System"]
        direction TB
        Student["student"]
        Advisor["advisor"]
        Director["director"]
    end

    AuthProvider --> UserData
    AuthContext --> Roles
```

## Data Flow - Paper Operations

```mermaid
sequenceDiagram
    actor User
    participant Component as React Component
    participant Hook as Custom Hook (usePapers)
    participant Query as TanStack Query
    participant Supabase as Supabase Client
    participant DB as PostgreSQL
    participant RLS as RLS Policies

    User->>Component: Create New Paper
    Component->>Hook: useCreatePaper()
    Hook->>Query: useMutation()
    Query->>Supabase: .from('papers').insert()
    Supabase->>DB: INSERT query
    DB->>RLS: Check policy: owner_id = auth.uid()
    RLS-->>DB: ALLOW
    DB-->>Supabase: Success
    Supabase-->>Query: Return data
    Query-->>Hook: onSuccess: invalidateQueries(['papers'])
    Hook-->>Component: Return result
    Component-->>User: UI Update

    Note over RLS: Students can only<br/>CRUD their own papers

    User->>Component: View Paper Versions
    Component->>Hook: usePaperVersions(paperId)
    Hook->>Query: useQuery()
    Query->>Supabase: .from('paper_versions').select()
    Supabase->>DB: SELECT query
    DB->>RLS: Check policy: paper_id IN (SELECT id FROM papers WHERE owner_id = auth.uid())
    RLS-->>DB: ALLOW
    DB-->>Supabase: Return versions
    Supabase-->>Query: Return data
    Query-->>Hook: Cache result
    Hook-->>Component: Return versions array
```

## Database Schema with Relationships

```mermaid
erDiagram
    auth_users ||--o| profiles : has
    auth_users ||--o{ user_roles : has
    auth_users ||--o{ papers : owns
    auth_users ||--o{ student_advisor : "is student"
    auth_users ||--o{ student_advisor : "is advisor"
    papers ||--o{ paper_versions : has

    profiles {
        uuid id PK
        uuid user_id FK "auth.users"
        string full_name
        string avatar_url
        timestamp created_at
        timestamp updated_at
    }

    user_roles {
        uuid id PK
        uuid user_id FK "auth.users"
        enum role "student|advisor|director"
    }

    papers {
        uuid id PK
        uuid owner_id FK "auth.users"
        string title
        text content
        integer word_count
        string status "draft|in-review|published"
        timestamp deadline
        string[] tags
        timestamp created_at
        timestamp updated_at
    }

    paper_versions {
        uuid id PK
        uuid paper_id FK "papers"
        integer version_number
        string label
        text content
        integer word_count
        text changes_summary
        timestamp created_at
    }

    student_advisor {
        uuid id PK
        uuid student_id FK "auth.users"
        uuid advisor_id FK "auth.users"
        timestamp created_at
    }
```

## Row Level Security (RLS) Policies

```mermaid
flowchart TD
    subgraph PapersTable["papers table"]
        P1["Students: owner_id = auth.uid()"]
        P2["Advisors: owner_id IN (SELECT student_id FROM student_advisor WHERE advisor_id = auth.uid())"]
        P3["Directors: has_role(auth.uid(), 'director')"]
    end

    subgraph VersionsTable["paper_versions table"]
        V1["Same as papers (via paper_id)"]
    end

    subgraph ProfilesTable["profiles table"]
        PR1["SELECT: authenticated"]
        PR2["UPDATE: user_id = auth.uid()"]
    end

    subgraph RolesTable["user_roles table"]
        R1["SELECT: user_id = auth.uid()"]
        R2["Directors: can view all"]
    end
```

## State Management Flow

```mermaid
flowchart TB
    subgraph GlobalState["Global State"]
        QueryClient["TanStack Query Client"]
        AuthContext["AuthContext (React Context)"]
    end

    subgraph LocalState["Local Component State"]
        useState["useState hooks"]
    end

    subgraph ServerState["Server State (Supabase)"]
        DB[("PostgreSQL")]
    end

    subgraph Cache["Query Cache"]
        papers["['papers', userId]"]
        versions["['paper_versions', paperId]"]
    end

    Components["React Components"] -->|"reads/writes"| LocalState
    Components -->|"uses"| QueryClient
    Components -->|"uses"| AuthContext
    QueryClient -->|"manages"| Cache
    QueryClient <-->|"fetches/updates"| DB
    AuthContext <-->|"auth operations"| DB
```

## Route Structure

```mermaid
flowchart LR
    subgraph Routes["React Router Routes"]
        direction TB
        Root[("/")]
        AuthRoute[("/auth")]
        EditorRoute[("/editor/:id")]
        NotFound[("*")]
    end

    subgraph Redirects["Root Route Logic"]
        CheckAuth{"Authenticated?"}
        ToAuth["Redirect to /auth"]
        ToDashboard["Show Dashboard"]
    end

    Root --> CheckAuth
    CheckAuth -->|No| ToAuth
    CheckAuth -->|Yes| ToDashboard
```

## Build & Deploy Pipeline

```mermaid
flowchart LR
    subgraph Development["Development"]
        Dev["bun run dev"]
        ViteDev["Vite Dev Server"]
        Port8080["Port 8080"]

        Dev --> ViteDev --> Port8080
    end

    subgraph Build["Production Build"]
        BuildCmd["bun run build"]
        ViteBuild["Vite Build"]
        Output["dist/"]

        BuildCmd --> ViteBuild --> Output
    end

    subgraph Test["Testing"]
        TestCmd["bun run test"]
        Vitest["Vitest"]
        JSDOM["jsdom environment"]

        TestCmd --> Vitest --> JSDOM
    end
```
