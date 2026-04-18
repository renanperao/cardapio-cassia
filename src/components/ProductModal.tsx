import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Product, CakeSize, IcingOption, CartItem } from '../types';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

const SIZE_MULTIPLIERS = {
  P: 1,
  M: 1.5,
  G: 2,
};

const ICING_PRICE = 15;

export function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  const [size, setSize] = useState<CakeSize>('P');
  const [icing, setIcing] = useState<IcingOption>('Sem');
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(product.basePrice);

  useEffect(() => {
    let price = product.basePrice;
    
    if (product.category === 'cake') {
      price = price * SIZE_MULTIPLIERS[size];
      if (icing === 'Com') {
        price += ICING_PRICE;
      }
    }
    
    setTotalPrice(price * quantity);
  }, [product, size, icing, quantity]);

  const handleAddToCart = () => {
    onAddToCart({
      id: crypto.randomUUID(),
      product,
      quantity,
      size: product.category === 'cake' ? size : undefined,
      icing: product.category === 'cake' ? icing : undefined,
      totalPrice
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-xl animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:fade-in-0 duration-300">
        <div className="relative h-64 sm:h-72 w-full bg-stone-100">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/80 backdrop-blur p-2 rounded-full text-stone-800 hover:bg-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <h2 className="font-serif text-2xl font-bold text-stone-800 mb-2">{product.name}</h2>
          <p className="text-stone-500 mb-6">{product.description}</p>
          
          {product.category === 'cake' && (
            <div className="space-y-6 mb-8">
              <div>
                <h3 className="text-sm font-semibold text-stone-800 uppercase tracking-wider mb-3">Tamanho</h3>
                <div className="flex gap-3">
                  {(['P', 'M', 'G'] as CakeSize[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`flex-1 py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                        size === s 
                          ? 'border-brand-500 bg-brand-50 text-brand-900' 
                          : 'border-stone-200 text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      {s}
                      <span className="block text-xs font-normal opacity-70 mt-1">
                        {s === 'P' ? 'Aprox. 1kg' : s === 'M' ? 'Aprox. 1.5kg' : 'Aprox. 2kg'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-stone-800 uppercase tracking-wider mb-3">Cobertura (+R$ 15,00)</h3>
                <div className="flex gap-3">
                  {(['Sem', 'Com'] as IcingOption[]).map((i) => (
                    <button
                      key={i}
                      onClick={() => setIcing(i)}
                      className={`flex-1 py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                        icing === i 
                          ? 'border-brand-500 bg-brand-50 text-brand-900' 
                          : 'border-stone-200 text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      {i} Cobertura
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-semibold text-stone-800 uppercase tracking-wider">Quantidade</h3>
            <div className="flex items-center gap-4 bg-stone-50 rounded-xl p-1 border border-stone-100">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center rounded-lg text-stone-500 hover:bg-white hover:shadow-sm transition-all"
              >
                -
              </button>
              <span className="w-4 text-center font-medium text-stone-800">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-lg text-stone-500 hover:bg-white hover:shadow-sm transition-all"
              >
                +
              </button>
            </div>
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="w-full bg-brand-800 hover:bg-brand-900 text-white py-4 rounded-xl font-medium transition-colors shadow-sm flex items-center justify-between px-6"
          >
            <span>Adicionar ao carrinho</span>
            <span className="font-semibold">R$ {totalPrice.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
