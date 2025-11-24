// Простой компонент для тестирования сохранения в Convex
import React, { useState } from 'react';
import { useProjects, useTemplates, useDraft } from './src/convexAdapter';

export function ConvexTest() {
  const { projects, isLoading, saveProject } = useProjects();
  const { templates } = useTemplates();
  const { draft } = useDraft();

  const [formData, setFormData] = useState({
    name: 'Тестовый проект',
    customer: 'Тестовый клиент',
    manager: 'Тестовый менеджер',
    comments: 'Тестовый комментарий',
    totalAmount: 100000
  });

  const handleSave = async () => {
    try {
      await saveProject(formData);
      alert('Проект сохранен в Convex!');
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Ошибка при сохранении: ' + (error as Error).message);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '20px', 
      right: '20px', 
      backgroundColor: '#1a1a1a', 
      border: '1px solid #333',
      borderRadius: '8px',
      padding: '20px',
      color: 'white',
      maxWidth: '400px',
      zIndex: 1000
    }}>
      <h3 style={{ color: '#64b5f6', marginBottom: '15px' }}>Convex Test Panel</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <p><strong>Статус загрузки:</strong> {isLoading ? 'Загрузка...' : 'Готово'}</p>
        <p><strong>Проектов в БД:</strong> {projects.length}</p>
        <p><strong>Шаблонов:</strong> {templates.length}</p>
        <p><strong>Черновиков:</strong> {draft ? 1 : 0}</p>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ color: '#64b5f6', marginBottom: '10px' }}>Тест сохранения проекта</h4>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input 
            type="text" 
            placeholder="Название проекта"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            style={{ 
              backgroundColor: '#333', 
              color: 'white', 
              border: '1px solid #555',
              padding: '8px',
              borderRadius: '4px'
            }}
          />
          
          <input 
            type="text" 
            placeholder="Клиент"
            value={formData.customer}
            onChange={(e) => setFormData(prev => ({ ...prev, customer: e.target.value }))}
            style={{ 
              backgroundColor: '#333', 
              color: 'white', 
              border: '1px solid #555',
              padding: '8px',
              borderRadius: '4px'
            }}
          />
          
          <input 
            type="text" 
            placeholder="Менеджер"
            value={formData.manager}
            onChange={(e) => setFormData(prev => ({ ...prev, manager: e.target.value }))}
            style={{ 
              backgroundColor: '#333', 
              color: 'white', 
              border: '1px solid #555',
              padding: '8px',
              borderRadius: '4px'
            }}
          />

          <input 
            type="number" 
            placeholder="Сумма"
            value={formData.totalAmount}
            onChange={(e) => setFormData(prev => ({ ...prev, totalAmount: parseInt(e.target.value) || 0 }))}
            style={{ 
              backgroundColor: '#333', 
              color: 'white', 
              border: '1px solid #555',
              padding: '8px',
              borderRadius: '4px'
            }}
          />
        </div>
      </div>

      <button 
        onClick={handleSave}
        disabled={isLoading}
        style={{
          width: '100%',
          backgroundColor: isLoading ? '#555' : '#4caf50',
          color: 'white',
          border: 'none',
          padding: '10px',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer'
        }}
      >
        {isLoading ? 'Сохранение...' : 'Сохранить в Convex'}
      </button>

      <div style={{ marginTop: '15px', fontSize: '12px', color: '#888' }}>
        <p><strong>Проекты из Convex:</strong></p>
        {projects.map(project => (
          <div key={project._id} style={{ marginBottom: '5px', padding: '5px', backgroundColor: '#333', borderRadius: '4px' }}>
            <p>{project.name} - {project.totalAmount} ₽</p>
            <p style={{ fontSize: '10px', color: '#666' }}>{project.customer} | {project.manager}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ConvexTest;
