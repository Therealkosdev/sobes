# Методичка подготовки к собеседованию Middle React/Next.js Developer

## 1. React: Современные хуки и паттерны

### useState
Базовый хук для локального состояния компонента.

```typescript
const [count, setCount] = useState<number>(0);
const [user, setUser] = useState<User | null>(null);

// Ленивая инициализация (вычисляется только один раз)
const [data, setData] = useState(() => expensiveComputation());

// Функциональное обновление (когда новое значение зависит от предыдущего)
setCount(prev => prev + 1);
```

**Важно на собеседовании:**
- Обновления состояния асинхронные и батчатся
- Используйте функциональное обновление при зависимости от предыдущего состояния
- Ленивая инициализация для тяжёлых вычислений

### useEffect
Для сайд-эффектов: запросы, подписки, изменения DOM.

```typescript
useEffect(() => {
  // Эффект выполняется после рендера
  const subscription = api.subscribe(userId);
  
  // Cleanup функция (вызывается перед следующим эффектом и при размонтировании)
  return () => {
    subscription.unsubscribe();
  };
}, [userId]); // Массив зависимостей

// Запуск только при монтировании
useEffect(() => {
  initializeApp();
}, []);

// Запуск при каждом рендере (избегать!)
useEffect(() => {
  // Выполняется всегда
});
```

**Важно на собеседовании:**
- Эффект запускается ПОСЛЕ рендера и покраски экрана
- Всегда возвращайте cleanup для подписок/таймеров
- Пустой массив зависимостей = выполнится один раз
- ESLint правило exhaustive-deps помогает избежать багов

### useLayoutEffect
Аналог useEffect, но выполняется синхронно ПЕРЕД покраской экрана.

```typescript
useLayoutEffect(() => {
  // Измеряем DOM элемент до того как браузер покрасит экран
  const rect = ref.current?.getBoundingClientRect();
  setHeight(rect?.height);
}, []);
```

**Когда использовать:**
- Измерение DOM элементов
- Синхронные изменения DOM, чтобы избежать мерцания
- В 99% случаев используйте useEffect

### useMemo
Мемоизация вычислений.

```typescript
const expensiveValue = useMemo(() => {
  return heavyComputation(a, b);
}, [a, b]);

// Пример: фильтрация большого списка
const filteredUsers = useMemo(() => {
  return users.filter(user => user.name.includes(searchQuery));
}, [users, searchQuery]);
```

**Важно на собеседовании:**
- Используйте только для реально тяжёлых вычислений
- Не оптимизируйте преждевременно
- Помогает избежать лишних рендеров дочерних компонентов

### useCallback
Мемоизация функций.

```typescript
const handleClick = useCallback(() => {
  doSomething(a, b);
}, [a, b]);

// Пример с передачей в дочерний компонент
const MemoizedChild = memo(Child);

function Parent() {
  const [count, setCount] = useState(0);
  
  // Без useCallback функция пересоздаётся при каждом рендере
  const handleIncrement = useCallback(() => {
    setCount(c => c + 1);
  }, []);
  
  return <MemoizedChild onIncrement={handleIncrement} />;
}
```

**Важно на собеседовании:**
- Нужен в основном для передачи в мемоизированные компоненты
- В связке с React.memo предотвращает лишние рендеры
- Функция внутри useCallback может стать "устаревшей" без правильных зависимостей

### useRef
Хранение мутабельного значения, которое не вызывает ре-рендер.

```typescript
// Доступ к DOM элементу
const inputRef = useRef<HTMLInputElement>(null);
useEffect(() => {
  inputRef.current?.focus();
}, []);

// Хранение предыдущего значения
const prevCountRef = useRef<number>();
useEffect(() => {
  prevCountRef.current = count;
}, [count]);

// Хранение интервала/таймера
const intervalRef = useRef<NodeJS.Timeout>();
useEffect(() => {
  intervalRef.current = setInterval(() => {}, 1000);
  return () => clearInterval(intervalRef.current);
}, []);
```

**Важно на собеседовании:**
- Изменение ref.current не вызывает ре-рендер
- Значение сохраняется между рендерами
- Идеально для работы с DOM и хранения мутабельных значений

### useReducer
Альтернатива useState для сложной логики состояния.

```typescript
type State = { count: number; step: number };
type Action = 
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'setStep'; payload: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + state.step };
    case 'decrement':
      return { ...state, count: state.count - state.step };
    case 'setStep':
      return { ...state, step: action.payload };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0, step: 1 });
  
  return (
    <>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </>
  );
}
```

**Когда использовать:**
- Сложная логика обновления состояния
- Следующее состояние зависит от предыдущего
- Множество связанных значений состояния
- Когда хотите предсказуемость (как Redux)

### useContext
Доступ к контексту без prop drilling.

```typescript
type Theme = 'light' | 'dark';
const ThemeContext = createContext<Theme>('light');

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

function Button() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Click me</button>;
}
```

**Важно на собеседовании:**
- Все потребители ре-рендерятся при изменении значения контекста
- Для оптимизации можно разделить на несколько контекстов
- Используйте memo для дочерних компонентов

### useTransition (React 18+)
Позволяет пометить обновление как не срочное.

```typescript
function SearchResults() {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Срочное обновление (инпут должен быть отзывчивым)
    setQuery(e.target.value);
    
    // Не срочное обновление (поиск может подождать)
    startTransition(() => {
      setResults(searchData(e.target.value));
    });
  };
  
  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending ? <Spinner /> : <List items={results} />}
    </>
  );
}
```

