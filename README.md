# Kanban Board

Full-stack приложение для управления проектами и задачами с Kanban-доской.

**Демо:** https://auth-nestjs-eta.vercel.app
Демо-аккаунт: `demo@example.com` / `********` (первая загрузка может быть медленной)

![Screenshot](./docs/board.png)

## Возможности
- Регистрация и вход, JWT access + refresh токены, logout с отзывом refresh-токена
- Роли USER / ADMIN (RBAC)
- Проекты и задачи: у каждого пользователя только свои данные
- Kanban-доска со статусами TODO / IN_PROGRESS / DONE
- Drag-and-drop между колонками

## Стек
**Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui,
React Hook Form + Zod, TanStack Query, @dnd-kit
**Backend:** NestJS, Prisma, PostgreSQL (Neon), Passport JWT, bcrypt
**Деплой:** Vercel (монорепозиторий: backend + frontend)

## Архитектура
Controller → Service → PrismaService → PostgreSQL.
Задачи проверяют владение проектом через ProjectsService перед любой операцией.
Frontend: feature-based структура (`features/<name>/{ui,hooks,api,schema}`).

## Запуск локально
...команды: установка, .env (DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET), запуск backend и frontend
