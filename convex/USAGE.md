# Система сохранения данных в Convex

Этот проект использует Convex для хранения проектов, шаблонов и прайс-листа дверного калькулятора DORREN.

## Структура данных

### 1. Проекты (Projects)
Хранят полные конфигурации проектов с дверями, клиентами и расчетами.

**Поля:**
- `name` - название проекта
- `customer` - имя клиента
- `manager` - менеджер проекта
- `comments` - комментарии
- `items` - массив конфигураций дверей
- `totalAmount` - общая сумма
- `createdAt`, `updatedAt` - временные метки

### 2. Шаблоны (Templates)
Сохраненные конфигурации дверей для быстрого повторного использования.

**Поля:**
- `name` - название шаблона
- `config` - конфигурация двери (тип, полотно, короб, опции и т.д.)
- `createdAt` - время создания

### 3. Черновики (Drafts)
Автосохранение текущего состояния конфигуратора.

**Поля:**
- `config` - текущее состояние конфигуратора
- `createdAt` - время создания

### 4. Продукты (Products) - НОВОЕ!
Прайс-лист всех доступных продуктов.

**Поля:**
- `id` - уникальный идентификатор (например, 'l1_ral_base')
- `name` - название продукта
- `price` - цена
- `category` - категория: 'leaf', 'frame', 'option', 'hardware', 'accessory'
- `description` - описание (опционально)
- `imageUrl` - URL изображения (опционально)
- `compatibleWith` - совместимость с типами дверей (опционально)
- `doorType` - тип двери для полотен и коробов: 'single', 'one_half', 'double' (опционально)
- `isActive` - активен ли продукт
- `createdAt`, `updatedAt` - временные метки

## Использование

### Импорт хуков

```typescript
import {
  useProjects,
  useTemplates,
  useDraft,
  useProducts,
  useProductsByCategory,
  useProductsByDoorType
} from './src/convexAdapter';
```

### Работа с проектами

```typescript
function MyComponent() {
  const { projects, isLoading, saveProject, deleteProject } = useProjects();

  const handleSave = async () => {
    const projectData = {
      name: "Проект 1",
      customer: "ООО Компания",
      manager: "Иван Иванов",
      comments: "Комментарий",
      items: [...],
      totalAmount: 150000
    };
    
    await saveProject(projectData);
  };

  return (
    <div>
      {isLoading ? <p>Загрузка...</p> : (
        <ul>
          {projects.map(project => (
            <li key={project._id}>{project.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### Работа с шаблонами

```typescript
function TemplatesComponent() {
  const { templates, saveTemplate, deleteTemplate, updateTemplate } = useTemplates();

  const handleSaveTemplate = async () => {
    const templateData = {
      name: "Стандартная дверь",
      config: {
        doorType: "single",
        leaf: {...},
        frame: {...},
        options: [],
        hardware: [],
        accessories: []
      }
    };
    
    await saveTemplate(templateData);
  };

  return <div>...</div>;
}
```

### Работа с продуктами (прайс-лист)

```typescript
function ProductsComponent() {
  const { products, activeProducts, isLoading, bulkUpsertProducts } = useProducts();

  // Импорт прайс-листа из data.ts
  const handleImport = async () => {
    const priceData = preparePriceDataForImport();
    await bulkUpsertProducts(priceData);
  };

  return (
    <div>
      <button onClick={handleImport}>Импортировать прайс-лист</button>
      <p>Всего продуктов: {products.length}</p>
      <p>Активных продуктов: {activeProducts.length}</p>
    </div>
  );
}
```

### Получение продуктов по категории

```typescript
function LeafsSelector() {
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

```typescript
function DoorTypeProducts() {
  const { products } = useProductsByDoorType('single');

  return (
    <div>
      {products.map(product => (
        <div key={product._id}>
          <h3>{product.name}</h3>
          <p>{product.price} ₽</p>
        </div>
      ))}
    </div>
  );
}
```

## Компонент импорта прайс-листа

Для первоначальной загрузки прайс-листа используйте компонент `PriceImporter`:

```typescript
import PriceImporter from './src/PriceImporter';

function AdminPanel() {
  return (
    <div>
      <h1>Панель администратора</h1>
      <PriceImporter />
    </div>
  );
}
```

Этот компонент:
- Показывает текущее количество продуктов в БД
- Позволяет импортировать все данные из `data.ts`
- Обновляет существующие продукты и добавляет новые
- Показывает результат импорта

## Функции Convex

### Проекты
- `saveProject` - сохранить проект
- `getProjects` - получить все проекты
- `deleteProject` - удалить проект

### Шаблоны
- `saveTemplate` - сохранить шаблон
- `getTemplates` - получить все шаблоны
- `deleteTemplate` - удалить шаблон
- `updateTemplate` - обновить название шаблона

### Черновики
- `saveDraft` - сохранить черновик (заменяет предыдущий)
- `getDraft` - получить текущий черновик
- `deleteDraft` - удалить черновик

### Продукты
- `upsertProduct` - добавить или обновить продукт
- `getProducts` - получить все продукты
- `getProductsByCategory` - получить продукты по категории
- `getProductsByDoorType` - получить продукты по типу двери
- `getActiveProducts` - получить только активные продукты
- `updateProductPrice` - обновить цену продукта
- `deleteProduct` - удалить продукт (жесткое удаление)
- `deactivateProduct` - деактивировать продукт (мягкое удаление)
- `bulkUpsertProducts` - массовое добавление/обновление продуктов

## Индексы

Для оптимизации запросов созданы следующие индексы:

### Projects
- `by_createdAt` - сортировка по дате создания

### Templates
- `by_createdAt` - сортировка по дате создания

### Drafts
- `by_createdAt` - сортировка по дате создания

### Products
- `by_id` - поиск по уникальному ID продукта
- `by_category` - фильтрация по категории
- `by_doorType` - фильтрация по типу двери
- `by_isActive` - фильтрация активных продуктов

## Миграция данных

Если у вас уже есть данные в localStorage, вы можете мигрировать их в Convex:

1. Используйте компонент `PriceImporter` для импорта прайс-листа
2. Для проектов и шаблонов создайте скрипт миграции, который:
   - Читает данные из localStorage
   - Вызывает соответствующие мутации Convex

## Примечания

- Все цены хранятся в рублях
- Продукты идентифицируются по полю `id` (не путать с `_id` от Convex)
- При импорте прайс-листа существующие продукты обновляются, новые добавляются
- Черновики автоматически заменяются при сохранении нового
- Используйте `isActive: false` для мягкого удаления продуктов вместо полного удаления