**Важно на собеседовании:**
- Улучшает отзывчивость UI при тяжёлых обновлениях
- Не блокирует пользовательский ввод
- React приоритизирует срочные обновления

### useDeferredValue (React 18+)
Откладывает обновление части UI.

```typescript
function ProductList({ query }: { query: string }) {
  const deferredQuery = useDeferredValue(query);
  
  // Список обновится с задержкой, инпут останется отзывчивым
  const results = useMemo(() => {
    return products.filter(p => p.name.includes(deferredQuery));
  }, [deferredQuery]);
  
  return <List items={results} />;
}
```

**Отличие от useTransition:**
- useTransition — контролируете начало обновления
- useDeferredValue — откладываете значение
- useDeferredValue проще когда не контролируете код обновления

### useId (React 18+)
Генерирует уникальные ID для accessibility.

```typescript
function TextField({ label }: { label: string }) {
  const id = useId();
  
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </>
  );
}
```

**Важно на собеседовании:**
- Работает с SSR (одинаковый ID на сервере и клиенте)
- Решает проблему гидратации
- Не используйте для ключей в списках

### Custom Hooks
Переиспользуемая логика с состоянием.

```typescript
// useDebounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}

// useLocalStorage
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });
  
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  
  return [value, setValue] as const;
}

// useClickOutside
function useClickOutside(ref: RefObject<HTMLElement>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };
    
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
```

## 2. Next.js: Полное руководство

### Что такое Next.js и зачем он нужен

**Next.js** — это React-фреймворк для production-ready приложений, созданный Vercel.

**Основные проблемы, которые решает Next.js:**

1. **SEO и производительность**
   - React из коробки — SPA (Single Page Application)
   - Контент рендерится на клиенте → поисковики видят пустую страницу
   - Next.js предоставляет SSR (Server-Side Rendering) и SSG (Static Site Generation)

2. **Роутинг**
   - В обычном React нужно устанавливать react-router
   - Next.js использует файловый роутинг (file-based routing)
   - Папка = маршрут, проще и интуитивнее

3. **Code Splitting**
   - Next.js автоматически разбивает код на чанки
   - Каждая страница загружает только необходимый JavaScript
   - Улучшает производительность

4. **API Routes**
   - Можно создавать бэкенд прямо в Next.js проекте
   - Не нужен отдельный сервер для простых API

5. **Оптимизация изображений**
   - Компонент `<Image>` автоматически оптимизирует картинки
   - Lazy loading, WebP формат, responsive images

6. **TypeScript из коробки**
   - Полная поддержка TypeScript без настройки

**Когда использовать Next.js:**
- SEO критично (блоги, e-commerce, корпоративные сайты)
- Нужен SSR или SSG
- Хотите быстро развернуть full-stack приложение
- Важна производительность и Core Web Vitals

**Когда НЕ использовать Next.js:**
- Чистое SPA без SEO (админки, dashboards)
- Очень сложная клиентская логика (лучше CRA или Vite)
- Микрофронтенды с Module Federation

### Структура Next.js проекта

**Базовая структура (App Router):**
```
my-next-app/
├── app/                    # Главная папка приложения (App Router)
│   ├── layout.tsx         # Root layout (обязательный)
│   ├── page.tsx           # Главная страница (/)
│   ├── loading.tsx        # Loading UI
│   ├── error.tsx          # Error boundary
│   ├── not-found.tsx      # 404 страница
│   ├── globals.css        # Глобальные стили
│   │
│   ├── about/             # /about маршрут
│   │   └── page.tsx
│   │
│   ├── blog/              # /blog маршрут
│   │   ├── page.tsx       # Список постов
│   │   ├── [slug]/        # Динамический маршрут /blog/[slug]
│   │   │   └── page.tsx
│   │   └── layout.tsx     # Layout только для blog секции
│   │
│   └── api/               # API routes
│       └── users/
│           └── route.ts   # GET/POST /api/users
│
├── components/            # Переиспользуемые компоненты
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ui/                # UI компоненты (кнопки, инпуты)
│       ├── Button.tsx
│       └── Input.tsx
│
├── lib/                   # Утилиты и хелперы
│   ├── api.ts            # API клиент (ky)
│   ├── utils.ts          # Общие утилиты
│   └── db.ts             # Database клиент
│
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts
│   └── useDebounce.ts
│
├── types/                 # TypeScript типы
│   ├── user.ts
│   └── post.ts
│
├── public/                # Статические файлы
│   ├── images/
│   └── favicon.ico
│
├── middleware.ts          # Middleware (auth, redirects)
├── next.config.js         # Конфигурация Next.js
├── tsconfig.json          # TypeScript конфиг
├── tailwind.config.ts     # Tailwind конфиг
└── package.json
```

**Альтернативная структура (более масштабируемая):**
```
my-next-app/
├── src/
│   ├── app/              # App Router
│   ├── components/       # Компоненты
│   ├── features/         # Фичи приложения
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── api/
│   │   └── posts/
│   │       ├── components/
│   │       └── hooks/
│   ├── lib/
│   └── types/
├── public/
└── ...
```

### Методы рендеринга в Next.js

**1. SSR (Server-Side Rendering)**
Страница рендерится на сервере при каждом запросе.

