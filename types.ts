

export type DoorType = 'single' | 'one_half' | 'double';

export interface ProductItem {
  id: string;
  name: string;
  price: number;
  category: 'leaf' | 'frame' | 'option' | 'hardware' | 'accessory';
  description?: string;
  imageUrl?: string; // URL for the product image
  compatibleWith?: DoorType[]; // If undefined, compatible with all
}

export interface DoorConfig {
  id: string; // unique ID for this instance in the project
  doorType: DoorType;
  leaf: ProductItem | null;
  frame: ProductItem | null;
  options: ProductItem[];
  hardware: ProductItem[];
  accessories: ProductItem[];
  quantity: number;
  discount?: {
    value: number;
    type: 'percent' | 'fixed';
  };
}

export interface DoorTemplate {
  id: string;
  name: string;
  config: {
    doorType: DoorType;
    leaf: ProductItem | null;
    frame: ProductItem | null;
    options: ProductItem[];
    hardware: ProductItem[];
    accessories: ProductItem[];
  }
}

export interface SavedProject {
  id: string;
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
  name: string; // Project Name
  customer: string;
  manager: string;
  comments: string;
  items: DoorConfig[];
  totalAmount: number;
}

export interface ProjectState {
  items: DoorConfig[];
  customerName: string;
  projectName: string;
}

export const DOOR_TYPES: { id: DoorType; label: string }[] = [
  { id: 'single', label: 'Однопольный блок (1.0)' },
  { id: 'one_half', label: 'Полуторный блок (1.5)' },
  { id: 'double', label: 'Двупольный блок (2.0)' },
];