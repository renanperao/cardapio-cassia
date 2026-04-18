import { useState } from 'react';
import { ArrowLeft, Save, X, Store, CakeSlice, Candy, Layers } from 'lucide-react';
import { useData } from './hooks/useData';
import { Product } from './types';
import { Link } from 'react-router-dom';

const ADMIN_PASSWORD = 'cassiaadmin';

type TabId = 'caseirinhos' | 'pool-vulcao' | 'recheados' | 'doces';

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'caseirinhos',  label: 'Caseirinhos',    icon: <CakeSlice size={15} /> },
  { id: 'pool-vulcao',  label: 'Pool / Vulcão',  icon: <Layers size={15} /> },
  { id: 'recheados',    label: 'Bolos Recheados', icon: <CakeSlice size={15} /> },
  { id: 'doces',        label: 'Doces',           icon: <Candy size={15} /> },
];

const SWEET_ORDER = [
  'Brigadeiros Tradicionais',
  'Brigadeiros Gourmet',
  'Doces Finos',
  'Coxinha de Morango',
  'Bombons',
];

// ── helpers ──────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-label={checked ? 'Desativar' : 'Ativar'}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none ${
        checked ? 'bg-green-500' : 'bg-stone-300'
      }`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`} />
    </button>
  );
}

function Field({
  label, hint, children,
}: {
  label: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-stone-400 mt-1">{hint}</p>}
    </div>
  );
}

const inputCls =
  'w-full px-3 py-2 rounded-lg border border-stone-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-200 outline-none text-sm transition-all';

// ── product row ───────────────────────────────────────────────────────────────

