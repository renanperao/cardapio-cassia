# Cardápio Cassia

Sistema de cardápio digital e pedidos online para a confeitaria artesanal **Cassia**. A aplicação permite que clientes naveguem pelos produtos, montem seus pedidos e finalizem via WhatsApp — tudo sem necessidade de backend ou banco de dados.

---

## Sumário

- [Visão Geral](#visão-geral)
- [Stack Tecnológica](#stack-tecnológica)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Execução](#instalação-e-execução)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Arquitetura da Aplicação](#arquitetura-da-aplicação)
- [Tipos e Modelos de Dados](#tipos-e-modelos-de-dados)
- [Painel Administrativo](#painel-administrativo)
- [Geração de Imagens com IA](#geração-de-imagens-com-ia)
- [Deploy](#deploy)

---

## Visão Geral

O **Cardápio Cassia** é uma SPA (Single Page Application) construída com React + TypeScript que funciona como cardápio digital completo para uma confeitaria. Não há servidor ou banco de dados — o estado dos produtos e configurações da loja é persistido no `localStorage` do navegador.

### Funcionalidades principais

| Área | Funcionalidade |
|---|---|
| Catálogo | Navegação por categorias de produtos com filtro |
| Produto | Modal de detalhes com opções de personalização (tamanho, cobertura, sabor, peso) |
| Carrinho | Adição, remoção e ajuste de quantidades |
| Checkout | Geração de mensagem formatada e envio direto via WhatsApp |
| Admin | Painel para gerenciar disponibilidade, preços e configurações da loja |
| IA | Script para geração automática de imagens dos produtos com Google Gemini |

### Categorias de produtos

- **Bolos Artesanais** — bolos decorados sob encomenda
- **Caseirinhos** — argolas caseiras em vários sabores e tamanhos
- **Pool Cakes** — bolos individuais em porção única
- **Bolos Vulcão** — bolos com cobertura transbordante
- **Bolos Recheados** — bolos vendidos por peso (kg)
- **Doces (Lotes)** — doces finos vendidos em lotes de 25 unidades

---

## Stack Tecnológica

| Camada | Tecnologia | Versão |
|---|---|---|
| UI | React | 18.3.1 |
| Linguagem | TypeScript | 5.6.2 |
| Build | Vite | 5.4.10 |
| Roteamento | React Router DOM | 7.14.1 |
| Estilização | Tailwind CSS | 3.4.19 |
| Ícones | Lucide React | 1.8.0 |
| IA (script) | Google GenAI SDK | 1.50.1 |
| Linting | ESLint | 9.13.0 |

---

## Estrutura do Projeto

```
cardapio-cassia/
├── public/
│   └── generated/              # Imagens dos produtos geradas por IA (JPGs)
├── scripts/
│   └── generate-product-images.mjs  # Script de geração de imagens com Gemini
├── src/
│   ├── assets/                 # Recursos estáticos (logo, etc.)
│   ├── components/
│   │   ├── ProductCard.tsx     # Card de produto no catálogo
│   │   └── ProductModal.tsx    # Modal de detalhes e personalização
│   ├── hooks/
│   │   ├── useData.ts          # Estado e persistência dos produtos e configurações
│   │   └── useCart.ts          # Lógica do carrinho de compras
│   ├── App.tsx                 # View principal do cliente (catálogo + carrinho)
│   ├── Admin.tsx               # Painel administrativo
│   ├── main.tsx                # Entry point — monta o BrowserRouter
│   ├── types.ts                # Todas as interfaces e tipos TypeScript
│   ├── index.css               # Estilos globais e customizações Tailwind
│   └── vite-env.d.ts           # Declarações de tipo do Vite
├── .env.example                # Exemplo de variáveis de ambiente
├── index.html                  # HTML raiz da aplicação
├── tailwind.config.js          # Cores da marca e fontes customizadas
├── tsconfig.app.json           # Configuração TypeScript para a aplicação
├── tsconfig.node.json          # Configuração TypeScript para ferramentas de build
└── vite.config.ts              # Configuração do Vite
```

---

## Pré-requisitos

- **Node.js** >= 18.x
- **npm** >= 9.x (incluso com o Node)

---

## Instalação e Execução

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd cardapio-cassia

# 2. Instale as dependências
npm install

# 3. Copie o arquivo de variáveis de ambiente
cp .env.example .env
# Preencha GEMINI_API_KEY se for usar a geração de imagens

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação ficará disponível em `http://localhost:5173`.

---

## Scripts Disponíveis

| Script | Comando | Descrição |
|---|---|---|
| Desenvolvimento | `npm run dev` | Inicia o servidor com HMR (Hot Module Replacement) |
| Build | `npm run build` | Compila TypeScript e gera o bundle em `dist/` |
| Preview | `npm run preview` | Serve o build de produção localmente |
| Lint | `npm run lint` | Executa o ESLint em todos os arquivos |
| Gerar imagens | `npm run generate:images` | Gera imagens dos produtos com Google Gemini |

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

```env
# Obrigatório apenas para o script de geração de imagens
GEMINI_API_KEY=sua_chave_aqui

# Opcional: modelo do Gemini a usar (padrão: gemini-3.1-flash-image-preview)
GEMINI_IMAGE_MODEL=gemini-3.1-flash-image-preview
```

> A variável `GEMINI_API_KEY` é usada **somente** pelo script `generate-product-images.mjs` em tempo de build/desenvolvimento. A aplicação em si não faz chamadas à API em runtime.

---

## Arquitetura da Aplicação

### Roteamento

A aplicação tem duas rotas principais configuradas em `src/main.tsx`:

```
/        → App.tsx       (catálogo de produtos e carrinho — público)
/admin   → Admin.tsx     (painel administrativo — protegido por senha)
```

### Persistência de dados

Não há backend. Toda a persistência é feita via `localStorage`:

- **Produtos**: o hook `useData.ts` carrega a lista de produtos hardcoded no próprio arquivo, e mescla com qualquer modificação salva no `localStorage` (ex: disponibilidade alterada pelo admin, preços editados).
- **Configurações da loja**: o status aberto/fechado também é salvo no `localStorage`.
- **Carrinho**: gerenciado em memória durante a sessão pelo hook `useCart.ts`.

### Fluxo do cliente

```
App.tsx
 ├── Lista de produtos filtrados por categoria
 ├── ProductCard → abre ProductModal ao clicar
 │    └── ProductModal → permite personalizar e adicionar ao carrinho
 └── Carrinho lateral
      └── Checkout → gera mensagem e abre WhatsApp
```

### Fluxo do admin

```
/admin → Admin.tsx
  ├── Autenticação por senha (hardcoded: "cassiaadmin")
  ├── Toggle global: loja aberta / fechada
  └── Tabs por categoria
       └── Por produto: toggle disponibilidade, editar preço/metadata
```

---

## Tipos e Modelos de Dados

Todos os tipos estão definidos em `src/types.ts`.

### Product

```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  isAvailable: boolean;
  category: 'cake' | 'sweet' | 'caseirinhos' | 'pool-cake' | 'vulcao' | 'recheado';
  subCategory?: string;

  // Metadados específicos por categoria:
  caseirinhoMetadata?: CaseirinhoMetadata;
  poolCakeMetadata?: PoolCakeMetadata;
  vulcaoMetadata?: VulcaoMetadata;
  recheadoMetadata?: RecheadoMetadata;
  sweetMetadata?: SweetMetadata;
}
```

### CartItem

```typescript
interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  size?: CakeSize | CaseirinhoSize;
  icing?: IcingOption;
  caseirinhoIcingFlavor?: string;
  recheadoKg?: number;
  recheadoFinishing?: string;
  recheadoHasStrawberry?: boolean;
  sweetShape?: boolean;
  totalPrice: number;
}
```

### StoreSettings

```typescript
interface StoreSettings {
  isOpen: boolean;
}
```

---

## Painel Administrativo

Acesse em `/admin`. A senha atual é `cassiaadmin` (hardcoded em `src/Admin.tsx`).

> Para alterar a senha, edite a constante `ADMIN_PASSWORD` no topo de `src/Admin.tsx`.

### Funcionalidades do admin

- **Status da loja**: toggle para abrir/fechar a loja. Quando fechada, o cliente vê um aviso e não consegue finalizar pedidos.
- **Disponibilidade por produto**: cada produto pode ser ativado ou desativado individualmente.
- **Edição de preços**: preço base editável por produto.
- **Edição de metadata**: dependendo da categoria, é possível editar tamanhos, sabores, coberturas e outras opções de personalização.

> Todas as alterações feitas no admin são salvas automaticamente no `localStorage` e persistem entre sessões no mesmo dispositivo/navegador.

---

## Geração de Imagens com IA

O script `scripts/generate-product-images.mjs` usa a API do Google Gemini para gerar imagens realistas de todos os produtos do catálogo.

### Como funciona

1. Lê o arquivo `src/hooks/useData.ts` via AST para extrair os dados dos produtos
2. Para cada produto, monta um prompt descritivo com base na categoria e nome
3. Chama a API do Gemini para gerar a imagem
4. Salva as imagens em `public/generated/<id>.jpg`
5. Atualiza automaticamente as referências de imagem no código-fonte

### Uso

```bash
# Gerar imagens para todos os produtos (pula os que já existem)
npm run generate:images

# Forçar regeração mesmo para imagens existentes
npm run generate:images -- --force

# Simular sem gerar (ver quais seriam processados)
npm run generate:images -- --dry-run

# Limitar quantidade gerada
npm run generate:images -- --limit 5

# Filtrar por nome de produto
npm run generate:images -- --match "Caseirinho"

# Usar um modelo específico do Gemini
npm run generate:images -- --model gemini-2.0-flash-exp
```

---

## Deploy

A aplicação é totalmente estática — basta servir o conteúdo da pasta `dist/`.

### Build de produção

```bash
npm run build
# Saída gerada em dist/
```

### Hospedagem recomendada

Qualquer serviço de hosting estático funciona:

- **Vercel**: conecte o repositório e configure `npm run build` como build command e `dist` como output directory.
- **Netlify**: mesmo processo que o Vercel.
- **GitHub Pages**: faça o deploy da pasta `dist/` usando `gh-pages` ou GitHub Actions.

### Observações importantes para produção

- O admin usa `localStorage` — dados editados no admin ficam **apenas no dispositivo onde foram editados**. Para uso em produção com múltiplos dispositivos, seria necessário adicionar um backend.
- O WhatsApp de destino dos pedidos é configurado diretamente no código (número hardcoded em `src/hooks/useCart.ts` ou `src/App.tsx` — verifique antes de publicar).
- Não há autenticação robusta no admin — a senha está em texto claro no código-fonte. Considere adicionar autenticação real se a aplicação for pública.
