import { useState, useEffect } from 'react';
import { Product, StoreSettings } from '../types';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '4',
    name: 'Caseirinho de Cenoura',
    description: 'Bolo caseiro de cenoura, clássico e fofinho.',
    basePrice: 29,
    image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    category: 'caseirinhos',
    caseirinhoMetadata: {
      priceM: 29, priceG: 39,
      icingPriceM: 10, icingPriceG: 20,
      icingName: 'Chocolate com granulado'
    }
  },
  {
    id: '5',
    name: 'Caseirinho de Chocolate',
    description: 'Bolo caseiro de chocolate super macio.',
    basePrice: 29,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    category: 'caseirinhos',
    caseirinhoMetadata: {
      priceM: 29, priceG: 39,
      icingPriceM: 10, icingPriceG: 20,
      isChocolate: true
    }
  },
  {
    id: '6',
    name: 'Caseirinho de Churros',
    description: 'Massa com toque de canela, macia e aromática.',
    basePrice: 29,
    image: 'https://images.unsplash.com/photo-1614145121029-83a9f7b68bf4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    category: 'caseirinhos',
    caseirinhoMetadata: {
      priceM: 29, priceG: 39,
      icingPriceM: 10, icingPriceG: 20,
      icingName: 'Leite condensado com canela'
    }
  },
  {
    id: '7',
    name: 'Caseirinho de Limão',
    description: 'Bolo refrescante com um leve azedinho de limão.',
    basePrice: 29,
    image: 'https://images.unsplash.com/photo-1519869325930-281384150729?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    category: 'caseirinhos',
    caseirinhoMetadata: {
      priceM: 29, priceG: 39,
      icingPriceM: 10, icingPriceG: 20,
      icingName: 'Mousse de limão'
    }
  },
  {
    id: '8',
    name: 'Caseirinho de Laranja',
    description: 'O clássico bolo de vó, perfeito para um café.',
    basePrice: 29,
    image: 'https://images.unsplash.com/photo-1601265882894-3ee1df4dc895?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    category: 'caseirinhos',
    caseirinhoMetadata: {
      priceM: 29, priceG: 39,
      icingPriceM: 10, icingPriceG: 20,
      icingName: 'Brigadeiro de laranja'
    }
  },
  {
    id: '9',
    name: 'Caseirinho de Coco',
    description: 'Massa leve de coco, super úmida e saborosa.',
    basePrice: 29,
    image: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    category: 'caseirinhos',
    caseirinhoMetadata: {
      priceM: 29, priceG: 39,
      icingPriceM: 10, icingPriceG: 20,
      icingName: 'Brigadeiro de coco'
    }
  },
  {
    id: '10',
    name: 'Caseirinho de Leite Ninho',
    description: 'O favorito! Massa macia de leite ninho.',
    basePrice: 29,
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    category: 'caseirinhos',
    caseirinhoMetadata: {
      priceM: 29, priceG: 39,
      icingPriceM: 10, icingPriceG: 20,
      icingName: 'Brigadeiro de leite ninho'
    }
  },
  {
    id: '11',
    name: 'Caseirinho Formigueiro',
    description: 'Massa branca fofinha com granulado de chocolate.',
    basePrice: 35,
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    category: 'caseirinhos',
    caseirinhoMetadata: {
      priceM: 35, priceG: 45,
      icingPriceM: 0, icingPriceG: 0,
      hasNoIcing: true
    }
  },
  {
    id: '12',
    name: 'Caseirinho de Milho',
    description: 'O verdadeiro bolo de milho verde.',
    basePrice: 39,
    image: 'https://images.unsplash.com/photo-1627914364448-f6236318bbd8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    category: 'caseirinhos',
    caseirinhoMetadata: {
      priceM: 39, priceG: 49,
      icingPriceM: 0, icingPriceG: 0,
      isMilho: true
    }
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
    const storedProducts = localStorage.getItem('@cassia:products_v4');
    const storedSettings = localStorage.getItem('@cassia:settings');

    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('@cassia:products_v4', JSON.stringify(INITIAL_PRODUCTS));
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
    localStorage.setItem('@cassia:products_v4', JSON.stringify(newProducts));
  };

  const toggleProductAvailability = (id: string) => {
    const newProducts = products.map(p => p.id === id ? { ...p, isAvailable: !p.isAvailable } : p);
    setProducts(newProducts);
    localStorage.setItem('@cassia:products_v4', JSON.stringify(newProducts));
  };

  const updateSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
    localStorage.setItem('@cassia:settings', JSON.stringify(newSettings));
  };

  return { products, settings, loading, updateProduct, toggleProductAvailability, updateSettings };
}