```typescript
// app/page.tsx
// По умолчанию с fetch cache: 'no-store'
async function HomePage() {
  const res = await fetch('https://api.example.com/posts', {
    cache: 'no-store' // Всегда свежие данные
  });
  const posts = await res.json();
  
  return <div>{posts.map(post => <Post key={post.id} {...post} />)}</div>;
}
```

**Когда использовать:** Персонализированный контент, данные часто меняются.

**2. SSG (Static Site Generation)**
Страница генерируется во время билда.

```typescript
// app/page.tsx
async function HomePage() {
  const res = await fetch('https://api.example.com/posts', {
    cache: 'force-cache' // Кэшируется навсегда (по умолчанию)
  });
  const posts = await res.json();
  
  return <div>{posts.map(post => <Post key={post.id} {...post} />)}</div>;
}
```

**Когда использовать:** Статический контент (блоги, документация).

**3. ISR (Incremental Static Regeneration)**
Статическая генерация с периодической ревалидацией.

```typescript
// app/page.tsx
async function HomePage() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 60 } // Ревалидация каждые 60 секунд
  });
  const posts = await res.json();
  
  return <div>{posts.map(post => <Post key={post.id} {...post} />)}</div>;
}
```

**Когда использовать:** Контент обновляется, но не критично показывать самые свежие данные.

**4. CSR (Client-Side Rendering)**
Рендеринг на клиенте (классический React).

```typescript
'use client';

import { useEffect, useState } from 'react';

function HomePage() {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    fetch('https://api.example.com/posts')
      .then(r => r.json())
      .then(setPosts);
  }, []);
  
  return <div>{posts.map(post => <Post key={post.id} {...post} />)}</div>;
}
```

**Когда использовать:** Данные специфичны для пользователя, SEO не важно.

### Сравнение: Pages Router vs App Router

| Особенность | Pages Router (старый) | App Router (новый) |
|-------------|----------------------|-------------------|
| Папка | `pages/` | `app/` |
| Файл страницы | `index.tsx` | `page.tsx` |
| Layouts | Ручная реализация | Встроенные `layout.tsx` |
| Data Fetching | `getServerSideProps`, `getStaticProps` | `async/await` в компонентах |
| Loading States | Ручная реализация | `loading.tsx` |
| Error Handling | `_error.tsx` | `error.tsx` |
| Server Components | Нет | Да (по умолчанию) |
| Streaming | Сложно | Встроенный (Suspense) |

**На собеседовании важно:** App Router — это будущее Next.js, Pages Router в maintenance mode.

### Основы App Router

**Структура папок:**
```
app/
├── page.tsx              # / route
├── layout.tsx            # Layout для всех страниц
├── loading.tsx           # Loading UI
├── error.tsx             # Error boundary
├── not-found.tsx         # 404 страница
├── about/
│   └── page.tsx          # /about route
└── blog/
    ├── [slug]/
    │   └── page.tsx      # /blog/[slug] dynamic route
    └── page.tsx          # /blog route
```

### Server Components vs Client Components

**Server Components (по умолчанию):**
```typescript
// app/page.tsx
// Это Server Component (по умолчанию)
async function HomePage() {
  const data = await fetch('https://api.example.com/data');
  const posts = await data.json();
  
  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>{post.title}</article>
      ))}
    </div>
  );
}

export default HomePage;
```

**Преимущества Server Components:**
- Не отправляются на клиент (меньше бандл)
- Прямой доступ к БД/файловой системе
- Автоматическое code splitting
- Лучше для SEO

**Client Components:**
```typescript
'use client'; // Директива для клиентского компонента

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

**Когда использовать Client Components:**
- Нужны хуки (useState, useEffect, etc.)
- Обработчики событий (onClick, onChange, etc.)
- Browser APIs (localStorage, window, etc.)
- Custom hooks

### Layouts и Templates

**Root Layout (обязательный):**
```typescript
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <header>My App</header>
        {children}
        <footer>© 2024</footer>
      </body>
    </html>
  );
}
```

**Nested Layouts:**
```typescript
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard">
      <aside>Sidebar</aside>
      <main>{children}</main>
    </div>
  );
}
```

**Template (пересоздаётся при навигации):**
```typescript
// app/template.tsx
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-in">{children}</div>;
}
```

**Отличие Layout vs Template:**
- Layout сохраняет состояние при навигации
- Template пересоздаётся (полезно для анимаций входа)

### Loading UI и Streaming

**Loading.tsx:**
```typescript
// app/dashboard/loading.tsx
export default function Loading() {
  return <div>Loading dashboard...</div>;
}
```

**Автоматически оборачивает page.tsx в Suspense:**
```typescript
<Suspense fallback={<Loading />}>
  <Page />
</Suspense>
```

**Ручной Streaming с Suspense:**
```typescript
// app/page.tsx
import { Suspense } from 'react';

async function SlowComponent() {
  await new Promise(resolve => setTimeout(resolve, 3000));
  return <div>Loaded!</div>;
}

export default function Page() {
  return (
    <div>
      <h1>Instant Content</h1>
      <Suspense fallback={<div>Loading slow part...</div>}>
        <SlowComponent />
      </Suspense>
    </div>
  );
}
```

### Error Handling

**Error.tsx (Error Boundary):**
```typescript
'use client'; // Error boundaries должны быть клиентскими

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

**Global Error (app/global-error.tsx):**
```typescript
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>Global Error</h2>
        <button onClick={reset}>Try again</button>
      </body>
    </html>
  );
}
```

### Data Fetching в App Router

