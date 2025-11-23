import React from 'react';
// This component is currently superseded by the main layout logic in App.tsx
// Keeping it empty/minimal to avoid breaking imports if any, or just return null.
// The new project summary bar is implemented directly in App.tsx for better state access.

interface OrderSummaryProps {
  cart: any;
  services: any[];
  onClear: () => void;
  onSubmit: () => void;
}

export const OrderSummary: React.FC<OrderSummaryProps> = () => {
  return null;
};
