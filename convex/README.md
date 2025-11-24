# DORREN Door Calculator - Convex Integration

Этот проект интегрирован с Convex для облачного хранения данных.

## Структура данных

Convex схема включает следующие таблицы:

### 1. Projects (Проекты)
Хранение сохраненных проектов пользователей.
- `name`: название проекта
- `customer`: заказчик
- `manager`: менеджер
- `comments`: комментарии
- `items`: массив конфигураций дверей
- `totalAmount`: общая сумма проекта
- `createdAt`, `updatedAt`: временные метки

### 2. Templates (Шаблоны)
Хранение шаблонов конфигураций дверей.
- `name`: название шаблона
- `config`: конфигурация двери
- `createdAt`: время создания

### 3. Drafts (Черновики)
Хранение временных черновиков конфигураций.
- `config`: текущая конфигурация
- `createdAt`: время сохранения

## Использование

1. Запустите Dev сервер: `npx convex dev`
2. Создайте проект в Convex dashboard
3. Обновите CONVEX_URL в .env.local

## Файлы

- `convex/schema.ts`: схема данных
- `convex/functions.ts`: серверные функции
- `src/convexHooks.ts`: клиентские хуки
- `src/convexStorage.ts`: адаптер для совместимости
