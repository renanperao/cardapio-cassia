import { useState, useEffect } from 'react';
import { Product, StoreSettings } from '../types';

const PRODUCTS_STORAGE_KEY = '@cassia:products_v10';

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
  },
  {
    id: '13',
    name: 'Pool Cake Red Velvet com Cream Cheese',
    description: 'Massa aveludada com a clássica cobertura de cream cheese.',
    basePrice: 52,
    image: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    category: 'pool-cake',
    poolCakeMetadata: { priceM: 52, priceG: 95 }
  },
  {
    id: '14',
    name: 'Pool Cake Brigadeiro com Confete',
    description: 'Alegria em forma de bolo, cheio de confetes.',
    basePrice: 47,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    category: 'pool-cake',
    poolCakeMetadata: { priceM: 47, priceG: 85 }
  },
  {
    id: '15',
    name: 'Pool Cake Ninho com Nutella',
    description: 'A combinação perfeita e irresistível.',
    basePrice: 60,
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    category: 'pool-cake',
    poolCakeMetadata: { priceM: 60, priceG: 110 }
  },
  {
    id: '16',
    name: 'Pool Cake Prestígio',
    description: 'Chocolate com coco, um clássico.',
    basePrice: 52,
    image: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    category: 'pool-cake',
    poolCakeMetadata: { priceM: 52, priceG: 95 }
  },
  {
    id: '17',
    name: 'Pool Cake Ninho',
    description: 'Deliciosa cobertura de leite ninho.',
    basePrice: 52,
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    category: 'pool-cake',
    poolCakeMetadata: { priceM: 52, priceG: 95 }
  },
  {
    id: '18',
    name: 'Pool Cake Brigadeiro de Nozes',
    description: 'Sofisticação e sabor único de nozes.',
    basePrice: 52,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    category: 'pool-cake',
    poolCakeMetadata: { priceM: 52, priceG: 95 }
  },
  {
    id: '19',
    name: 'Pool Cake Red Velvet (Cream Cheese e Frutas Vermelhas)',
    description: 'O nosso premium: frutas vermelhas frescas e cream cheese.',
    basePrice: 65,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    category: 'pool-cake',
    poolCakeMetadata: { priceM: 65, priceG: 120 }
  },
  {
    id: '20',
    name: 'Bolo Vulcão Red Velvet com Cream Cheese',
    description: 'Massa aveludada com uma explosão de cobertura de cream cheese.',
    basePrice: 56,
    image: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    category: 'vulcao',
    vulcaoMetadata: { priceM: 56, priceG: 98 }
  },
  {
    id: '21',
    name: 'Bolo Vulcão Brigadeiro com Confete',
    description: 'O clássico brigadeiro em versão vulcão, pura alegria.',
    basePrice: 52,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    category: 'vulcao',
    vulcaoMetadata: { priceM: 52, priceG: 90 }
  },
  {
    id: '22',
    name: 'Bolo Vulcão Ninho com Nutella',
    description: 'Transbordando sabor e cremosidade em cada fatia.',
    basePrice: 65,
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    category: 'vulcao',
    vulcaoMetadata: { priceM: 65, priceG: 115 }
  },
  {
    id: '23',
    name: 'Bolo Vulcão Prestígio',
    description: 'Chocolate macio coberto por um incrível vulcão de coco.',
    basePrice: 56,
    image: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    category: 'vulcao',
    vulcaoMetadata: { priceM: 56, priceG: 98 }
  },
  {
    id: '24',
    name: 'Bolo Vulcão Ninho',
    description: 'A delicadeza do ninho em forma de vulcão.',
    basePrice: 56,
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    category: 'vulcao',
    vulcaoMetadata: { priceM: 56, priceG: 98 }
  },
  {
    id: '25',
    name: 'Bolo Vulcão Brigadeiro de Nozes',
    description: 'Sofisticação e sabor único de nozes em abundância.',
    basePrice: 56,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    category: 'vulcao',
    vulcaoMetadata: { priceM: 56, priceG: 98 }
  },
  {
    id: '26',
    name: 'Bolo Vulcão Red Velvet (Cream Cheese e Frutas Vermelhas)',
    description: 'O nosso premium: frutas vermelhas frescas e muito cream cheese.',
    basePrice: 70,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    category: 'vulcao',
    vulcaoMetadata: { priceM: 70, priceG: 125 }
  },
  { id: '27', name: 'Bolo Recheado Kit Kat', description: 'Bolo recheado com acabamento de Kit Kat. Pedido Mínimo 2kg.', basePrice: 170, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80', isAvailable: true, category: 'recheado', recheadoMetadata: { pricePerKg: 170, minKg: 2, hasFinishingOptions: false } },
  { id: '28', name: 'Bolo Recheado Red Velvet c/ Geleia de Frutas Vermelhas', description: 'Massa aveludada com geleia artesanal de frutas vermelhas.', basePrice: 115, image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80', isAvailable: true, category: 'recheado', recheadoMetadata: { pricePerKg: 115, minKg: 1, hasFinishingOptions: false } },
  { id: '29', name: 'Bolo Recheado Red Velvet c/ Leite Ninho', description: 'Red Velvet especial com o toque do Leite Ninho.', basePrice: 115, image: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=800&q=80', isAvailable: true, category: 'recheado', recheadoMetadata: { pricePerKg: 115, minKg: 1, hasFinishingOptions: false } },
  { id: '30', name: 'Bolo Recheado Ninho c/ Nutella', description: 'A combinação que todos amam.', basePrice: 110, image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=800&q=80', isAvailable: true, category: 'recheado', recheadoMetadata: { pricePerKg: 110, minKg: 1, hasFinishingOptions: true } },
  { id: '31', name: 'Bolo Recheado Nozes c/ Leite Condensado Cozido', description: 'A elegância das nozes com o dulçor do doce de leite.', basePrice: 110, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80', isAvailable: true, category: 'recheado', recheadoMetadata: { pricePerKg: 110, minKg: 1, hasFinishingOptions: true } },
  { id: '32', name: 'Bolo Recheado Surpresa de Uva (Verde s/ Semente)', description: 'Refrescante e surpreendente.', basePrice: 110, image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=800&q=80', isAvailable: true, category: 'recheado', recheadoMetadata: { pricePerKg: 110, minKg: 1, hasFinishingOptions: true } },
  { id: '33', name: 'Bolo Recheado Olho de Sogra', description: 'Tradicional bolo recheado de olho de sogra.', basePrice: 110, image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&q=80', isAvailable: true, category: 'recheado', recheadoMetadata: { pricePerKg: 110, minKg: 1, hasFinishingOptions: true } },
  { id: '34', name: 'Bolo Recheado Damasco c/ Creme Belga', description: 'Suavidade do creme belga com o toque fino do damasco.', basePrice: 110, image: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=800&q=80', isAvailable: true, category: 'recheado', recheadoMetadata: { pricePerKg: 110, minKg: 1, hasFinishingOptions: true } },
  { id: '35', name: 'Bolo Recheado 4 Leites', description: 'Massa fofa recheada com um delicioso creme de 4 leites.', basePrice: 110, image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=800&q=80', isAvailable: true, category: 'recheado', recheadoMetadata: { pricePerKg: 110, minKg: 1, hasFinishingOptions: true } },
  { id: '36', name: 'Bolo Recheado Ameixa com Doce de Leite', description: 'Clássico imbatível.', basePrice: 110, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80', isAvailable: true, category: 'recheado', recheadoMetadata: { pricePerKg: 110, minKg: 1, hasFinishingOptions: true } },
  { id: '37', name: 'Bolo Recheado Ferrero Rocher', description: 'Chocolate, avelã e muito sabor.', basePrice: 110, image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=800&q=80', isAvailable: true, category: 'recheado', recheadoMetadata: { pricePerKg: 110, minKg: 1, hasFinishingOptions: true } },
  { id: '38', name: 'Bolo Recheado Creme Belga c/ Abacaxi', description: 'Leve e tropical.', basePrice: 105, image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&q=80', isAvailable: true, category: 'recheado', recheadoMetadata: { pricePerKg: 105, minKg: 1, hasFinishingOptions: true } },
  { id: '39', name: 'Bolo Recheado Creme Belga c/ Morango', description: 'Morangos frescos no creme belga.', basePrice: 105, image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80', isAvailable: true, category: 'recheado', recheadoMetadata: { pricePerKg: 105, minKg: 1, hasFinishingOptions: true } },
  { id: '40', name: 'Bolo Recheado Brigadeiro Gourmet', description: 'O clássico com sabor gourmet.', basePrice: 100, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80', isAvailable: true, category: 'recheado', recheadoMetadata: { pricePerKg: 100, minKg: 1, hasFinishingOptions: true, isBrigadeiroGourmet: true } },
  { id: '41', name: 'Bolo Recheado Coco (Coco Fresco)', description: 'Frescor do coco em cada mordida.', basePrice: 90, image: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=800&q=80', isAvailable: true, category: 'recheado', recheadoMetadata: { pricePerKg: 90, minKg: 1, hasFinishingOptions: true } },
  { id: '42', name: 'Bolo Recheado Dois Amores', description: 'A união do brigadeiro branco com o preto.', basePrice: 90, image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=800&q=80', isAvailable: true, category: 'recheado', recheadoMetadata: { pricePerKg: 90, minKg: 1, hasFinishingOptions: true } },
  { id: '43', name: 'Bolo Recheado Brigadeiro Amendoim', description: 'Sabor marcante de amendoim.', basePrice: 80, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80', isAvailable: true, category: 'recheado', recheadoMetadata: { pricePerKg: 80, minKg: 1, hasFinishingOptions: true } },
  { id: '44', name: 'Brigadeiro Tradicional ao Leite', description: 'Brigadeiro clássico ao leite.', basePrice: 1.90, image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Brigadeiros Tradicionais', sweetMetadata: { isTradicional: true } },
  { id: '45', name: 'Brigadeiro Tradicional Branco', description: 'Brigadeiro de chocolate branco.', basePrice: 1.90, image: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Brigadeiros Tradicionais', sweetMetadata: { isTradicional: true } },
  { id: '46', name: 'Brigadeiro Tradicional Moranguinho', description: 'O clássico bicho de pé.', basePrice: 1.90, image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Brigadeiros Tradicionais', sweetMetadata: { isTradicional: true } },
  { id: '47', name: 'Brigadeiro Tradicional Dois Amores', description: 'Meio branco, meio preto.', basePrice: 1.90, image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Brigadeiros Tradicionais', sweetMetadata: { isTradicional: true } },
  { id: '48', name: 'Brigadeiro Tradicional Leite Ninho', description: 'Com o sabor puro do Leite Ninho.', basePrice: 1.90, image: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Brigadeiros Tradicionais', sweetMetadata: { isTradicional: true } },
  { id: '49', name: 'Brigadeiro Tradicional Coco', description: 'Beijinho de coco tradicional.', basePrice: 1.90, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Brigadeiros Tradicionais', sweetMetadata: { isTradicional: true } },

  { id: '50', name: 'Brigadeiro Gourmet Ninho com Nutella', description: 'Sabor irresistível de ninho e nutella.', basePrice: 2.50, image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Brigadeiros Gourmet' },
  { id: '51', name: 'Brigadeiro Gourmet Romeu e Julieta', description: 'Queijo com goiabada.', basePrice: 2.50, image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Brigadeiros Gourmet' },
  { id: '52', name: 'Brigadeiro Gourmet Churros', description: 'Sabor marcante de churros e doce de leite.', basePrice: 2.50, image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Brigadeiros Gourmet' },
  { id: '53', name: 'Brigadeiro Gourmet Confete de Chocolate', description: 'Alegria em forma de doce.', basePrice: 2.50, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Brigadeiros Gourmet' },
  { id: '54', name: 'Brigadeiro Gourmet Surpresa de Uva', description: 'Uva envolta em brigadeiro branco.', basePrice: 2.50, image: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Brigadeiros Gourmet' },
  { id: '55', name: 'Brigadeiro Gourmet ao Leite', description: 'Chocolate nobre ao leite.', basePrice: 2.50, image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Brigadeiros Gourmet' },
  { id: '56', name: 'Brigadeiro Gourmet Branco', description: 'Chocolate nobre branco.', basePrice: 2.50, image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Brigadeiros Gourmet' },
  { id: '57', name: 'Brigadeiro Gourmet Meio Amargo', description: 'Chocolate nobre meio amargo.', basePrice: 2.50, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Brigadeiros Gourmet' },
  { id: '58', name: 'Brigadeiro Gourmet Damasco com Coco', description: 'Uma combinação fina e requintada.', basePrice: 2.50, image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Brigadeiros Gourmet' },
  
  { id: '59', name: 'Brigadeiro Gourmet Ferrero', description: 'Inspirado no famoso bombom.', basePrice: 3.00, image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Brigadeiros Gourmet' },
  { id: '60', name: 'Brigadeiro Gourmet Ouriço de Coco', description: 'Especialidade de coco.', basePrice: 3.00, image: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Brigadeiros Gourmet' },
  { id: '61', name: 'Brigadeiro Gourmet Pistache', description: 'O queridinho do momento.', basePrice: 4.50, image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Brigadeiros Gourmet' },

  { id: '62', name: 'Doce Fino Joia de Nozes', description: 'Elegância em cada detalhe.', basePrice: 5.50, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Doces Finos' },
  { id: '63', name: 'Doce Fino Joia de Damasco', description: 'Sofisticação e sabor.', basePrice: 5.50, image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Doces Finos' },
  { id: '64', name: 'Doce Fino Copinho de Cereja', description: 'Delicado copinho de chocolate com cereja.', basePrice: 5.50, image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Doces Finos' },
  { id: '65', name: 'Doce Fino Copinho de Uva', description: 'Delicado copinho de chocolate com uva.', basePrice: 5.50, image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Doces Finos' },
  { id: '66', name: 'Doce Fino Caixeta de Maracujá', description: 'Caixeta de chocolate com trufa de maracujá.', basePrice: 5.50, image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Doces Finos' },
  { id: '67', name: 'Doce Fino Pirâmide de Coco', description: 'Chocolate nobre recheado com coco.', basePrice: 5.50, image: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Doces Finos' },

  { id: '68', name: 'Doce Fino Caixeta de Morango', description: 'Caixeta de chocolate com morango.', basePrice: 6.00, image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Doces Finos' },

  { id: '69', name: 'Doce Fino Coração de Physalis', description: 'Formato especial com physalis.', basePrice: 6.50, image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Doces Finos' },
  { id: '70', name: 'Doce Fino Caixeta de Frutas Vermelhas', description: 'Caixeta de chocolate com frutas vermelhas.', basePrice: 6.50, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Doces Finos' },

  { id: '71', name: 'Coxinha de Morango (Brigadeiro Branco)', description: 'Morango envolto em brigadeiro branco.', basePrice: 5.00, image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Coxinha de Morango' },
  { id: '72', name: 'Coxinha de Morango (Ao Leite)', description: 'Morango envolto em brigadeiro ao leite.', basePrice: 5.00, image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Coxinha de Morango' },
  { id: '73', name: 'Coxinha de Morango (Meio Amargo)', description: 'Morango envolto em brigadeiro meio amargo.', basePrice: 5.00, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Coxinha de Morango' },
  { id: '74', name: 'Coxinha de Morango (Leite Ninho)', description: 'Morango envolto em brigadeiro de ninho.', basePrice: 5.00, image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Coxinha de Morango' },

  { id: '75', name: 'Bombom de Castanha', description: 'Chocolate e castanhas selecionadas.', basePrice: 3.00, image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Bombons' },
  { id: '76', name: 'Bombom de Uva', description: 'Clássico bombom de uva.', basePrice: 3.00, image: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Bombons' },
  { id: '77', name: 'Bombom de Damasco com Coco', description: 'Damasco e coco envoltos em chocolate.', basePrice: 3.00, image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Bombons' },
  { id: '78', name: 'Bombom de Coco', description: 'Bombom clássico de coco.', basePrice: 3.00, image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Bombons' },
  { id: '79', name: 'Bombom de Amendoim', description: 'Crocante e delicioso.', basePrice: 3.00, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Bombons' },

  { id: '80', name: 'Bombom de Cereja', description: 'Bombom trufado de cereja.', basePrice: 3.50, image: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Bombons' },
  { id: '81', name: 'Bombom Romeu e Julieta', description: 'Goiabada e queijo no bombom.', basePrice: 3.50, image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Bombons' },
  { id: '82', name: 'Bombom de Pistache', description: 'O requinte do pistache.', basePrice: 3.50, image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Bombons' },
  { id: '83', name: 'Bombom Camafeu de Nozes', description: 'O mais tradicional dos casamentos.', basePrice: 3.50, image: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=800&q=80', isAvailable: true, category: 'sweet', subCategory: 'Bombons' }
];

const INITIAL_SETTINGS: StoreSettings = {
  isOpen: true,
};

function mergeProductsWithDefaults(storedProducts: Product[]) {
  const storedProductsById = new Map(storedProducts.map((product) => [product.id, product]));

  const mergedProducts = INITIAL_PRODUCTS.map((initialProduct) => {
    const storedProduct = storedProductsById.get(initialProduct.id);

    if (!storedProduct) {
      return initialProduct;
    }

    return {
      ...initialProduct,
      ...storedProduct,
      subCategory: storedProduct.subCategory ?? initialProduct.subCategory,
      caseirinhoMetadata: storedProduct.caseirinhoMetadata ?? initialProduct.caseirinhoMetadata,
      poolCakeMetadata: storedProduct.poolCakeMetadata ?? initialProduct.poolCakeMetadata,
      vulcaoMetadata: storedProduct.vulcaoMetadata ?? initialProduct.vulcaoMetadata,
      recheadoMetadata: storedProduct.recheadoMetadata ?? initialProduct.recheadoMetadata,
      sweetMetadata: storedProduct.sweetMetadata ?? initialProduct.sweetMetadata,
    };
  });

  const extraProducts = storedProducts.filter(
    (storedProduct) => !INITIAL_PRODUCTS.some((initialProduct) => initialProduct.id === storedProduct.id)
  );

  return [...mergedProducts, ...extraProducts];
}

export function useData() {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY) ?? localStorage.getItem('@cassia:products_v9');
    const storedSettings = localStorage.getItem('@cassia:settings');

    if (storedProducts) {
      const parsedProducts = JSON.parse(storedProducts) as Product[];
      const mergedProducts = mergeProductsWithDefaults(parsedProducts);
      setProducts(mergedProducts);
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(mergedProducts));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
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
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(newProducts));
  };

  const toggleProductAvailability = (id: string) => {
    const newProducts = products.map(p => p.id === id ? { ...p, isAvailable: !p.isAvailable } : p);
    setProducts(newProducts);
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(newProducts));
  };

  const updateSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
    localStorage.setItem('@cassia:settings', JSON.stringify(newSettings));
  };

  return { products, settings, loading, updateProduct, toggleProductAvailability, updateSettings };
}
