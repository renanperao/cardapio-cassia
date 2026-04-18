export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  isAvailable: boolean;
  category: 'cake' | 'sweet';
}

export interface StoreSettings {
  isOpen: boolean;
}

export type CakeSize = 'P' | 'M' | 'G';
export type IcingOption = 'Com' | 'Sem';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  size?: CakeSize;
  icing?: IcingOption;
  totalPrice: number;
}
