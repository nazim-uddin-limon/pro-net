# ProNet — Professional Networking App
### Full Production Blueprint: Next.js + Node.js

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Tech Stack](#3-tech-stack)
4. [Database Design](#4-database-design)
5. [Backend — API & Auth](#5-backend--api--auth)
6. [Frontend — UI/UX](#6-frontend--uiux)
7. [DevOps & Deployment](#7-devops--deployment)
8. [Security Checklist](#8-security-checklist)
9. [Scalability Roadmap](#9-scalability-roadmap)
10. [Development Timeline](#10-development-timeline)

---

## 1. Project Overview

**ProNet** is a professional networking platform with:
- User profiles (work history, skills, education, avatar)
- Connection system (1st / 2nd / 3rd degree)
- Activity feed (posts, articles, likes, comments)
- Real-time messaging (DMs)
- Job board (post & apply for jobs)
- Notifications (in-app + email)
- Search (people, companies, jobs)
- Company pages

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│              Next.js 14 (App Router + SSR/ISR)              │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
┌────────────────────────▼────────────────────────────────────┐
│                      API GATEWAY                            │
│             Next.js API Routes / Node.js Express            │
│               (Rate limiting, Auth middleware)              │
└──────┬─────────────────┬──────────────────┬─────────────────┘
       │                 │                  │
┌──────▼──────┐  ┌───────▼───────┐  ┌──────▼──────┐
│  PostgreSQL │  │     Redis     │  │  AWS S3 /   │
│  (Primary   │  │  (Cache,      │  │  Cloudinary │
│   DB)       │  │   Sessions,   │  │  (Media)    │
│             │  │   Pub/Sub)    │  │             │
└─────────────┘  └───────────────┘  └─────────────┘
                         │
                 ┌───────▼───────┐
                 │  WebSockets   │
                 │  (Socket.io)  │
                 │  Real-time DM │
                 └───────────────┘
```

### Architectural Decisions

| Concern | Decision | Reason |
|---|---|---|
| Rendering | SSR + ISR | SEO for profiles/jobs, fast TTFB |
| API style | REST (+ WebSocket for chat) | Simplicity, wide tooling support |
| Auth | JWT + Refresh Tokens | Stateless, scalable |
| OAuth | Google, GitHub | Reduce friction at signup |
| Cache | Redis | Feed caching, session store, pub/sub |
| Media | AWS S3 + CloudFront CDN | Scalable, cheap, fast delivery |
| Search | PostgreSQL full-text → Elasticsearch (later) | Start simple, scale when needed |

---

## 3. Tech Stack

### Frontend
| Tool | Version | Purpose |
|---|---|---|
| Next.js | 14+ | Framework (App Router, SSR, ISR) |
| TypeScript | 5+ | Type safety |
| Tailwind CSS | 3+ | Styling |
| shadcn/ui | latest | Component library |
| Zustand | 4+ | Global state |
| React Query (TanStack) | 5+ | Server state, caching, mutations |
| Socket.io-client | 4+ | Real-time messaging |
| React Hook Form + Zod | latest | Form handling & validation |
| next-auth | 5+ | Authentication |

### Backend
| Tool | Version | Purpose |
|---|---|---|
| Node.js | 20 LTS | Runtime |
| Express.js | 4+ | API server (separate service) |
| Prisma ORM | 5+ | Database access layer |
| PostgreSQL | 15+ | Primary database |
| Redis | 7+ | Cache + pub/sub |
| Socket.io | 4+ | WebSocket server |
| BullMQ | latest | Job queues (emails, notifications) |
| Nodemailer | latest | Transactional emails |
| AWS SDK v3 | latest | S3 file uploads |
| Zod | latest | API input validation |
| Winston | latest | Logging |

### DevOps
| Tool | Purpose |
|---|---|
| Docker + Docker Compose | Containerization |
| GitHub Actions | CI/CD pipeline |
| Vercel | Next.js frontend hosting |
| Railway / Render | Node.js API hosting |
| Neon / Supabase | Managed PostgreSQL |
| Upstash | Managed Redis |
| AWS S3 + CloudFront | Media storage & CDN |
| Sentry | Error monitoring |
| PostHog | Analytics |

---

## 4. Database Design

### Core Tables (PostgreSQL via Prisma)

```prisma
// schema.prisma

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  passwordHash  String?
  name          String
  headline      String?
  bio           String?
  avatarUrl     String?
  bannerUrl     String?
  location      String?
  website       String?
  openToWork    Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  experiences     Experience[]
  educations      Education[]
  skills          UserSkill[]
  posts           Post[]
  comments        Comment[]
  likes           Like[]
  sentConnections     Connection[] @relation("Sender")
  receivedConnections Connection[] @relation("Receiver")
  sentMessages    Message[]    @relation("Sender")
  receivedMessages Message[]   @relation("Receiver")
  notifications   Notification[]
  jobApplications JobApplication[]
  accounts        Account[]    // OAuth accounts
}

model Experience {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  title       String
  company     String
  companyId   String?
  location    String?
  startDate   DateTime
  endDate     DateTime?
  current     Boolean   @default(false)
  description String?
}

model Education {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  school      String
  degree      String?
  field       String?
  startYear   Int
  endYear     Int?
  description String?
}

model Skill {
  id    String      @id @default(cuid())
  name  String      @unique
  users UserSkill[]
}

model UserSkill {
  userId  String
  skillId String
  user    User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  skill   Skill  @relation(fields: [skillId], references: [id])
  @@id([userId, skillId])
}

model Connection {
  id         String           @id @default(cuid())
  senderId   String
  receiverId String
  status     ConnectionStatus @default(PENDING)
  createdAt  DateTime         @default(now())
  updatedAt  DateTime         @updatedAt
  sender     User             @relation("Sender", fields: [senderId], references: [id])
  receiver   User             @relation("Receiver", fields: [receiverId], references: [id])
  @@unique([senderId, receiverId])
}

enum ConnectionStatus { PENDING ACCEPTED REJECTED BLOCKED }

model Post {
  id         String    @id @default(cuid())
  authorId   String
  author     User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  content    String
  mediaUrls  String[]
  visibility PostVisibility @default(PUBLIC)
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
  comments   Comment[]
  likes      Like[]
}

enum PostVisibility { PUBLIC CONNECTIONS_ONLY }

model Comment {
  id        String   @id @default(cuid())
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  content   String
  createdAt DateTime @default(now())
  likes     Like[]
}

model Like {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  postId    String?
  post      Post?    @relation(fields: [postId], references: [id])
  commentId String?
  comment   Comment? @relation(fields: [commentId], references: [id])
  createdAt DateTime @default(now())
  @@unique([userId, postId])
  @@unique([userId, commentId])
}

model Conversation {
  id           String    @id @default(cuid())
  participants ConversationParticipant[]
  messages     Message[]
  lastMessageAt DateTime?
  createdAt    DateTime  @default(now())
}

model ConversationParticipant {
  conversationId String
  userId         String
  conversation   Conversation @relation(fields: [conversationId], references: [id])
  user           User         @relation(fields: [userId], references: [id])
  @@id([conversationId, userId])
}

model Message {
  id             String       @id @default(cuid())
  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id])
  senderId       String
  sender         User         @relation("Sender", fields: [senderId], references: [id])
  content        String
  read           Boolean      @default(false)
  createdAt      DateTime     @default(now())
}

model Notification {
  id        String           @id @default(cuid())
  userId    String
  user      User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  type      NotificationType
  message   String
  read      Boolean          @default(false)
  link      String?
  createdAt DateTime         @default(now())
}

enum NotificationType {
  CONNECTION_REQUEST CONNECTION_ACCEPTED
  POST_LIKE POST_COMMENT COMMENT_LIKE
  NEW_MESSAGE JOB_APPLICATION
}

model Company {
  id          String   @id @default(cuid())
  name        String
  description String?
  logoUrl     String?
  website     String?
  industry    String?
  size        String?
  location    String?
  createdAt   DateTime @default(now())
  jobs        Job[]
}

model Job {
  id           String    @id @default(cuid())
  companyId    String
  company      Company   @relation(fields: [companyId], references: [id])
  title        String
  description  String
  location     String?
  remote       Boolean   @default(false)
  type         JobType
  salary       String?
  skills       String[]
  closingDate  DateTime?
  createdAt    DateTime  @default(now())
  applications JobApplication[]
}

enum JobType { FULL_TIME PART_TIME CONTRACT INTERNSHIP }

model JobApplication {
  id        String   @id @default(cuid())
  jobId     String
  job       Job      @relation(fields: [jobId], references: [id])
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  resumeUrl String?
  coverLetter String?
  status    ApplicationStatus @default(APPLIED)
  appliedAt DateTime @default(now())
  @@unique([jobId, userId])
}

enum ApplicationStatus { APPLIED REVIEWED SHORTLISTED REJECTED HIRED }

model Account {
  id                String  @id @default(cuid())
  userId            String
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  provider          String
  providerAccountId String
  access_token      String?
  refresh_token     String?
  @@unique([provider, providerAccountId])
}
```

---

## 5. Backend — API & Auth

### Project Structure (Node.js API)

```
api/
├── src/
│   ├── config/
│   │   ├── database.ts       # Prisma client
│   │   ├── redis.ts          # Redis client
│   │   └── env.ts            # Env validation (Zod)
│   ├── middleware/
│   │   ├── auth.ts           # JWT verify middleware
│   │   ├── rateLimit.ts      # Rate limiting
│   │   ├── upload.ts         # Multer + S3
│   │   └── errorHandler.ts   # Global error handler
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.controller.ts
│   │   │   └── auth.service.ts
│   │   ├── users/
│   │   ├── posts/
│   │   ├── connections/
│   │   ├── messages/
│   │   ├── notifications/
│   │   ├── jobs/
│   │   └── search/
│   ├── queues/
│   │   ├── emailQueue.ts     # BullMQ email jobs
│   │   └── notifQueue.ts     # BullMQ notification jobs
│   ├── sockets/
│   │   └── chat.ts           # Socket.io handlers
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── password.ts       # bcrypt helpers
│   │   └── logger.ts         # Winston
│   └── app.ts                # Express app
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── Dockerfile
└── package.json
```

### Authentication Flow

```
1. REGISTER
   POST /api/auth/register
   → Validate input (Zod)
   → Hash password (bcrypt, 12 rounds)
   → Create user in DB
   → Send verification email (BullMQ queue)
   → Return { accessToken, refreshToken }

2. LOGIN
   POST /api/auth/login
   → Validate credentials
   → Issue accessToken (15min) + refreshToken (7d, httpOnly cookie)
   → Store refreshToken hash in Redis

3. REFRESH
   POST /api/auth/refresh
   → Read httpOnly cookie
   → Verify against Redis hash
   → Issue new accessToken

4. OAUTH (Google / GitHub)
   GET /api/auth/google → Redirect to Google
   GET /api/auth/google/callback → Handle callback
   → Upsert user, issue tokens

5. LOGOUT
   POST /api/auth/logout
   → Delete refreshToken from Redis
   → Clear httpOnly cookie
```

### Key API Endpoints

```
AUTH
  POST   /api/auth/register
  POST   /api/auth/login
  POST   /api/auth/logout
  POST   /api/auth/refresh
  GET    /api/auth/google
  GET    /api/auth/github
  POST   /api/auth/verify-email
  POST   /api/auth/forgot-password
  POST   /api/auth/reset-password

USERS
  GET    /api/users/:id               # Public profile
  PATCH  /api/users/me                # Update own profile
  POST   /api/users/me/avatar         # Upload avatar
  POST   /api/users/me/experience     # Add experience
  PATCH  /api/users/me/experience/:id
  DELETE /api/users/me/experience/:id
  POST   /api/users/me/skills
  DELETE /api/users/me/skills/:skillId

CONNECTIONS
  GET    /api/connections             # My connections
  GET    /api/connections/requests    # Pending requests
  POST   /api/connections/:userId     # Send request
  PATCH  /api/connections/:id/accept
  PATCH  /api/connections/:id/reject
  DELETE /api/connections/:id

FEED & POSTS
  GET    /api/feed                    # Personalized feed (paginated)
  POST   /api/posts                   # Create post
  GET    /api/posts/:id
  PATCH  /api/posts/:id
  DELETE /api/posts/:id
  POST   /api/posts/:id/like
  DELETE /api/posts/:id/like
  POST   /api/posts/:id/comments
  DELETE /api/posts/:id/comments/:commentId

MESSAGES
  GET    /api/conversations           # My conversations
  POST   /api/conversations           # Start conversation
  GET    /api/conversations/:id/messages
  POST   /api/conversations/:id/messages

NOTIFICATIONS
  GET    /api/notifications
  PATCH  /api/notifications/read-all
  PATCH  /api/notifications/:id/read

JOBS
  GET    /api/jobs                    # Search/browse jobs
  POST   /api/jobs                    # Post a job (company admin)
  GET    /api/jobs/:id
  POST   /api/jobs/:id/apply
  GET    /api/jobs/:id/applications   # Company admin

SEARCH
  GET    /api/search?q=...&type=people|jobs|companies

COMPANIES
  POST   /api/companies
  GET    /api/companies/:id
  PATCH  /api/companies/:id
```

### Feed Algorithm (simplified)

```typescript
async function getFeed(userId: string, page: number) {
  // 1. Get user's connections
  const connectionIds = await getConnectionIds(userId);

  // 2. Fetch recent posts from connections + self (cached in Redis)
  const cacheKey = `feed:${userId}:${page}`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // 3. Query DB
  const posts = await prisma.post.findMany({
    where: {
      authorId: { in: [...connectionIds, userId] },
      visibility: 'PUBLIC',
    },
    include: { author: true, _count: { select: { likes: true, comments: true } } },
    orderBy: { createdAt: 'desc' },
    skip: page * 10,
    take: 10,
  });

  // 4. Cache for 2 minutes
  await redis.setEx(cacheKey, 120, JSON.stringify(posts));
  return posts;
}
```

---

## 6. Frontend — UI/UX

### Project Structure (Next.js)

```
app/
├── (auth)/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── layout.tsx              # Auth layout (no navbar)
├── (main)/
│   ├── layout.tsx              # Main layout (navbar, sidebar)
│   ├── feed/page.tsx           # Home feed
│   ├── profile/
│   │   └── [username]/page.tsx # Public profile (SSR)
│   ├── network/page.tsx        # My Network
│   ├── jobs/
│   │   ├── page.tsx            # Job listings
│   │   └── [id]/page.tsx       # Job detail
│   ├── messaging/
│   │   └── page.tsx            # Chat
│   ├── notifications/page.tsx
│   ├── search/page.tsx
│   └── settings/page.tsx
├── api/                        # Next.js API routes (BFF layer)
│   └── [...nextauth]/route.ts
components/
├── ui/                         # shadcn/ui primitives
├── layout/
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   └── RightPanel.tsx          # "People you may know"
├── feed/
│   ├── PostCard.tsx
│   ├── CreatePost.tsx
│   └── FeedList.tsx
├── profile/
│   ├── ProfileHeader.tsx
│   ├── ExperienceSection.tsx
│   ├── EducationSection.tsx
│   └── SkillsSection.tsx
├── messaging/
│   ├── ConversationList.tsx
│   ├── ChatWindow.tsx
│   └── MessageBubble.tsx
└── jobs/
    ├── JobCard.tsx
    └── JobFilters.tsx
lib/
├── api.ts                      # Axios instance + interceptors
├── hooks/
│   ├── useAuth.ts
│   ├── useFeed.ts
│   ├── useConnections.ts
│   └── useSocket.ts            # Socket.io hook
└── stores/
    ├── authStore.ts            # Zustand
    └── notifStore.ts
```

### Key Pages & Components

#### Feed Page
- Infinite scroll with React Query `useInfiniteQuery`
- Create Post widget (text + media upload)
- Post cards with like/comment/share
- Right sidebar: connection suggestions, trending

#### Profile Page (SSR)
- Fetched server-side → great SEO
- Connect / Message CTA button
- Sections: About, Experience, Education, Skills
- Inline editing for own profile

#### Messaging
- Left panel: conversation list
- Right panel: chat window
- Real-time via Socket.io
- Message read receipts

#### Jobs
- Filter by: location, remote, type, salary
- Apply modal: upload resume + cover letter
- Saved jobs bookmark

### Design System
- **Colors:** Blue primary (#0A66C2 LinkedIn-like), white bg, gray-50 cards
- **Typography:** Inter font, 14px base
- **Components:** All via shadcn/ui (Avatar, Card, Dialog, Sheet, Tooltip, Badge, Tabs)
- **Dark mode:** Supported via next-themes

---

## 7. DevOps & Deployment

### Docker Setup

```yaml
# docker-compose.yml (local dev)
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: pronet
      POSTGRES_USER: pronet
      POSTGRES_PASSWORD: secret
    ports: ["5432:5432"]
    volumes: [pgdata:/var/lib/postgresql/data]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  api:
    build: ./api
    environment:
      DATABASE_URL: postgresql://pronet:secret@postgres:5432/pronet
      REDIS_URL: redis://redis:6379
    ports: ["4000:4000"]
    depends_on: [postgres, redis]
    volumes: [./api:/app, /app/node_modules]

volumes:
  pgdata:
```

### CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run test
      - run: npm run lint

  deploy-api:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Railway
        run: railway up --service api
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel
        run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

### Production Infrastructure

```
┌─────────────────────────────────────────────┐
│              PRODUCTION STACK               │
│                                             │
│  Frontend: Vercel (Global Edge CDN)         │
│  API:      Railway (auto-scaling)           │
│  DB:       Neon PostgreSQL (serverless)     │
│  Redis:    Upstash Redis (serverless)       │
│  Media:    AWS S3 + CloudFront CDN          │
│  Email:    Resend / SendGrid                │
│  Monitor:  Sentry + PostHog                 │
│  Logs:     Railway logs / Axiom             │
└─────────────────────────────────────────────┘
```

### Environment Variables

```bash
# api/.env
DATABASE_URL=
REDIS_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=
AWS_REGION=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
RESEND_API_KEY=
SENTRY_DSN=
NODE_ENV=production
PORT=4000

# frontend/.env.local
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_SOCKET_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
NEXT_PUBLIC_POSTHOG_KEY=
```

---

## 8. Security Checklist

- [x] **Passwords:** bcrypt with 12 salt rounds
- [x] **JWT:** Short-lived access tokens (15 min), refresh tokens in httpOnly cookies
- [x] **CSRF:** SameSite=Strict cookies + CSRF tokens on mutations
- [x] **Rate limiting:** express-rate-limit (login: 5/min, API: 100/min)
- [x] **Input validation:** Zod on all API inputs
- [x] **SQL injection:** Prisma ORM (parameterized queries)
- [x] **XSS:** React auto-escapes, sanitize rich text with DOMPurify
- [x] **File uploads:** Validate MIME type + size (5MB limit), store in S3 (not server)
- [x] **CORS:** Restrict to known frontend origin
- [x] **Helmet.js:** Security headers (CSP, HSTS, X-Frame-Options)
- [x] **Secrets:** Never committed — environment variables only
- [x] **Email verification:** Required before full access
- [x] **Account enumeration:** Generic error on login failure
- [x] **Dependencies:** Automated Dependabot PRs

---

## 9. Scalability Roadmap

### Phase 1 (MVP — 0 to 10k users)
- Monolith API + Vercel + Railway + Neon + Upstash
- PostgreSQL full-text search
- Basic feed algorithm (chronological connections)

### Phase 2 (Growth — 10k to 100k users)
- Add Elasticsearch for people/job/company search
- Redis pub/sub → upgrade to dedicated Redis cluster
- CDN for static assets already in place
- Horizontal scaling of API via Railway

### Phase 3 (Scale — 100k+ users)
- Break monolith into microservices (messaging, notifications, feed)
- Kafka for event streaming between services
- Feed pre-computation for active users
- Read replicas for PostgreSQL
- Move to ECS / Kubernetes

---

## 10. Development Timeline

| Phase | Duration | Deliverables |
|---|---|---|
| **Phase 0: Setup** | 1 week | Repo, CI/CD, Docker, DB schema, env setup |
| **Phase 1: Auth** | 1 week | Register, login, OAuth, email verify |
| **Phase 2: Profiles** | 1.5 weeks | Profile CRUD, avatar upload, experience/education |
| **Phase 3: Connections** | 1 week | Connect, accept/reject, connection list |
| **Phase 4: Feed & Posts** | 2 weeks | Create posts, feed, likes, comments |
| **Phase 5: Messaging** | 1.5 weeks | Conversations, real-time DMs via Socket.io |
| **Phase 6: Jobs** | 1.5 weeks | Job board, post/apply, applications |
| **Phase 7: Notifications** | 1 week | In-app + email notifications, BullMQ |
| **Phase 8: Search** | 1 week | Full-text search (users, jobs, companies) |
| **Phase 9: Polish** | 1 week | UI polish, dark mode, performance audit |
| **Phase 10: Deploy** | 1 week | Production deploy, monitoring, load testing |
| **Total** | **~13 weeks** | Production-ready MVP |

---

## Next Steps — Where to Start

1. `git init pronet && cd pronet`
2. Scaffold Next.js: `npx create-next-app@latest frontend --typescript --tailwind --app`
3. Scaffold API: `mkdir api && npm init -y && npm i express prisma @prisma/client zod`
4. Run `npx prisma init` and paste the schema above
5. Start Docker: `docker compose up -d`
6. Run migrations: `npx prisma migrate dev --name init`
7. Build auth module first — everything else depends on it

---

*Generated for ProNet — Professional Networking Platform*
*Stack: Next.js 14 · Node.js · PostgreSQL · Redis · Socket.io · AWS S3*