**Автоматическое кэширование fetch:**
```typescript
// Кэшируется по умолчанию (force-cache)
const data = await fetch('https://api.example.com/data');

// Отключить кэш
const data = await fetch('https://api.example.com/data', {
  cache: 'no-store'
});

// Ревалидация каждые 60 секунд
const data = await fetch('https://api.example.com/data', {
  next: { revalidate: 60 }
});
```

**Параллельные запросы:**
```typescript
async function Page() {
  const [user, posts] = await Promise.all([
    fetch('/api/user').then(r => r.json()),
    fetch('/api/posts').then(r => r.json())
  ]);
  
  return <div>...</div>;
}
```

**Sequential Fetching (когда нужны данные из первого запроса):**
```typescript
async function Page() {
  const user = await fetch('/api/user').then(r => r.json());
  const posts = await fetch(`/api/posts?userId=${user.id}`).then(r => r.json());
  
  return <div>...</div>;
}
```

### Route Handlers (API Routes)

**Базовый Route Handler:**
```typescript
// app/api/users/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const users = await db.users.findMany();
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const body = await request.json();
  const user = await db.users.create({ data: body });
  return NextResponse.json(user, { status: 201 });
}
```

**Dynamic Route Handler:**
```typescript
// app/api/users/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await db.users.findUnique({ where: { id: params.id } });
  
  if (!user) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  
  return NextResponse.json(user);
}
```

### Metadata и SEO

**Static Metadata:**
```typescript
// app/page.tsx
export const metadata = {
  title: 'My App',
  description: 'Welcome to my app',
  openGraph: {
    title: 'My App',
    description: 'Welcome to my app',
    images: ['/og-image.jpg'],
  },
};

export default function Page() {
  return <div>Home</div>;
}
```

**Dynamic Metadata:**
```typescript
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await fetch(`/api/posts/${params.slug}`).then(r => r.json());
  
  return {
    title: post.title,
    description: post.excerpt,
  };
}
```

### Route Groups и Parallel Routes

**Route Groups (не влияют на URL):**
```
app/
├── (marketing)/
│   ├── layout.tsx
│   ├── page.tsx          # /
│   └── about/page.tsx    # /about
└── (shop)/
    ├── layout.tsx
    └── products/page.tsx # /products
```

**Parallel Routes:**
```
app/
├── @team/
│   └── page.tsx
├── @analytics/
│   └── page.tsx
└── layout.tsx
```

```typescript
// app/layout.tsx
export default function Layout({
  children,
  team,
  analytics,
}: {
  children: React.ReactNode;
  team: React.ReactNode;
  analytics: React.ReactNode;
}) {
  return (
    <div>
      {children}
      {team}
      {analytics}
    </div>
  );
}
```

### Intercepting Routes

```
app/
├── photo/
│   └── [id]/
│       └── page.tsx      # /photo/123
└── @modal/
    └── (.)photo/
        └── [id]/
            └── page.tsx  # Перехватывает /photo/123
```

### Middleware

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Проверка авторизации
  const token = request.cookies.get('token');
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*',
};
```

## 3. React Hook Form

### Основы использования

**Простая форма:**
```typescript
import { useForm, SubmitHandler } from 'react-hook-form';

type FormData = {
  email: string;
  password: string;
};

function LoginForm() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<FormData>();
  
  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input 
        {...register('email', { 
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address'
          }
        })} 
      />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input 
        type="password"
        {...register('password', { 
          required: 'Password is required',
          minLength: {
            value: 8,
            message: 'Password must be at least 8 characters'
          }
        })} 
      />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit">Login</button>
    </form>
  );
}
```

### Валидация

**Встроенная валидация:**
```typescript
const { register } = useForm<FormData>();

<input 
  {...register('username', {
    required: 'Username is required',
    minLength: { value: 3, message: 'Min length is 3' },
    maxLength: { value: 20, message: 'Max length is 20' },
    pattern: {
      value: /^[a-zA-Z0-9_]+$/,
      message: 'Only alphanumeric characters'
    },
    validate: {
      noAdmin: (value) => value !== 'admin' || 'Username cannot be admin',
      async isUnique(value) {
        const response = await fetch(`/api/check-username?name=${value}`);
        const isUnique = await response.json();
        return isUnique || 'Username is taken';
      }
    }
  })}
/>
```

**Интеграция с Zod:**
```typescript
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  age: z.number().min(18, 'Must be 18 or older'),
});

type FormData = z.infer<typeof schema>;

function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  
  return <form>...</form>;
}
```

### Контролируемые компоненты с Controller

```typescript
import { Controller } from 'react-hook-form';
import Select from 'react-select';

function MyForm() {
  const { control } = useForm();
  
  return (
    <Controller
      name="country"
      control={control}
      rules={{ required: 'Please select a country' }}
      render={({ field, fieldState: { error } }) => (
        <>
          <Select
            {...field}
            options={countries}
            onChange={(value) => field.onChange(value)}
          />
          {error && <span>{error.message}</span>}
        </>
      )}
    />
  );
}
```

### Watch и setValue

```typescript
function MyForm() {
  const { register, watch, setValue } = useForm<FormData>();
  
  // Следить за одним полем
  const email = watch('email');
  
  // Следить за несколькими полями
  const [email, password] = watch(['email', 'password']);
  
  // Следить за всей формой
  const formData = watch();
  
  // Программное изменение значения
  const handleReset = () => {
    setValue('email', '');
  };
  
  return <form>...</form>;
}
```

### Динамические поля (Field Arrays)

```typescript
import { useFieldArray } from 'react-hook-form';

