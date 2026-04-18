export type ProductCategory = 'cake' | 'sweet' | 'caseirinhos';

export interface CaseirinhoMetadata {
  isMilho?: boolean;
  isChocolate?: boolean;
  hasNoIcing?: boolean;
  icingName?: string;
  priceM: number;
  priceG: number;
  icingPriceM: number;
  icingPriceG: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  isAvailable: boolean;
  category: ProductCategory;
  caseirinhoMetadata?: CaseirinhoMetadata;
}

export interface StoreSettings {
  isOpen: boolean;
}

export type CakeSize = 'P' | 'M' | 'G';
export type CaseirinhoSize = 'M' | 'G';
export type IcingOption = 'Com' | 'Sem';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  size?: CakeSize | CaseirinhoSize;
  icing?: IcingOption;
  caseirinhoIcingFlavor?: string; // e.g. "Chocolate", "Leite Ninho", "Goiabada", "Requeijão"
  totalPrice: number;
}