function ProductRow({
  product,
  onToggle,
  onEdit,
  showImage = true,
}: {
  product: Product;
  onToggle: () => void;
  onEdit: () => void;
  showImage?: boolean;
}) {
  const priceLabel = (() => {
    if (product.category === 'caseirinhos' && product.caseirinhoMetadata) {
      const m = product.caseirinhoMetadata;
      return `M R$${m.priceM} / G R$${m.priceG}`;
    }
    if ((product.category === 'pool-cake') && product.poolCakeMetadata) {
      return `M R$${product.poolCakeMetadata.priceM} / G R$${product.poolCakeMetadata.priceG}`;
    }
    if (product.category === 'vulcao' && product.vulcaoMetadata) {
      return `M R$${product.vulcaoMetadata.priceM} / G R$${product.vulcaoMetadata.priceG}`;
    }
    if (product.category === 'recheado' && product.recheadoMetadata) {
      return `R$${product.recheadoMetadata.pricePerKg}/kg · mín ${product.recheadoMetadata.minKg}kg`;
    }
    return `R$ ${product.basePrice.toFixed(2)}`;
  })();

  return (
    <div className={`flex items-center gap-3 px-4 py-3 border-b border-stone-100 last:border-0 transition-colors ${!product.isAvailable ? 'opacity-50' : ''}`}>
      {showImage && (
        product.category === 'sweet'
          ? <div className="w-10 h-10 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center text-lg flex-shrink-0">🍫</div>
          : <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-stone-100 flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-stone-900 truncate">{product.name}</p>
        <p className="text-xs text-stone-400">{priceLabel}</p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <Toggle checked={product.isAvailable} onChange={onToggle} />
        <button
          onClick={onEdit}
          className="text-xs font-medium text-brand-700 hover:text-brand-900 px-2 py-1 rounded hover:bg-brand-50 transition-colors"
        >
          Editar
        </button>
      </div>
    </div>
  );
}

// ── edit modal ────────────────────────────────────────────────────────────────

function EditModal({
  product,
  onClose,
  onSave,
}: {
  product: Product;
  onClose: () => void;
  onSave: (p: Product) => void;
}) {
  const [draft, setDraft] = useState<Product>(product);

  const set = (patch: Partial<Product>) => setDraft(prev => ({ ...prev, ...patch }));
  const setMeta = <K extends keyof Product>(key: K, patch: Partial<NonNullable<Product[K]>>) =>
    setDraft(prev => ({ ...prev, [key]: { ...(prev[key] as object), ...patch } }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(draft);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-stone-900/40 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-xl flex flex-col max-h-[92dvh]">
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 flex-shrink-0">
          <h3 className="font-semibold text-stone-900">Editar produto</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-5 space-y-4">
          {/* common fields */}
          <Field label="Nome">
            <input className={inputCls} value={draft.name} onChange={e => set({ name: e.target.value })} required />
          </Field>

          <Field label="Descrição">
            <textarea
              className={`${inputCls} resize-none`}
              rows={2}
              value={draft.description}
              onChange={e => set({ description: e.target.value })}
            />
          </Field>

          {/* image field — shown for all non-sweet categories */}
          {draft.category !== 'sweet' && (
            <Field label="URL da Imagem" hint="Cole um link direto para a imagem (https://...)">
              <div className="flex gap-3 items-start">
                <div className="flex-1">
                  <input
                    className={inputCls}
                    value={draft.image}
                    onChange={e => set({ image: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                {draft.image && (
                  <img
                    src={draft.image}
                    alt="preview"
                    className="w-14 h-14 rounded-lg object-cover bg-stone-100 border border-stone-200 flex-shrink-0"
                    onError={e => (e.currentTarget.style.display = 'none')}
                    onLoad={e => (e.currentTarget.style.display = 'block')}
                  />
                )}
              </div>
            </Field>
          )}

          {/* ── CASEIRINHOS ── */}
          {draft.category === 'caseirinhos' && draft.caseirinhoMetadata && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Preço M (R$)">
                  <input type="number" step="0.01" className={inputCls}
                    value={draft.caseirinhoMetadata.priceM}
                    onChange={e => setMeta('caseirinhoMetadata', { priceM: parseFloat(e.target.value) || 0 })}
                  />
                </Field>
                <Field label="Preço G (R$)">
                  <input type="number" step="0.01" className={inputCls}
                    value={draft.caseirinhoMetadata.priceG}
                    onChange={e => setMeta('caseirinhoMetadata', { priceG: parseFloat(e.target.value) || 0 })}
                  />
                </Field>
              </div>
              {!draft.caseirinhoMetadata.hasNoIcing && !draft.caseirinhoMetadata.isMilho && (
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Adicional Cob. M (R$)">
                    <input type="number" step="0.01" className={inputCls}
                      value={draft.caseirinhoMetadata.icingPriceM}
                      onChange={e => setMeta('caseirinhoMetadata', { icingPriceM: parseFloat(e.target.value) || 0 })}
                    />
                  </Field>
                  <Field label="Adicional Cob. G (R$)">
                    <input type="number" step="0.01" className={inputCls}
                      value={draft.caseirinhoMetadata.icingPriceG}
                      onChange={e => setMeta('caseirinhoMetadata', { icingPriceG: parseFloat(e.target.value) || 0 })}
                    />
                  </Field>
                </div>
              )}
            </>
          )}

          {/* ── POOL CAKE ── */}
          {draft.category === 'pool-cake' && draft.poolCakeMetadata && (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Preço M (R$)">
                <input type="number" step="0.01" className={inputCls}
                  value={draft.poolCakeMetadata.priceM}
                  onChange={e => setMeta('poolCakeMetadata', { priceM: parseFloat(e.target.value) || 0 })}
                />
              </Field>
              <Field label="Preço G (R$)">
                <input type="number" step="0.01" className={inputCls}
                  value={draft.poolCakeMetadata.priceG}
                  onChange={e => setMeta('poolCakeMetadata', { priceG: parseFloat(e.target.value) || 0 })}
                />
              </Field>
            </div>
          )}

          {/* ── VULCÃO ── */}
          {draft.category === 'vulcao' && draft.vulcaoMetadata && (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Preço M (R$)">
                <input type="number" step="0.01" className={inputCls}
                  value={draft.vulcaoMetadata.priceM}
                  onChange={e => setMeta('vulcaoMetadata', { priceM: parseFloat(e.target.value) || 0 })}
                />
              </Field>
              <Field label="Preço G (R$)">
                <input type="number" step="0.01" className={inputCls}
                  value={draft.vulcaoMetadata.priceG}
                  onChange={e => setMeta('vulcaoMetadata', { priceG: parseFloat(e.target.value) || 0 })}
                />
              </Field>
            </div>
          )}

          {/* ── RECHEADO ── */}
          {draft.category === 'recheado' && draft.recheadoMetadata && (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Preço por KG (R$)">
                <input type="number" step="0.01" className={inputCls}
                  value={draft.recheadoMetadata.pricePerKg}
                  onChange={e => setMeta('recheadoMetadata', { pricePerKg: parseFloat(e.target.value) || 0 })}
                />
              </Field>
              <Field label="Pedido mínimo (kg)">
                <input type="number" step="0.5" min="0.5" className={inputCls}
                  value={draft.recheadoMetadata.minKg}
                  onChange={e => setMeta('recheadoMetadata', { minKg: parseFloat(e.target.value) || 1 })}
                />
              </Field>
            </div>
          )}

          {/* ── SWEET ── */}
          {draft.category === 'sweet' && (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Preço unitário (R$)" hint="Vendido em lotes de 25">
                <input type="number" step="0.01" className={inputCls}
                  value={draft.basePrice}
                  onChange={e => set({ basePrice: parseFloat(e.target.value) || 0 })}
                />
              </Field>
              <Field label="Total lote (25 un)">
                <div className={`${inputCls} bg-stone-50 text-stone-500 cursor-default`}>
                  R$ {(draft.basePrice * 25).toFixed(2)}
                </div>
              </Field>
            </div>
          )}

          {/* cake fallback */}
          {draft.category === 'cake' && (
            <Field label="Preço base (R$)">
              <input type="number" step="0.01" className={inputCls}
                value={draft.basePrice}
                onChange={e => set({ basePrice: parseFloat(e.target.value) || 0 })}
              />
            </Field>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-lg font-medium transition-colors">
              Cancelar
            </button>
            <button type="submit"
              className="px-5 py-2 text-sm bg-brand-800 hover:bg-brand-900 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
              <Save size={15} />
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────

export default function Admin() {
  const { products, settings, updateProduct, toggleProductAvailability, updateSettings } = useData();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<TabId>('caseirinhos');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Senha incorreta!');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-bold text-stone-900 mb-2">Área Restrita</h1>
            <p className="text-stone-500 text-sm">Painel de administração</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" className="w-full bg-stone-900 hover:bg-stone-800 text-white py-3 rounded-xl font-medium transition-colors">
              Entrar
            </button>
            <div className="text-center pt-2">
              <Link to="/" className="text-sm text-brand-600 hover:underline">Voltar para a loja</Link>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // ── filtered lists ──
  const caseirinhos = products.filter(p => p.category === 'caseirinhos');
  const poolVulcao  = products.filter(p => p.category === 'pool-cake' || p.category === 'vulcao');
  const recheados   = products.filter(p => p.category === 'recheado');
  const sweets      = products.filter(p => p.category === 'sweet');

  const groupedSweets = sweets.reduce<Record<string, Product[]>>((acc, p) => {
    const key = p.subCategory ?? 'Outros';
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});
  const sweetEntries = Object.entries(groupedSweets).sort(([a], [b]) => {
    const ia = SWEET_ORDER.indexOf(a);
    const ib = SWEET_ORDER.indexOf(b);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });

  const poolList   = poolVulcao.filter(p => p.category === 'pool-cake');
  const vulcaoList = poolVulcao.filter(p => p.category === 'vulcao');

  return (
    <div className="min-h-screen bg-stone-50">
      {/* ── top bar ── */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-stone-400 hover:text-stone-800 transition-colors p-1">
              <ArrowLeft size={18} />
            </Link>
            <span className="font-semibold text-stone-900 text-sm">Admin</span>
          </div>

          {/* store status */}
          <div className="flex items-center gap-2">
            <Store size={15} className={settings.isOpen ? 'text-green-600' : 'text-stone-400'} />
            <span className="text-xs font-medium text-stone-600 hidden sm:block">Loja</span>
            <Toggle
              checked={settings.isOpen}
              onChange={() => updateSettings({ isOpen: !settings.isOpen })}
            />
            <span className={`text-xs font-semibold w-14 ${settings.isOpen ? 'text-green-600' : 'text-stone-400'}`}>
              {settings.isOpen ? 'Aberta' : 'Fechada'}
            </span>
          </div>
        </div>
      </header>

      {/* ── tabs ── */}
      <div className="bg-white border-b border-stone-200 sticky top-14 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto hide-scrollbar">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-brand-700 text-brand-800'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── content ── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">

        {/* CASEIRINHOS */}
        {activeTab === 'caseirinhos' && (
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-stone-100 bg-stone-50">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {caseirinhos.length} produtos
              </p>
            </div>
            {caseirinhos.map(p => (
              <ProductRow
                key={p.id}
                product={p}
                onToggle={() => toggleProductAvailability(p.id)}
                onEdit={() => setEditingProduct(p)}
              />
            ))}
          </div>
        )}

        {/* POOL / VULCÃO */}
        {activeTab === 'pool-vulcao' && (
          <div className="space-y-4">
            {[{ label: 'Pool Cakes', list: poolList }, { label: 'Bolos Vulcão', list: vulcaoList }].map(({ label, list }) => (
              <div key={label} className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-stone-100 bg-stone-50 flex items-center justify-between">
                  <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">{label}</p>
                  <p className="text-xs text-stone-400">{list.length} produtos</p>
                </div>
                {list.map(p => (
                  <ProductRow
                    key={p.id}
                    product={p}
                    onToggle={() => toggleProductAvailability(p.id)}
                    onEdit={() => setEditingProduct(p)}
                  />
                ))}
              </div>
            ))}
          </div>
        )}

        {/* RECHEADOS */}
        {activeTab === 'recheados' && (
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-stone-100 bg-stone-50">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {recheados.length} produtos
              </p>
            </div>
            {recheados.map(p => (
              <ProductRow
                key={p.id}
                product={p}
                onToggle={() => toggleProductAvailability(p.id)}
                onEdit={() => setEditingProduct(p)}
              />
            ))}
          </div>
        )}

        {/* DOCES */}
        {activeTab === 'doces' && (
          <div className="space-y-4">
            {sweetEntries.map(([subCategory, list]) => (
              <div key={subCategory} className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-stone-100 bg-stone-50 flex items-center justify-between">
                  <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">{subCategory}</p>
                  <p className="text-xs text-stone-400">{list.length} itens</p>
                </div>
                {list.map(p => (
                  <ProductRow
                    key={p.id}
                    product={p}
                    onToggle={() => toggleProductAvailability(p.id)}
                    onEdit={() => setEditingProduct(p)}
                    showImage={false}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── edit modal ── */}
      {editingProduct && (
        <EditModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={p => { updateProduct(p); setEditingProduct(null); }}
        />
      )}
    </div>
  );
}