type FormData = {
  users: { name: string; email: string }[];
};

function DynamicForm() {
  const { register, control } = useForm<FormData>({
    defaultValues: {
      users: [{ name: '', email: '' }]
    }
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'users'
  });
  
  return (
    <form>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input {...register(`users.${index}.name`)} />
          <input {...register(`users.${index}.email`)} />
          <button type="button" onClick={() => remove(index)}>
            Remove
          </button>
        </div>
      ))}
      
      <button 
        type="button" 
        onClick={() => append({ name: '', email: '' })}
      >
        Add User
      </button>
    </form>
  );
}
```

### Режимы валидации

```typescript
const { register } = useForm({
  mode: 'onSubmit',    // (default) валидация при сабмите
  // mode: 'onBlur',   // валидация при потере фокуса
  // mode: 'onChange', // валидация при каждом изменении
  // mode: 'onTouched', // после первого blur, затем при каждом change
  // mode: 'all',      // onBlur + onChange
});
```

### Интеграция с React Query

```typescript
function CreateUserForm() {
  const { register, handleSubmit } = useForm<UserFormData>();
  
  const mutation = useMutation({
    mutationFn: (data: UserFormData) => 
      fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
  
  const onSubmit = (data: UserFormData) => {
    mutation.mutate(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      <button disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create'}
      </button>
      {mutation.isError && <span>Error creating user</span>}
    </form>
  );
}
```

## 4. HTTP-клиент: ky

### Основы ky

**Почему ky вместо fetch/axios:**
- Минималистичный и современный
- Работает на fetch API
- Автоматический retry
- Timeout из коробки
- Меньше бойлерплейта

**Базовое использование:**
```typescript
import ky from 'ky';

// GET запрос
const user = await ky.get('https://api.example.com/users/1').json<User>();

// POST запрос
const newUser = await ky.post('https://api.example.com/users', {
  json: { name: 'John', email: 'john@example.com' }
}).json<User>();

// PUT запрос
await ky.put('https://api.example.com/users/1', {
  json: { name: 'Jane' }
});

// DELETE запрос
await ky.delete('https://api.example.com/users/1');
```

### Создание API клиента

```typescript
// lib/api.ts
import ky from 'ky';

export const api = ky.create({
  prefixUrl: 'https://api.example.com',
  timeout: 30000, // 30 секунд
  retry: {
    limit: 3,
    methods: ['get', 'put', 'head', 'delete', 'options', 'trace'],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  },
  hooks: {
    beforeRequest: [
      request => {
        // Добавление токена авторизации
        const token = localStorage.getItem('token');
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      }
    ],
    afterResponse: [
      async (request, options, response) => {
        // Обработка 401 (обновление токена)
        if (response.status === 401) {
          const newToken = await refreshToken();
          localStorage.setItem('token', newToken);
          
          // Повторить запрос с новым токеном
          request.headers.set('Authorization', `Bearer ${newToken}`);
          return ky(request);
        }
        
        return response;
      }
    ],
    beforeError: [
      error => {
        // Логирование ошибок
        console.error('API Error:', error);
        return error;
      }
    ]
  }
});

// Использование
export const getUsers = () => api.get('users').json<User[]>();
export const getUser = (id: string) => api.get(`users/${id}`).json<User>();
export const createUser = (data: CreateUserDto) => 
  api.post('users', { json: data }).json<User>();
```

### Обработка ошибок

```typescript
import { HTTPError } from 'ky';

try {
  const user = await api.get('users/1').json<User>();
} catch (error) {
  if (error instanceof HTTPError) {
    // HTTP ошибка (4xx, 5xx)
    const statusCode = error.response.status;
    const errorBody = await error.response.json();
    
    if (statusCode === 404) {
      console.log('User not found');
    } else if (statusCode === 401) {
      console.log('Unauthorized');
    }
  } else {
    // Сетевая ошибка
    console.error('Network error:', error);
  }
}
```

### Интеграция с React Query

```typescript
// lib/api.ts
import ky from 'ky';

export const api = ky.create({
  prefixUrl: '/api',
  hooks: {
    beforeRequest: [
      request => {
        const token = localStorage.getItem('token');
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      }
    ]
  }
});

// lib/queries/users.ts
export const usersApi = {
  getAll: () => api.get('users').json<User[]>(),
  getById: (id: string) => api.get(`users/${id}`).json<User>(),
  create: (data: CreateUserDto) => api.post('users', { json: data }).json<User>(),
  update: (id: string, data: UpdateUserDto) => 
    api.patch(`users/${id}`, { json: data }).json<User>(),
  delete: (id: string) => api.delete(`users/${id}`).json<void>(),
};

// components/UsersList.tsx
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/lib/queries/users';

function UsersList() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getAll,
  });
  
  if (isLoading) return <div>Loading...</div>;
  
  return <ul>{users?.map(user => <li key={user.id}>{user.name}</li>)}</ul>;
}
```

### Продвинутые фичи ky

**Timeout для конкретного запроса:**
```typescript
const user = await api.get('users/1', {
  timeout: 5000 // 5 секунд
}).json<User>();
```

**Отмена запроса:**
```typescript
const controller = new AbortController();

api.get('users', { signal: controller.signal })
  .json()
  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('Request cancelled');
    }
  });

