export type ProductCategory = 'cake' | 'sweet' | 'caseirinhos' | 'pool-cake' | 'vulcao' | 'recheado';

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

export interface PoolCakeMetadata {
  priceM: number;
  priceG: number;
}

export interface VulcaoMetadata {
  priceM: number;
  priceG: number;
}

export interface RecheadoMetadata {
  pricePerKg: number;
  minKg: number;
  hasFinishingOptions: boolean;
  isBrigadeiroGourmet?: boolean;
}

export interface SweetMetadata {
  isTradicional?: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  isAvailable: boolean;
  category: ProductCategory;
  subCategory?: string;
  caseirinhoMetadata?: CaseirinhoMetadata;
  poolCakeMetadata?: PoolCakeMetadata;
  vulcaoMetadata?: VulcaoMetadata;
  recheadoMetadata?: RecheadoMetadata;
  sweetMetadata?: SweetMetadata;
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
  recheadoKg?: number;
  recheadoFinishing?: string;
  recheadoHasStrawberry?: boolean;
  sweetShape?: boolean;
  totalPrice: number;
}
