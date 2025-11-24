import React, { useState, useMemo, useEffect } from 'react';
import { LEAFS, FRAMES, OPTIONS, HARDWARE, ACCESSORIES } from './data';
import { DoorConfig, DoorType, DOOR_TYPES, ProductItem, DoorTemplate, SavedProject } from './types';
import { Logo } from './components/Logo';
import { SelectionCard } from './components/ServiceCard';
import { OrderSummary } from './components/OrderSummary';
import { Modal } from './components/Modal';
import { Button } from './components/Button';
import { 
  Trash2, Plus, Copy, Package, ChevronRight, Settings, Info, Loader2, FileDown, 
  CheckCircle, Edit3, XCircle, Save, ArrowUp, ArrowDown, ArrowUpDown, Layout, 
  Bookmark, Play, CheckSquare, Square, Percent, DollarSign, PlusCircle, MinusCircle, 
  RotateCcw, FileX, Download, FolderOpen, Calendar, User, Briefcase, HardDrive, RefreshCw,
  Maximize2, Shield, Eye, Zap, Lock, Move, LogOut, Gem, DoorOpen
} from 'lucide-react';
import { calculateItemTotal, calculateProjectTotal } from './priceCalculator';
import { generatePDF } from './pdfGenerator';
import { 
  useProjects, 
  useTemplates as useTemplatesHook, 
  useDraft as useDraftHook 
} from './src/convexAdapter';

type SortKey = 'name' | 'quantity' | 'price';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

// Helper for item icons outside component to prevent re-renders
const getItemIcon = (category: string, id: string) => {
  if (category === 'leaf') return <DoorOpen size={16} />;
  if (category === 'frame') return <Maximize2 size={16} />;
  if (category === 'option') {
      if (id.includes('glass') || id.includes('porthole')) return <Eye size={16} />;
      if (id.includes('kickplate')) return <Shield size={16} />;
      if (id.includes('skud') || id.includes('elect')) return <Zap size={16} />;
  }
  if (category === 'hardware') {
      if (id.includes('lock') || id.includes('cylinder')) return <Lock size={16} />;
      if (id.includes('handle')) return <Move size={16} />;
      if (id.includes('panic')) return <LogOut size={16} />;
  }
  if (category === 'accessory') return <Gem size={16} />;

  return <Settings size={16} />;
}

