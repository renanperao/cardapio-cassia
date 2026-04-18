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

  const cakes = products.filter(p => p.category === 'cake');
  const sweets = products.filter(p => p.category === 'sweet');

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

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6">
        <section className="mb-16">
          <h2 className="font-serif text-2xl font-bold text-stone-800 mb-8 flex items-center gap-4">
            Bolos Artesanais
            <span className="h-px bg-stone-200 flex-grow" />
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {loading 
              ? Array(3).fill(0).map((_, i) => <ProductSkeleton key={i} />)
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

        <section>
          <h2 className="font-serif text-2xl font-bold text-stone-800 mb-8 flex items-center gap-4">
            Doces
            <span className="h-px bg-stone-200 flex-grow" />
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {loading 
              ? Array(3).fill(0).map((_, i) => <ProductSkeleton key={i} />)
              : sweets.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onSelect={setSelectedProduct} 
                  />
                ))
            }
          </div>
        </section>
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
                            {item.quantity}x • {item.size && `Tamanho ${item.size}`}{item.icing && ` • ${item.icing} Cob.`}
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
