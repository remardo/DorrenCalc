// Утилита для импорта прайс-листа из data.ts в Convex
import { LEAFS, FRAMES, OPTIONS, HARDWARE, ACCESSORIES } from '../data';
import { ProductItem, DoorType } from '../types';

// Функция для преобразования данных из data.ts в формат для Convex
export function preparePriceDataForImport() {
  const products: any[] = [];

  // Обрабатываем полотна (LEAFS)
  Object.entries(LEAFS).forEach(([doorType, items]) => {
    items.forEach((item: ProductItem) => {
      products.push({
        id: item.id,
        name: item.name,
        price: item.price,
        category: item.category,
        description: item.description,
        imageUrl: item.imageUrl,
        compatibleWith: item.compatibleWith,
        doorType: doorType as DoorType,
        isActive: true,
      });
    });
  });

  // Обрабатываем коробки (FRAMES)
  Object.entries(FRAMES).forEach(([doorType, items]) => {
    items.forEach((item: ProductItem) => {
      products.push({
        id: item.id,
        name: item.name,
        price: item.price,
        category: item.category,
        description: item.description,
        imageUrl: item.imageUrl,
        compatibleWith: item.compatibleWith,
        doorType: doorType as DoorType,
        isActive: true,
      });
    });
  });

  // Обрабатываем опции (OPTIONS)
  OPTIONS.forEach((item: ProductItem) => {
    products.push({
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category,
      description: item.description,
      imageUrl: item.imageUrl,
      compatibleWith: item.compatibleWith,
      isActive: true,
    });
  });

  // Обрабатываем фурнитуру (HARDWARE)
  HARDWARE.forEach((item: ProductItem) => {
    products.push({
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category,
      description: item.description,
      imageUrl: item.imageUrl,
      compatibleWith: item.compatibleWith,
      isActive: true,
    });
  });

  // Обрабатываем аксессуары (ACCESSORIES)
  ACCESSORIES.forEach((item: ProductItem) => {
    products.push({
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category,
      description: item.description,
      imageUrl: item.imageUrl,
      compatibleWith: item.compatibleWith,
      isActive: true,
    });
  });

  return products;
}

// Функция для получения продуктов по типу двери из локальных данных
export function getLocalProductsByDoorType(doorType: DoorType) {
  return {
    leafs: LEAFS[doorType] || [],
    frames: FRAMES[doorType] || [],
    options: OPTIONS,
    hardware: HARDWARE,
    accessories: ACCESSORIES,
  };
}

// Функция для получения всех продуктов из локальных данных
export function getAllLocalProducts() {
  const allProducts: ProductItem[] = [];

  // Добавляем все полотна
  Object.values(LEAFS).forEach(items => {
    allProducts.push(...items);
  });

  // Добавляем все коробки
  Object.values(FRAMES).forEach(items => {
    allProducts.push(...items);
  });

  // Добавляем опции, фурнитуру и аксессуары
  allProducts.push(...OPTIONS, ...HARDWARE, ...ACCESSORIES);

  return allProducts;
}
