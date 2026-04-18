import { useState } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div 
      role={product.isAvailable ? 'button' : undefined}
      tabIndex={product.isAvailable ? 0 : undefined}
      aria-label={product.isAvailable ? `Ver detalhes de ${product.name}` : `${product.name} — esgotado`}
      className={`group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 border border-stone-100 active:scale-[0.98] ${!product.isAvailable ? 'opacity-60 grayscale-[0.2]' : 'cursor-pointer hover:shadow-md'}`}
      onClick={() => product.isAvailable && onSelect(product)}
      onKeyDown={(e) => e.key === 'Enter' && product.isAvailable && onSelect(product)}
    >
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        {!imageLoaded && (
          <div className="absolute inset-0 skeleton" />
        )}
        <img 
          src={product.image} 
          alt={product.name}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
        {product.category === 'vulcao' && (
          <div className="absolute top-3 left-3 bg-red-600/90 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider backdrop-blur-sm shadow-sm">
            Vulcão
          </div>
        )}
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-white/40 flex items-center justify-center backdrop-blur-[1px]">
            <span className="bg-stone-800 text-white text-xs font-semibold px-3 py-1 rounded-full tracking-wider uppercase">
              Esgotado
            </span>
          </div>
        )}
      </div>
      
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <h3 className="font-serif text-sm sm:text-base font-semibold text-stone-800 mb-1 leading-tight">
          {product.name}
        </h3>
        <p className="text-xs text-stone-500 mb-3 line-clamp-2 flex-grow">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-[10px] font-medium text-stone-400">A partir de</span>
          <span className="text-sm font-semibold text-brand-700">
            R$ {product.basePrice.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-xl overflow-hidden shadow-sm border border-stone-100">
      <div className="aspect-square skeleton" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-6 w-3/4 skeleton" />
        <div className="h-4 w-full skeleton" />
        <div className="h-4 w-5/6 skeleton" />
        <div className="flex justify-between mt-2">
          <div className="h-5 w-1/3 skeleton" />
          <div className="h-6 w-1/4 skeleton" />
        </div>
      </div>
    </div>
  );
}
