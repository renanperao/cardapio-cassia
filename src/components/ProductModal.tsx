import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Product, CakeSize, CaseirinhoSize, IcingOption, CartItem } from '../types';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

const CAKE_SIZE_MULTIPLIERS = {
  P: 1,
  M: 1.5,
  G: 2,
};
const CAKE_ICING_PRICE = 15;

export function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  // Common states
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(product.basePrice);

  // Cake states
  const [cakeSize, setCakeSize] = useState<CakeSize>('P');
  const [cakeIcing, setCakeIcing] = useState<IcingOption>('Sem');

  // Caseirinhos states
  const [caseirinhoSize, setCaseirinhoSize] = useState<CaseirinhoSize>('M');
  const [caseirinhoIcing, setCaseirinhoIcing] = useState<IcingOption>('Sem');
  const [caseirinhoFlavor, setCaseirinhoFlavor] = useState<string>('');

  // Pool Cake states
  const [poolCakeSize, setPoolCakeSize] = useState<CaseirinhoSize>('M');

  // Recheado states
  const [recheadoKg, setRecheadoKg] = useState<number>(1);
  const [recheadoFinishing, setRecheadoFinishing] = useState<string>('');
  const [recheadoHasStrawberry, setRecheadoHasStrawberry] = useState<boolean>(false);

  // Sweet states
  const [sweetShape, setSweetShape] = useState<boolean>(false);

  useEffect(() => {
    // Set initial defaults for Milho and Chocolate when product opens
    if (product.category === 'caseirinhos' && product.caseirinhoMetadata) {
      if (product.caseirinhoMetadata.isMilho) {
        setCaseirinhoIcing('Com');
        setCaseirinhoFlavor('Goiabada');
      } else if (product.caseirinhoMetadata.isChocolate) {
        setCaseirinhoFlavor('Chocolate');
      }
    }

    if (product.category === 'recheado' && product.recheadoMetadata) {
      setRecheadoKg(product.recheadoMetadata.minKg);
      setRecheadoFinishing('');
      setRecheadoHasStrawberry(false);
    }

    if (product.category === 'sweet') {
      setQuantity(25);
      setSweetShape(false);
    } else {
      setQuantity(1);
    }
  }, [product]);

  useEffect(() => {
    let price = product.basePrice;
    
    if (product.category === 'cake') {
      price = price * CAKE_SIZE_MULTIPLIERS[cakeSize];
      if (cakeIcing === 'Com') {
        price += CAKE_ICING_PRICE;
      }
    } else if (product.category === 'caseirinhos' && product.caseirinhoMetadata) {
      const meta = product.caseirinhoMetadata;
      if (caseirinhoSize === 'M') {
        price = meta.priceM;
        if (caseirinhoIcing === 'Com') price += meta.icingPriceM;
      } else if (caseirinhoSize === 'G') {
        price = meta.priceG;
        if (caseirinhoIcing === 'Com') price += meta.icingPriceG;
      }
    } else if (product.category === 'pool-cake' && product.poolCakeMetadata) {
      price = poolCakeSize === 'M' ? product.poolCakeMetadata.priceM : product.poolCakeMetadata.priceG;
    } else if (product.category === 'vulcao' && product.vulcaoMetadata) {
      price = poolCakeSize === 'M' ? product.vulcaoMetadata.priceM : product.vulcaoMetadata.priceG;
    } else if (product.category === 'recheado' && product.recheadoMetadata) {
      price = product.recheadoMetadata.pricePerKg * recheadoKg;
      if (recheadoHasStrawberry) {
        price += 10;
      }
    } else if (product.category === 'sweet') {
      if (sweetShape) {
        price += 0.5;
      }
    }
    
    setTotalPrice(price * quantity);
  }, [product, cakeSize, cakeIcing, caseirinhoSize, caseirinhoIcing, poolCakeSize, recheadoKg, recheadoHasStrawberry, sweetShape, quantity]);

  const handleAddToCart = () => {
    let finalFlavor = '';
    
    if (product.category === 'caseirinhos' && product.caseirinhoMetadata) {
      if (product.caseirinhoMetadata.isMilho) {
        finalFlavor = caseirinhoFlavor; // Goiabada, Requeijão, etc
      } else if (caseirinhoIcing === 'Com') {
        if (product.caseirinhoMetadata.isChocolate) {
          finalFlavor = caseirinhoFlavor;
        } else {
          finalFlavor = product.caseirinhoMetadata.icingName || 'Padrão';
        }
      }
    }

    onAddToCart({
      id: crypto.randomUUID(),
      product,
      quantity,
      size: product.category === 'cake' ? cakeSize : (product.category === 'caseirinhos' ? caseirinhoSize : ((product.category === 'pool-cake' || product.category === 'vulcao') ? poolCakeSize : undefined)),
      icing: product.category === 'cake' ? cakeIcing : (product.category === 'caseirinhos' ? caseirinhoIcing : undefined),
      caseirinhoIcingFlavor: finalFlavor || undefined,
      recheadoKg: product.category === 'recheado' ? recheadoKg : undefined,
      recheadoFinishing: product.category === 'recheado' && product.recheadoMetadata?.hasFinishingOptions ? recheadoFinishing : undefined,
      recheadoHasStrawberry: product.category === 'recheado' && product.recheadoMetadata?.isBrigadeiroGourmet ? recheadoHasStrawberry : undefined,
      sweetShape: product.category === 'sweet' && product.sweetMetadata?.isTradicional ? sweetShape : undefined,
      totalPrice
    });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-stone-900/40 backdrop-blur-sm transition-opacity"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-xl animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:fade-in-0 duration-300 flex flex-col max-h-[92dvh] sm:max-h-[90vh]">
        <div className="relative h-52 sm:h-64 w-full bg-stone-100 flex-shrink-0">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
          <button 
            onClick={onClose}
            aria-label="Fechar"
            className="absolute top-4 right-4 bg-white/80 backdrop-blur p-2 rounded-full text-stone-800 hover:bg-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X size={20} />
          </button>
          {/* Drag handle indicator for mobile */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-white/60 rounded-full sm:hidden" />
        </div>
        
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 overscroll-contain">
          <h2 className="font-serif text-2xl font-bold text-stone-800 mb-2">{product.name}</h2>
          <p className="text-stone-500 mb-6">{product.description}</p>
          
          {/* CATEGORIA: CAKE */}
          {product.category === 'cake' && (
            <div className="space-y-6 mb-8">
              <div>
                <h3 className="text-sm font-semibold text-stone-800 uppercase tracking-wider mb-3">Tamanho</h3>
                <div className="flex gap-3">
                  {(['P', 'M', 'G'] as CakeSize[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setCakeSize(s)}
                      className={`flex-1 py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                        cakeSize === s 
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
                      onClick={() => setCakeIcing(i)}
                      className={`flex-1 py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                        cakeIcing === i 
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

          {/* CATEGORIA: CASEIRINHOS */}
          {product.category === 'caseirinhos' && product.caseirinhoMetadata && (
            <div className="space-y-6 mb-8">
              <div>
                <h3 className="text-sm font-semibold text-stone-800 uppercase tracking-wider mb-3">Tamanho</h3>
                <div className="flex gap-3">
                  {(['M', 'G'] as CaseirinhoSize[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setCaseirinhoSize(s)}
                      className={`flex-1 py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                        caseirinhoSize === s 
                          ? 'border-brand-500 bg-brand-50 text-brand-900' 
                          : 'border-stone-200 text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      {s}
                      <span className="block text-[10px] sm:text-xs font-normal opacity-70 mt-1 leading-tight">
                        {s === 'M' ? 'Aprox. 600g' : 'Aprox. 1kg'} <br />
                        {s === 'M' ? '6 a 8 fatias' : '8 a 10 fatias'}
                      </span>
                      <span className="block text-xs font-semibold text-brand-700 mt-1">
                        R$ {(s === 'M' ? product.caseirinhoMetadata!.priceM : product.caseirinhoMetadata!.priceG).toFixed(2)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              
              {product.caseirinhoMetadata.isMilho ? (
                <div>
                  <h3 className="text-sm font-semibold text-stone-800 uppercase tracking-wider mb-3">Opções de Sabor</h3>
                  <div className="flex flex-col gap-2">
                    {['Goiabada', 'Requeijão', 'Erva Doce'].map((flavor) => (
                      <label key={flavor} className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-stone-50 transition-colors">
                        <input 
                          type="radio" 
                          name="milhoFlavor" 
                          checked={caseirinhoFlavor === flavor}
                          onChange={() => setCaseirinhoFlavor(flavor)}
                          className="text-brand-600 focus:ring-brand-500"
                        />
                        <span className="text-sm font-medium text-stone-800">{flavor}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ) : product.caseirinhoMetadata.hasNoIcing ? null : (
                <div>
                  <h3 className="text-sm font-semibold text-stone-800 uppercase tracking-wider mb-3">
                    Cobertura (+R$ {caseirinhoSize === 'M' ? product.caseirinhoMetadata.icingPriceM.toFixed(2) : product.caseirinhoMetadata.icingPriceG.toFixed(2)})
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3 mb-3">
                    <button
                      onClick={() => setCaseirinhoIcing('Sem')}
                      className={`flex-1 py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                        caseirinhoIcing === 'Sem'
                          ? 'border-brand-500 bg-brand-50 text-brand-900' 
                          : 'border-stone-200 text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      Sem Cobertura
                    </button>
                    <button
                      onClick={() => setCaseirinhoIcing('Com')}
                      className={`flex-1 py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                        caseirinhoIcing === 'Com'
                          ? 'border-brand-500 bg-brand-50 text-brand-900' 
                          : 'border-stone-200 text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      {product.caseirinhoMetadata.icingName && !product.caseirinhoMetadata.isChocolate 
                        ? `Adicionar Cobertura de ${product.caseirinhoMetadata.icingName}`
                        : 'Adicionar Cobertura'}
                    </button>
                  </div>
                  
                  {caseirinhoIcing === 'Com' && product.caseirinhoMetadata.isChocolate && (
                    <div className="mt-4 p-4 bg-stone-50 rounded-xl border border-stone-100">
                      <h4 className="text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2">Escolha a Cobertura:</h4>
                      <div className="flex flex-col gap-2">
                        {['Chocolate', 'Leite Ninho'].map((flavor) => (
                          <label key={flavor} className="flex items-center gap-3 cursor-pointer">
                            <input 
                              type="radio" 
                              name="chocFlavor" 
                              checked={caseirinhoFlavor === flavor}
                              onChange={() => setCaseirinhoFlavor(flavor)}
                              className="text-brand-600 focus:ring-brand-500"
                            />
                            <span className="text-sm text-stone-800">{flavor}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* CATEGORIA: POOL CAKE E VULCÃO */}
          {(product.category === 'pool-cake' || product.category === 'vulcao') && (
            <div className="space-y-6 mb-8">
              <div>
                <h3 className="text-sm font-semibold text-stone-800 uppercase tracking-wider mb-3">Tamanho</h3>
                <div className="flex gap-3">
                  {(['M', 'G'] as CaseirinhoSize[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setPoolCakeSize(s)}
                      className={`flex-1 py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                        poolCakeSize === s 
                          ? 'border-brand-500 bg-brand-50 text-brand-900' 
                          : 'border-stone-200 text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      {s}
                      {product.category === 'pool-cake' && (
                        <span className="block text-[10px] sm:text-xs font-normal opacity-70 mt-1 leading-tight">
                          {s === 'M' ? 'Aprox. 1kg' : 'Aprox. 1,5kg'} <br />
                          {s === 'M' ? '8 a 10 fatias' : '10 a 15 fatias'}
                        </span>
                      )}
                      <span className="block text-xs font-semibold text-brand-700 mt-1">
                        R$ {(s === 'M' 
                          ? (product.poolCakeMetadata?.priceM || product.vulcaoMetadata?.priceM)
                          : (product.poolCakeMetadata?.priceG || product.vulcaoMetadata?.priceG)
                        )?.toFixed(2)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CATEGORIA: RECHEADO */}
          {product.category === 'recheado' && product.recheadoMetadata && (
            <div className="space-y-6 mb-8">
              <div>
                <h3 className="text-sm font-semibold text-stone-800 uppercase tracking-wider mb-3">Peso (KG)</h3>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-4 bg-stone-50 rounded-xl p-1 border border-stone-100 max-w-[200px]">
                    <button 
                      onClick={() => setRecheadoKg(Math.max(product.recheadoMetadata!.minKg, recheadoKg - 0.5))}
                      className="w-11 h-11 flex items-center justify-center rounded-lg text-stone-500 hover:bg-white hover:shadow-sm transition-all text-lg"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-medium text-stone-800">{recheadoKg.toFixed(1)} kg</span>
                    <button 
                      onClick={() => setRecheadoKg(recheadoKg + 0.5)}
                      className="w-11 h-11 flex items-center justify-center rounded-lg text-stone-500 hover:bg-white hover:shadow-sm transition-all text-lg"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-xs text-stone-500">
                    * Mínimo de {product.recheadoMetadata.minKg}kg. 1kg rende em média 10 a 12 fatias.
                  </p>
                </div>
              </div>

              {product.recheadoMetadata.hasFinishingOptions && (
                <div>
                  <h3 className="text-sm font-semibold text-stone-800 uppercase tracking-wider mb-3">Acabamento / Cobertura</h3>
                  <div className="flex flex-col gap-2">
                    {['Briganache', 'Buttercream', 'Chantilly', 'Chantininho', 'Nata'].map((finishing) => (
                      <label key={finishing} className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-stone-50 transition-colors">
                        <input 
                          type="radio" 
                          name="recheadoFinishing" 
                          checked={recheadoFinishing === finishing}
                          onChange={() => setRecheadoFinishing(finishing)}
                          className="text-brand-600 focus:ring-brand-500"
                        />
                        <span className="text-sm font-medium text-stone-800">{finishing}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {product.recheadoMetadata.isBrigadeiroGourmet && (
                <div>
                  <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer bg-stone-50 hover:bg-stone-100 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={recheadoHasStrawberry}
                      onChange={(e) => setRecheadoHasStrawberry(e.target.checked)}
                      className="text-brand-600 focus:ring-brand-500 rounded"
                    />
                    <div>
                      <span className="block text-sm font-medium text-stone-800">Adicionar Morango</span>
                      <span className="block text-xs text-brand-700 font-semibold">+ R$ 10,00 fixo</span>
                    </div>
                  </label>
                </div>
              )}
            </div>
          )}
          {/* CATEGORIA: SWEET (DOCES) */}
          {product.category === 'sweet' && product.sweetMetadata?.isTradicional && (
            <div className="space-y-6 mb-8">
              <div>
                <h3 className="text-sm font-semibold text-stone-800 uppercase tracking-wider mb-3">Opcionais</h3>
                <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer bg-stone-50 hover:bg-stone-100 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={sweetShape}
                    onChange={(e) => setSweetShape(e.target.checked)}
                    className="text-brand-600 focus:ring-brand-500 rounded"
                  />
                  <div>
                    <span className="block text-sm font-medium text-stone-800">Formato de Flor ou Coração</span>
                    <span className="block text-xs text-brand-700 font-semibold">+ R$ 0,50 por unidade</span>
                  </div>
                </label>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-semibold text-stone-800 uppercase tracking-wider">
              Quantidade {product.category === 'sweet' && '(Lotes de 25)'}
            </h3>
            <div className="flex items-center gap-4 bg-stone-50 rounded-xl p-1 border border-stone-100">
              <button 
                onClick={() => setQuantity(Math.max(product.category === 'sweet' ? 25 : 1, quantity - (product.category === 'sweet' ? 25 : 1)))}
                className="w-11 h-11 flex items-center justify-center rounded-lg text-stone-500 hover:bg-white hover:shadow-sm transition-all text-lg"
              >
                -
              </button>
              <span className="w-8 text-center font-medium text-stone-800">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + (product.category === 'sweet' ? 25 : 1))}
                className="w-11 h-11 flex items-center justify-center rounded-lg text-stone-500 hover:bg-white hover:shadow-sm transition-all text-lg"
              >
                +
              </button>
            </div>
          </div>
          
          <button 
            onClick={handleAddToCart}
            disabled={product.category === 'recheado' && product.recheadoMetadata?.hasFinishingOptions && !recheadoFinishing}
            className="w-full bg-brand-800 hover:bg-brand-900 disabled:bg-stone-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-medium transition-colors shadow-sm flex items-center justify-between px-6"
          >
            <span>Adicionar ao carrinho</span>
            <div className="text-right flex flex-col items-end">
              {product.category === 'sweet' && (
                <span className="text-[10px] font-normal opacity-80 mb-0.5">
                  {quantity} un x R$ {(product.basePrice + (sweetShape ? 0.5 : 0)).toFixed(2)}
                </span>
              )}
              <span className="font-semibold text-lg leading-none">R$ {totalPrice.toFixed(2)}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
