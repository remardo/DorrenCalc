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

### 4. Products (Продукты) - НОВОЕ!
Хранение прайс-листа всех доступных продуктов.
- `id`: уникальный идентификатор продукта
- `name`: название продукта
- `price`: цена в рублях
- `category`: категория (leaf, frame, option, hardware, accessory)
- `description`: описание (опционально)
- `imageUrl`: URL изображения (опционально)
- `compatibleWith`: совместимость с типами дверей (опционально)
- `doorType`: тип двери для полотен и коробов (опционально)
- `isActive`: активен ли продукт
- `createdAt`, `updatedAt`: временные метки

## Использование

1. Запустите Dev сервер: `npx convex dev`
2. Создайте проект в Convex dashboard
3. Обновите CONVEX_URL в .env.local

## Импорт прайс-листа

Для первоначальной загрузки прайс-листа в Convex:

1. Используйте компонент `PriceImporter` в вашем приложении
2. Или вызовите функцию `bulkUpsertProducts` напрямую:

```typescript
import { useProducts } from './src/convexAdapter';
import { preparePriceDataForImport } from './src/importPriceData';

const { bulkUpsertProducts } = useProducts();
const priceData = preparePriceDataForImport();
await bulkUpsertProducts(priceData);
```

## Файлы

- `convex/schema.ts`: схема данных
- `convex/functions.ts`: серверные функции (queries и mutations)
- `convex/USAGE.md`: подробная документация по использованию
- `src/hooks.ts`: базовые хуки Convex
- `src/convexHooks.ts`: дополнительные хуки
- `src/convexAdapter.ts`: удобные хуки с обработкой состояния загрузки
- `src/importPriceData.ts`: утилиты для импорта прайс-листа
- `src/PriceImporter.tsx`: компонент для импорта прайс-листа

## Доступные функции

### Проекты
- `saveProject` - сохранить проект
- `getProjects` - получить все проекты
- `deleteProject` - удалить проект

### Шаблоны
- `saveTemplate` - сохранить шаблон
- `getTemplates` - получить все шаблоны
- `deleteTemplate` - удалить шаблон
- `updateTemplate` - обновить шаблон

### Черновики
- `saveDraft` - сохранить черновик
- `getDraft` - получить черновик
- `deleteDraft` - удалить черновик

### Продукты (НОВОЕ!)
- `upsertProduct` - добавить/обновить продукт
- `getProducts` - получить все продукты
- `getProductsByCategory` - получить продукты по категории
- `getProductsByDoorType` - получить продукты по типу двери
- `getActiveProducts` - получить активные продукты
- `updateProductPrice` - обновить цену
- `deleteProduct` - удалить продукт
- `deactivateProduct` - деактивировать продукт
- `bulkUpsertProducts` - массовый импорт продуктов

Подробную документацию смотрите в [`USAGE.md`](./USAGE.md).