// Отменить запрос
controller.abort();
```

**Кастомные retry стратегии:**
```typescript
const api = ky.create({
  retry: {
    limit: 3,
    methods: ['get'],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
    backoffLimit: 3000,
    delay: attemptCount => 0.3 * (2 ** (attemptCount - 1)) * 1000
  }
});
```

**SearchParams:**
```typescript
const users = await api.get('users', {
  searchParams: {
    page: 1,
    limit: 10,
    sort: 'name',
  }
}).json<User[]>();
// GET /users?page=1&limit=10&sort=name
```

## 5. @tanstack/react-query (TanStack Query)

### Что такое React Query и зачем он нужен

**React Query** — библиотека для управления асинхронным серверным состоянием.

**Проблемы, которые решает:**
- Кэширование данных
- Автоматическая ревалидация
- Дедупликация запросов
- Optimistic updates
- Pagination / Infinite scroll
- Prefetching
- Синхронизация состояния между компонентами

**Без React Query:**
```typescript
function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch('/api/user')
      .then(r => r.json())
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;
  return <div>{user.name}</div>;
}
```

**С React Query:**
```typescript
function UserProfile() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: () => fetch('/api/user').then(r => r.json()),
  });
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;
  return <div>{user.name}</div>;
}
```

### Настройка React Query

```typescript
// app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 минута
        gcTime: 5 * 60 * 1000, // 5 минут (раньше cacheTime)
        retry: 3,
        refetchOnWindowFocus: true,
      },
    },
  }));
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### useQuery: Получение данных

**Базовое использование:**
```typescript
import { useQuery } from '@tanstack/react-query';

function UserProfile({ userId }: { userId: string }) {
  const { 
    data,           // Данные
    error,          // Ошибка
    isLoading,      // Первая загрузка
    isFetching,     // Любая загрузка (включая рефетч)
    isError,        
    isSuccess,
    refetch,        // Функция для ручного рефетча
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => api.get(`users/${userId}`).json<User>(),
    enabled: !!userId, // Запрос выполнится только если userId существует
  });
  
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  
  return <div>{data.name}</div>;
}
```

### Query Keys: Правила и паттерны

**Query Key** — уникальный идентификатор запроса для кэширования.

```typescript
// ❌ Плохо - слишком общий ключ
useQuery({ queryKey: ['users'], queryFn: getUsers });

// ✅ Хорошо - специфичный ключ
useQuery({ 
  queryKey: ['users', { page: 1, limit: 10 }], 
  queryFn: () => getUsers({ page: 1, limit: 10 })
});

// ✅ Иерархические ключи
useQuery({ queryKey: ['users'], queryFn: getAllUsers });
useQuery({ queryKey: ['users', userId], queryFn: () => getUser(userId) });
useQuery({ queryKey: ['users', userId, 'posts'], queryFn: () => getUserPosts(userId) });

// ✅ С фильтрами
useQuery({ 
  queryKey: ['users', { status: 'active', role: 'admin' }], 
  queryFn: () => getUsers({ status: 'active', role: 'admin' })
});
```

**Важно на собеседовании:**
- Query key определяет, когда данные считаются "теми же самыми"
- Изменение query key = новый запрос
- React Query сериализует ключи для сравнения

### Кэширование и staleTime vs gcTime

**staleTime** — время, пока данные считаются "свежими".
**gcTime** (garbage collection time, раньше cacheTime) — время хранения неиспользуемых данных в кэше.

```typescript
useQuery({
  queryKey: ['users'],
  queryFn: getUsers,
  staleTime: 5 * 60 * 1000, // 5 минут - данные свежие
  gcTime: 10 * 60 * 1000,   // 10 минут - данные в кэше
});
```

**Жизненный цикл кэша:**
```
1. Запрос → данные в кэше (fresh)
2. После staleTime → данные stale (устаревшие)
3. При рефокусе/ремонте компонента → рефетч если stale
4. Компонент размонтирован → данные inactive
5. После gcTime → данные удаляются из памяти
```

**Важно на собеседовании:**
- `staleTime: 0` (default) — данные сразу устаревают, рефетч при каждом маунте
- `staleTime: Infinity` — данные никогда не устаревают
- `gcTime` не влияет на то, когда данные рефетчатся

### Инвалидация кэша

**Ручная инвалидация:**
```typescript
import { useQueryClient } from '@tanstack/react-query';

function CreateUserButton() {
  const queryClient = useQueryClient();
  
  const handleCreate = async () => {
    await api.post('users', { json: newUser });
    
    // Инвалидировать все запросы с ключом ['users']
    queryClient.invalidateQueries({ queryKey: ['users'] });
    
    // Инвалидировать только точный ключ
    queryClient.invalidateQueries({ 
      queryKey: ['users', { page: 1 }],
      exact: true 
    });
    
    // Инвалидировать с предикатом
    queryClient.invalidateQueries({
      predicate: (query) => 
        query.queryKey[0] === 'users' && query.state.data?.length > 10
    });
  };
  
  return <button onClick={handleCreate}>Create User</button>;
}
```

**Ручное обновление кэша:**
```typescript
// Установить данные напрямую
queryClient.setQueryData(['user', '1'], newUser);

// Обновить данные функцией
queryClient.setQueryData(['user', '1'], (oldData) => ({
  ...oldData,
  name: 'Updated Name'
}));

// Удалить из кэша
queryClient.removeQueries({ queryKey: ['user', '1'] });

// Сбросить к начальному состоянию
queryClient.resetQueries({ queryKey: ['user', '1'] });
```

