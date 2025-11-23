
import { DoorConfig, ProductItem, DoorType, DOOR_TYPES } from './types';

// Helper: Calculate total for a single item (config)
export const calculateItemTotal = (
  leaf: ProductItem | null,
  frame: ProductItem | null,
  options: ProductItem[],
  hardware: ProductItem[],
  accessories: ProductItem[],
  quantity: number,
  discountValue?: string,
  discountType?: 'percent' | 'fixed'
): number => {
  let basePrice = 0;
  if (leaf) basePrice += leaf.price;
  if (frame) basePrice += frame.price;
  options.forEach(opt => basePrice += opt.price);
  hardware.forEach(hw => basePrice += hw.price);
  accessories.forEach(acc => basePrice += acc.price);

  let total = basePrice * quantity;

  // Apply Discount
  if (discountValue) {
    const val = parseFloat(discountValue);
    if (!isNaN(val) && val > 0) {
      if (discountType === 'fixed') {
        total = Math.max(0, total - val);
      } else {
        total = Math.max(0, total - (total * (val / 100)));
      }
    }
  }

  return Math.round(total);
};

// Helper: Calculate total for the entire project
export const calculateProjectTotal = (items: DoorConfig[]): number => {
  return items.reduce((acc, item) => {
    const discVal = item.discount?.value.toString();
    const discType = item.discount?.type;
    return acc + calculateItemTotal(
      item.leaf, 
      item.frame, 
      item.options, 
      item.hardware, 
      item.accessories, 
      item.quantity, 
      discVal, 
      discType
    );
  }, 0);
};
