import { useState, useEffect } from 'react';
import { Product, StoreSettings } from '../types';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Bolo de Chocolate Intenso',
    description: 'Massa fofinha de cacau 100%, recheio cremoso de brigadeiro gourmet.',
    basePrice: 85,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    category: 'cake',
  },
  {
    id: '2',
    name: 'Bolo Red Velvet',
    description: 'Clássico red velvet com recheio de cream cheese com toque de baunilha.',
    basePrice: 95,
    image: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    category: 'cake',
  },
  {
    id: '3',
    name: 'Caixa de Brigadeiros',
    description: 'Caixa com 12 unidades de brigadeiros gourmet sortidos.',
    basePrice: 45,
    image: 'https://images.unsplash.com/photo-1552317188-f54291880486?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isAvailable: false,
    category: 'sweet',
  }
];

const INITIAL_SETTINGS: StoreSettings = {
  isOpen: true,
};

export function useData() {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedProducts = localStorage.getItem('@cassia:products');
    const storedSettings = localStorage.getItem('@cassia:settings');

    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('@cassia:products', JSON.stringify(INITIAL_PRODUCTS));
    }

    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    } else {
      setSettings(INITIAL_SETTINGS);
      localStorage.setItem('@cassia:settings', JSON.stringify(INITIAL_SETTINGS));
    }
    
    // Simulate loading for skeleton demo
    setTimeout(() => setLoading(false), 800);
  }, []);

  const updateProduct = (updatedProduct: Product) => {
    const newProducts = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    setProducts(newProducts);
    localStorage.setItem('@cassia:products', JSON.stringify(newProducts));
  };

  const toggleProductAvailability = (id: string) => {
    const newProducts = products.map(p => p.id === id ? { ...p, isAvailable: !p.isAvailable } : p);
    setProducts(newProducts);
    localStorage.setItem('@cassia:products', JSON.stringify(newProducts));
  };

  const updateSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
    localStorage.setItem('@cassia:settings', JSON.stringify(newSettings));
  };

  return { products, settings, loading, updateProduct, toggleProductAvailability, updateSettings };
}
