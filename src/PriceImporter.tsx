// Компонент для импорта прайс-листа в Convex
import React, { useState } from 'react';
import { useProducts } from './convexAdapter';
import { preparePriceDataForImport } from './importPriceData';

export function PriceImporter() {
  const { bulkUpsertProducts, products } = useProducts();
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);

  const handleImport = async () => {
    setIsImporting(true);
    setImportResult(null);

    try {
      const priceData = preparePriceDataForImport();
      console.log(`Импорт ${priceData.length} продуктов...`);
      
      const result = await bulkUpsertProducts(priceData);
      
      setImportResult({
        success: true,
        message: `Успешно импортировано ${priceData.length} продуктов`,
        details: result,
      });
      
      console.log('Импорт завершен:', result);
    } catch (error) {
      console.error('Ошибка импорта:', error);
      setImportResult({
        success: false,
        message: 'Ошибка при импорте данных',
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '20px' }}>
      <h3>Импорт прайс-листа в Convex</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <p>Текущее количество продуктов в БД: <strong>{products.length}</strong></p>
      </div>

      <button
        onClick={handleImport}
        disabled={isImporting}
        style={{
          padding: '10px 20px',
          backgroundColor: isImporting ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isImporting ? 'not-allowed' : 'pointer',
          fontSize: '16px',
        }}
      >
        {isImporting ? 'Импорт...' : 'Импортировать прайс-лист'}
      </button>

      {importResult && (
        <div
          style={{
            marginTop: '15px',
            padding: '10px',
            borderRadius: '4px',
            backgroundColor: importResult.success ? '#d4edda' : '#f8d7da',
            color: importResult.success ? '#155724' : '#721c24',
          }}
        >
          <p><strong>{importResult.message}</strong></p>
          {importResult.details && (
            <details>
              <summary>Детали импорта</summary>
              <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                {JSON.stringify(importResult.details, null, 2)}
              </pre>
            </details>
          )}
          {importResult.error && (
            <p style={{ fontSize: '12px', marginTop: '5px' }}>
              Ошибка: {importResult.error}
            </p>
          )}
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p><strong>Примечание:</strong></p>
        <ul>
          <li>Импорт обновит существующие продукты и добавит новые</li>
          <li>Продукты идентифицируются по полю <code>id</code></li>
          <li>Все продукты будут помечены как активные</li>
        </ul>
      </div>
    </div>
  );
}

export default PriceImporter;
