// Пример использования Convex для сохранения проектов и шаблонов
import React, { useState } from 'react';
import { useProjects, useTemplates, useDraft } from './convexAdapter';

export function ConvexExample() {
  // Подключаем Convex хуки
  const { projects, saveProject, deleteProject } = useProjects();
  const { templates, saveTemplate, deleteTemplate } = useTemplates();
  const { draft, saveDraft, deleteDraft } = useDraft();

  // Локальное состояние для формы
  const [projectForm, setProjectForm] = useState({
    name: '',
    customer: '',
    manager: '',
    comments: '',
    totalAmount: 0
  });

  const [templateForm, setTemplateForm] = useState({
    name: '',
    config: {
      doorType: 'single',
      leaf: null,
      frame: null,
      options: [],
      hardware: [],
      accessories: []
    }
  });

  // Обработчик сохранения проекта
  const handleSaveProject = async () => {
    if (!projectForm.name.trim()) {
      alert('Введите название проекта');
      return;
    }

    try {
      await saveProject({
        ...projectForm,
        items: [], // Здесь должны быть элементы проекта
        totalAmount: Number(projectForm.totalAmount) || 0
      });
      
      setProjectForm({
        name: '',
        customer: '',
        manager: '',
        comments: '',
        totalAmount: 0
      });
      
      alert('Проект успешно сохранен в Convex!');
    } catch (error) {
      console.error('Ошибка сохранения проекта:', error);
      alert('Ошибка при сохранении проекта');
    }
  };

  // Обработчик сохранения шаблона
  const handleSaveTemplate = async () => {
    if (!templateForm.name.trim()) {
      alert('Введите название шаблона');
      return;
    }

    try {
      await saveTemplate(templateForm);
      
      setTemplateForm({
        name: '',
        config: {
          doorType: 'single',
          leaf: null,
          frame: null,
          options: [],
          hardware: [],
          accessories: []
        }
      });
      
      alert('Шаблон успешно сохранен в Convex!');
    } catch (error) {
      console.error('Ошибка сохранения шаблона:', error);
      alert('Ошибка при сохранении шаблона');
    }
  };

  // Обработчик сохранения черновика
  const handleSaveDraft = async () => {
    try {
      await saveDraft({
        activeTab: 'single',
        selectedLeaf: null,
        selectedFrame: null,
        selectedOptions: [],
        selectedHardware: [],
        selectedAccessories: [],
        configQuantity: 1,
        configDiscountValue: '',
        configDiscountType: 'percent'
      });
      
      alert('Черновик сохранен в Convex!');
    } catch (error) {
      console.error('Ошибка сохранения черновика:', error);
      alert('Ошибка при сохранении черновика');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Convex Integration Demo</h1>
      
      {/* Статистика */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded">
          <h3 className="font-semibold">Проекты в БД</h3>
          <p className="text-2xl">{projects?.length || 0}</p>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <h3 className="font-semibold">Шаблоны в БД</h3>
          <p className="text-2xl">{templates?.length || 0}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded">
          <h3 className="font-semibold">Черновик</h3>
          <p className="text-2xl">{draft ? 'Есть' : 'Нет'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Форма сохранения проекта */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Сохранить проект</h2>
          
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Название проекта"
              value={projectForm.name}
              onChange={(e) => setProjectForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border rounded"
            />
            
            <input
              type="text"
              placeholder="Клиент"
              value={projectForm.customer}
              onChange={(e) => setProjectForm(prev => ({ ...prev, customer: e.target.value }))}
              className="w-full p-2 border rounded"
            />
            
            <input
              type="text"
              placeholder="Менеджер"
              value={projectForm.manager}
              onChange={(e) => setProjectForm(prev => ({ ...prev, manager: e.target.value }))}
              className="w-full p-2 border rounded"
            />
            
            <textarea
              placeholder="Комментарии"
              value={projectForm.comments}
              onChange={(e) => setProjectForm(prev => ({ ...prev, comments: e.target.value }))}
              className="w-full p-2 border rounded h-20 resize-none"
            />
            
            <input
              type="number"
              placeholder="Сумма"
              value={projectForm.totalAmount}
              onChange={(e) => setProjectForm(prev => ({ ...prev, totalAmount: e.target.value }))}
              className="w-full p-2 border rounded"
            />
            
            <button
              onClick={handleSaveProject}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Сохранить проект
            </button>
          </div>
        </div>

        {/* Форма сохранения шаблона */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Сохранить шаблон</h2>
          
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Название шаблона"
              value={templateForm.name}
              onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border rounded"
            />
            
            <select
              value={templateForm.config.doorType}
              onChange={(e) => setTemplateForm(prev => ({ 
                ...prev, 
                config: { ...prev.config, doorType: e.target.value }
              }))}
              className="w-full p-2 border rounded"
            >
              <option value="single">Однопольная</option>
              <option value="one_half">Полуторная</option>
              <option value="double">Двупольная</option>
            </select>
            
            <button
              onClick={handleSaveTemplate}
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
            >
              Сохранить шаблон
            </button>
          </div>
        </div>

        {/* Управление черновиком */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Черновик</h2>
          
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Статус: {draft ? 'Сохранен' : 'Не сохранен'}
            </p>
            
            <button
              onClick={handleSaveDraft}
              className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600"
            >
              Сохранить черновик
            </button>
            
            {draft && (
              <button
                onClick={() => deleteDraft()}
                className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
              >
                Удалить черновик
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Список проектов */}
      {projects && projects.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Проекты в базе данных</h2>
          <div className="bg-white rounded shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Название</th>
                  <th className="px-4 py-2 text-left">Клиент</th>
                  <th className="px-4 py-2 text-left">Менеджер</th>
                  <th className="px-4 py-2 text-left">Сумма</th>
                  <th className="px-4 py-2 text-left">Действия</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project._id} className="border-t">
                    <td className="px-4 py-2">{project.name}</td>
                    <td className="px-4 py-2">{project.customer}</td>
                    <td className="px-4 py-2">{project.manager}</td>
                    <td className="px-4 py-2">{project.totalAmount?.toLocaleString()} ₽</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => deleteProject(project._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Список шаблонов */}
      {templates && templates.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Шаблоны в базе данных</h2>
          <div className="grid gap-4">
            {templates.map((template) => (
              <div key={template._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{template.name}</h3>
                  <p className="text-sm text-gray-600">
                    Тип двери: {template.config.doorType}
                  </p>
                  <p className="text-xs text-gray-500">
                    Создан: {new Date(template.createdAt).toLocaleDateString('ru-RU')}
                  </p>
                </div>
                <button
                  onClick={() => deleteTemplate(template._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ConvexExample;