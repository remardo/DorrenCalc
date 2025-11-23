

import { ProductItem, DoorType } from './types';

// Prices are estimates based on previous data and relative value of catalog items.

export const LEAFS: Record<DoorType, ProductItem[]> = {
  single: [
    { 
      id: 'l1_ral_base', 
      name: 'Полотно МДФ (Покраска по RAL)', 
      price: 34003, 
      category: 'leaf', 
      description: 'Гладкое полотно, эмаль по каталогу RAL. Универсальное решение для офисов.', 
      imageUrl: 'https://images.unsplash.com/photo-1517646331032-9e8563c523a1?auto=format&fit=crop&q=80&w=800' 
    },
    { 
      id: 'l1_hpl_med', 
      name: 'Полотно HPL (Медицинское/Антивандальное)', 
      price: 42500, 
      category: 'leaf', 
      description: 'Покрытие HPL пластик. Устойчиво к дезинфекции и ударам. Для медицинских объектов.', 
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800' 
    },
    { 
      id: 'l1_veneer', 
      name: 'Полотно Шпон (Натуральное дерево)', 
      price: 48900, 
      category: 'leaf', 
      description: 'Отделка натуральным шпоном. Премиальный внешний вид.', 
      imageUrl: 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?auto=format&fit=crop&q=80&w=800' 
    },
    { 
      id: 'l1_ei30', 
      name: 'Полотно Противопожарное EI30 (HPL/RAL)', 
      price: 58545, 
      category: 'leaf', 
      description: 'Огнестойкость 30 минут. Внутри огнестойкая фиброплита.', 
      imageUrl: 'https://images.unsplash.com/photo-1622015663319-e97e697503ee?auto=format&fit=crop&q=80&w=800' 
    },
    { 
      id: 'l1_ei60', 
      name: 'Полотно Противопожарное EI60 (HPL/RAL)', 
      price: 104375, 
      category: 'leaf', 
      description: 'Огнестойкость 60 минут. Максимальная защита.', 
      imageUrl: 'https://images.unsplash.com/photo-1622015663319-e97e697503ee?auto=format&fit=crop&q=80&w=800' 
    },
    { 
      id: 'l1_metal', 
      name: 'Полотно Металлическое (Техническое)', 
      price: 22007, 
      category: 'leaf', 
      description: 'Оцинкованная сталь с порошковой покраской.', 
      imageUrl: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=800' 
    },
  ],
  one_half: [
    { 
      id: 'l15_ral_base', 
      name: 'Полотно 1.5 МДФ (Покраска по RAL)', 
      price: 64106, 
      category: 'leaf', 
      imageUrl: 'https://images.unsplash.com/photo-1517646331032-9e8563c523a1?auto=format&fit=crop&q=80&w=800' 
    },
    { 
      id: 'l15_hpl_med', 
      name: 'Полотно 1.5 HPL (Медицинское)', 
      price: 75200, 
      category: 'leaf', 
      description: 'Антибактериальный пластик, устойчивость к ударам.', 
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800' 
    },
    { 
      id: 'l15_ei30', 
      name: 'Полотно 1.5 Противопожарное EI30', 
      price: 89295, 
      category: 'leaf', 
      imageUrl: 'https://images.unsplash.com/photo-1622015663319-e97e697503ee?auto=format&fit=crop&q=80&w=800' 
    },
    { 
      id: 'l15_ei60', 
      name: 'Полотно 1.5 Противопожарное EI60', 
      price: 178760, 
      category: 'leaf', 
      imageUrl: 'https://images.unsplash.com/photo-1622015663319-e97e697503ee?auto=format&fit=crop&q=80&w=800' 
    },
    { 
      id: 'l15_metal', 
      name: 'Полотно 1.5 Металлическое', 
      price: 45464, 
      category: 'leaf', 
      imageUrl: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=800' 
    },
  ],
  double: [
    { 
      id: 'l2_ral_base', 
      name: 'Полотно 2.0 МДФ (Покраска по RAL)', 
      price: 76905, 
      category: 'leaf', 
      imageUrl: 'https://images.unsplash.com/photo-1517646331032-9e8563c523a1?auto=format&fit=crop&q=80&w=800' 
    },
    { 
      id: 'l2_hpl_med', 
      name: 'Полотно 2.0 HPL (Медицинское)', 
      price: 92400, 
      category: 'leaf', 
      description: 'Для широких проемов в медицинских учреждениях.', 
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800' 
    },
    { 
      id: 'l2_ei30', 
      name: 'Полотно 2.0 Противопожарное EI30', 
      price: 104797, 
      category: 'leaf', 
      imageUrl: 'https://images.unsplash.com/photo-1622015663319-e97e697503ee?auto=format&fit=crop&q=80&w=800' 
    },
    { 
      id: 'l2_ei60', 
      name: 'Полотно 2.0 Противопожарное EI60', 
      price: 183786, 
      category: 'leaf', 
      imageUrl: 'https://images.unsplash.com/photo-1622015663319-e97e697503ee?auto=format&fit=crop&q=80&w=800' 
    },
    { 
      id: 'l2_metal', 
      name: 'Полотно 2.0 Металлическое', 
      price: 59347, 
      category: 'leaf', 
      imageUrl: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=800' 
    },
  ]
};

