import React from 'react';
import { ProductItem } from '../types';
import { Check, Info } from 'lucide-react';

interface SelectionCardProps {
  item: ProductItem;
  isSelected: boolean;
  type: 'radio' | 'checkbox';
  onSelect: () => void;
  onInfoClick?: (e: React.MouseEvent) => void;
  icon?: React.ReactNode;
}

export const SelectionCard = React.memo<SelectionCardProps>(({ item, isSelected, type, onSelect, onInfoClick, icon }) => {
  return (
    <div 
      onClick={onSelect}
      className={`
        group relative p-4 md:p-5 border cursor-pointer transition-all duration-300
        ${isSelected 
          ? 'border-dorren-lightBlue bg-dorren-darkBlue/40' 
          : 'border-dorren-darkBlue bg-transparent hover:border-dorren-lightBlue/30 hover:bg-dorren-darkBlue/10'
        }
      `}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {/* Custom Radio/Checkbox Indicator */}
            <div className={`
              w-4 h-4 flex-shrink-0 flex items-center justify-center border transition-all duration-300
              ${type === 'radio' ? 'rounded-full' : 'rounded-sm'}
              ${isSelected ? 'border-dorren-lightBlue bg-dorren-lightBlue text-dorren-black' : 'border-white/30 bg-transparent'}
            `}>
              {isSelected && <Check size={10} strokeWidth={4} />}
            </div>
            
            {/* Optional Icon */}
            {icon && (
              <div className={`flex-shrink-0 ${isSelected ? 'text-dorren-lightBlue' : 'text-white/40 group-hover:text-white/60'} transition-colors`}>
                {icon}
              </div>
            )}
            
            <h3 className={`text-sm md:text-base font-light tracking-wide ${isSelected ? 'text-white' : 'text-white/80'}`}>
              {item.name}
            </h3>

            {/* Info Icon - Only show if onInfoClick is provided */}
            {onInfoClick && (
              <button 
                onClick={onInfoClick}
                className="p-1 text-white/40 hover:text-dorren-lightBlue transition-colors z-10"
                title="Подробнее"
              >
                <Info size={16} />
              </button>
            )}
          </div>
          
          {item.description && (
            <p className="text-xs text-dorren-gray mt-1 ml-6 font-light">
              {item.description}
            </p>
          )}
        </div>

        <div className="text-right whitespace-nowrap">
          <div className={`font-mono text-sm ${isSelected ? 'text-dorren-lightBlue' : 'text-white/60'}`}>
            {item.price.toLocaleString('ru-RU')} ₽
          </div>
        </div>
      </div>
      
      {/* Decorative corners for active state */}
      {isSelected && (
        <>
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-dorren-lightBlue"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-dorren-lightBlue"></div>
        </>
      )}
    </div>
  );
});

SelectionCard.displayName = 'SelectionCard';