import { useState } from 'react';
import { ArrowLeft, Save, Package } from 'lucide-react';
import { useData } from './hooks/useData';
import { Product } from './types';
import { Link } from 'react-router-dom';

const ADMIN_PASSWORD = 'cassiaadmin';

export default function Admin() {
  const { products, settings, updateProduct, toggleProductAvailability, updateSettings } = useData();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Senha incorreta!');
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct);
      setEditingProduct(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-bold text-stone-900 mb-2">Área Restrita</h1>
            <p className="text-stone-500 text-sm">Acesso ao painel de administração</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Senha</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-stone-900 hover:bg-stone-800 text-white py-3 rounded-xl font-medium transition-colors"
            >
              Entrar
            </button>
            <div className="text-center pt-4">
              <Link to="/" className="text-sm text-brand-600 hover:underline">Voltar para a loja</Link>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-stone-400 hover:text-stone-800 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="font-serif text-xl font-bold text-stone-900">Painel Admin</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-stone-600">Status da Loja:</span>
            <button
              onClick={() => updateSettings({ isOpen: !settings.isOpen })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.isOpen ? 'bg-green-500' : 'bg-stone-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.isOpen ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
            <span className={`text-sm font-semibold ${settings.isOpen ? 'text-green-600' : 'text-stone-500'}`}>
              {settings.isOpen ? 'ABERTA' : 'FECHADA'}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8 flex items-center gap-3">
          <Package className="text-brand-600" />
          <h2 className="font-serif text-2xl font-bold text-stone-800">Produtos</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium">Produto</th>
                  <th className="p-4 font-medium">Preço Base</th>
                  <th className="p-4 font-medium">Estoque</th>
                  <th className="p-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded-md object-cover bg-stone-100" />
                        <div>
                          <p className="font-medium text-stone-900">{product.name}</p>
                          <p className="text-xs text-stone-500">{product.category === 'cake' ? 'Bolo' : 'Doce'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-stone-600">
                      R$ {product.basePrice.toFixed(2)}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleProductAvailability(product.id)}
                        className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                          product.isAvailable 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {product.isAvailable ? 'Em Estoque' : 'Esgotado'}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => setEditingProduct(product)}
                        className="text-brand-600 hover:text-brand-800 font-medium text-sm px-3 py-1 rounded-md hover:bg-brand-50 transition-colors"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-stone-900">Editar Produto</h3>
              <button 
                onClick={() => setEditingProduct(null)}
                className="text-stone-400 hover:text-stone-800 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Nome</label>
                <input 
                  type="text" 
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Descrição</label>
                <textarea 
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none resize-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Preço Base (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={editingProduct.basePrice}
                  onChange={(e) => setEditingProduct({...editingProduct, basePrice: parseFloat(e.target.value) || 0})}
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">URL da Imagem</label>
                <input 
                  type="url" 
                  value={editingProduct.image}
                  onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                  required
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-brand-800 hover:bg-brand-900 text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Save size={18} />
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