const App: React.FC = () => {
  // --- Convex Hooks для работы с БД ---
  const { 
    projects: savedProjects, 
    saveProject: convexSaveProject, 
    deleteProject: convexDeleteProject 
  } = useProjects();
   
  const { 
    templates: convexTemplates,
    saveTemplate: convexSaveTemplate, 
    deleteTemplate: convexDeleteTemplate 
  } = useTemplatesHook();
   
  const { 
    draft: convexDraft, 
    saveDraft: convexSaveDraft, 
    deleteDraft: convexDeleteDraft 
  } = useDraftHook();
  
  // --- Catalog State (Initialized from data.ts but mutable) ---
  const [catalogLeafs, setCatalogLeafs] = useState(LEAFS);
  const [catalogFrames, setCatalogFrames] = useState(FRAMES);
  const [catalogOptions, setCatalogOptions] = useState(OPTIONS);
  const [catalogHardware, setCatalogHardware] = useState(HARDWARE);
  const [catalogAccessories, setCatalogAccessories] = useState(ACCESSORIES);

  // --- Configuration State ---
  const [activeTab, setActiveTab] = useState<DoorType>('single');
  const [selectedLeaf, setSelectedLeaf] = useState<ProductItem | null>(null);
  const [selectedFrame, setSelectedFrame] = useState<ProductItem | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<ProductItem[]>([]);
  const [selectedHardware, setSelectedHardware] = useState<ProductItem[]>([]);
  const [selectedAccessories, setSelectedAccessories] = useState<ProductItem[]>([]);
  const [configQuantity, setConfigQuantity] = useState(1);
  const [configDiscountValue, setConfigDiscountValue] = useState('');
  const [configDiscountType, setConfigDiscountType] = useState<'percent' | 'fixed'>('percent');

  // --- Project State ---
  const [projectItems, setProjectItems] = useState<DoorConfig[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
   
  // --- Price Editor State ---
  const [isPriceEditorOpen, setIsPriceEditorOpen] = useState(false);
  const [editorCategory, setEditorCategory] = useState<'leaf' | 'frame' | 'option' | 'hardware' | 'accessory'>('leaf');
  const [editorDoorType, setEditorDoorType] = useState<DoorType>('single');
  const [editorSelectedItems, setEditorSelectedItems] = useState<Set<string>>(new Set());
  const [bulkEditValue, setBulkEditValue] = useState('');
  const [bulkEditUnit, setBulkEditUnit] = useState<'percent' | 'fixed'>('percent');
  
  // --- Template State (локальное хранение) ---
  const [templates, setTemplates] = useState<DoorTemplate[]>(() => {
    try {
      const saved = localStorage.getItem('dorren_templates');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Failed to parse templates from local storage", e);
      return [];
    }
  });
  
  const [isTemplateManagerOpen, setIsTemplateManagerOpen] = useState(false);
  const [isSaveTemplateModalOpen, setIsSaveTemplateModalOpen] = useState(false);
  const [templateNameInput, setTemplateNameInput] = useState('');
  const [templateToRenameId, setTemplateToRenameId] = useState<string | null>(null); 

  // --- Projects Archive State (локальное хранение) ---
  const [savedLocalProjects, setSavedLocalProjects] = useState<SavedProject[]>(() => {
    try {
      const saved = localStorage.getItem('dorren_saved_projects');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      
      return parsed.map((p: any) => ({
        ...p,
        id: String(p.id || Math.random().toString(36).substr(2, 9)),
        items: Array.isArray(p.items) ? p.items : []
      }));
    } catch (e) {
      console.error("Failed to parse saved projects", e);
      return [];
    }
  });
  
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);

  // --- Draft State (локальное хранение) ---
  const [draftConfig, setDraftConfig] = useState<{
    activeTab: DoorType;
    selectedLeaf: ProductItem | null;
    selectedFrame: ProductItem | null;
    selectedOptions: ProductItem[];
    selectedHardware: ProductItem[];
    selectedAccessories: ProductItem[];
    configQuantity: number;
    configDiscountValue: string;
    configDiscountType: 'percent' | 'fixed';
  } | null>(() => {
    try {
      const saved = localStorage.getItem('dorren_draft_config');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (!parsed || typeof parsed !== 'object') return null;
      return parsed;
    } catch (e) {
      console.error("Failed to parse draft config", e);
      return null;
    }
  });

  // --- Form State ---
  const [managerName, setManagerName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [comments, setComments] = useState('');
   
  // --- Sorting State ---
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // --- PDF Generation State ---
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // --- Item Info Modal State ---
  const [selectedInfoItem, setSelectedInfoItem] = useState<ProductItem | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  // Reset editor selection when category/type changes
  useEffect(() => {
    setEditorSelectedItems(new Set());
    setBulkEditValue('');
  }, [editorCategory, editorDoorType, isPriceEditorOpen]);

  // --- Helpers ---
  const currentConfigCost = useMemo(() => {
    let total = 0;
    if (selectedLeaf) total += selectedLeaf.price;
    if (selectedFrame) total += selectedFrame.price;
    selectedOptions.forEach(opt => total += opt.price);
    selectedHardware.forEach(hw => total += hw.price);
    selectedAccessories.forEach(acc => total += acc.price);
    return total;
  }, [selectedLeaf, selectedFrame, selectedOptions, selectedHardware, selectedAccessories]);

  const currentConfigTotal = useMemo(() => {
     return calculateItemTotal(
       selectedLeaf, selectedFrame, selectedOptions, selectedHardware, selectedAccessories, 
       configQuantity, configDiscountValue, configDiscountType
     );
  }, [selectedLeaf, selectedFrame, selectedOptions, selectedHardware, selectedAccessories, configQuantity, configDiscountValue, configDiscountType]);

  const projectTotal = useMemo(() => {
    return calculateProjectTotal(projectItems);
  }, [projectItems]);

  const currentEditorItems = useMemo(() => {
    if (editorCategory === 'leaf') return catalogLeafs[editorDoorType];
    if (editorCategory === 'frame') return catalogFrames[editorDoorType];
    if (editorCategory === 'option') return catalogOptions;
    if (editorCategory === 'hardware') return catalogHardware;
    if (editorCategory === 'accessory') return catalogAccessories;
    return [];
  }, [editorCategory, editorDoorType, catalogLeafs, catalogFrames, catalogOptions, catalogHardware, catalogAccessories]);

  // --- Sorting Logic ---
  const getSortedGroupItems = (items: DoorConfig[]) => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (sortConfig.key === 'name') {
          const nameA = a.leaf?.name.toLowerCase() || '';
          const nameB = b.leaf?.name.toLowerCase() || '';
          if (nameA < nameB) return sortConfig.direction === 'asc' ? -1 : 1;
          if (nameA > nameB) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
        }
        if (sortConfig.key === 'quantity') {
          return sortConfig.direction === 'asc' 
            ? a.quantity - b.quantity 
            : b.quantity - a.quantity;
        }
        if (sortConfig.key === 'price') {
          const getCost = (item: DoorConfig) => {
             const discVal = item.discount?.value.toString() || '';
             const discType = item.discount?.type || 'percent';
             return calculateItemTotal(item.leaf, item.frame, item.options, item.hardware, item.accessories, item.quantity, discVal, discType);
          };
          return sortConfig.direction === 'asc'
            ? getCost(a) - getCost(b)
            : getCost(b) - getCost(a);
        }
        return 0;
      });
    }
    return sortableItems;
  };

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) return <ArrowUpDown size={14} className="opacity-30" />;
    return sortConfig.direction === 'asc' ? <ArrowUp size={14} className="text-dorren-lightBlue" /> : <ArrowDown size={14} className="text-dorren-lightBlue" />;
  };

  // --- Handlers ---
  const handleTabChange = (type: DoorType) => {
    setActiveTab(type);
    setSelectedLeaf(null);
    setSelectedFrame(null);
    setSelectedOptions([]); 
    setSelectedHardware([]);
    setSelectedAccessories([]);
    setEditingItemId(null); 
    setConfigDiscountValue('');
    setConfigDiscountType('percent');
  };

  const handleInfoClick = (e: React.MouseEvent, item: ProductItem) => {
    e.stopPropagation();
    setSelectedInfoItem(item);
    setIsInfoModalOpen(true);
  };

  const toggleOption = (item: ProductItem, list: ProductItem[], setList: React.Dispatch<React.SetStateAction<ProductItem[]>>) => {
    const exists = list.find(i => i.id === item.id);
    if (exists) {
      setList(list.filter(i => i.id !== item.id));
    } else {
      setList([...list, item]);
    }
  };

  const handleSaveProjectItem = () => {
    if (!selectedLeaf || !selectedFrame) return;

    const discountData = configDiscountValue ? { value: parseFloat(configDiscountValue.replace(',', '.')), type: configDiscountType } : undefined;

    if (editingItemId) {
      setProjectItems(prev => prev.map(item => {
        if (item.id === editingItemId) {
          return {
            ...item,
            doorType: activeTab,
            leaf: selectedLeaf,
            frame: selectedFrame,
            options: [...selectedOptions],
            hardware: [...selectedHardware],
            accessories: [...selectedAccessories],
            quantity: configQuantity,
            discount: discountData
          };
        }
        return item;
      }));
      setEditingItemId(null);
      setSelectedLeaf(null);
      setSelectedFrame(null);
      setSelectedOptions([]);
      setSelectedHardware([]);
      setSelectedAccessories([]);
      setConfigQuantity(1);
      setConfigDiscountValue('');
      setConfigDiscountType('percent');
    } else {
      const newConfig: DoorConfig = {
        id: Math.random().toString(36).substr(2, 9),
        doorType: activeTab,
        leaf: selectedLeaf,
        frame: selectedFrame,
        options: [...selectedOptions],
        hardware: [...selectedHardware],
        accessories: [...selectedAccessories],
        quantity: configQuantity,
        discount: discountData
      };
      setProjectItems([...projectItems, newConfig]);
    }
  };

  const handleEditItem = (item: DoorConfig) => {
    setActiveTab(item.doorType);
    setSelectedLeaf(item.leaf);
    setSelectedFrame(item.frame);
    setSelectedOptions([...item.options]);
    setSelectedHardware([...item.hardware]);
    setSelectedAccessories(item.accessories ? [...item.accessories] : []);
    setConfigQuantity(item.quantity);
    
    if (item.discount) {
        setConfigDiscountValue(item.discount.value.toString());
        setConfigDiscountType(item.discount.type);
    } else {
        setConfigDiscountValue('');
        setConfigDiscountType('percent');
    }

    setEditingItemId(item.id);
    setIsModalOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingItemId(null);
    setSelectedLeaf(null);
    setSelectedFrame(null);
    setSelectedOptions([]);
    setSelectedHardware([]);
    setSelectedAccessories([]);
    setConfigQuantity(1);
    setConfigDiscountValue('');
  };

  const clearConfig = () => {
    setEditingItemId(null);
    setSelectedLeaf(null);
    setSelectedFrame(null);
    setSelectedOptions([]);
    setSelectedHardware([]);
    setSelectedAccessories([]);
    setConfigQuantity(1);
    setConfigDiscountValue('');
    setConfigDiscountType('percent');
  };

  const duplicateProjectItem = (item: DoorConfig) => {
    const newConfig: DoorConfig = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      options: [...item.options],
      hardware: [...item.hardware],
      accessories: item.accessories ? [...item.accessories] : [],
      discount: item.discount ? { ...item.discount } : undefined
    };
    setProjectItems([...projectItems, newConfig]);
  };

  const removeFromProject = (id: string) => {
    setProjectItems(projectItems.filter(item => item.id !== id));
    if (editingItemId === id) {
      cancelEdit();
    }
  };

  // --- Project Archive Handlers ---
  const handleSaveProjectToArchive = async () => {
    if (projectItems.length === 0) return;
    
    // Default name generation logic
    let nameToSave = projectName;
    if (!nameToSave.trim()) {
      const dateStr = new Date().toLocaleDateString('ru-RU');
      nameToSave = `Проект ${dateStr}`;
    }

    // Prompt user to confirm or edit
    const userInput = window.prompt("Подтвердите название проекта для сохранения:", nameToSave);
    if (userInput === null) return; // User cancelled

    const finalName = userInput.trim() || nameToSave;
    setProjectName(finalName); // Update UI state

    const projectToSave: SavedProject = {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      name: finalName,
      customer: customerName || 'Не указан',
      manager: managerName || 'Не указан',
      comments: comments,
      items: [...projectItems],
      totalAmount: projectTotal
    };

    // Сохраняем в localStorage (как и раньше)
    setSavedLocalProjects(prev => [projectToSave, ...prev]);
    
    // Дополнительно сохраняем в Convex (асинхронно, не блокируя UI)
    try {
      if (convexSaveProject) {
        await convexSaveProject({
          name: finalName,
          customer: customerName || 'Не указан',
          manager: managerName || 'Не указан',
          comments: comments,
          items: [...projectItems],
          totalAmount: projectTotal
        });
        console.log('Проект сохранен в Convex');
      }
    } catch (error) {
      console.error('Ошибка сохранения в Convex:', error);
    }

    setSaveSuccess(true); 
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleLoadProjectFromArchive = (project: SavedProject) => {
    if (window.confirm('Загрузка проекта заменит текущий список товаров. Продолжить?')) {
      setProjectItems(project.items);
      setProjectName(project.name);
      setCustomerName(project.customer);
      setManagerName(project.manager);
      setComments(project.comments);
      setIsProjectsModalOpen(false);
      setIsModalOpen(true); 
    }
  };

  const handleDeleteProject = (id: string) => {
    if (!id) return;
    if (window.confirm('Удалить этот проект из архива?')) {
      // Robust filtering: compare as strings to avoid type mismatch
      setSavedLocalProjects(prev => prev.filter(p => String(p.id) !== String(id)));
    }
  };

  // --- Template Handlers ---
  const handleOpenSaveTemplateModal = () => {
    if (!selectedLeaf || !selectedFrame) return; 
    setTemplateNameInput('');
    setTemplateToRenameId(null);
    setIsSaveTemplateModalOpen(true);
  };

  const handleSaveTemplate = () => {
    if (!templateNameInput.trim()) return;

    if (templateToRenameId) {
        setTemplates(prev => prev.map(t => t.id === templateToRenameId ? { ...t, name: templateNameInput } : t));
        setTemplateToRenameId(null);
        setIsSaveTemplateModalOpen(false);
        setIsTemplateManagerOpen(true); 
        return;
    }

    const newTemplate: DoorTemplate = {
      id: Math.random().toString(36).substr(2, 9),
      name: templateNameInput,
      config: {
        doorType: activeTab,
        leaf: selectedLeaf,
        frame: selectedFrame,
        options: [...selectedOptions],
        hardware: [...selectedHardware],
        accessories: [...selectedAccessories]
      }
    };
    setTemplates([...templates, newTemplate]);
    
    // Также сохраняем в Convex
    if (convexSaveTemplate) {
      try {
        convexSaveTemplate({
          name: templateNameInput,
          config: {
            doorType: activeTab,
            leaf: selectedLeaf,
            frame: selectedFrame,
            options: [...selectedOptions],
            hardware: [...selectedHardware],
            accessories: [...selectedAccessories]
          }
        });
        console.log('Шаблон сохранен в Convex');
      } catch (error) {
        console.error('Ошибка сохранения шаблона в Convex:', error);
      }
    }
    
    setIsSaveTemplateModalOpen(false);
  };

  const handleLoadTemplate = (template: DoorTemplate) => {
    setActiveTab(template.config.doorType);
    setSelectedLeaf(template.config.leaf);
    setSelectedFrame(template.config.frame);
    setSelectedOptions([...template.config.options]);
    setSelectedHardware([...template.config.hardware]);
    setSelectedAccessories(template.config.accessories ? [...template.config.accessories] : []);
    setEditingItemId(null);
    setConfigQuantity(1);
    setConfigDiscountValue('');
    setConfigDiscountType('percent');
    setIsTemplateManagerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  const handleStartRenameTemplate = (template: DoorTemplate) => {
    setTemplateNameInput(template.name);
    setTemplateToRenameId(template.id);
    setIsTemplateManagerOpen(false); 
    setIsSaveTemplateModalOpen(true);
  };

  // --- Draft Handlers ---
  const handleSaveDraft = () => {
    const draft = {
      activeTab,
      selectedLeaf,
      selectedFrame,
      selectedOptions,
      selectedHardware,
      selectedAccessories,
      configQuantity,
      configDiscountValue,
      configDiscountType
    };
    localStorage.setItem('dorren_draft_config', JSON.stringify(draft));
    setDraftConfig(draft);
    
    // Сохраняем в Convex
    if (convexSaveDraft) {
      try {
        convexSaveDraft(draft);
        console.log('Черновик сохранен в Convex');
      } catch (error) {
        console.error('Ошибка сохранения черновика в Convex:', error);
      }
    }
  };

  const handleLoadDraft = () => {
    if (!draftConfig) return;
    setActiveTab(draftConfig.activeTab);
    setSelectedLeaf(draftConfig.selectedLeaf);
    setSelectedFrame(draftConfig.selectedFrame);
    setSelectedOptions(draftConfig.selectedOptions || []);
    setSelectedHardware(draftConfig.selectedHardware || []);
    setSelectedAccessories(draftConfig.selectedAccessories || []);
    setConfigQuantity(draftConfig.configQuantity || 1);
    setConfigDiscountValue(draftConfig.configDiscountValue || '');
    setConfigDiscountType(draftConfig.configDiscountType || 'percent');
    setEditingItemId(null);
  };

  const handleClearDraft = () => {
    localStorage.removeItem('dorren_draft_config');
    setDraftConfig(null);
    
    // Удаляем из Convex
    if (convexDeleteDraft) {
      try {
        convexDeleteDraft();
        console.log('Черновик удален из Convex');
      } catch (error) {
        console.error('Ошибка удаления черновика из Convex:', error);
      }
    }
  };

  const formatPrice = (p: number) => p.toLocaleString('ru-RU');
  
  return (
    <div className="min-h-screen bg-dorren-black text-white font-sans selection:bg-dorren-lightBlue selection:text-dorren-black pb-32">
       
      {/* Background Decorative Lines */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
        <div className="absolute left-8 md:left-24 top-0 bottom-0 w-[1px] bg-white"></div>
        <div className="absolute right-8 md:right-24 top-0 bottom-0 w-[1px] bg-white"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 pt-8 pb-8 px-4 md:px-8 border-b border-white/10 bg-dorren-black sticky top-0">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-4 md:gap-6">
            
            {/* Projects Archive Button */}
            <button 
              onClick={() => setIsProjectsModalOpen(true)}
              className="group flex items-center gap-2 text-white/40 hover:text-dorren-lightBlue transition-colors"
              title="Архив проектов"
            >
              <div className="p-2 rounded-full border border-white/10 group-hover:border-dorren-lightBlue/50 transition-colors">
                <FolderOpen size={18} />
              </div>
              <span className="hidden lg:inline text-xs uppercase tracking-widest">Проекты</span>
            </button>

            {/* Templates Button */}
            <button 
              onClick={() => setIsTemplateManagerOpen(true)}
              className="group flex items-center gap-2 text-white/40 hover:text-dorren-lightBlue transition-colors"
              title="Шаблоны конфигураций"
            >
              <div className="p-2 rounded-full border border-white/10 group-hover:border-dorren-lightBlue/50 transition-colors">
                <Layout size={18} />
              </div>
              <span className="hidden lg:inline text-xs uppercase tracking-widest">Шаблоны</span>
            </button>

            {/* Convex Status Indicator */}
            <div className="flex items-center gap-2 text-white/40">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" title="Convex подключен"></div>
              <span className="hidden xl:inline text-xs">DB Active</span>
            </div>

            <div className="hidden md:block text-right border-l border-white/10 pl-6">
               <p className="text-xs text-white/40 uppercase tracking-widest">Текущий проект</p>
               <p className="text-lg font-mono text-dorren-lightBlue">{formatPrice(projectTotal)} ₽</p>
            </div>
            <Button variant="outline" className="text-xs py-2 px-4" onClick={() => setIsModalOpen(true)} disabled={projectItems.length === 0}>
              <Package size={16} className="mr-2" />
              Заказ ({projectItems.length})
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-4 md:px-8 py-8 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Configurator */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Door Type Tabs */}
            <div className="flex flex-wrap gap-2">
              {DOOR_TYPES.map(type => (
                <button
                  key={type.id}
                  onClick={() => handleTabChange(type.id)}
                  className={`
                    flex-1 px-4 py-4 text-sm uppercase tracking-widest border transition-all duration-300
                    ${activeTab === type.id 
                      ? 'bg-dorren-lightBlue text-dorren-black border-dorren-lightBlue font-medium' 
                      : 'bg-transparent text-white/60 border-dorren-darkBlue hover:border-white/30 hover:text-white'}
                  `}
                >
                  {type.label}
                </button>
              ))}
            </div>

            <div className="space-y-12">
              {/* Section: Leaf (USING DYNAMIC CATALOG STATE) */}
              <section>
                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-2">
                  <span className="text-dorren-lightBlue font-mono">01</span>
                  <h3 className="text-xl font-light uppercase tracking-widest">Выбор полотна</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {catalogLeafs[activeTab].map(item => (
                    <SelectionCard
                      key={item.id}
                      item={item}
                      icon={getItemIcon(item.category, item.id)}
                      isSelected={selectedLeaf?.id === item.id}
                      type="radio"
                      onSelect={() => setSelectedLeaf(item)}
                      onInfoClick={(e) => handleInfoClick(e, item)}
                    />
                  ))}
                </div>
              </section>

              {/* Section: Frame (USING DYNAMIC CATALOG STATE) */}
              <section>
                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-2">
                  <span className="text-dorren-lightBlue font-mono">02</span>
                  <h3 className="text-xl font-light uppercase tracking-widest">Выбор короба</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {catalogFrames[activeTab].map(item => (
                    <SelectionCard
                      key={item.id}
                      item={item}
                      icon={getItemIcon(item.category, item.id)}
                      isSelected={selectedFrame?.id === item.id}
                      type="radio"
                      onSelect={() => setSelectedFrame(item)}
                      onInfoClick={(e) => handleInfoClick(e, item)}
                    />
                  ))}
                </div>
              </section>

              {/* Section: Options (USING DYNAMIC CATALOG STATE) */}
              <section>
                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-2">
                  <span className="text-dorren-lightBlue font-mono">03</span>
                  <h3 className="text-xl font-light uppercase tracking-widest">Дополнительные опции</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catalogOptions.map(item => (
                    <SelectionCard
                      key={item.id}
                      item={item}
                      icon={getItemIcon(item.category, item.id)}
                      isSelected={!!selectedOptions.find(i => i.id === item.id)}
                      type="checkbox"
                      onSelect={() => toggleOption(item, selectedOptions, setSelectedOptions)}
                      onInfoClick={(e) => handleInfoClick(e, item)}
                    />
                  ))}
                </div>
              </section>

              {/* Section: Hardware (USING DYNAMIC CATALOG STATE) */}
              <section>
                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-2">
                  <span className="text-dorren-lightBlue font-mono">04</span>
                  <h3 className="text-xl font-light uppercase tracking-widest">Фурнитура</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catalogHardware.map(item => (
                    <SelectionCard
                      key={item.id}
                      item={item}
                      icon={getItemIcon(item.category, item.id)}
                      isSelected={!!selectedHardware.find(i => i.id === item.id)}
                      type="checkbox"
                      onSelect={() => toggleOption(item, selectedHardware, setSelectedHardware)}
                      onInfoClick={(e) => handleInfoClick(e, item)}
                    />
                  ))}
                </div>
              </section>

              {/* Section: Accessories (USING DYNAMIC CATALOG STATE) */}
              <section>
                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-2">
                  <span className="text-dorren-lightBlue font-mono">05</span>
                  <h3 className="text-xl font-light uppercase tracking-widest">Аксессуары</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catalogAccessories.map(item => (
                    <SelectionCard
                      key={item.id}
                      item={item}
                      icon={getItemIcon(item.category, item.id)}
                      isSelected={!!selectedAccessories.find(i => i.id === item.id)}
                      type="checkbox"
                      onSelect={() => toggleOption(item, selectedAccessories, setSelectedAccessories)}
                      onInfoClick={(e) => handleInfoClick(e, item)}
                    />
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* RIGHT COLUMN: Summary Sticky */}
          <div className="lg:col-span-4 relative h-full">
            <div className="sticky top-32 flex flex-col gap-0 max-h-[calc(100vh-9rem)] overflow-y-auto pr-1">
               
               {/* Project Metadata Inputs */}
               <div className="bg-dorren-darkBlue/20 border border-dorren-darkBlue p-6 mb-4 backdrop-blur-sm">
                  <h3 className="text-xs uppercase tracking-widest text-white/40 mb-4">Данные проекта</h3>
                  <div className="space-y-3">
                      <div className="space-y-1">
                         <label className="text-[10px] text-white/30 uppercase tracking-wider">Проект</label>
                         <input 
                            type="text" 
                            placeholder="Название проекта"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            className="w-full bg-dorren-black border border-dorren-darkBlue p-3 text-sm text-white focus:border-dorren-lightBlue outline-none placeholder:text-white/20 transition-colors"
                         />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] text-white/30 uppercase tracking-wider">Заказчик</label>
                         <input 
                            type="text" 
                            placeholder="Заказчик"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="w-full bg-dorren-black border border-dorren-darkBlue p-3 text-sm text-white focus:border-dorren-lightBlue outline-none placeholder:text-white/20 transition-colors"
                         />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] text-white/30 uppercase tracking-wider">Менеджер</label>
                         <input 
                            type="text" 
                            placeholder="Менеджер"
                            value={managerName}
                            onChange={(e) => setManagerName(e.target.value)}
                            className="w-full bg-dorren-black border border-dorren-darkBlue p-3 text-sm text-white focus:border-dorren-lightBlue outline-none placeholder:text-white/20 transition-colors"
                         />
                      </div>
                  </div>
               </div>

               {/* Configuration Card */}
               <div className={`
                 backdrop-blur-sm p-6 md:p-8 transition-colors duration-500 border
                 ${editingItemId 
                   ? 'bg-dorren-lightBlue/10 border-dorren-lightBlue' 
                   : 'bg-dorren-darkBlue/20 border-dorren-darkBlue'
                 }
               `}>
                 <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
                     <div>
                       <h2 className="text-lg uppercase tracking-widest text-white">
                         {editingItemId ? 'Редактирование' : 'Конфигурация'}
                       </h2>
                       {editingItemId && <span className="text-xs text-dorren-lightBlue animate-pulse">● EDIT MODE</span>}
                     </div>
                     
                     <div className="flex items-center gap-2">
                       {/* Draft Controls */}
                       {!editingItemId && (
                           <div className="flex items-center gap-1 border-r border-white/10 pr-2 mr-2">
                               <button 
                                   onClick={handleSaveDraft}
                                   className="p-1 text-white/30 hover:text-dorren-lightBlue transition-colors"
                                   title="Сохранить черновик"
                               >
                                   <Save size={18} />
                               </button>
                               {draftConfig && (
                                   <>
                                       <button 
                                           onClick={handleLoadDraft}
                                           className="p-1 text-white/30 hover:text-white transition-colors"
                                           title="Загрузить черновик"
                                       >
                                           <Download size={18} />
                                       </button>
                                       <button 
                                           onClick={handleClearDraft}
                                           className="p-1 text-white/30 hover:text-red-400 transition-colors"
                                           title="Удалить черновик"
                                       >
                                           <FileX size={18} />
                                       </button>
                                   </>
                               )}
                           </div>
                       )}

                       {!editingItemId && (
                           <button 
                             onClick={handleOpenSaveTemplateModal}
                             disabled={!selectedLeaf || !selectedFrame}
                             className="text-white/30 hover:text-dorren-lightBlue disabled:opacity-30 disabled:hover:text-white/30 transition-colors"
                             title="Сохранить как шаблон"
                           >
                             <Bookmark size={20} />
                           </button>
                       )}
                       <button 
                         onClick={clearConfig}
                         className="text-white/30 hover:text-white transition-colors"
                         title="Очистить конфигурацию"
                       >
                         <RotateCcw size={20} />
                       </button>
                     </div>
                 </div>

                 <div className="space-y-4 mb-8 text-sm">
                   <div className="flex justify-between items-start">
                     <span className="text-white/40">Тип блока</span>
                     <span className="text-right max-w-[60%]">{DOOR_TYPES.find(t => t.id === activeTab)?.label}</span>
                   </div>
                   
                   <div className="flex justify-between items-start">
                     <span className="text-white/40">Полотно</span>
                     <span className={`text-right max-w-[60%] ${selectedLeaf ? 'text-white' : 'text-dorren-lightBlue animate-pulse'}`}>
                       {selectedLeaf ? selectedLeaf.name : 'Выберите полотно'}
                     </span>
                   </div>

                   <div className="flex justify-between items-start">
                     <span className="text-white/40">Короб</span>
                     <span className={`text-right max-w-[60%] ${selectedFrame ? 'text-white' : 'text-dorren-lightBlue animate-pulse'}`}>
                       {selectedFrame ? selectedFrame.name : 'Выберите короб'}
                     </span>
                   </div>

                   {(selectedOptions.length > 0 || selectedHardware.length > 0 || selectedAccessories.length > 0) && (
                     <div className="border-t border-white/10 pt-4 mt-4 space-y-2">
                       <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Дополнительно</p>
                       {[...selectedOptions, ...selectedHardware, ...selectedAccessories].map(opt => (
                         <div key={opt.id} className="flex justify-between text-xs">
                           <span className="text-white/70">{opt.name}</span>
                           <span className="text-white/40">{formatPrice(opt.price)} ₽</span>
                         </div>
                       ))}
                     </div>
                   )}
                 </div>

                 <div className="bg-dorren-black/50 p-4 border border-white/5 mb-6">
                   <div className="flex justify-between items-end mb-1">
                     <span className="text-xs uppercase tracking-widest text-white/60">Цена за шт.</span>
                     <span className="text-xl font-mono text-white">{formatPrice(currentConfigCost)} ₽</span>
                   </div>
                 </div>

                 {/* Quantity and Discount */}
                 <div className="space-y-4 mb-6">
                     <div className="flex justify-between items-center">
                        <span className="text-xs text-white/40 uppercase">Количество</span>
                        <div className="flex items-center bg-dorren-black border border-dorren-darkBlue">
                           <button 
                             onClick={() => setConfigQuantity(Math.max(1, configQuantity - 1))}
                             className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white hover:bg-dorren-darkBlue/30 transition-colors"
                           >-</button>
                           <span className="w-8 text-center font-mono text-sm">{configQuantity}</span>
                           <button 
                             onClick={() => setConfigQuantity(configQuantity + 1)}
                             className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white hover:bg-dorren-darkBlue/30 transition-colors"
                           >+</button>
                        </div>
                     </div>

                     <div className="flex justify-between items-center">
                         <span className="text-xs text-white/40 uppercase">Скидка</span>
                         <div className="flex items-center gap-2">
                            <input 
                              type="text" 
                              value={configDiscountValue}
                              onChange={(e) => setConfigDiscountValue(e.target.value.replace(',', '.'))}
                              placeholder="0"
                              className="w-16 bg-dorren-black border border-dorren-darkBlue px-2 py-1 text-right font-mono text-sm outline-none focus:border-dorren-lightBlue"
                            />
                            <div className="flex bg-dorren-black border border-dorren-darkBlue">
                               <button 
                                 onClick={() => setConfigDiscountType('percent')}
                                 className={`p-1 ${configDiscountType === 'percent' ? 'bg-white/20 text-white' : 'text-white/40'}`}
                               ><Percent size={14} /></button>
                               <button 
                                 onClick={() => setConfigDiscountType('fixed')}
                                 className={`p-1 ${configDiscountType === 'fixed' ? 'bg-white/20 text-white' : 'text-white/40'}`}
                               ><DollarSign size={14} /></button>
                            </div>
                         </div>
                     </div>
                 </div>

                 <div className="text-right mb-6 border-t border-white/10 pt-4">
                       <span className="text-xs text-white/40 uppercase mr-2">Итого:</span>
                       <div className="flex flex-col items-end">
                          {configDiscountValue && (
                             <span className="text-xs text-white/30 line-through font-mono">
                                {formatPrice(currentConfigCost * configQuantity)} ₽
                             </span>
                          )}
                          <span className="text-lg font-mono text-white">
                             {formatPrice(currentConfigTotal)} ₽
                          </span>
                       </div>
                 </div>

                 <div className="flex gap-2">
                   {editingItemId ? (
                     <>
                       <Button 
                         onClick={handleSaveProjectItem} 
                         className="flex-1 bg-dorren-lightBlue text-dorren-black"
                         disabled={!selectedLeaf || !selectedFrame}
                       >
                         <Save size={18} className="mr-2" />
                         Сохранить
                       </Button>
                       <Button 
                         onClick={cancelEdit} 
                         variant="outline"
                         className="w-12 px-0 flex items-center justify-center"
                         title="Отмена"
                       >
                         <XCircle size={20} />
                       </Button>
                     </>
                   ) : (
                     <Button 
                       onClick={handleSaveProjectItem} 
                       className="w-full" 
                       disabled={!selectedLeaf || !selectedFrame}
                     >
                       <Plus size={18} className="mr-2" />
                       Добавить в проект
                     </Button>
                   )}
                 </div>
               </div>

               {/* Mini Project List Preview */}
               {projectItems.length > 0 && (
                 <div className="mt-8">
                   <h3 className="text-xs uppercase tracking-widest text-white/40 mb-4">Состав проекта</h3>
                   <div className="space-y-3">
                     {projectItems.map((item, idx) => (
                       <div key={item.id} className={`
                         flex justify-between items-center text-xs p-3 border transition-colors cursor-pointer group
                         ${editingItemId === item.id 
                           ? 'bg-dorren-lightBlue/20 border-dorren-lightBlue' 
                           : 'bg-white/5 border-white/5 hover:border-dorren-lightBlue/30'
                         }
                       `}>
                         <div>
                           <span className="text-dorren-lightBlue mr-2 font-mono">#{idx + 1}</span>
                           <span className="text-white/80">{item.leaf?.name.substring(0, 20)}...</span>
                         </div>
                         <div className="flex items-center gap-3">
                           <span className="font-mono">{item.quantity} шт</span>
                           
                           <button 
                             onClick={(e) => { e.stopPropagation(); handleEditItem(item); }} 
                             className={`text-white/20 hover:text-white transition-opacity ${editingItemId === item.id ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100'}`}
                             title="Редактировать"
                           >
                             <Edit3 size={14} />
                           </button>

                           <button 
                             onClick={(e) => { e.stopPropagation(); duplicateProjectItem(item); }} 
                             className="text-white/20 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                             title="Копировать"
                           >
                             <Copy size={14} />
                           </button>

                           <button 
                             onClick={(e) => { e.stopPropagation(); removeFromProject(item.id); }} 
                             className="text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                             title="Удалить"
                           >
                             <Trash2 size={14} />
                           </button>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      </main>

      {/* Info Modal */}
      <Modal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        title={selectedInfoItem?.name || 'Информация'}
      >
        <div className="space-y-6">
          {selectedInfoItem?.imageUrl ? (
            <div className="w-full aspect-video bg-white/5 border border-white/10 rounded overflow-hidden">
               <img 
                 src={selectedInfoItem.imageUrl} 
                 alt={selectedInfoItem.name}
                 className="w-full h-full object-cover"
               />
            </div>
          ) : (
            <div className="w-full aspect-video bg-white/5 border border-white/10 rounded flex items-center justify-center text-white/20 uppercase tracking-widest">
               Нет изображения
            </div>
          )}
          
          <div>
             <h3 className="text-lg text-white mb-2">{selectedInfoItem?.name}</h3>
             <div className="w-12 h-[1px] bg-dorren-lightBlue mb-4"></div>
             
             <p className="text-white/70 font-light leading-relaxed">
               {selectedInfoItem?.description || 'Описание отсутствует.'}
             </p>

             <div className="mt-6 flex justify-between items-end border-t border-white/10 pt-4">
                <span className="text-xs text-white/40 uppercase tracking-widest">Стоимость</span>
                <span className="text-xl font-mono text-dorren-lightBlue">{selectedInfoItem ? formatPrice(selectedInfoItem.price) : 0} ₽</span>
             </div>
          </div>
        </div>
      </Modal>

      {/* Projects Archive Modal */}
      <Modal
        isOpen={isProjectsModalOpen}
        onClose={() => setIsProjectsModalOpen(false)}
        title="АРХИВ ПРОЕКТОВ"
      >
        <div className="space-y-4">
           {savedLocalProjects.length === 0 ? (
             <div className="text-center py-12 text-white/40 text-sm bg-white/5 border border-white/5 rounded-sm">
                <FolderOpen size={48} className="mx-auto mb-4 opacity-20" />
                <p>Нет сохраненных проектов.</p>
                <p className="text-xs mt-2">Сохраните текущий расчет при формировании КП, чтобы он появился здесь.</p>
             </div>
           ) : (
             <div className="space-y-4">
               {savedLocalProjects.map(project => (
                 <div key={project.id} className="bg-dorren-darkBlue/20 border border-white/10 p-5 hover:border-dorren-lightBlue/40 transition-all group">
                    <div className="flex justify-between items-start">
                       <div className="space-y-2">
                          <h4 className="text-white font-medium text-lg flex items-center gap-2">
                            {project.name || 'Проект без названия'}
                            <span className="text-xs font-normal text-white/40 border border-white/10 px-2 py-0.5 rounded-full">
                               {new Date(project.createdAt).toLocaleDateString('ru-RU')}
                            </span>
                          </h4>
                          
                          <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs text-white/60">
                             <div className="flex items-center gap-2">
                                <User size={12} />
                                <span>Заказчик: <span className="text-white">{project.customer || '—'}</span></span>
                             </div>
                             <div className="flex items-center gap-2">
                                <Briefcase size={12} />
                                <span>Менеджер: <span className="text-white">{project.manager || '—'}</span></span>
                             </div>
                             <div className="flex items-center gap-2 mt-1 col-span-2">
                                <Package size={12} />
                                <span>Позиций: <span className="text-white">{project.items.length}</span></span>
                             </div>
                          </div>
                       </div>

                       <div className="text-right">
                          <div className="text-xl font-mono text-dorren-lightBlue mb-3">
                             {formatPrice(project.totalAmount)} ₽
                          </div>
                          <div className="flex gap-2 justify-end">
                             <Button 
                               onClick={() => handleLoadProjectFromArchive(project)}
                               className="px-3 py-2 text-xs h-auto bg-white/10 hover:bg-dorren-lightBlue hover:text-dorren-black border-none"
                             >
                                <HardDrive size={14} className="mr-2" /> Загрузить
                             </Button>
                             <button 
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteProject(String(project.id));
                                }}
                                className="p-2 text-white/20 hover:text-red-400 hover:bg-white/5 rounded transition-all z-20 relative cursor-pointer"
                                title="Удалить проект"
                             >
                                <Trash2 size={16} className="pointer-events-none" />
                             </button>
                          </div>
                       </div>
                    </div>
                 </div>
               ))}
             </div>
           )}
        </div>
      </Modal>

      {/* Templates Manager Modal */}
      <Modal
        isOpen={isTemplateManagerOpen}
        onClose={() => setIsTemplateManagerOpen(false)}
        title="ШАБЛОНЫ КОНФИГУРАЦИЙ"
      >
        <div className="space-y-4">
          {templates.length === 0 ? (
            <div className="text-center py-8 text-white/40 text-sm">
              <p>Нет сохраненных шаблонов.</p>
              <p className="text-xs mt-2">Настройте дверь и нажмите иконку закладки в блоке конфигурации, чтобы сохранить шаблон.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {templates.map(template => (
                <div key={template.id} className="bg-white/5 border border-white/10 p-4 flex justify-between items-center hover:border-dorren-lightBlue/30 transition-colors">
                   <div>
                      <h4 className="text-white font-medium">{template.name}</h4>
                      <p className="text-[10px] text-white/50 mt-1 uppercase tracking-wider">
                        {DOOR_TYPES.find(t => t.id === template.config.doorType)?.label}
                      </p>
                      <div className="text-xs text-white/40 mt-1 truncate max-w-[250px]">
                        {template.config.leaf?.name}
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <button 
                        onClick={() => handleLoadTemplate(template)}
                        className="p-2 bg-dorren-lightBlue text-dorren-black hover:bg-white transition-colors rounded-sm"
                        title="Загрузить шаблон"
                      >
                         <Play size={16} fill="currentColor" />
                      </button>
                      <button 
                        onClick={() => handleStartRenameTemplate(template)}
                        className="p-2 border border-white/20 text-white/60 hover:text-white hover:border-white transition-colors rounded-sm"
                        title="Переименовать"
                      >
                         <Edit3 size={16} />
                      </button>
                      <button 
                         onClick={() => handleDeleteTemplate(template.id)}
                         className="p-2 border border-white/20 text-white/60 hover:text-red-400 hover:border-red-400 transition-colors rounded-sm"
                         title="Удалить"
                      >
                         <Trash2 size={16} />
                      </button>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Save Template Modal */}
      <Modal
        isOpen={isSaveTemplateModalOpen}
        onClose={() => setIsSaveTemplateModalOpen(false)}
        title={templateToRenameId ? "ПЕРЕИМЕНОВАНИЕ ШАБЛОНА" : "СОХРАНЕНИЕ ШАБЛОНА"}
      >
        <div className="space-y-4">
          <div>
             <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Название шаблона</label>
             <input 
                type="text" 
                value={templateNameInput}
                onChange={(e) => setTemplateNameInput(e.target.value)}
                className="w-full bg-dorren-black border border-dorren-darkBlue p-4 text-white focus:border-dorren-lightBlue outline-none"
                placeholder="Например: Стандартная офисная дверь"
                autoFocus
             />
          </div>
          <Button onClick={handleSaveTemplate} disabled={!templateNameInput.trim()} className="w-full">
             {templateToRenameId ? "Сохранить изменения" : "Сохранить шаблон"}
          </Button>
        </div>
      </Modal>

      {/* Checkout/Project Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ"
      >
        <div className="space-y-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-widest text-white/40 border-b border-white/10">
                <tr>
                  <th className="pb-4 pl-4 cursor-pointer group hover:text-white transition-colors" onClick={() => requestSort('name')}>
                    <div className="flex items-center gap-2">
                      Наименование
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th className="pb-4 text-center cursor-pointer group hover:text-white transition-colors" onClick={() => requestSort('quantity')}>
                    <div className="flex items-center justify-center gap-2">
                      Кол-во
                      {getSortIcon('quantity')}
                    </div>
                  </th>
                  <th className="pb-4 text-right pr-4 cursor-pointer group hover:text-white transition-colors" onClick={() => requestSort('price')}>
                    <div className="flex items-center justify-end gap-2">
                      Сумма
                      {getSortIcon('price')}
                    </div>
                  </th>
                  <th className="pb-4 w-24"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {DOOR_TYPES.map(doorType => {
                  const groupItems = getSortedGroupItems(projectItems).filter(item => item.doorType === doorType.id);
                  if (groupItems.length === 0) return null;

                  return (
                    <React.Fragment key={doorType.id}>
                      {/* Group Header */}
                      <tr className="bg-dorren-darkBlue/20">
                        <td colSpan={4} className="py-3 pl-4 text-xs font-bold uppercase tracking-widest text-dorren-lightBlue">
                           {doorType.label}
                        </td>
                      </tr>
                      
                      {/* Items */}
                      {groupItems.map((item) => {
                          const itemDiscountVal = item.discount?.value.toString() || '';
                          const itemDiscountType = item.discount?.type || 'percent';
                          const total = calculateItemTotal(item.leaf, item.frame, item.options, item.hardware, item.accessories, item.quantity, itemDiscountVal, itemDiscountType);
                          
                          return (
                            <tr key={item.id} className="group hover:bg-white/5 transition-colors">
                              <td className="py-4 pl-4">
                                <div className="flex flex-col gap-1">
                                  <span className="font-medium text-white">{item.leaf?.name}</span>
                                  <span className="text-xs text-white/60">{item.frame?.name}</span>
                                  {(item.options.length > 0 || item.hardware.length > 0 || (item.accessories && item.accessories.length > 0)) && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {[...item.options, ...item.hardware, ...(item.accessories || [])].map(opt => (
                                        <span key={opt.id} className="px-1.5 py-0.5 bg-dorren-darkBlue/50 border border-white/10 rounded-[2px] text-[10px] text-dorren-lightBlue">
                                          {opt.name}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                  {item.discount && (
                                     <div className="text-[10px] text-dorren-lightBlue mt-1">
                                        СКИДКА: {item.discount.type === 'percent' ? `${item.discount.value}%` : `${item.discount.value} ₽`}
                                     </div>
                                  )}
                                </div>
                              </td>
                              <td className="py-4 text-center font-mono text-white/80">{item.quantity}</td>
                              <td className="py-4 text-right pr-4 font-mono text-white">
                                 {formatPrice(total)} ₽
                              </td>
                              <td className="py-4 text-right whitespace-nowrap">
                                <button onClick={() => handleEditItem(item)} className="text-white/20 hover:text-dorren-lightBlue transition-colors mr-3" title="Редактировать">
                                  <Edit3 size={16} />
                                </button>
                                <button onClick={() => duplicateProjectItem(item)} className="text-white/20 hover:text-white transition-colors mr-3" title="Копировать">
                                  <Copy size={16} />
                                </button>
                                <button onClick={() => removeFromProject(item.id)} className="text-white/20 hover:text-red-400 transition-colors" title="Удалить">
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          );
                      })}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end items-center border-t border-white/20 pt-6">
             <div className="text-right">
               <span className="text-sm uppercase tracking-widest text-white/60 mr-4">Итого к оплате:</span>
               <span className="text-3xl font-light text-dorren-lightBlue font-mono">{formatPrice(projectTotal)} ₽</span>
             </div>
          </div>

          <div className="mt-6 flex flex-col md:flex-row gap-4">
            <Button 
              className="flex-1 transition-all duration-300 bg-dorren-darkBlue text-white hover:bg-dorren-lightBlue hover:text-dorren-black"
              onClick={handleSaveProjectToArchive}
              disabled={projectItems.length === 0}
            >
              <Save size={18} className="mr-2" />
              Сохранить проект
            </Button>
            <Button 
              className="flex-1 transition-all duration-300"
              onClick={() => {}}
              disabled={true}
            >
              <FileDown className="mr-2" size={18} />
              Формирование КП (скоро)
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default App;