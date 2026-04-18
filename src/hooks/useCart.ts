import { useState } from 'react';
import { CartItem } from '../types';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addItem = (item: CartItem) => {
    setItems(prev => [...prev, item]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalCartPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);

  const generateWhatsAppMessage = () => {
    if (items.length === 0) return '';
    
    let message = 'Olá, Cassia! Gostaria de encomendar:\n\n';
    
    items.forEach(item => {
      if (item.product.category === 'caseirinhos') {
        let line = `${item.quantity}x ${item.product.name} [Tamanho ${item.size}]`;
        if (item.caseirinhoIcingFlavor) {
          if (item.product.caseirinhoMetadata?.isMilho) {
            line += ` (Sabor: ${item.caseirinhoIcingFlavor})`;
          } else {
            line += ` com Cobertura de ${item.caseirinhoIcingFlavor}`;
          }
        }
        message += `${line} - R$ ${item.totalPrice.toFixed(2)}\n`;
      } else if (item.product.category === 'pool-cake') {
        message += `${item.quantity}x ${item.product.name} [Tamanho ${item.size}] - R$ ${item.totalPrice.toFixed(2)}\n`;
      } else if (item.product.category === 'vulcao') {
        message += `${item.quantity}x ${item.product.name} [Tamanho ${item.size}] - R$ ${item.totalPrice.toFixed(2)}\n`;
      } else if (item.product.category === 'recheado') {
        let name = item.product.name;
        if (item.recheadoHasStrawberry) {
          name += ' + Adicional de Morango';
        }
        let line = `${item.quantity}x ${name} - Peso: ${item.recheadoKg?.toFixed(1)}kg`;
        if (item.recheadoFinishing) {
          line += ` - Cobertura: ${item.recheadoFinishing}`;
        }
        message += `${line} - R$ ${item.totalPrice.toFixed(2)}\n`;
      } else if (item.product.category === 'sweet') {
        let name = item.product.name;
        if (item.sweetShape) {
          name += ' (Formato Flor ou Coração)';
        }
        message += `${item.quantity}x ${name} - R$ ${item.totalPrice.toFixed(2)}\n`;
      } else {
        let details = '';
        if (item.size) details += ` Tamanho ${item.size}`;
        if (item.icing) details += `, ${item.icing === 'Com' ? 'Com cobertura' : 'Sem cobertura'}`;
        
        message += `${item.quantity}x ${item.product.name}${details ? ` (${details.trim()})` : ''} - R$ ${item.totalPrice.toFixed(2)}\n`;
      }
    });
    
    message += `\n*Total: R$ ${totalCartPrice.toFixed(2)}*`;
    
    return encodeURIComponent(message);
  };

  const checkout = () => {
    const message = generateWhatsAppMessage();
    const phone = '554896726149'; // Replace with actual phone
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    clearCart();
    setIsCartOpen(false);
  };

  return {
    items,
    addItem,
    removeItem,
    clearCart,
    totalCartPrice,
    isCartOpen,
    setIsCartOpen,
    checkout
  };
}