export const FRAMES: Record<DoorType, ProductItem[]> = {
  single: [
    { 
      id: 'f1_mdf_wrap', 
      name: 'Короб МДФ (Обхватной)', 
      price: 18022, 
      category: 'frame', 
      description: 'Классический короб с наличниками из МДФ. Регулируемый до 220мм.', 
      imageUrl: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=800' 
    },
    { 
      id: 'f1_metal_corner', 
      name: 'Короб Цельнометаллический (Угловой)', 
      price: 16854, 
      category: 'frame', 
      description: 'Стальной профиль. Высокая прочность. Под покраску.', 
      imageUrl: 'https://images.unsplash.com/photo-1506385779032-44111357591e?auto=format&fit=crop&q=80&w=800' 
    },
    { 
      id: 'f1_hidden_alum', 
      name: 'Короб Скрытый (Алюминиевый)', 
      price: 24500, 
      category: 'frame', 
      description: 'Монтаж в плоскость стены. Невидимая коробка.', 
      imageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800' 
    },
  ],
  one_half: [
    { id: 'f15_mdf_wrap', name: 'Короб 1.5 МДФ (Обхватной)', price: 25231, category: 'frame', imageUrl: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=800' },
    { id: 'f15_metal_corner', name: 'Короб 1.5 Цельнометаллический', price: 23767, category: 'frame', imageUrl: 'https://images.unsplash.com/photo-1506385779032-44111357591e?auto=format&fit=crop&q=80&w=800' },
  ],
  double: [
    { id: 'f2_mdf_wrap', name: 'Короб 2.0 МДФ (Обхватной)', price: 27174, category: 'frame', imageUrl: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=800' },
    { id: 'f2_metal_corner', name: 'Короб 2.0 Цельнометаллический', price: 25780, category: 'frame', imageUrl: 'https://images.unsplash.com/photo-1506385779032-44111357591e?auto=format&fit=crop&q=80&w=800' },
  ]
};

export const OPTIONS: ProductItem[] = [
  // Glazing Options (Page 3)
  { 
    id: 'opt_glass_25', 
    name: 'Остекление 25% (Узкое)', 
    price: 4500, 
    category: 'option', 
    description: 'Вертикальное или прямоугольное окно. Верхняя часть двери.', 
    imageUrl: 'https://images.unsplash.com/photo-1506385779032-44111357591e?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: 'opt_glass_50', 
    name: 'Остекление 50% (Половинное)', 
    price: 7153, 
    category: 'option', 
    description: 'Окно на половину высоты полотна.', 
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: 'opt_glass_75', 
    name: 'Остекление 75% (В пол)', 
    price: 9500, 
    category: 'option', 
    description: 'Максимальное остекление. Армированное или закаленное стекло.', 
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800' 
  },
  
  // Portholes (Page 3)
  { 
    id: 'opt_porthole_d400', 
    name: 'Иллюминатор D400 (МДФ)', 
    price: 6195, 
    category: 'option', 
    description: 'Круглое окно диаметром 400мм с обкладкой из МДФ.', 
    imageUrl: 'https://images.unsplash.com/photo-1549103723-5d5543c8d372?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: 'opt_porthole_inox', 
    name: 'Иллюминатор D350 (INOX)', 
    price: 17389, 
    category: 'option', 
    description: 'Круглое окно с рамкой из нержавеющей стали. Для чистых помещений.', 
    imageUrl: 'https://images.unsplash.com/photo-1549103723-5d5543c8d372?auto=format&fit=crop&q=80&w=800' 
  },

  // Protection (Page 2 - Medical)
  { 
    id: 'opt_kickplate', 
    name: 'Отбойник INOX H=300мм (2 стороны)', 
    price: 2042, 
    category: 'option', 
    description: 'Пластина из нержавеющей стали для защиты низа двери от каталок.', 
    imageUrl: 'https://images.unsplash.com/photo-1631679706909-1e44c347d667?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: 'opt_kickplate_mid', 
    name: 'Отбойная пластина (По центру)', 
    price: 1800, 
    category: 'option', 
    description: 'Защита от ударов рук/каталок на уровне ручки.', 
    imageUrl: 'https://images.unsplash.com/photo-1631679706909-1e44c347d667?auto=format&fit=crop&q=80&w=800' 
  },

  // Technical
  { 
    id: 'opt_threshold', 
    name: 'Автоматический порог ATHMER', 
    price: 2351, 
    category: 'option', 
    description: 'Выпадающий уплотнитель. Звукоизоляция и дымозащита.', 
    imageUrl: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: 'opt_skud', 
    name: 'Подготовка под СКУД', 
    price: 4196, 
    category: 'option', 
    description: 'Кабель-переход и врезка замка.', 
    imageUrl: 'https://images.unsplash.com/photo-1558002038-1091a1661116?auto=format&fit=crop&q=80&w=800' 
  },
];

export const HARDWARE: ProductItem[] = [
  // Hinges (Page 4)
  { 
    id: 'hw_hinge_std', 
    name: 'Петли ввертные (Комплект)', 
    price: 1200, 
    category: 'hardware', 
    description: 'Стандартные петли для деревянных коробок.', 
    imageUrl: 'https://images.unsplash.com/photo-1588619461332-45f50945aa6f?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: 'hw_hinge_hidden', 
    name: 'Петли скрытые TECTUS (SIMONSWERK)', 
    price: 36481, 
    category: 'hardware', 
    description: '3D регулировка. Невидимы при закрытой двери.', 
    imageUrl: 'https://images.unsplash.com/photo-1588619461332-45f50945aa6f?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: 'hw_hinge_overlay', 
    name: 'Петли накладные (Для металла)', 
    price: 2500, 
    category: 'hardware', 
    description: 'Усиленные петли для металлических дверей.', 
    imageUrl: 'https://images.unsplash.com/photo-1588619461332-45f50945aa6f?auto=format&fit=crop&q=80&w=800' 
  },

  // Locks & Panic
  { 
    id: 'hw_panic_bar', 
    name: 'Антипаника (Штанга + Замок)', 
    price: 25618, 
    category: 'hardware', 
    description: 'Накладная штанга для быстрой эвакуации.', 
    imageUrl: 'https://images.unsplash.com/photo-1519219788971-8d9797e0928e?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: 'hw_smart_lock', 
    name: 'Замок SMART (Электронный)', 
    price: 63342, 
    category: 'hardware', 
    description: 'СКУД SVP/SVZ 6000. Доступ по карте/коду.', 
    imageUrl: 'https://images.unsplash.com/photo-1558002038-1091a1661116?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: 'hw_closer_slide', 
    name: 'Доводчик со скользящей шиной', 
    price: 5724, 
    category: 'hardware', 
    description: 'TS Profil EN2-4. Плавное закрывание.', 
    imageUrl: 'https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: 'hw_handle_ss', 
    name: 'Ручка нажимная (Нерж. сталь)', 
    price: 2500, 
    category: 'hardware', 
    imageUrl: 'https://images.unsplash.com/photo-1618606089354-9988a6d2df26?auto=format&fit=crop&q=80&w=800' 
  },
];

export const ACCESSORIES: ProductItem[] = [
  { id: 'acc_stop_floor', name: 'Стопор напольный (INOX)', price: 1500, category: 'accessory', imageUrl: 'https://images.unsplash.com/photo-1618606089354-9988a6d2df26?auto=format&fit=crop&q=80&w=800' },
  { id: 'acc_cylinder', name: 'Цилиндр (Ключ-Ключ)', price: 2500, category: 'accessory', imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800' },
  { id: 'acc_plate', name: 'Номерная табличка', price: 500, category: 'accessory', imageUrl: 'https://images.unsplash.com/photo-1563293883-7c25c68b444b?auto=format&fit=crop&q=80&w=800' },
];
