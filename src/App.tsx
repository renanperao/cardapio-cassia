import { useState } from 'react';
import { ShoppingBag, ChevronRight, X } from 'lucide-react';
import { useData } from './hooks/useData';
import { useCart } from './hooks/useCart';
import { ProductCard, ProductSkeleton } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { Product } from './types';

function App() {
  const { products, settings, loading } = useData();
  const cart = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const sweetSubcategoryOrder = [
    'Brigadeiros Tradicionais',
    'Brigadeiros Gourmet',
    'Doces Finos',
    'Coxinha de Morango',
    'Bombons',
  ];

  const cakes = products.filter(p => p.category === 'cake' && (activeCategory === 'all' || activeCategory === 'cake'));
  const caseirinhos = products.filter(p => p.category === 'caseirinhos' && (activeCategory === 'all' || activeCategory === 'caseirinhos'));
  const poolCakes = products.filter(p => p.category === 'pool-cake' && (activeCategory === 'all' || activeCategory === 'pool-cake'));
  const vulcaoCakes = products.filter(p => p.category === 'vulcao' && (activeCategory === 'all' || activeCategory === 'vulcao'));
  const recheados = products.filter(p => p.category === 'recheado' && (activeCategory === 'all' || activeCategory === 'recheado'));
  const sweets = products.filter(p => p.category === 'sweet' && (activeCategory === 'all' || activeCategory === 'sweet'));
  const groupedSweets = sweets.reduce<Record<string, Product[]>>((groups, product) => {
    const key = product.subCategory ?? 'Doces';

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(product);
    return groups;
  }, {});
  const groupedSweetEntries = Object.entries(groupedSweets).sort(([a], [b]) => {
    const indexA = sweetSubcategoryOrder.indexOf(a);
    const indexB = sweetSubcategoryOrder.indexOf(b);
    const safeIndexA = indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA;
    const safeIndexB = indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB;

    return safeIndexA - safeIndexB || a.localeCompare(b);
  });

  const categories = [
    { id: 'all', label: 'Tudo' },
    { id: 'caseirinhos', label: 'Caseirinhos' },
    { id: 'pool-cake', label: 'Pool Cakes' },
    { id: 'vulcao', label: 'Bolos Vulcão' },
    { id: 'recheado', label: 'Bolos Recheados' },
    { id: 'sweet', label: 'Doces Finos' },
  ];

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    window.scrollTo({ top: 280, behavior: 'smooth' }); // Adjust pixel value to roughly where the sticky nav is
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Status Banner */}
      <div className={`py-2 px-4 text-center text-xs font-medium uppercase tracking-widest text-white ${settings.isOpen ? 'bg-brand-800' : 'bg-stone-500'}`}>
        {settings.isOpen ? 'Aberta para pedidos' : 'Fechada no momento'}
      </div>

      {/* Header */}
      <header className="py-12 px-6 text-center max-w-2xl mx-auto">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 mb-4 tracking-tight">
          Cassia
        </h1>
        <p className="text-sm uppercase tracking-widest text-stone-500 mb-6">
          Confeitaria Artesanal
        </p>
        <p className="text-stone-600 max-w-md mx-auto leading-relaxed">
          Bolos e doces feitos com ingredientes selecionados e muito carinho para adoçar o seu dia.
        </p>
      </header>

      {/* Category Navigation */}
      <nav className="sticky top-0 z-40 bg-[#fcf9f5]/90 backdrop-blur-md pb-4 pt-4 mb-8 border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex overflow-x-auto md:flex-wrap md:justify-center hide-scrollbar gap-3 pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all flex-shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-brand-800 text-white shadow-sm'
                    : 'bg-white text-stone-600 border border-stone-200 hover:border-brand-300 hover:text-brand-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6">
        {cakes.length > 0 && (
          <section className="mb-16">
            <h2 className="font-serif text-2xl font-bold text-stone-800 mb-8 flex items-center gap-4">
            Bolos Artesanais
            <span className="h-px bg-stone-200 flex-grow" />
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {loading 
              ? Array(4).fill(0).map((_, i) => <ProductSkeleton key={i} />)
              : cakes.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onSelect={setSelectedProduct} 
                  />
                ))
            }
            </div>
          </section>
        )}

        {caseirinhos.length > 0 && (
          <section className="mb-16">
            <h2 className="font-serif text-2xl font-bold text-stone-800 mb-8 flex items-center gap-4">
              Caseirinhos
              <span className="h-px bg-stone-200 flex-grow" />
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
              {loading 
                ? Array(4).fill(0).map((_, i) => <ProductSkeleton key={i} />)
                : caseirinhos.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onSelect={setSelectedProduct} 
                    />
                  ))
              }
            </div>
          </section>
        )}

        {poolCakes.length > 0 && (
          <section className="mb-16">
            <h2 className="font-serif text-2xl font-bold text-stone-800 mb-8 flex items-center gap-4">
              Pool Cakes
              <span className="h-px bg-stone-200 flex-grow" />
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
              {loading 
                ? Array(4).fill(0).map((_, i) => <ProductSkeleton key={i} />)
                : poolCakes.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onSelect={setSelectedProduct} 
                    />
                  ))
              }
            </div>
          </section>
        )}

        {vulcaoCakes.length > 0 && (
          <section className="mb-16">
            <h2 className="font-serif text-2xl font-bold text-stone-800 mb-8 flex items-center gap-4">
              Bolos Vulcão
              <span className="h-px bg-stone-200 flex-grow" />
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
              {loading 
                ? Array(4).fill(0).map((_, i) => <ProductSkeleton key={i} />)
                : vulcaoCakes.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onSelect={setSelectedProduct} 
                    />
                  ))
              }
            </div>
          </section>
        )}

        {recheados.length > 0 && (
          <section className="mb-16">
            <h2 className="font-serif text-2xl font-bold text-stone-800 mb-8 flex items-center gap-4">
              Bolos Recheados
              <span className="h-px bg-stone-200 flex-grow" />
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
              {loading 
                ? Array(4).fill(0).map((_, i) => <ProductSkeleton key={i} />)
                : recheados.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onSelect={setSelectedProduct} 
                    />
                  ))
              }
            </div>
          </section>
        )}

        {sweets.length > 0 && (
          <section>
            <h2 className="font-serif text-2xl font-bold text-stone-800 mb-8 flex items-center gap-4">
              Doces (Lotes)
              <span className="h-px bg-stone-200 flex-grow" />
            </h2>
          
            <div className="space-y-8">
              {loading
                ? Array(6).fill(0).map((_, i) => <div key={i} className="h-20 bg-stone-100 animate-pulse rounded-2xl" />)
                : groupedSweetEntries.map(([subCategory, products]) => (
                    <div key={subCategory} className="space-y-4">
                      <div className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-[#f7f1e8] px-4 py-3">
                        <h3 className="font-serif text-lg font-semibold text-stone-800">{subCategory}</h3>
                        <span className="h-px flex-grow bg-stone-300" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {products.map(product => (
                          <button 
                            key={product.id}
                            onClick={() => setSelectedProduct(product)}
                            className="group flex items-center gap-4 bg-white p-3 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md hover:border-brand-200 transition-all text-left w-full"
                          >
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-16 h-16 rounded-xl object-cover bg-stone-50"
                            />
                            <div className="flex-grow">
                              <h3 className="font-semibold text-stone-800 group-hover:text-brand-700 transition-colors">{product.name}</h3>
                              <p className="text-xs text-stone-500 line-clamp-1">{product.description}</p>
                              <p className="text-sm font-bold text-brand-700 mt-1">R$ {product.basePrice.toFixed(2)} / un</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
              }
            </div>
          </section>
        )}
      </main>

      {/* Modals & Cart */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onAddToCart={cart.addItem}
        />
      )}

      {/* Floating Cart Button */}
      {cart.items.length > 0 && !cart.isCartOpen && (
        <button 
          onClick={() => cart.setIsCartOpen(true)}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-brand-800 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all z-40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-8 duration-300"
        >
          <div className="relative">
            <ShoppingBag size={24} />
            <span className="absolute -top-2 -right-2 bg-white text-brand-900 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
              {cart.items.length}
            </span>
          </div>
          <span className="font-medium pr-2 hidden sm:block">Ver Carrinho</span>
        </button>
      )}

      {/* Cart Drawer Overlay */}
      {cart.isCartOpen && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 transition-opacity flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold text-stone-800">Carrinho</h2>
              <button 
                onClick={() => cart.setIsCartOpen(false)}
                className="text-stone-400 hover:text-stone-800 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {cart.items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-stone-400">
                  <ShoppingBag size={48} className="mb-4 opacity-20" />
                  <p>Seu carrinho está vazio.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded-lg bg-stone-100" />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium text-stone-800 leading-tight pr-4">{item.product.name}</h4>
                            <button 
                              onClick={() => cart.removeItem(item.id)}
                              className="text-stone-400 hover:text-red-500 transition-colors p-1 -mr-1"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          <p className="text-xs text-stone-500">
                            {item.quantity}x • {item.size && `Tamanho ${item.size}`}
                            {item.product.category !== 'caseirinhos' && item.icing && ` • ${item.icing} Cob.`}
                            {item.product.category === 'caseirinhos' && item.caseirinhoIcingFlavor && ` • Sabor: ${item.caseirinhoIcingFlavor}`}
                          </p>
                        </div>
                        <p className="font-semibold text-brand-800">
                          R$ {item.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-stone-100 bg-stone-50">
              <div className="flex items-center justify-between mb-6">
                <span className="text-stone-600 font-medium">Total</span>
                <span className="font-serif text-2xl font-bold text-stone-900">
                  R$ {cart.totalCartPrice.toFixed(2)}
                </span>
              </div>
              <button 
                disabled={cart.items.length === 0 || !settings.isOpen}
                onClick={cart.checkout}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                {!settings.isOpen ? 'Fechado no momento' : 'Finalizar via WhatsApp'}
                {settings.isOpen && <ChevronRight size={20} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
