# 🔥 Уровень 1: Базовая оптимизация (80–90% выигрыша)
## 1. Server Components (90% компонентов)

Что: Компоненты, которые рендерятся на сервере и отправляют уже готовый HTML.
Почему: Уменьшают размер JS на клиенте, экономят трафик, ускоряют TTI (Time To Interactive).
Как: Не добавляешь 'use client', оставляешь компонент серверным.

Эффект:

JS-бандл: 200–400 КБ → 30–80 КБ

TTI: 4–6 сек → 1–2 сек

Улучшаются показатели Lighthouse (Performance)

Пример:

// app/dashboard/page.tsx — Server Component
export default async function Dashboard() {
  const data = await getAnalytics(); // fetch прямо здесь!
  return <Stats data={data} />;
}


Особенности 2025:

Можно делать почти все компоненты серверными, только интерактивные элементы (кнопки, формы) делать клиентскими.

Server Components работают с асинхронными функциями async/await прямо в компоненте — без лишних API routes.

## 2. Client Components — только для интерактива

Что: Компоненты с 'use client', которые требуют состояния, событий или DOM-манипуляций.
Почему: Client Components добавляют JS на клиент, поэтому их нужно минимизировать.

Рекомендация 2025:

Использовать только для кнопок, форм, редакторов, графиков.

Вся остальная часть приложения остаётся серверной → меньше JS, быстрее рендер.

## 3. Получение данных в Server Components

Что: Запросы через await fetch() делаем прямо в компоненте.
Почему:

Меньше лишних API routes

Данные приходят сразу с сервера → клиенту приходит готовый HTML

Экономия сетевых вызовов и ускорение TTI

Пример:

export default async function Page() {
  const posts = await fetch('https://api.example.com/posts', { cache: 'force-cache' }).then(r => r.json());
  return <PostList posts={posts} />;
}

## 4. Dynamic import тяжелых библиотек

Что: Динамическая подгрузка через next/dynamic.
Почему: Убирает огромные библиотеки из основного бандла, подгружает их только когда реально нужны.

Пример:

const Chart = dynamic(() => import('./Chart'), { ssr: false });


Эффект:

Убирает 500 КБ–2 МБ из первого бандла

Загружается только при открытии страницы/компонента

## 5. Ленивая загрузка через React.lazy + Suspense

Что: Компоненты подгружаются по мере необходимости.
Почему: Уменьшает время первой загрузки страницы.

Пример:

const Heavy = React.lazy(() => import('./Heavy'));
<Suspense fallback={<Skeleton/>}><Heavy/></Suspense>

# 🔥 Уровень 2: Оптимизация рендеров
## 1. React.memo

Что: Мемоизация компонента — рендерится только при изменении пропсов.
Когда: Тяжелые компоненты с редкими изменениями.
Пример:

const ProductCard = React.memo(function ProductCard({ product }) { ... });

## 2. useMemo

Что: Кэширует результат вычислений, чтобы не делать тяжелые операции на каждом рендере.
Когда: Фильтры, сортировки больших массивов (>10k элементов).
Пример:

const filtered = useMemo(() => heavyFilter(items, filters), [items, filters]);

## 3. useCallback

Что: Мемоизация функций, чтобы их не пересоздавать при каждом рендере.
Когда: Колбэки передаются в memo-компоненты.
Пример:

const handleDelete = useCallback((id) => deleteItem(id), []);

## 4. useTransition + useDeferredValue

Что: Делает UI отзывчивым при тяжелой обработке данных.
Когда: Поиск, фильтры, таблицы, динамические списки.
Пример:

const deferredSearch = useDeferredValue(searchTerm);
const isPending = useTransition();

## 5. useOptimistic

Что: Мгновенный отклик UI при изменении состояния, до подтверждения от сервера.
Когда: Лайки, корзина, удаление элементов.

Особенность React 2025:

React 19 оптимизирует повторные рендеры сам → useMemo и useCallback нужны реже.

# 🔥 Уровень 3: Оптимизация бандла и загрузки
## 1. Code splitting по роутам

App Router делает автоматически — каждый роут отдельный чанк.

Эффект: подгружается только нужный JS → меньше задержка TTI.

## 2. Font optimization

next/font для Google или локальных шрифтов.

Убирает FOIT/FOUT, ускоряет LCP.

## 3. Image optimization

Компонент <Image /> автоматически оптимизирует изображения, lazy loading, WebP/AVIF.

Эффект: меньше веса страниц, быстрее LCP.

## 4. Анализ бандла
next build && npx next-bundle-analyzer


Видно, какие библиотеки «тяжелые», где можно оптимизировать.

## 5. Удаление мёртвого кода
swcMinify: true


Tree-shaking убирает неиспользуемый JS → −10–30 % бандла.

## 6. Предзагрузка важных ресурсов
<link rel="preload" as="image" href="hero.jpg">


Значительно ускоряет LCP.

# 🔥 Уровень 4: Профи-техники (2025)
## 1. Partial Prerendering (PPR)

Next.js 15 (экспериментально)

Страница отдаётся статично, динамические куски стримятся

Эффект: пользователь видит контент за 300–500 мс

export const experimental_ppr = true;

## 2. Streaming + Suspense

Контент начинает отображаться сразу, тяжелые данные догружаются позже.

<Suspense fallback={<Skeleton/>}>
  <HeavyData/>
</Suspense>

## 3. Edge Runtime
export const runtime = 'edge';


Ответ за 20–50 мс вместо 150–300 мс

Особенно важно для глобальных приложений и CDN

## 4. Server Actions вместо API routes
async function addToCart() { 'use server'; ... }


Нет дублирования логики

Меньше кода, меньше сетевых вызовов

## 5. React Compiler (экспериментально)
// @react-compiler


Автоматическая memo-изация всех компонентов

Меньше повторных рендеров → экономия CPU

# 🔥 Идеальный чек-лист Next.js 2025

+ App Router + Server Components по умолчанию

+ Все страницы — async function Page()

+ Тяжёлые компоненты — dynamic({ ssr: false })

+ Изображения — <Image />

+ Шрифты — next/font

+ Формы — Server Actions + useActionState

+ Лайки/корзина — useOptimistic

+ Поиск/фильтры — useDeferredValue + useTransition

+ Кэширование fetch — cache: 'force-cache' или revalidate: 3600

+ Lighthouse ≥ 95 по Performance, Accessibility, Best Practices, SEO