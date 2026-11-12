# Kanban Board (TaskFlow)

Full-stack приложение для управления проектами и задачами с Kanban-доской: аутентификация на JWT (access + refresh), ролевая модель, drag-and-drop между колонками.

**Демо:** https://auth-nestjs-eta.vercel.app
Демо-аккаунт: `demo@example.com` / `<пароль>`
> Бэкенд использует serverless-базу (Neon), поэтому первый запрос после простоя может занять несколько секунд.

![Kanban board](./docs/board.png)
<!-- TODO: добавить скриншот или GIF с drag-and-drop в docs/ -->

## Возможности

- Регистрация и вход, JWT access-токен + refresh-токен
- Refresh-токен хранится в БД только в виде bcrypt-хэша, при logout отзывается
- Ролевая модель доступа (RBAC): `USER` / `ADMIN`
- Проекты и задачи: пользователь видит и меняет только свои данные
  (чужой ресурс возвращает 404, а не 403)
- Kanban-доска со статусами `TODO` / `IN_PROGRESS` / `DONE`
- Drag-and-drop карточек между колонками
- Защищённые маршруты, общий layout с сайдбаром, breadcrumbs с названием проекта
- Серверное состояние на TanStack Query: кэш и автообновление списков после мутаций

## Стек

| Слой | Технологии |
| --- | --- |
| Frontend | Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, React Hook Form + Zod, TanStack Query, @dnd-kit |
| Backend | NestJS, Prisma ORM, PostgreSQL (Neon), Passport JWT, bcrypt, class-validator |
| Деплой | Vercel (монорепозиторий: сервисы `backend` и `frontend`) |

## Структура репозитория

```
.
├── backend/        # NestJS REST API
├── frontend/       # Next.js приложение (Feature-Sliced Design)
├── vercel.json     # описание сервисов и rewrites для деплоя
└── README.md
```

## Backend

### Архитектура

```
Controller → Service → PrismaService → PostgreSQL
```

Модули: `auth`, `users`, `projects`, `tasks`, `prisma` (глобальный), `common`.

- `AuthModule` отвечает за регистрацию, вход, выпуск и обновление токенов
- `JwtStrategy` (passport-jwt) + `JwtAuthGuard` защищают маршруты
- `@Roles()` + `RolesGuard` реализуют RBAC
- `@CurrentUser()` достаёт пользователя из запроса
- `TasksService` перед любой операцией проверяет владение проектом через `ProjectsService`
- `ownerId` всегда берётся из токена, а не из тела запроса

### API

| Метод | Путь | Описание | Доступ |
| --- | --- | --- | --- |
| POST | `/auth/register` | Регистрация | публичный |
| POST | `/auth/login` | Вход, возвращает `access_token` и `refresh_token` | публичный |
| POST | `/auth/refresh` | Новый access-токен по refresh-токену | публичный |
| POST | `/auth/logout` | Отзыв refresh-токена | JWT |
| GET | `/auth/me` | Текущий пользователь | JWT |
| GET | `/auth/admin` | Пример маршрута только для `ADMIN` | JWT + роль |
| GET / POST | `/projects` | Список и создание проектов | JWT |
| GET / PATCH / DELETE | `/projects/:id` | Один проект | JWT, владелец |
| GET / POST | `/projects/:projectId/tasks` | Список и создание задач проекта | JWT, владелец |
| GET / PATCH / DELETE | `/projects/:projectId/tasks/:id` | Одна задача | JWT, владелец |

<!-- TODO: проверить HTTP-методы update (PATCH или PUT) и пути в контроллерах -->

## Frontend

Фронтенд построен по методологии **Feature-Sliced Design (FSD)**: код разделён на слои, и каждый слой импортирует только из нижележащих.

```
app → pages → widgets → features → entities → shared
```

<!-- TODO: заменить дерево ниже реальным выводом `tree` по frontend/src и убрать лишние слои -->

```
frontend/
├── app/                  # маршруты Next.js (App Router), providers
│   ├── (dashboard)/      # общий layout: сайдбар + header
│   │   ├── kanban-board/
│   │   └── projects/[id]/
│   └── auth/             # login, register
├── features/             # пользовательские сценарии
│   ├── auth/             # вход, регистрация
│   ├── projects/         # создание и список проектов
│   └── tasks/            # создание, смена статуса, drag-and-drop
│       ├── api/
│       ├── hooks/
│       ├── schema/       # Zod-схемы
│       └── ui/
└── shared/               # переиспользуемый код без бизнес-логики
    ├── api/              # ApiClient: auth-заголовок, JSON, ошибки сервера
    ├── ui/               # Sidebar, Header, ProtectedRoute, shadcn/ui
    └── lib/
```

Ключевые решения:

- **Слой данных:** запросы через единый `ApiClient<T>` (типизированный, добавляет `Authorization: Bearer`, пробрасывает сообщение ошибки сервера); кэш и инвалидация в TanStack Query (`['projects']`, `['tasks', projectId]`)
- **Формы:** React Hook Form + Zod, схемы только для пользовательского ввода
- **Доска:** задачи группируются по статусам в `useTask`, `TaskColumn` остаётся презентационным компонентом; `@dnd-kit` обновляет статус при `onDragEnd`
- **Защита маршрутов:** компонент `ProtectedRoute` перенаправляет на `/auth/login` без токена

## Запуск локально

Требуется Node.js и PostgreSQL (локальный или Neon).

```bash
git clone https://github.com/krims31/Kanban-Board.git
cd Kanban-Board
```

### Backend (порт 3000)

```bash
cd backend
npm install
```

Создай `backend/.env`:

```env
DATABASE_URL=            # pooled-строка подключения
DIRECT_URL=              # прямая (unpooled) строка для Prisma CLI
JWT_SECRET=              # секрет access-токена
JWT_REFRESH_SECRET=      # секрет refresh-токена
```

<!-- TODO: проверить точные названия переменных и команды миграций -->

```bash
npx prisma generate
npm run start:dev
```

### Frontend (порт 3001)

```bash
cd frontend
npm install
```

Создай `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

<!-- TODO: проверить имя переменной адреса API -->

```bash
npm run dev -- -p 3001
```

Открой http://localhost:3001

## Деплой

Монорепозиторий деплоится на Vercel как два сервиса (Vercel Services), конфигурация в `vercel.json`:

- `backend` — NestJS (директория `backend`)
- `frontend` — Next.js (директория `frontend`) с переменной `BACKEND_URL`
- запросы `/api/*` перенаправляются на бэкенд, остальные на фронтенд

## Планы

- [ ] Тесты (unit и e2e) для auth и проверки владения данными
- [ ] Swagger-документация API
- [ ] Диалог создания, редактирование и удаление задач из интерфейса
- [ ] Порядок задач внутри колонки
- [ ] GitHub Actions: lint и build
- [ ] Токены в httpOnly-cookie вместо localStorage