### useMutation: Изменение данных

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

function CreateUserForm() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (newUser: CreateUserDto) => 
      api.post('users', { json: newUser }).json<User>(),
    
    // Вызывается перед мутацией
    onMutate: async (newUser) => {
      // Отменить исходящие рефетчи
      await queryClient.cancelQueries({ queryKey: ['users'] });
      
      // Сохранить предыдущие данные для отката
      const previousUsers = queryClient.getQueryData(['users']);
      
      return { previousUsers };
    },
    
    // Вызывается при успехе
    onSuccess: (data, variables, context) => {
      // Инвалидировать и рефетчить
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    
    // Вызывается при ошибке
    onError: (err, variables, context) => {
      // Откатить изменения
      if (context?.previousUsers) {
        queryClient.setQueryData(['users'], context.previousUsers);
      }
    },
    
    // Вызывается всегда (после success или error)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
  
  const handleSubmit = (data: CreateUserDto) => {
    mutation.mutate(data);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create'}
      </button>
      {mutation.isError && <div>Error: {mutation.error.message}</div>}
      {mutation.isSuccess && <div>User created!</div>}
    </form>
  );
}
```

### Optimistic Updates

**Паттерн 1: Обновление списка при создании:**
```typescript
const mutation = useMutation({
  mutationFn: createUser,
  onMutate: async (newUser) => {
    await queryClient.cancelQueries({ queryKey: ['users'] });
    
    const previousUsers = queryClient.getQueryData(['users']);
    
    // Оптимистично добавить пользователя
    queryClient.setQueryData(['users'], (old: User[]) => [
      ...old,
      { ...newUser, id: 'temp-id' }
    ]);
    
    return { previousUsers };
  },
  onError: (err, newUser, context) => {
    // Откатить при ошибке
    queryClient.setQueryData(['users'], context.previousUsers);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  },
});
```

**Паттерн 2: Обновление элемента:**
```typescript
const mutation = useMutation({
  mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) =>
    api.patch(`users/${id}`, { json: data }).json<User>(),
  
  onMutate: async ({ id, data }) => {
    await queryClient.cancelQueries({ queryKey: ['users', id] });
    
    const previousUser = queryClient.getQueryData(['users', id]);
    
    // Оптимистично обновить
    queryClient.setQueryData(['users', id], (old: User) => ({
      ...old,
      ...data
    }));
    
    return { previousUser };
  },
  
  onError: (err, { id }, context) => {
    queryClient.setQueryData(['users', id], context.previousUser);
  },
  
  onSuccess: (data, { id }) => {
    queryClient.setQueryData(['users', id], data);
  },
});
```

**Паттерн 3: Удаление элемента:**
```typescript
const mutation = useMutation({
  mutationFn: (id: string) => api.delete(`users/${id}`),
  
  onMutate: async (id) => {
    await queryClient.cancelQueries({ queryKey: ['users'] });
    
    const previousUsers = queryClient.getQueryData(['users']);
    
    // Оптимистично удалить
    queryClient.setQueryData(['users'], (old: User[]) =>
      old.filter(user => user.id !== id)
    );
    
    return { previousUsers };
  },
  
  onError: (err, id, context) => {
    queryClient.setQueryData(['users'], context.previousUsers);
  },
});
```

### Dependent Queries (Зависимые запросы)

```typescript
function UserPosts({ userId }: { userId: string }) {
  // Первый запрос
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => api.get(`users/${userId}`).json<User>(),
  });
  
  // Второй запрос зависит от первого
  const { data: posts } = useQuery({
    queryKey: ['posts', user?.id],
    queryFn: () => api.get(`posts?userId=${user.id}`).json<Post[]>(),
    enabled: !!user?.id, // Запрос выполнится только когда user загружен
  });
  
  return <div>{/* render posts */}</div>;
}
```

### Parallel Queries

```typescript
function Dashboard() {
  // Запросы выполняются параллельно
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });
  
  const postsQuery = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  });
  
  const statsQuery = useQuery({
    queryKey: ['stats'],
    queryFn: getStats,
  });
  
  if (usersQuery.isLoading || postsQuery.isLoading || statsQuery.isLoading) {
    return <div>Loading...</div>;
  }
  
  return <div>{/* render data */}</div>;
}

// Или с useQueries для динамического количества
function MultiUserProfiles({ userIds }: { userIds: string[] }) {
  const queries = useQueries({
    queries: userIds.map(id => ({
      queryKey: ['user', id],
      queryFn: () => getUser(id),
    })),
  });
  
  const isLoading = queries.some(q => q.isLoading);
  const users = queries.map(q => q.data);
  
  return <div>{/* render users */}</div>;
}
```

### Infinite Queries (Бесконечная прокрутка)

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';

function PostsList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 1 }) =>
      api.get('posts', {
        searchParams: { page: pageParam, limit: 10 }
      }).json<{ posts: Post[]; nextPage: number | null }>(),
    
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });
  
  return (
    <>
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page.posts.map(post => (
            <div key={post.id}>{post.title}</div>
          ))}
        </div>
      ))}
      
      <button 
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage ? 'Loading...' : 'Load More'}
      </button>
    </>
  );
}
```

### Prefetching (Предзагрузка)

