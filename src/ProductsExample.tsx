// Пример использования системы управления продуктами
import React, { useState } from 'react';
import { useProducts, useProductsByCategory } from './convexAdapter';

export function ProductsExample() {
  const { products, activeProducts, isLoading, updateProductPrice, deactivateProduct } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<'leaf' | 'frame' | 'option' | 'hardware' | 'accessory'>('leaf');
  const { products: categoryProducts } = useProductsByCategory(selectedCategory);

  if (isLoading) {
    return <div>Загрузка продуктов...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Управление продуктами</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Статистика</h3>
        <p>Всего продуктов: {products.length}</p>
        <p>Активных продуктов: {activeProducts.length}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Фильтр по категории</h3>
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value as any)}
          style={{ padding: '8px', fontSize: '14px' }}
        >
          <option value="leaf">Полотна</option>
          <option value="frame">Коробки</option>
          <option value="option">Опции</option>
          <option value="hardware">Фурнитура</option>
          <option value="accessory">Аксессуары</option>
        </select>
        <p>Найдено: {categoryProducts.length} продуктов</p>
      </div>

      <div>
        <h3>Продукты в категории "{selectedCategory}"</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>ID</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Название</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Цена</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Тип двери</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Статус</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {categoryProducts.map((product) => (
              <tr key={product._id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{product.id}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  {product.name}
                  {product.description && (
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                      {product.description}
                    </div>
                  )}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  {product.price.toLocaleString('ru-RU')} ₽
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  {product.doorType || '-'}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: product.isActive ? '#d4edda' : '#f8d7da',
                    color: product.isActive ? '#155724' : '#721c24',
                    fontSize: '12px'
                  }}>
                    {product.isActive ? 'Активен' : 'Неактивен'}
                  </span>
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <button
                    onClick={() => {
                      const newPrice = prompt('Новая цена:', product.price.toString());
                      if (newPrice) {
                        updateProductPrice(product.id, parseFloat(newPrice));
                      }
                    }}
                    style={{
                      padding: '4px 8px',
                      marginRight: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Изменить цену
                  </button>
                  {product.isActive && (
                    <button
                      onClick={() => {
                        if (confirm(`Деактивировать "${product.name}"?`)) {
                          deactivateProduct(product.id);
                        }
                      }}
                      style={{
                        padding: '4px 8px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px'
                      }}
                    >
                      Деактивировать
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductsExample;
