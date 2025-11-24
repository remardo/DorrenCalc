# Changelog: Добавление сохранения прайс-листа в Convex

## Дата: 2025-11-24

## Что было сделано

### 1. Обновлена схема Convex (`convex/schema.ts`)

Добавлена новая таблица `products` для хранения прайс-листа:

```typescript
products: defineTable({
  id: v.string(),                    // Уникальный ID продукта
  name: v.string(),                  // Название
  price: v.number(),                 // Цена в рублях
  category: v.union(...),            // Категория продукта
  description: v.optional(v.string()), // Описание
  imageUrl: v.optional(v.string()),  // URL изображения
  compatibleWith: v.optional(v.array(v.string())), // Совместимость
  doorType: v.optional(v.string()),  // Тип двери
  isActive: v.boolean(),             // Активен ли продукт
  createdAt: v.number(),             // Время создания
  updatedAt: v.number(),             // Время обновления
})
```

**Индексы:**
- `by_id` - поиск по уникальному ID
- `by_category` - фильтрация по категории
- `by_doorType` - фильтрация по типу двери
- `by_isActive` - фильтрация активных продуктов

### 2. Добавлены функции Convex (`convex/functions.ts`)

**Queries (запросы):**
- `getProducts` - получить все продукты
- `getProductsByCategory` - получить продукты по категории
- `getProductsByDoorType` - получить продукты по типу двери
- `getActiveProducts` - получить только активные продукты

**Mutations (изменения):**
- `upsertProduct` - добавить или обновить продукт
- `updateProductPrice` - обновить цену продукта
- `deleteProduct` - удалить продукт (жесткое удаление)
- `deactivateProduct` - деактивировать продукт (мягкое удаление)
- `bulkUpsertProducts` - массовое добавление/обновление продуктов

### 3. Обновлены хуки (`src/hooks.ts`)

Добавлены новые хуки для работы с продуктами:
- `useUpsertProduct`
- `useGetProducts`
- `useGetProductsByCategory`
- `useGetProductsByDoorType`
- `useGetActiveProducts`
- `useUpdateProductPrice`
- `useDeleteProduct`
- `useDeactivateProduct`
- `useBulkUpsertProducts`

### 4. Обновлен адаптер (`src/convexAdapter.ts`)

Полностью переписан для упрощения использования. Добавлены новые функции:
- `useProducts()` - основной хук для работы с продуктами
- `useProductsByCategory(category)` - получение продуктов по категории
- `useProductsByDoorType(doorType)` - получение продуктов по типу двери

Все хуки теперь возвращают `isLoading` для отслеживания состояния загрузки.

### 5. Обновлены дополнительные хуки (`src/convexHooks.ts`)

Добавлена функция `useConvexProducts()` для работы с продуктами.

### 6. Создана утилита импорта (`src/importPriceData.ts`)

Функции для подготовки данных из `data.ts` к импорту в Convex:
- `preparePriceDataForImport()` - преобразует данные из data.ts в формат Convex
- `getLocalProductsByDoorType(doorType)` - получает продукты по типу двери из локальных данных
- `getAllLocalProducts()` - получает все продукты из локальных данных

### 7. Создан компонент импорта (`src/PriceImporter.tsx`)

React-компонент с UI для импорта прайс-листа в Convex:
- Показывает текущее количество продуктов в БД
- Кнопка для запуска импорта
- Отображение результата импорта
- Информация о процессе импорта

### 8. Создан пример использования (`src/ProductsExample.tsx`)

Полнофункциональный пример компонента для:
- Просмотра всех продуктов
- Фильтрации по категориям
- Обновления цен
- Деактивации продуктов
- Отображения статистики

### 9. Создана документация

**`convex/USAGE.md`** - подробная документация:
- Описание структуры данных
- Примеры использования всех хуков
- Примеры работы с проектами, шаблонами и продуктами
- Информация об индексах
- Инструкции по миграции данных

**`convex/README.md`** - обновлен:
- Добавлена информация о таблице products
- Список всех доступных функций
- Инструкции по импорту прайс-листа

**`QUICKSTART.md`** - руководство по быстрому старту:
- Пошаговая инструкция по импорту прайс-листа
- Примеры использования в коде
- Структура данных
- Следующие шаги

## Как использовать

### Шаг 1: Импорт прайс-листа

```tsx
import PriceImporter from './src/PriceImporter';

function App() {
  return <PriceImporter />;
}
```

### Шаг 2: Использование в приложении

```tsx
import { useProducts, useProductsByCategory } from './src/convexAdapter';

function MyComponent() {
  const { products, isLoading } = useProducts();
  const { products: leafs } = useProductsByCategory('leaf');
  
  // Используйте products и leafs в вашем компоненте
}
```

## Преимущества

1. **Централизованное хранение цен** - все цены в одном месте (Convex БД)
2. **Легкое обновление** - можно обновлять цены без изменения кода
3. **История изменений** - Convex автоматически отслеживает изменения
4. **Реактивность** - изменения цен автоматически отображаются во всех компонентах
5. **Масштабируемость** - легко добавлять новые продукты
6. **Мягкое удаление** - продукты можно деактивировать вместо удаления
7. **Фильтрация** - быстрый поиск по категориям и типам дверей

## Совместимость

Все изменения обратно совместимы с существующим кодом. Локальные данные из `data.ts` продолжают работать, но теперь их можно импортировать в Convex для централизованного управления.

## Следующие шаги

1. Запустите импорт прайс-листа через компонент `PriceImporter`
2. Проверьте данные в Convex Dashboard
3. Начните использовать хуки `useProducts` в вашем приложении
4. При необходимости обновляйте цены через `updateProductPrice`

## Файлы

### Изменены:
- `convex/schema.ts` - добавлена таблица products
- `convex/functions.ts` - добавлены функции для работы с продуктами
- `src/hooks.ts` - добавлены хуки для продуктов
- `src/convexAdapter.ts` - полностью переписан
- `src/convexHooks.ts` - добавлена функция useConvexProducts
- `convex/README.md` - обновлена документация

### Созданы:
- `src/importPriceData.ts` - утилиты для импорта
- `src/PriceImporter.tsx` - компонент импорта
- `src/ProductsExample.tsx` - пример использования
- `convex/USAGE.md` - подробная документация
- `QUICKSTART.md` - руководство по быстрому старту
- `CHANGELOG.md` - этот файл

## Проверка

Все изменения проверены:
- ✅ TypeScript компиляция без ошибок
- ✅ Схема Convex валидна
- ✅ Функции работают корректно
- ✅ Хуки типизированы
- ✅ Документация полная
