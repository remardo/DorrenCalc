# Быстрый старт: Сохранение данных в Convex

## Шаг 1: Импорт прайс-листа

После настройки Convex, первым делом нужно импортировать прайс-лист в базу данных.

### Вариант А: Использование компонента PriceImporter

Добавьте компонент в ваше приложение (например, в админ-панель):

```tsx
import PriceImporter from './src/PriceImporter';

function App() {
  return (
    <div>
      <PriceImporter />
    </div>
  );
}
```

Нажмите кнопку "Импортировать прайс-лист" - это загрузит все данные из `data.ts` в Convex.

### Вариант Б: Программный импорт

```tsx
import { useProducts } from './src/convexAdapter';
import { preparePriceDataForImport } from './src/importPriceData';

function ImportButton() {
  const { bulkUpsertProducts } = useProducts();

  const handleImport = async () => {
    const priceData = preparePriceDataForImport();
    await bulkUpsertProducts(priceData);
    console.log('Импорт завершен!');
  };

  return <button onClick={handleImport}>Импортировать</button>;
}
```

## Шаг 2: Использование продуктов в приложении

### Получение всех продуктов

```tsx
import { useProducts } from './src/convexAdapter';

function ProductList() {
  const { products, isLoading } = useProducts();

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <ul>
      {products.map(product => (
        <li key={product._id}>
          {product.name} - {product.price} ₽
        </li>
      ))}
    </ul>
  );
}
```

### Получение продуктов по категории

```tsx
import { useProductsByCategory } from './src/convexAdapter';

function LeafSelector() {
  const { products, isLoading } = useProductsByCategory('leaf');

  return (
    <select>
      {products.map(product => (
        <option key={product._id} value={product.id}>
          {product.name} - {product.price} ₽
        </option>
      ))}
    </select>
  );
}
```

### Получение продуктов по типу двери

```tsx
import { useProductsByDoorType } from './src/convexAdapter';

function SingleDoorProducts() {
  const { products } = useProductsByDoorType('single');

  return (
    <div>
      <h3>Продукты для однопольных дверей</h3>
      {products.map(product => (
        <div key={product._id}>{product.name}</div>
      ))}
    </div>
  );
}
```

## Шаг 3: Сохранение проектов

```tsx
import { useProjects } from './src/convexAdapter';

function SaveProjectButton({ projectData }) {
  const { saveProject } = useProjects();

  const handleSave = async () => {
    await saveProject({
      name: "Проект 1",
      customer: "ООО Компания",
      manager: "Иван Иванов",
      comments: "Комментарий",
      items: projectData.items,
      totalAmount: projectData.totalAmount
    });
    alert('Проект сохранен!');
  };

  return <button onClick={handleSave}>Сохранить проект</button>;
}
```

## Шаг 4: Работа с шаблонами

```tsx
import { useTemplates } from './src/convexAdapter';

function TemplateManager() {
  const { templates, saveTemplate, deleteTemplate } = useTemplates();

  const handleSaveTemplate = async (config) => {
    await saveTemplate({
      name: "Стандартная дверь",
      config: config
    });
  };

  return (
    <div>
      <h3>Шаблоны</h3>
      {templates.map(template => (
        <div key={template._id}>
          <span>{template.name}</span>
          <button onClick={() => deleteTemplate(template._id)}>
            Удалить
          </button>
        </div>
      ))}
    </div>
  );
}
```

## Шаг 5: Обновление цен

```tsx
import { useProducts } from './src/convexAdapter';

function PriceEditor({ productId }) {
  const { updateProductPrice } = useProducts();

  const handleUpdatePrice = async (newPrice: number) => {
    await updateProductPrice(productId, newPrice);
    alert('Цена обновлена!');
  };

  return (
    <button onClick={() => {
      const price = prompt('Новая цена:');
      if (price) handleUpdatePrice(parseFloat(price));
    }}>
      Изменить цену
    </button>
  );
}
```

## Полезные компоненты

### Компонент для импорта
- `src/PriceImporter.tsx` - UI для импорта прайс-листа

### Пример использования
- `src/ProductsExample.tsx` - полный пример управления продуктами

## Структура данных

Все продукты имеют следующую структуру:

```typescript
{
  _id: Id<"products">,           // Convex ID
  id: string,                     // Уникальный ID продукта (например, 'l1_ral_base')
  name: string,                   // Название
  price: number,                  // Цена в рублях
  category: string,               // 'leaf' | 'frame' | 'option' | 'hardware' | 'accessory'
  description?: string,           // Описание
  imageUrl?: string,              // URL изображения
  compatibleWith?: string[],      // Совместимость с типами дверей
  doorType?: string,              // Тип двери (для полотен и коробов)
  isActive: boolean,              // Активен ли продукт
  createdAt: number,              // Время создания
  updatedAt: number               // Время обновления
}
```

## Следующие шаги

1. Импортируйте прайс-лист (Шаг 1)
2. Проверьте, что данные загрузились: откройте Convex Dashboard
3. Используйте хуки в вашем приложении для работы с данными
4. При необходимости обновляйте цены через `updateProductPrice`

Подробную документацию смотрите в [`convex/USAGE.md`](../convex/USAGE.md)