```typescript
import { useQueryClient } from '@tanstack/react-query';

function UsersList() {
  const queryClient = useQueryClient();
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });
  
  const prefetchUser = (userId: string) => {
    queryClient.prefetchQuery({
      queryKey: ['user', userId],
      queryFn: () => getUser(userId),
      staleTime: 60000, // Данные будут свежими 1 минуту
    });
  };
  
  return (
    <ul>
      {users?.map(user => (
        <li 
          key={user.id}
          onMouseEnter={() => prefetchUser(user.id)}
        >
          <Link to={`/users/${user.id}`}>{user.name}</Link>
        </li>
      ))}
    </ul>
  );
}
```

### Polling (Периодическое обновление)

```typescript
function LiveStats() {
  const { data } = useQuery({
    queryKey: ['stats'],
    queryFn: getStats,
    refetchInterval: 5000, // Рефетч каждые 5 секунд
    refetchIntervalInBackground: true, // Продолжать даже если вкладка неактивна
  });
  
  return <div>Active users: {data?.activeUsers}</div>;
}
```

### Важные паттерны на собеседовании

**1. Структура query keys:**
```typescript
// ✅ Хорошая структура
const queryKeys = {
  all: ['users'] as const,
  lists: () => [...queryKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...queryKeys.lists(), filters] as const,
  details: () => [...queryKeys.all, 'detail'] as const,
  detail: (id: string) => [...queryKeys.details(), id] as const,
};

// Использование
useQuery({ queryKey: queryKeys.detail(userId), queryFn: () => getUser(userId) });
queryClient.invalidateQueries({ queryKey: queryKeys.all });
```

**2. Обработка ошибок:**
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Не ретраить 404
        if (error instanceof HTTPError && error.response.status === 404) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});
```

**3. TypeScript типизация:**
```typescript
// Типизированный хук
function useUser(userId: string) {
  return useQuery<User, HTTPError>({
    queryKey: ['user', userId],
    queryFn: () => api.get(`users/${userId}`).json<User>(),
  });
}
```

## 6. UI-библиотеки (UI Kits)

### Обзор популярных UI-библиотек

**Критерии выбора UI-библиотеки:**
- Полнота компонентов
- Кастомизация (темы, стили)
- TypeScript support
- Accessibility (a11y)
- Bundle size
- Документация и community
- Совместимость с React Server Components

### Material-UI (MUI)

**Что это:**
- Самая популярная React UI библиотека
- Реализация Material Design от Google
- Огромное количество компонентов

**Установка:**
```bash
npm install @mui/material @emotion/react @emotion/styled
```

**Базовое использование:**
```typescript
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

function LoginForm() {
  return (
    <Stack spacing={2}>
      <TextField label="Email" variant="outlined" fullWidth />
      <TextField label="Password" type="password" variant="outlined" fullWidth />
      <Button variant="contained" color="primary">
        Login
      </Button>
    </Stack>
  );
}
```

**Кастомизация темы:**
```typescript
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <YourApp />
    </ThemeProvider>
  );
}
```

**Styled Components в MUI:**
```typescript
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const CustomButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  textTransform: 'none',
  padding: theme.spacing(1, 3),
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));
```

**Плюсы MUI:**
- Огромная экосистема компонентов
- Отличная документация
- Хорошая accessibility
- Enterprise-ready

**Минусы MUI:**
- Большой bundle size (~300KB минимум)
- Специфичный дизайн (Material Design)
- Может быть сложно переопределить стили

**Когда использовать:**
- Нужен быстрый старт с готовым дизайном
- Enterprise приложения
- Не критичен размер бандла

### shadcn/ui

**Что это:**
- НЕ библиотека, а коллекция копируемых компонентов
- Построена на Radix UI (primitives) + Tailwind CSS
- Вы владеете кодом компонентов

**Установка:**
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
```

**Использование:**
```typescript
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function LoginForm() {
  return (
    <div className="space-y-4">
      <Input type="email" placeholder="Email" />
      <Input type="password" placeholder="Password" />
      <Button>Login</Button>
    </div>
  );
}
```

**Кастомизация:**
```typescript
// Файл уже в вашем проекте: components/ui/button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input bg-background hover:bg-accent",
        // Добавьте свой вариант
        custom: "bg-gradient-to-r from-purple-500 to-pink-500",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Просто редактируйте этот файл!
```

**Сложные компоненты:**
```typescript
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

function MyDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        {/* Your content */}
      </DialogContent>
    </Dialog>
  );
}
```

**Плюсы shadcn/ui:**
- Полный контроль над кодом
- Маленький bundle (только то, что используете)
- Современный дизайн
- Отличная accessibility (Radix UI)
- TypeScript из коробки

**Минусы shadcn/ui:**
- Нужно знать Tailwind CSS
- Меньше готовых компонентов чем в MUI
- Вы сами поддерживаете код

**Когда использовать:**
- Важен размер бандла
- Хотите полный контроль
- Любите Tailwind CSS
- Современные проекты

### Ant Design (antd)

**Что это:**
- Enterprise UI библиотека от Alibaba
- Китайский дизайн-язык
- Много готовых компонентов для админок

**Установка:**
```bash
npm install antd
```

**Использование:**
```typescript
import { Button, Input, Form, Space } from 'antd';

function LoginForm() {
  const [form] = Form.useForm();
  
  const onFinish = (values: any) => {
    console.log(values);
  };
  
  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please input your email!' },
          { type: 'email', message: 'Invalid email!' }
        ]}
      >
        <Input />
      </Form.Item>
      
      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input