# Методичка подготовки к собеседованию Frontend-разработчик

## Оглавление
1. [Next.js и React](#1-nextjs-и-react)
2. [UI и анимации](#2-ui-и-анимации)
3. [Управление состоянием и формы](#3-управление-состоянием-и-формы)
4. [Интернационализация](#4-интернационализация)
5. [Работа с API и утилитами](#5-работа-с-api-и-утилитами)
6. [Валидация и безопасность](#6-валидация-и-безопасность)
7. [Developer Experience и сборка](#7-developer-experience-и-сборка)
8. [Тестирование](#8-тестирование)
9. [Интеграции и инструменты](#9-интеграции-и-инструменты)
10. [Мониторинг и production](#10-мониторинг-и-production)

---

## 1. Next.js и React

### Что такое Next.js?

**Next.js** — это React-фреймворк для production-ready приложений с встроенной поддержкой:
- Server-Side Rendering (SSR)
- Static Site Generation (SSG)
- API routes
- File-based routing
- Автоматическая оптимизация

### App Router vs Pages Router

**Pages Router (старый подход):**
```typescript
// pages/blog/[slug].tsx
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params
  const post = await fetchPost(slug)
  return { props: { post } }
}

export default function BlogPost({ post }) {
  return <article>{post.content}</article>
}
```

**App Router (новый подход с Next.js 13+):**
```typescript
// app/blog/[slug]/page.tsx
async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug) // Fetch прямо в компоненте!
  return <article>{post.content}</article>
}

export default BlogPost
```

**Что изменилось:**
- Больше не нужны `getServerSideProps`, `getStaticProps`
- Компоненты по умолчанию серверные (React Server Components)
- Более интуитивная структура папок

---

### Server Side Rendering (SSR)

**Что это:** HTML генерируется на сервере при каждом запросе.

**Когда использовать:**
- Динамические данные (профиль пользователя, корзина)
- SEO критично
- Данные меняются часто

```typescript
// app/profile/page.tsx
async function ProfilePage() {
  // Этот код выполняется на сервере при каждом запросе
  const user = await fetch('https://api.example.com/user', {
    cache: 'no-store' // Отключаем кэш = SSR
  }).then(res => res.json())
  
  return <div>Привет, {user.name}!</div>
}
```

**Плюсы:** Свежие данные, SEO
**Минусы:** Медленнее, нагрузка на сервер

---

### Static Site Generation (SSG)

**Что это:** HTML генерируется во время build'а.

**Когда использовать:**
- Статичный контент (блог, документация)
- Данные меняются редко
- Максимальная производительность

```typescript
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await fetchAllPosts()
  return posts.map(post => ({ slug: post.slug }))
}

async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug)
  // Этот fetch закэшируется по умолчанию = SSG
  return <article>{post.content}</article>
}
```

**Плюсы:** Очень быстро, дешево (CDN)
**Минусы:** Нужно пересобирать при изменениях

---

### Incremental Static Regeneration (ISR)

**Что это:** Обновление статичных страниц в фоне без полного rebuild.

```typescript
async function ProductPage({ params }) {
  const product = await fetch(`https://api.example.com/products/${params.id}`, {
    next: { revalidate: 3600 } // Обновлять каждый час
  }).then(res => res.json())
  
  return <div>{product.name}</div>
}
```

**Как работает:**
1. Первый запрос — отдаётся закэшированная версия
2. Через час кэш помечается "stale"
3. Следующий запрос триггерит регенерацию в фоне
4. Пользователь получает старую версию, следующий — новую

---

### React Server Components (RSC)

**Что это:** Компоненты, которые рендерятся ТОЛЬКО на сервере.

```typescript
// app/dashboard/page.tsx - Server Component (по умолчанию)
async function Dashboard() {
  // ✅ Можно делать fetch, читать файлы, обращаться к БД
  const data = await db.query('SELECT * FROM users')
  
  return (
    <div>
      <ServerComponent data={data} />
      <ClientComponent /> {/* Можно миксовать */}
    </div>
  )
}

// app/components/ClientComponent.tsx - Client Component
'use client' // Директива для клиентского компонента

import { useState } from 'react'

export function ClientComponent() {
  // ✅ Можно использовать хуки, события, браузерные API
  const [count, setCount] = useState(0)
  
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

**Ключевые отличия:**

| Server Component | Client Component |
|-----------------|------------------|
| Доступ к серверным ресурсам | useState, useEffect, события |
| НЕ отправляется в браузер | Отправляется в bundle |
| Нет интерактивности | Полная интерактивность |
| Лучше для SEO | Нужен для UX |

---

### Streaming и Suspense

**Что это:** Постепенная отправка HTML пользователю.

```typescript
// app/dashboard/page.tsx
import { Suspense } from 'react'

async function SlowComponent() {
  await delay(3000) // Долгий запрос
  return <div>Медленные данные</div>
}

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <FastComponent /> {/* Отрендерится сразу */}
      
      <Suspense fallback={<div>Загрузка...</div>}>
        <SlowComponent /> {/* Загрузится позже */}
      </Suspense>
    </div>
  )
}
```

**Как работает:**
1. Браузер получает `<h1>` и `<FastComponent>` сразу
2. Видит `<Suspense>` с fallback — показывает "Загрузка..."
3. Когда `<SlowComponent>` готов — Next.js "докидывает" HTML через stream
4. React заменяет fallback на реальный контент

---

### Оптимизация изображений

```typescript
import Image from 'next/image'

<Image
  src="/photo.jpg"
  alt="Описание"
  width={800}
  height={600}
  priority // Для LCP (Largest Contentful Paint)
  placeholder="blur" // Blur-эффект при загрузке
  blurDataURL="data:image/jpeg;base64,..." // Превью
  quality={75} // Качество (по умолчанию 75)
  sizes="(max-width: 768px) 100vw, 50vw" // Responsive
/>
```

**Что делает Next.js:**
- Автоматически конвертирует в WebP/AVIF
- Генерирует разные размеры для разных экранов
- Ленивая загрузка (кроме `priority`)
- Оптимизирует на лету

---

### Dynamic Imports (Code Splitting)

```typescript
import dynamic from 'next/dynamic'

// Компонент загрузится только когда понадобится
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <p>Загрузка графика...</p>,
  ssr: false // Не рендерить на сервере
})

export default function Analytics() {
  const [showChart, setShowChart] = useState(false)
  
  return (
    <div>
      <button onClick={() => setShowChart(true)}>Показать график</button>
      {showChart && <HeavyChart />}
    </div>
  )
}
```

---

### Вопросы и ответы

**В1: Чем App Router отличается от Pages Router?**

**Ответ:** App Router (Next.js 13+) использует новую архитектуру с React Server Components. Основные отличия:
- Компоненты по умолчанию серверные, что уменьшает размер bundle
- Не нужны getServerSideProps/getStaticProps — fetch прямо в компонентах
- Поддержка streaming и Suspense из коробки
- Более интуитивная структура: layouts, loading.tsx, error.tsx
- Параллельная загрузка данных вместо waterfall

**В2: Когда использовать SSR, а когда SSG?**

**Ответ:**
- **SSG** — для контента, который редко меняется: блог, маркетинговые страницы, документация. Плюс — скорость и низкая стоимость хостинга.
- **SSR** — для персонализированного контента: профиль пользователя, корзина, админки. Плюс — всегда актуальные данные.
- **ISR** — золотая середина: каталог товаров, новости. Большая часть запросов обслуживается быстро, но контент обновляется в фоне.

**В3: Что такое React Server Components и зачем они нужны?**

**Ответ:** RSC — компоненты, которые выполняются только на сервере и НЕ попадают в JavaScript bundle браузера. Преимущества:
- Доступ к серверным ресурсам (база данных, файловая система) без API endpoints
- Уменьшение bundle size — весь код компонента остаётся на сервере
- Лучшая производительность — нет гидрации для серверных компонентов
- Безопасность — секреты и бизнес-логика не утекают в браузер

Клиентские компоненты ('use client') нужны для интерактивности: кнопки, формы, анимации.

**В4: Как работает Suspense в Next.js?**

**Ответ:** Suspense позволяет показывать fallback (например, скелетон) пока загружается асинхронный компонент. В Next.js с App Router:
- Suspense работает с async Server Components
- Включает streaming — HTML отправляется частями
- Пользователь видит контент быстрее (не ждёт всю страницу)
- Можно оборачивать разные части страницы для независимой загрузки

```typescript
<Suspense fallback={<Skeleton />}>
  <AsyncDataComponent />
</Suspense>
```

**В5: Как оптимизировать производительность Next.js приложения?**

**Ответ:**
1. **Image optimization** — использовать компонент `next/image`
2. **Code splitting** — dynamic imports для тяжёлых компонентов
3. **ISR** вместо SSR где возможно
4. **React Server Components** — переносим логику на сервер
5. **Кэширование** — правильно используем `fetch` с опциями кэша
6. **Bundle analyzer** — находим тяжёлые зависимости
7. **Prefetching** — Next.js автоматически prefetch'ит Link'и в viewport
8. **Fonts optimization** — используем `next/font` для оптимизации шрифтов

**В6: Что такое гидрация и какие у неё проблемы?**

**Ответ:** Гидрация (hydration) — процесс, когда React "оживляет" HTML, полученный с сервера, добавляя обработчики событий и состояние.

Проблемы:
- **Hydration mismatch** — если HTML сервера отличается от того, что React ожидает на клиенте (например, Date.now(), Math.random() в рендере)
- **Performance** — JavaScript должен скачаться и выполниться до интерактивности
- **Blocking** — пока идёт гидрация, UI может "тормозить"

Решения:
- Использовать React Server Components (они не гидрируются)
- Selective hydration через Suspense
- Избегать рандома/времени в рендере или использовать 'use client'

---

## 2. UI и анимации

### UI-киты и кастомизация

**Что такое UI-кит:** Набор готовых компонентов (кнопки, инпуты, модалки) с консистентным дизайном.

Пример структуры UI-кита:
```typescript
// @maxhub/max-ui
import { Button, Input, Modal } from '@maxhub/max-ui'

// Базовое использование
<Button variant="primary" size="lg">
  Отправить
</Button>

<Input 
  placeholder="Email"
  error="Неверный формат"
/>
```

**Кастомизация через props:**
```typescript
<Button
  variant="primary" // primary, secondary, ghost
  size="md" // sm, md, lg
  disabled={isLoading}
  leftIcon={<Icon />}
  onClick={handleClick}
>
  Текст
</Button>
```

**Кастомизация через CSS-переменные:**
```css
/* Переопределение темы */
:root {
  --button-primary-bg: #6366f1;
  --button-primary-hover: #4f46e5;
  --button-radius: 8px;
}
```

**Кастомизация через className:**
```typescript
import { Button } from '@maxhub/max-ui'
import clsx from 'clsx'

<Button 
  className={clsx(
    'custom-button',
    isActive && 'custom-button--active'
  )}
>
  Кнопка
</Button>
```

---

### Framer Motion (анимации)

**Что это:** Библиотека для декларативных анимаций в React.

**Базовая анимация:**
```typescript
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }} // Начальное состояние
  animate={{ opacity: 1, y: 0 }}  // Конечное состояние
  exit={{ opacity: 0, y: -20 }}   // При unmount
  transition={{ duration: 0.3 }}  // Длительность
>
  Контент
</motion.div>
```

**Анимация при наведении:**
```typescript
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: 'spring', stiffness: 400 }}
>
  Наведи на меня
</motion.button>
```

**Анимация списков:**
```typescript
import { motion, AnimatePresence } from 'framer-motion'

<AnimatePresence>
  {items.map(item => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      layout // Автоматическая анимация изменения позиции
    >
      {item.name}
    </motion.div>
  ))}
</AnimatePresence>
```

**Сложная анимация с вариантами:**
```typescript
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
  hover: {
    scale: 1.03,
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
  }
}

<motion.div
  variants={cardVariants}
  initial="hidden"
  animate="visible"
  whileHover="hover"
>
  Карточка
</motion.div>
```

**Анимация на скролл:**
```typescript
import { useScroll, useTransform } from 'framer-motion'

function ParallaxComponent() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 1000], [0, -300])
  
  return (
    <motion.div style={{ y }}>
      Параллакс эффект
    </motion.div>
  )
}
```

---

### Bottom Sheets (react-modal-sheet)

**Что это:** Модальные окна, которые выезжают снизу (популярно на мобильных).

```typescript
import { Sheet } from 'react-modal-sheet'
import { useState } from 'react'

function BottomSheetExample() {
  const [isOpen, setOpen] = useState(false)
  
  return (
    <>
      <button onClick={() => setOpen(true)}>
        Открыть шторку
      </button>
      
      <Sheet 
        isOpen={isOpen} 
        onClose={() => setOpen(false)}
        snapPoints={[600, 400, 100, 0]} // Точки остановки
        initialSnap={1} // Начальная точка
      >
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            <div style={{ padding: 20 }}>
              Содержимое шторки
            </div>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop onTap={() => setOpen(false)} />
      </Sheet>
    </>
  )
}
```

**Snap points** — точки, в которых шторка "залипает":
- 600px — полностью открыта
- 400px — средняя позиция
- 100px — минимизирована
- 0 — закрыта

---

### Кастомные контролы (input-otp)

**Что это:** Инпут для ввода одноразовых кодов (как SMS-код).

```typescript
import { OTPInput } from 'input-otp'

<OTPInput
  maxLength={6}
  containerClassName="otp-container"
  render={({ slots }) => (
    <>
      {slots.slice(0, 3).map((slot, idx) => (
        <div key={idx} className="otp-slot">
          {slot}
        </div>
      ))}
      
      <div className="otp-separator">-</div>
      
      {slots.slice(3, 6).map((slot, idx) => (
        <div key={idx} className="otp-slot">
          {slot}
        </div>
      ))}
    </>
  )}
/>
```

Результат: `[1][2][3] - [4][5][6]`

---

### clsx (утилита для классов)

**Что это:** Библиотека для условного объединения CSS-классов.

```typescript
import clsx from 'clsx'

// Базовое использование
const buttonClass = clsx('btn', 'btn-primary')
// Результат: 'btn btn-primary'

// Условные классы
const buttonClass = clsx(
  'btn',
  isPrimary && 'btn-primary',
  isLoading && 'btn-loading',
  { 'btn-disabled': disabled }
)

// С объектами
const buttonClass = clsx({
  'btn': true,
  'btn-primary': isPrimary,
  'btn-secondary': !isPrimary,
  'btn-loading': isLoading
})

// Практический пример
function Button({ variant, size, disabled, className, children }) {
  return (
    <button
      className={clsx(
        'btn',
        `btn-${variant}`, // btn-primary, btn-secondary
        `btn-${size}`,    // btn-sm, btn-md, btn-lg
        disabled && 'btn-disabled',
        className // Дополнительные классы от пропса
      )}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
```

---

### Вопросы и ответы

**В1: Как кастомизировать UI-кит, не нарушая его целостность?**

**Ответ:** Есть несколько уровней кастомизации:
1. **Props** — используем встроенные варианты (variant, size)
2. **CSS Variables** — переопределяем цвета/размеры темы
3. **className** — добавляем свои стили через CSS Modules или Tailwind
4. **Wrapper компоненты** — оборачиваем компоненты UI-кита:
```typescript
// Наш кастомный Button на основе UI-кита
export function CustomButton(props) {
  return (
    <UIKitButton 
      {...props}
      className={clsx('our-styles', props.className)}
    />
  )
}
```

Главное — не модифицировать сам UI-кит напрямую, чтобы можно было обновляться.

**В2: Как оптимизировать производительность анимаций?**

**Ответ:**
1. **Анимировать только transform и opacity** — они не вызывают reflow:
```typescript
// ❌ Медленно (reflow)
animate={{ width: 300, height: 200 }}

// ✅ Быстро (только композитинг)
animate={{ scale: 1.5, opacity: 1 }}
```

2. **Использовать CSS transitions для простых анимаций** вместо JavaScript

3. **will-change** для сложных анимаций:
```css
.animated-element {
  will-change: transform, opacity;
}
```

4. **useReducedMotion** для пользователей с отключёнными анимациями:
```typescript
const shouldReduceMotion = useReducedMotion()

<motion.div
  animate={{ 
    x: shouldReduceMotion ? 0 : 100,
    transition: { duration: shouldReduceMotion ? 0 : 0.5 }
  }}
/>
```

5. **layout animations** в Framer Motion — используем свойство `layout` вместо анимации width/height

**В3: Что такое AnimatePresence и зачем он нужен?**

**Ответ:** AnimatePresence позволяет анимировать компоненты при unmount (удалении из DOM). Без него React сразу удаляет компонент и анимация exit не проигрывается.

```typescript
<AnimatePresence>
  {isVisible && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }} // Эта анимация сработает только с AnimatePresence
    >
      Контент
    </motion.div>
  )}
</AnimatePresence>
```

Также AnimatePresence умеет анимировать списки с уникальными key.

**В4: Как обеспечить accessibility модальных окон?**

**Ответ:** Важные моменты:
1. **Focus trap** — фокус должен оставаться внутри модалки:
```typescript
import { FocusTrap } from 'focus-trap-react'

<FocusTrap active={isOpen}>
  <Modal>...</Modal>
</FocusTrap>
```

2. **ARIA атрибуты**:
```typescript
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Заголовок</h2>
  <p id="modal-description">Описание</p>
</div>
```

3. **Закрытие по Escape**:
```typescript
useEffect(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape') onClose()
  }
  
  if (isOpen) {
    document.addEventListener('keydown', handleEscape)
  }
  
  return () => document.removeEventListener('keydown', handleEscape)
}, [isOpen])
```

4. **Возврат фокуса** — после закрытия фокус должен вернуться на элемент, который открыл модалку

5. **Блокировка скролла body**:
```typescript
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  }
  return () => {
    document.body.style.overflow = ''
  }
}, [isOpen])
```

**В5: Зачем нужен clsx вместо обычной конкатенации строк?**

**Ответ:**
1. **Читаемость** — условные классы выглядят чище
2. **Производительность** — clsx оптимизирован для работы со строками
3. **Удобство** — автоматически фильтрует false/null/undefined:

```typescript
// ❌ Сложно читать, нужны дополнительные проверки
const className = 'btn' + 
  (isPrimary ? ' btn-primary' : '') + 
  (disabled ? ' disabled' : '')

// ✅ Чисто и понятно
const className = clsx(
  'btn',
  isPrimary && 'btn-primary',
  disabled && 'disabled'
)
```

4. **Работа с массивами и объектами** — гибкость в передаче классов

---

## 3. Управление состоянием и формы

### Jotai (атомарный state)

**Что это:** Библиотека для управления состоянием с минималистичным API. Альтернатива Redux/Zustand.

**Философия:** State разбит на атомы (atoms) — маленькие независимые единицы состояния.

**Базовое использование:**
```typescript
import { atom, useAtom } from 'jotai'

// Создаём атом
const countAtom = atom(0)

function Counter() {
  const [count, setCount] = useAtom(countAtom)
  
  return (
    <>
      <div>Count: {count}</div>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
    </>
  )
}
```

**Производные атомы (derived):**
```typescript
const countAtom = atom(0)
const doubledAtom = atom(get => get(countAtom) * 2)

function Display() {
  const [doubled] = useAtom(doubledAtom)
  return <div>Doubled: {doubled}</div>
}
```

**Асинхронные атомы:**
```typescript
const userIdAtom = atom(1)
const userAtom = atom(async (get) => {
  const userId = get(userIdAtom)
  const response = await fetch(`/api/users/${userId}`)
  return response.json()
})

function UserProfile() {
  const [user] = useAtom(userAtom) // Suspense автоматом!
  return <div>{user.name}</div>
}
```

**Write-only атомы (actions):**
```typescript
const countAtom = atom(0)
const incrementAtom = atom(
  null, // read
  (get, set) => set(countAtom, get(countAtom) + 1) // write
)

function IncrementButton() {
  const [, increment] = useAtom(incrementAtom)
  return <button onClick={increment}>+1</button>
}
```

**Атомы с persist (localStorage):**
```typescript
import { atomWithStorage } from 'jotai/utils'

const darkModeAtom = atomWithStorage('darkMode', false)

function ThemeToggle() {
  const [isDark, setIsDark] = useAtom(darkModeAtom)
  // Автоматически синхронизируется с localStorage
  return <button onClick={() => setIsDark(!isDark)}>Toggle</button>
}
```

---

### React Query (@tanstack/react-query)

**Что это:** Библиотека для управления **серверным состоянием** (загрузка, кэширование, обновление).

**Основные концепции:**
- **Query** — чтение данных (GET)
- **Mutation** — изменение данных (POST/PUT/DELETE)
- **Кэширование** — автоматическое кэширование ответов
- **Инвалидация** — обновление устаревших данных

**Базовый query:**
```typescript
import { useQuery } from '@tanstack/react-query'

function TodoList() {
  const { 
    data,        // Данные
    isLoading,   // Первая загрузка
    isError,     // Ошибка
    error,       // Объект ошибки
    refetch      // Функция для ручного refetch
  } = useQuery({
    queryKey: ['todos'],        // Уникальный ключ для кэша
    queryFn: fetchTodos,        // Функция загрузки
    staleTime: 5 * 60 * 1000,  // Кэш свежий 5 минут
    gcTime: 10 * 60 * 1000,    // Удалить из памяти через 10 минут
  })
  
  if (isLoading) return <div>Загрузка...</div>
  if (isError) return <div>Ошибка: {error.message}</div>
  
  return (
    <ul>
      {data.map(todo => <li key={todo.id}>{todo.title}</li>)}
    </ul>
  )
}
```

**Query с параметрами:**
```typescript
function TodoDetails({ todoId }) {
  const { data: todo } = useQuery({
    queryKey: ['todo', todoId], // Ключ зависит от todoId
    queryFn: () => fetchTodo(todoId),
    enabled: !!todoId,  // Запрос только если todoId есть
  })
  
  return <div>{todo?.title}</div>
}
```

**Mutations (изменение данных):**
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'

function AddTodo() {
  const queryClient = useQueryClient()
  
  const mutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      // Инвалидируем кэш todos после успешного добавления
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    }
  })
  
  const handleSubmit = (e) => {
    e.preventDefault()
    const title = e.target.title.value
    mutation.mutate({ title })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="title" />
      <button disabled={mutation.isPending}>
        {mutation.isPending ? 'Добавление...' : 'Добавить'}
      </button>
    </form>
  )
}
```

**Optimistic Updates (оптимистичные обновления):**
```typescript
const mutation = useMutation({
  mutationFn: updateTodo,
  
  // Перед запросом обновляем UI оптимистично
  onMutate: async (newTodo) => {
    // Отменяем текущие запросы
    await queryClient.cancelQueries({ queryKey: ['todos'] })
    
    // Сохраняем предыдущее состояние для rollback
    const previousTodos = queryClient.getQueryData(['todos'])
    
    // Обновляем кэш оптимистично
    queryClient.setQueryData(['todos'], (old) => {
      return old.map(todo => 
        todo.id === newTodo.id ? newTodo : todo
      )
    })
    
    return { previousTodos } // Контекст для onError
  },
  
  // Если ошибка — откатываем
  onError: (err, newTodo, context) => {
    queryClient.setQueryData(['todos'], context.previousTodos)
  },
  
  // В любом случае обновляем данные с сервера
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  }
})
```

**Pagination:**
```typescript
function PaginatedTodos() {
  const [page, setPage] = useState(1)
  
  const { data, isPreviousData } = useQuery({
    queryKey: ['todos', page],
    queryFn: () => fetchTodos(page),
    keepPreviousData: true, // Показываем старые данные пока грузятся новые
  })
  
  return (
    <>
      <TodoList todos={data.todos} />
      
      <button 
        onClick={() => setPage(old => old - 1)}
        disabled={page === 1}
      >
        Назад
      </button>
      
      <button
        onClick={() => setPage(old => old + 1)}
        disabled={isPreviousData || !data.hasMore}
      >
        Вперёд
      </button>
    </>
  )
}
```

**Infinite Scroll:**
```typescript
function InfiniteTodos() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['todos'],
    queryFn: ({ pageParam = 1 }) => fetchTodos(pageParam),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length + 1 : undefined
    },
  })
  
  return (
    <>
      {data.pages.map((page, i) => (
        <div key={i}>
          {page.todos.map(todo => <TodoItem key={todo.id} {...todo} />)}
        </div>
      ))}
      
      {hasNextPage && (
        <button onClick={fetchNextPage} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? 'Загрузка...' : 'Загрузить ещё'}
        </button>
      )}
    </>
  )
}
```

---

### React Hook Form

**Что это:** Библиотека для работы с формами с минимальным количеством ре-рендеров.

**Базовая форма:**
```typescript
import { useForm } from 'react-hook-form'

function LoginForm() {
  const { 
    register,      // Регистрация поля
    handleSubmit,  // Обработчик сабмита
    formState: { errors, isSubmitting } 
  } = useForm()
  
  const onSubmit = async (data) => {
    await login(data)
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('email', { 
          required: 'Email обязателен',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Неверный формат email'
          }
        })}
        placeholder="Email"
      />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input
        {...register('password', { 
          required: 'Пароль обязателен',
          minLength: {
            value: 8,
            message: 'Минимум 8 символов'
          }
        })}
        type="password"
        placeholder="Пароль"
      />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Вход...' : 'Войти'}
      </button>
    </form>
  )
}
```

**Контролируемые поля (controlled inputs):**
```typescript
function ControlledForm() {
  const { control, handleSubmit } = useForm({
    defaultValues: { username: '' }
  })
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="username"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <input {...field} />
        )}
      />
    </form>
  )
}
```

**Интеграция с кастомными компонентами:**
```typescript
import { Controller } from 'react-hook-form'
import Select from 'react-select'

function FormWithSelect() {
  const { control } = useForm()
  
  return (
    <Controller
      name="country"
      control={control}
      rules={{ required: 'Выберите страну' }}
      render={({ field, fieldState: { error } }) => (
        <>
          <Select
            {...field}
            options={countries}
            placeholder="Выберите страну"
          />
          {error && <span>{error.message}</span>}
        </>
      )}
    />
  )
}
```

**Валидация с Zod:**
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Неверный email'),
  password: z.string().min(8, 'Минимум 8 символов'),
  age: z.number().min(18, 'Минимум 18 лет')
})

type FormData = z.infer<typeof schema>

function ValidatedForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input {...register('password')} type="password" />
      {errors.password && <span>{errors.password.message}</span>}
      
      <input {...register('age', { valueAsNumber: true })} type="number" />
      {errors.age && <span>{errors.age.message}</span>}
      
      <button type="submit">Отправить</button>
    </form>
  )
}
```

**Динамические поля:**
```typescript
import { useFieldArray } from 'react-hook-form'

function DynamicForm() {
  const { control, register } = useForm({
    defaultValues: { items: [{ name: '' }] }
  })
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  })
  
  return (
    <form>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input {...register(`items.${index}.name`)} />
          <button type="button" onClick={() => remove(index)}>
            Удалить
          </button>
        </div>
      ))}
      
      <button type="button" onClick={() => append({ name: '' })}>
        Добавить поле
      </button>
    </form>
  )
}
```

---

### Вопросы и ответы

**В1: Чем Jotai отличается от Redux?**

**Ответ:**
- **Простота:** Jotai имеет минималистичный API, не требует boilerplate кода (actions, reducers)
- **Атомарность:** State разбит на независимые атомы, а не один большой store
- **Производительность:** Компоненты ре-рендерятся только при изменении нужных атомов
- **TypeScript:** Отличная поддержка типов из коробки
- **Размер:** ~3KB vs ~20KB у Redux + Redux Toolkit

Redux лучше для:
- Больших приложений с сложной бизнес-логикой
- Когда нужен DevTools с time-travel debugging
- Когда команда уже знакома с Redux

Jotai лучше для:
- Средних и малых приложений
- Быстрого старта без настройки
- Когда нужна простота и минимум кода

**В2: Что такое staleTime и gcTime в React Query?**

**Ответ:**
- **staleTime** (время "свежести") — как долго данные считаются актуальными. Пока данные "fresh", React Query не будет делать refetch при повторном использовании.
  ```typescript
  staleTime: 5 * 60 * 1000 // 5 минут — данные свежие
  ```
  
- **gcTime** (garbage collection time, раньше cacheTime) — как долго хранить неиспользуемые данные в кэше перед удалением из памяти.
  ```typescript
  gcTime: 10 * 60 * 1000 // 10 минут в кэше после unmount
  ```

Пример:
1. Загрузили данные
2. 4 минуты — данные fresh (staleTime), refetch не нужен
3. 6 минут — данные stale, при повторном монтировании сделается refetch
4. 11 минут — данные удалены из памяти (gcTime)

**В3: Что такое optimistic updates и когда их использовать?**

**Ответ:** Optimistic updates — это мгновенное обновление UI до получения ответа от сервера, предполагая, что запрос успешен.

**Когда использовать:**
- Лайки, реакции (низкий риск, высокая скорость отклика)
- TODO списки, чекбоксы
- Любые операции, где важна мгновенная обратная связь

**Когда НЕ использовать:**
- Финансовые операции (оплаты)
- Удаление критичных данных
- Когда высока вероятность ошибки сервера

Пример:
```typescript
// Без optimistic — кнопка disabled, ждём ответ
// С optimistic — лайк появляется сразу, если ошибка — откатываем
```

**В4: Как работает инвалидация кэша в React Query?**

**Ответ:** Инвалидация помечает данные как "stale" и триггерит refetch если компоненты активны.

```typescript
// Инвалидация конкретного query
queryClient.invalidateQueries({ queryKey: ['todos'] })

// Инвалидация по префиксу
queryClient.invalidateQueries({ queryKey: ['todos'] }) // Инвалидирует ['todos', 1], ['todos', 2] и т.д.

// Инвалидация с условием
queryClient.invalidateQueries({
  predicate: (query) => query.queryKey[0] === 'todos' && query.queryKey[1] > 5
})
```

Когда вызывать:
- После успешной мутации (создание/обновление/удаление)
- При получении вебсокет-события об изменении данных
- При навигации между страницами (для актуализации)

**В5: Зачем React Hook Form, если есть контролируемые компоненты?**

**Ответ:**
**Контролируемые компоненты (обычный React):**
```typescript
const [email, setEmail] = useState('')
<input value={email} onChange={e => setEmail(e.target.value)} />
// Ре-рендер при каждом символе
```

**React Hook Form:**
```typescript
const { register } = useForm()
<input {...register('email')} />
// Ре-рендер только при сабмите или ошибках
```

**Преимущества RHF:**
- **Производительность** — минимум ре-рендеров (использует refs)
- **Меньше кода** — встроенная валидация, обработка ошибок
- **Лучшая типизация** — автоматический вывод типов формы
- **Интеграция** — легко работает с UI-китами через Controller

Обычные контролируемые компоненты лучше для:
- Простых форм (1-2 поля)
- Когда нужна полная кастомизация
- Когда значение поля влияет на другие элементы в реальном времени

**В6: Как организовать глобальное состояние с Jotai?**

**Ответ:**
```typescript
// atoms/auth.ts
export const userAtom = atom(null)
export const isAuthenticatedAtom = atom(get => get(userAtom) !== null)

// atoms/cart.ts
export const cartItemsAtom = atom([])
export const cartTotalAtom = atom(get => {
  const items = get(cartItemsAtom)
  return items.reduce((sum, item) => sum + item.price, 0)
})

// Использование в компонентах
function Header() {
  const [isAuth] = useAtom(isAuthenticatedAtom)
  return <div>{isAuth ? 'Профиль' : 'Войти'}</div>
}

function Cart() {
  const [items] = useAtom(cartItemsAtom)
  const [total] = useAtom(cartTotalAtom)
  return <div>Итого: {total}₽ ({items.length} товаров)</div>
}
```

Советы по организации:
- Атомы в отдельных файлах по доменам (auth, cart, settings)
- Производные атомы для вычисляемых значений
- Экспортируем только нужные атомы, не всё подряд

---

## 4. Интернационализация

### next-intl

**Что это:** Библиотека для i18n в Next.js с поддержкой App Router.

**Базовая настройка:**

```typescript
// i18n.ts
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default
}))
```

```typescript
// middleware.ts
import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['ru', 'en', 'de'],
  defaultLocale: 'ru'
})

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}
```

**Файлы переводов:**

```json
// messages/ru.json
{
  "HomePage": {
    "title": "Добро пожаловать",
    "description": "Это главная страница"
  },
  "Navigation": {
    "home": "Главная",
    "about": "О нас",
    "contact": "Контакты"
  }
}
```

```json
// messages/en.json
{
  "HomePage": {
    "title": "Welcome",
    "description": "This is the home page"
  },
  "Navigation": {
    "home": "Home",
    "about": "About",
    "contact": "Contact"
  }
}
```

**Использование в компонентах:**

```typescript
import { useTranslations } from 'next-intl'

export default function HomePage() {
  const t = useTranslations('HomePage')
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  )
}
```

**Интерполяция переменных:**

```json
{
  "welcome": "Добро пожаловать, {name}!",
  "itemsInCart": "У вас {count} товаров в корзине"
}
```

```typescript
const t = useTranslations()

t('welcome', { name: 'Иван' }) 
// "Добро пожаловать, Иван!"

t('itemsInCart', { count: 5 }) 
// "У вас 5 товаров в корзине"
```

**Pluralization (множественное число):**

```json
{
  "items": "{count, plural, =0 {нет товаров} one {# товар} few {# товара} many {# товаров} other {# товара}}"
}
```

```typescript
t('items', { count: 0 })  // "нет товаров"
t('items', { count: 1 })  // "1 товар"
t('items', { count: 2 })  // "2 товара"
t('items', { count: 5 })  // "5 товаров"
t('items', { count: 21 }) // "21 товар"
```

**Форматирование дат и чисел:**

```typescript
import { useFormatter } from 'next-intl'

function DateDisplay() {
  const format = useFormatter()
  
  return (
    <div>
      {/* Дата */}
      {format.dateTime(new Date(), {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
      {/* 15 декабря 2024 */}
      
      {/* Число */}
      {format.number(1234567.89, {
        style: 'currency',
        currency: 'RUB'
      })}
      {/* 1 234 567,89 ₽ */}
      
      {/* Относительное время */}
      {format.relativeTime(new Date('2024-12-09'), {
        now: new Date('2024-12-10')
      })}
      {/* "вчера" */}
    </div>
  )
}
```

**Rich text (форматирование внутри переводов):**

```json
{
  "terms": "Я согласен с <link>условиями использования</link>"
}
```

```typescript
t.rich('terms', {
  link: (chunks) => <a href="/terms">{chunks}</a>
})
// Я согласен с <a href="/terms">условиями использования</a>
```

---

### lvovich (склонение русских имён)

**Что это:** Библиотека для склонения русских ФИО, названий городов.

**Склонение имён:**

```typescript
import { inclineFirstname, inclineLastname, inclineMiddlename } from 'lvovich'

const firstName = 'Иван'
const lastName = 'Иванов'

// Именительный (кто?)
inclineFirstname(firstName, 'nominative')   // "Иван"
inclineLastname(lastName, 'nominative')     // "Иванов"

// Родительный (кого?)
inclineFirstname(firstName, 'genitive')     // "Ивана"
inclineLastname(lastName, 'genitive')       // "Иванова"

// Дательный (кому?)
inclineFirstname(firstName, 'dative')       // "Ивану"
inclineLastname(lastName, 'dative')         // "Иванову"

// Винительный (кого?)
inclineFirstname(firstName, 'accusative')   // "Ивана"

// Творительный (кем?)
inclineFirstname(firstName, 'instrumental') // "Иваном"
inclineLastname(lastName, 'instrumental')   // "Ивановым"

// Предложный (о ком?)
inclineFirstname(firstName, 'prepositional') // "Иване"
inclineLastname(lastName, 'prepositional')   // "Иванове"
```

**Практическое применение:**

```typescript
function GreetingMessage({ user, action }) {
  const firstName = inclineFirstname(user.firstName, 'nominative')
  const lastName = inclineLastname(user.lastName, 'genitive')
  
  return (
    <div>
      {action === 'profile_view' && (
        <span>Профиль {firstName} {lastName}</span>
        // "Профиль Ивана Иванова"
      )}
      
      {action === 'send_message' && (
        <span>Отправить сообщение {inclineFirstname(user.firstName, 'dative')}</span>
        // "Отправить сообщение Ивану"
      )}
    </div>
  )
}
```

**Склонение городов:**

```typescript
import { inclineCity } from 'lvovich'

inclineCity('Москва', 'genitive')      // "Москвы"
inclineCity('Москва', 'dative')        // "Москве"
inclineCity('Москва', 'prepositional') // "Москве"

// В Москве, из Москвы, в Москву
const city = 'Москва'
const from = `из ${inclineCity(city, 'genitive')}` // "из Москвы"
const to = `в ${inclineCity(city, 'accusative')}`  // "в Москву"
const where = `в ${inclineCity(city, 'prepositional')}` // "в Москве"
```

**Определение пола по имени:**

```typescript
import { genderize } from 'lvovich'

genderize('Иван')    // { gender: 'male', ... }
genderize('Мария')   // { gender: 'female', ... }
genderize('Саша')    // { gender: 'androgynous', ... }
```

---

### Вопросы и ответы

**В1: Как организовать переводы в большом проекте?**

**Ответ:**
1. **Структура по доменам:**
```
messages/
  ru/
    common.json       // Общие переводы
    auth.json         // Авторизация
    products.json     // Товары
    checkout.json     // Оформление заказа
  en/
    common.json
    auth.json
    ...
```

2. **Namespaces в next-intl:**
```typescript
const t = useTranslations('Products') // Только переводы Products
const tCommon = useTranslations('Common') // Общие переводы
```

3. **Ключи с точками для вложенности:**
```json
{
  "Products.list.title": "Каталог товаров",
  "Products.list.empty": "Товаров нет",
  "Products.detail.addToCart": "В корзину"
}
```

4. **Переиспользование:**
```json
{
  "common": {
    "buttons": {
      "save": "Сохранить",
      "cancel": "Отмена"
    }
  }
}
```

**В2: Как правильно обрабатывать pluralization в разных языках?**

**Ответ:** Разные языки имеют разные правила множественного числа:

**Русский** (4 формы):
- `one` — 1, 21, 31, 41, ... (1 товар)
- `few` — 2-4, 22-24, ... (2 товара)
- `many` — 5-20, 25-30, ... (5 товаров)
- `other` — остальное

**Английский** (2 формы):
- `one` — 1 (1 item)
- `other` — всё остальное (2 items, 5 items)

**Арабский** (6 форм!):
- `zero`, `one`, `two`, `few`, `many`, `other`

**Решение в next-intl:**
```json
// ru.json
{
  "items": "{count, plural, one {# товар} few {# товара} many {# товаров} other {#}}"
}

// en.json
{
  "items": "{count, plural, one {# item} other {# items}}"
}
```

next-intl автоматически применяет правильные правила для каждого языка.

**В3: Как обрабатывать переводы, которых ещё нет?**

**Ответ:**
1. **Fallback на ключ:**
```typescript
// Если перевода нет, вернётся ключ
t('Products.newFeature') // "Products.newFeature"
```

2. **Fallback на другой язык:**
```typescript
export default getRequestConfig(async ({ locale }) => {
  const userMessages = await import(`./messages/${locale}.json`)
  const defaultMessages = await import('./messages/ru.json')
  
  return {
    messages: {
      ...defaultMessages,
      ...userMessages // Переопределяем существующие
    }
  }
})
```

3. **Уведомление разработчиков:**
```typescript
onError: (error) => {
  if (error.code === 'MISSING_MESSAGE') {
    console.warn(`Missing translation: ${error.key}`)
    // Отправляем в Sentry или логирующий сервис
  }
}
```

4. **Заглушка в development:**
```typescript
getMessageFallback: ({ namespace, key }) => {
  return `[${namespace}.${key}]` // [Products.title]
}
```

**В4: Как работать с датами в разных локалях?**

**Ответ:**
```typescript
import { useFormatter, useLocale } from 'next-intl'

function EventDate({ date }) {
  const format = useFormatter()
  const locale = useLocale()
  
  return (
    <div>
      {/* Полная дата */}
      {format.dateTime(date, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}
      {/* ru: "15 декабря 2024 г., 14:30" */}
      {/* en: "December 15, 2024, 2:30 PM" */}
      
      {/* Короткая дата */}
      {format.dateTime(date, {
        dateStyle: 'short'
      })}
      {/* ru: "15.12.2024" */}
      {/* en: "12/15/2024" */}
      
      {/* Относительное время */}
      {format.relativeTime(date)}
      {/* "2 часа назад", "2 hours ago" */}
    </div>
  )
}
```

**Важно:**
- Используйте `useFormatter` вместо ручного форматирования
- Даты автоматически учитывают часовой пояс пользователя
- Для backend API используйте ISO 8601 (UTC), форматируйте на фронте

**В5: Зачем нужна библиотека lvovich?**

**Ответ:** Русский язык имеет падежи, и имена/города склоняются. Без библиотеки легко сделать ошибки:

❌ **Неправильно:**
```
"Профиль Иван Иванов"
"Отправить сообщение Иван"
```

✅ **Правильно с lvovich:**
```typescript
`Профиль ${inclineFirstname('Иван', 'genitive')} ${inclineLastname('Иванов', 'genitive')}`
// "Профиль Ивана Иванова"

`Отправить сообщение ${inclineFirstname('Иван', 'dative')}`
// "Отправить сообщение Ивану"
```

Библиотека знает правила склонения и обрабатывает edge cases (двойные фамилии, иностранные имена).

---

## 5. Работа с API и утилитами

### ky (HTTP-клиент)

**Что это:** Лёгкий HTTP-клиент на основе Fetch API с удобным API и автоматической обработкой ошибок.

**Зачем нужен (vs fetch):**
- Автоматический retry при ошибках сети
- Timeout из коробки
- Автоматический парсинг JSON
- Хуки для middleware (добавление токенов)
- Лучшая обработка ошибок

**Базовое использование:**

```typescript
import ky from 'ky'

// GET запрос
const user = await ky.get('https://api.example.com/user').json()

// POST запрос
const newUser = await ky.post('https://api.example.com/users', {
  json: { name: 'Иван', email: 'ivan@example.com' }
}).json()

// PUT запрос
await ky.put('https://api.example.com/users/123', {
  json: { name: 'Пётр' }
})

// DELETE запрос
await ky.delete('https://api.example.com/users/123')
```

**Создание инстанса с базовой конфигурацией:**

```typescript
// api/client.ts
import ky from 'ky'

export const api = ky.create({
  prefixUrl: 'https://api.example.com',
  timeout: 10000, // 10 секунд
  retry: {
    limit: 2, // 2 повтора при ошибке
    methods: ['get'], // Повторять только GET
    statusCodes: [408, 413, 429, 500, 502, 503, 504]
  },
  hooks: {
    beforeRequest: [
      request => {
        // Добавляем токен к каждому запросу
        const token = localStorage.getItem('token')
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      }
    ],
    afterResponse: [
      async (request, options, response) => {
        // Обработка ошибок
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message)
        }
      }
    ]
  }
})

// Использование
const users = await api.get('users').json()
const user = await api.get(`users/${id}`).json()
```

**Обработка ошибок:**

```typescript
try {
  const data = await api.get('users/999').json()
} catch (error) {
  if (error instanceof HTTPError) {
    const response = error.response
    
    if (response.status === 404) {
      console.log('Пользователь не найден')
    } else if (response.status === 401) {
      console.log('Не авторизован')
      redirectToLogin()
    }
    
    // Получить тело ошибки
    const errorBody = await response.json()
    console.log(errorBody.message)
  } else if (error instanceof TimeoutError) {
    console.log('Превышен timeout')
  }
}
```

**Query параметры:**

```typescript
await api.get('users', {
  searchParams: {
    page: 1,
    limit: 10,
    sort: 'name',
    filter: ['active', 'verified']
  }
}).json()
// GET /users?page=1&limit=10&sort=name&filter=active&filter=verified
```

**Загрузка файлов:**

```typescript
const formData = new FormData()
formData.append('file', fileInput.files[0])
formData.append('description', 'Аватар пользователя')

await api.post('upload', {
  body: formData
})
```

**Отмена запроса (AbortController):**

```typescript
const controller = new AbortController()

const promise = api.get('users', {
  signal: controller.signal
})

// Отменить запрос через 5 секунд
setTimeout(() => controller.abort(), 5000)

try {
  const data = await promise.json()
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Запрос отменён')
  }
}
```

---

### p-queue (очередь запросов)

**Что это:** Библиотека для контроля одновременных асинхронных операций.

**Зачем нужна:**
- Ограничение количества одновременных запросов к API
- Избежание rate limiting
- Контроль нагрузки на сервер

**Базовое использование:**

```typescript
import PQueue from 'p-queue'

const queue = new PQueue({ concurrency: 3 }) // Максимум 3 запроса одновременно

// Добавляем задачи в очередь
const users = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const promises = users.map(id => 
  queue.add(() => fetchUser(id)) // Выполнится только 3 одновременно
)

const results = await Promise.all(promises)
```

**Приоритеты:**

```typescript
const queue = new PQueue({ concurrency: 2 })

// Важные запросы с высоким приоритетом
await queue.add(() => fetchCriticalData(), { priority: 10 })

// Обычные запросы
await queue.add(() => fetchRegularData(), { priority: 0 })

// Важные выполнятся первыми
```

**Интервал между запросами:**

```typescript
const queue = new PQueue({
  concurrency: 1,
  interval: 1000,      // Интервал 1 секунда
  intervalCap: 5       // Максимум 5 запросов за интервал
})

// Будет выполнять максимум 5 запросов в секунду
for (let i = 0; i < 20; i++) {
  queue.add(() => api.get(`users/${i}`))
}
```

**Практический пример (массовая загрузка файлов):**

```typescript
async function uploadFiles(files: File[]) {
  const queue = new PQueue({ 
    concurrency: 3, // 3 файла одновременно
    timeout: 30000  // Таймаут 30 секунд на файл
  })
  
  const results = await Promise.allSettled(
    files.map(file => 
      queue.add(async () => {
        const formData = new FormData()
        formData.append('file', file)
        
        return await api.post('upload', { body: formData }).json()
      })
    )
  )
  
  const successful = results.filter(r => r.status === 'fulfilled')
  const failed = results.filter(r => r.status === 'rejected')
  
  return { successful, failed }
}
```

**С React Query:**

```typescript
function BulkDataFetcher({ ids }) {
  const queue = useMemo(() => new PQueue({ concurrency: 5 }), [])
  
  const queries = useQueries({
    queries: ids.map(id => ({
      queryKey: ['user', id],
      queryFn: () => queue.add(() => fetchUser(id))
    }))
  })
  
  return <div>{/* Рендер данных */}</div>
}
```

---

### use-debounce (задержка выполнения)

**Что это:** Хук для debounce значений и функций в React.

**Зачем нужен:**
- Поиск с автокомплитом (не слать запрос на каждую букву)
- Сохранение форм (не сохранять на каждое изменение)
- Resize/scroll обработчики

**Debounce значения:**

```typescript
import { useDebounce } from 'use-debounce'
import { useState, useEffect } from 'react'

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500) // 500ms задержка
  
  useEffect(() => {
    if (debouncedSearchTerm) {
      // Этот запрос отправится только через 500ms после остановки ввода
      searchAPI(debouncedSearchTerm)
    }
  }, [debouncedSearchTerm])
  
  return (
    <input
      value={searchTerm}
      onChange={e => setSearchTerm(e.target.value)}
      placeholder="Поиск..."
    />
  )
}
```

**Debounce функции:**

```typescript
import { useDebouncedCallback } from 'use-debounce'

function AutosaveForm() {
  const [formData, setFormData] = useState({ name: '', email: '' })
  
  const saveToBackend = useDebouncedCallback(
    async (data) => {
      await api.post('save', { json: data })
      console.log('Сохранено!')
    },
    1000 // Сохранить через 1 секунду после последнего изменения
  )
  
  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    saveToBackend(newData)
  }
  
  return (
    <div>
      <input
        value={formData.name}
        onChange={e => handleChange('name', e.target.value)}
      />
      <input
        value={formData.email}
        onChange={e => handleChange('email', e.target.value)}
      />
    </div>
  )
}
```

**С отменой (cancel):**

```typescript
const debouncedSearch = useDebouncedCallback(
  (term) => searchAPI(term),
  500
)

// Можно отменить вручную
<button onClick={debouncedSearch.cancel}>
  Отменить поиск
</button>

// Можно проверить, есть ли ожидающий вызов
{debouncedSearch.isPending() && <Spinner />}

// Можно выполнить немедленно
<button onClick={debouncedSearch.flush}>
  Искать сейчас
</button>
```

**Практический пример (поиск с автокомплитом):**

```typescript
function Autocomplete() {
  const [query, setQuery] = useState('')
  const [debouncedQuery] = useDebounce(query, 300)
  
  const { data: suggestions, isLoading } = useQuery({
    queryKey: ['autocomplete', debouncedQuery],
    queryFn: () => api.get('autocomplete', {
      searchParams: { q: debouncedQuery }
    }).json(),
    enabled: debouncedQuery.length >= 3 // Минимум 3 символа
  })
  
  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Начните вводить..."
      />
      
      {isLoading && <Spinner />}
      
      {suggestions && (
        <ul>
          {suggestions.map(item => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

---

### date-fns (работа с датами)

**Что это:** Модульная библиотека для работы с датами (альтернатива moment.js).

**Базовые операции:**

```typescript
import { format, addDays, subMonths, isAfter, differenceInDays } from 'date-fns'
import { ru } from 'date-fns/locale'

const now = new Date()

// Форматирование
format(now, 'dd.MM.yyyy') // "10.12.2024"
format(now, 'dd MMMM yyyy', { locale: ru }) // "10 декабря 2024"
format(now, 'HH:mm:ss') // "14:30:45"

// Арифметика
const tomorrow = addDays(now, 1)
const lastMonth = subMonths(now, 1)

// Сравнение
isAfter(tomorrow, now) // true

// Разница
differenceInDays(tomorrow, now) // 1
```

**Парсинг:**

```typescript
import { parse, parseISO, isValid } from 'date-fns'

// Из ISO строки
const date1 = parseISO('2024-12-10T14:30:00Z')

// С кастомным форматом
const date2 = parse('10.12.2024', 'dd.MM.yyyy', new Date())

// Проверка валидности
if (isValid(date2)) {
  console.log('Дата корректна')
}
```

**Относительное время:**

```typescript
import { formatDistance, formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

const past = new Date('2024-12-09')

formatDistanceToNow(past, { locale: ru, addSuffix: true })
// "1 день назад"

formatDistance(past, new Date(), { locale: ru })
// "1 день"
```

**Практические примеры:**

```typescript
// Проверка, прошло ли 24 часа
import { isAfter, subHours } from 'date-fns'

const lastLogin = new Date(user.lastLoginAt)
const canSendEmail = isAfter(new Date(), addHours(lastLogin, 24))

// Группировка по датам
import { startOfDay, format } from 'date-fns'

const groupedMessages = messages.reduce((acc, msg) => {
  const day = format(startOfDay(msg.createdAt), 'yyyy-MM-dd')
  if (!acc[day]) acc[day] = []
  acc[day].push(msg)
  return acc
}, {})

// Календарь (дни месяца)
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  getDay 
} from 'date-fns'

const firstDay = startOfMonth(new Date())
const lastDay = endOfMonth(new Date())
const days = eachDayOfInterval({ start: firstDay, end: lastDay })

days.map(day => ({
  date: day,
  dayOfWeek: getDay(day), // 0-6 (Вс-Сб)
  isWeekend: [0, 6].includes(getDay(day))
}))
```

---

### Вопросы и ответы

**В1: Почему ky лучше fetch?**

**Ответ:**
**fetch** требует много boilerplate:
```typescript
const response = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})

if (!response.ok) throw new Error('Failed')
const result = await response.json()
```

**ky** — компактнее и удобнее:
```typescript
const result = await ky.post('/api/users', { json: data }).json()
// Автоматически: headers, JSON.stringify, проверка response.ok, парсинг
```

Дополнительно ky даёт:
- Retry при ошибках сети
- Timeout из коробки
- Хуки для middleware
- Лучшая типизация с TypeScript

**В2: Когда использовать p-queue?**

**Ответ:**
**Используйте когда:**
- Загружаете много данных параллельно (массовый импорт, синхронизация)
- API имеет rate limiting (например, 10 запросов в секунду)
- Нужно контролировать нагрузку на сервер или браузер
- Загружаете файлы (не перегружать сеть)

**Пример:** У вас 1000 товаров, нужно обновить цены. Без p-queue отправите 1000 запросов одновременно → сервер упадёт. С p-queue:
```typescript
const queue = new PQueue({ concurrency: 10 })
// Только 10 запросов одновременно, остальные в очереди
```

**Не используйте:** для обычных одиночных запросов — избыточно.

**В3: В чём разница между debounce и throttle?**

**Ответ:**
**Debounce** — откладывает выполнение пока не прекратятся события:
```
Ввод: a b c d e _ _ _ (500ms пауза) → выполнится 1 раз после "e"
```
**Когда:** поиск, автосохранение форм

**Throttle** — выполняет не чаще чем раз в N миллисекунд:
```
События каждые 10ms, throttle 100ms → выполнится каждые 100ms
```
**Когда:** scroll, resize обработчики

**Пример:**
```typescript
// Debounce — для поиска
const [query] = useDebounce(searchTerm, 500)
// Запрос отправится только когда пользователь перестанет печатать

// Throttle — для скролла
const handleScroll = useThrottle(() => {
  updateScrollPosition()
}, 100)
// Будет вызываться максимум раз в 100ms, даже при быстром скролле
```

**В4: Зачем использовать date-fns вместо встроенного Date?**

**Ответ:**
**Встроенный Date:**
- Мутабельный (опасно)
- Неинтуитивный API
- Плохая поддержка локалей
- Нет удобных утилит

```typescript
// ❌ Date API
const date = new Date()
date.setDate(date.getDate() + 1) // Мутация!
const formatted = date.toLocaleDateString('ru') // Ограниченные опции
```

**date-fns:**
- Иммутабельный (безопасно)
- Модульный (tree-shakeable)
- Читаемый код
- Богатый функционал

```typescript
// ✅ date-fns
import { addDays, format } from 'date-fns'
import { ru } from 'date-fns/locale'

const tomorrow = addDays(new Date(), 1) // Новый объект, оригинал не изменён
const formatted = format(tomorrow, 'dd MMMM yyyy', { locale: ru })
// "11 декабря 2024"
```

**В5: Как правильно организовать API клиент?**

**Ответ:**
```typescript
// api/client.ts - базовая конфигурация
import ky from 'ky'

export const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  hooks: {
    beforeRequest: [
      (request) => {
        const token = getToken()
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      }
    ]
  }
})

// api/users.ts - методы для работы с пользователями
import { api } from './client'

export const usersAPI = {
  getAll: () => api.get('users').json<User[]>(),
  getById: (id: string) => api.get(`users/${id}`).json<User>(),
  create: (data: CreateUserDTO) => api.post('users', { json: data }).json<User>(),
  update: (id: string, data: UpdateUserDTO) => 
    api.put(`users/${id}`, { json: data }).json<User>(),
  delete: (id: string) => api.delete(`users/${id}`)
}

// В компоненте
import { usersAPI } from '@/api/users'

const { data: users } = useQuery({
  queryKey: ['users'],
  queryFn: usersAPI.getAll
})
```

Преимущества:
- Единая точка конфигурации
- Типизация запросов
- Легко тестировать (моки)
- Переиспользование логики

---

## 6. Валидация и безопасность

### Zod (схемы валидации)

**Что это:** TypeScript-first библиотека для валидации данных и генерации типов.

**Базовые типы:**

```typescript
import { z } from 'zod'

// Примитивы
z.string()           // string
z.number()           // number
z.boolean()          // boolean
z.date()             // Date
z.undefined()        // undefined
z.null()             // null
z.any()              // any
z.unknown()          // unknown
z.never()            // never
z.void()             // void

// Специальные
z.string().email()   // email формат
z.string().url()     // URL формат
z.string().uuid()    // UUID формат
z.string().regex(/^\d+$/)  // regex
```

**Объекты:**

```typescript
const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(2).max(50),
  age: z.number().int().positive().min(18),
  role: z.enum(['admin', 'user', 'guest']),
  isActive: z.boolean().optional(),
  createdAt: z.date().default(() => new Date())
})

// Автоматическая генерация TypeScript типа
type User = z.infer<typeof userSchema>
/* 
type User = {
  id: string
  email: string
  name: string
  age: number
  role: 'admin' | 'user' | 'guest'
  isActive?: boolean
  createdAt: Date
}
*/
```

**Валидация:**

```typescript
// safeParse - не бросает ошибку
const result = userSchema.safeParse({
  id: '123',
  email: 'invalid-email',
  name: 'A',
  age: 15
})

if (result.success) {
  console.log(result.data) // Типизированные данные
} else {
  console.log(result.error.issues)
  /* 
  [
    { path: ['id'], message: 'Invalid uuid' },
    { path: ['email'], message: 'Invalid email' },
    { path: ['name'], message: 'String must contain at least 2 character(s)' },
    { path: ['age'], message: 'Number must be greater than or equal to 18' }
  ]
  */
}

// parse - бросает ZodError при ошибке
try {
  const user = userSchema.parse(data)
} catch (error) {
  if (error instanceof z.ZodError) {
    console.log(error.issues)
  }
}
```

**Трансформации:**

```typescript
const stringToNumberSchema = z.string().transform(val => parseInt(val))

stringToNumberSchema.parse('42') // 42 (number)

// Более сложная трансформация
const userInputSchema = z.object({
  name: z.string().trim().toLowerCase(),
  age: z.string().transform(val => parseInt(val)),
  email: z.string().email().toLowerCase()
})

userInputSchema.parse({
  name: '  ИВАН  ',
  age: '25',
  email: 'IVAN@EXAMPLE.COM'
})
/* 
{
  name: 'иван',
  age: 25,
  email: 'ivan@example.com'
}
*/
```

**Сложные схемы:**

```typescript
// Union (или)
const stringOrNumber = z.union([z.string(), z.number()])
stringOrNumber.parse('hello') // ✅
stringOrNumber.parse(42) // ✅
stringOrNumber.parse(true) // ❌

// Discriminated Union
const petSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('dog'), breed: z.string() }),
  z.object({ type: z.literal('cat'), indoor: z.boolean() })
])

petSchema.parse({ type: 'dog', breed: 'Labrador' }) // ✅
petSchema.parse({ type: 'cat', indoor: true }) // ✅
petSchema.parse({ type: 'dog', indoor: true }) // ❌

// Рекурсивные схемы
type Category = {
  name: string
  subcategories: Category[]
}

const categorySchema: z.ZodType<Category> = z.lazy(() =>
  z.object({
    name: z.string(),
    subcategories: z.array(categorySchema)
  })
)
```

**Кастомная валидация:**

```typescript
const passwordSchema = z.string()
  .min(8, 'Минимум 8 символов')
  .refine(
    val => /[A-Z]/.test(val),
    'Должна быть хотя бы одна заглавная буква'
  )
  .refine(
    val => /[0-9]/.test(val),
    'Должна быть хотя бы одна цифра'
  )

// Сравнение двух полей
const signupSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string()
}).refine(
  data => data.password === data.confirmPassword,
  {
    message: 'Пароли не совпадают',
    path: ['confirmPassword']
  }
)
```

**С React Hook Form:**

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

type FormData = z.infer<typeof schema>

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input {...register('password')} type="password" />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit">Войти</button>
    </form>
  )
}
```

---

### jose (работа с JWT)

**Что это:** Библиотека для работы с JSON Web Tokens на клиенте.

**Декодирование JWT:**

```typescript
import { decodeJwt } from 'jose'

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

// Декодирование без проверки подписи (только чтение payload)
const payload = decodeJwt(token)
console.log(payload)
/*
{
  sub: 'user-123',
  email: 'user@example.com',
  role: 'admin',
  iat: 1702123456,
  exp: 1702209856
}
*/

// Проверка истечения
const isExpired = payload.exp && payload.exp * 1000 < Date.now()
```

**Проверка JWT:**

```typescript
import { jwtVerify, createRemoteJWKSet } from 'jose'

// Получаем публичный ключ с сервера
const JWKS = createRemoteJWKSet(
  new URL('https://example.com/.well-known/jwks.json')
)

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: 'https://example.com',
      audience: 'my-app'
    })
    
    return payload
  } catch (error) {
    console.error('Invalid token:', error)
    return null
  }
}
```

**Создание JWT (на клиенте редко нужно):**

```typescript
import { SignJWT } from 'jose'

const secret = new TextEncoder().encode('my-secret-key')

const token = await new SignJWT({ userId: '123' })
  .setProtectedHeader({ alg: 'HS256' })
  .setIssuedAt()
  .setExpirationTime('2h')
  .sign(secret)
```

**Практический пример (авторизация):**

```typescript
// utils/auth.ts
import { decodeJwt } from 'jose'

export function getTokenPayload(token: string) {
  try {
    const payload = decodeJwt(token)
    
    // Проверяем срок действия
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null // Токен истёк
    }
    
    return payload
  } catch {
    return null // Невалидный токен
  }
}

// Atom для хранения токена
import { atom } from 'jotai'

export const tokenAtom = atom<string | null>(null)

export const userAtom = atom(get => {
  const token = get(tokenAtom)
  if (!token) return null
  
  const payload = getTokenPayload(token)
  return payload ? {
    id: payload.sub,
    email: payload.email,
    role: payload.role
  } : null
})

// В компоненте
function UserProfile() {
  const [user] = useAtom(userAtom)
  
  if (!user) return <div>Войдите</div>
  
  return <div>Привет, {user.email}!</div>
}
```

---

### libphonenumber-js (валидация телефонов)

**Что это:** Библиотека для парсинга, форматирования и валидации телефонных номеров.

**Парсинг номера:**

```typescript
import { parsePhoneNumber } from 'libphonenumber-js'

const phone = parsePhoneNumber('+79991234567')

console.log(phone.country)              // 'RU'
console.log(phone.nationalNumber)       // '9991234567'
console.log(phone.number)               // '+79991234567'
console.log(phone.countryCallingCode)   // '7'
```

**Валидация:**

```typescript
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js'

// Простая проверка
isValidPhoneNumber('+79991234567')     // true
isValidPhoneNumber('89991234567', 'RU') // true
isValidPhoneNumber('123', 'RU')        // false

// Детальная проверка
try {
  const phone = parsePhoneNumber('+79991234567')
  
  if (!phone.isValid()) {
    throw new Error('Невалидный номер')
  }
  
  console.log('Номер корректен')
} catch (error) {
  console.log('Ошибка парсинга')
}
```

**Форматирование:**

```typescript
const phone = parsePhoneNumber('+79991234567')

phone.format('INTERNATIONAL')  // '+7 999 123 45 67'
phone.format('NATIONAL')       // '8 (999) 123-45-67'
phone.format('E.164')          // '+79991234567'
phone.format('RFC3966')        // 'tel:+7-999-123-45-67'

// Кастомное форматирование
phone.formatNational()         // '8 (999) 123-45-67'
phone.formatInternational()    // '+7 999 123 45 67'
```

**Определение типа номера:**

```typescript
const phone = parsePhoneNumber('+79991234567')

phone.getType()  // 'MOBILE', 'FIXED_LINE', 'TOLL_FREE', etc.

// Проверка типа
phone.getType() === 'MOBILE'  // true
```

**Практический пример (компонент ввода телефона):**

```typescript
import { useState } from 'react'
import { parsePhoneNumber, AsYouType } from 'libphonenumber-js'

function PhoneInput() {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    
    // Форматируем на лету
    const formatter = new AsYouType('RU')
    const formatted = formatter.input(input)
    
    setValue(formatted)
    
    // Валидируем
    try {
      const phone = parsePhoneNumber(input, 'RU')
      if (phone.isValid()) {
        setError('')
      } else {
        setError('Неполный номер')
      }
    } catch {
      setError('Некорректный формат')
    }
  }
  
  return (
    <div>
      <input
        type="tel"
        value={value}
        onChange={handleChange}
        placeholder="+7 (999) 123-45-67"
      />
      {error && <span className="error">{error}</span>}
    </div>
  )
}
```

**С React Hook Form и Zod:**

```typescript
import { z } from 'zod'
import { isValidPhoneNumber } from 'libphonenumber-js'

const phoneSchema = z.string().refine(
  val => isValidPhoneNumber(val, 'RU'),
  { message: 'Некорректный номер телефона' }
)

const formSchema = z.object({
  name: z.string().min(2),
  phone: phoneSchema
})

function ContactForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema)
  })
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}
      
      <input {...register('phone')} type="tel" />
      {errors.phone && <span>{errors.phone.message}</span>}
      
      <button type="submit">Отправить</button>
    </form>
  )
}
```

---

### @hapi/bourne (безопасный JSON парсинг)

**Что это:** Библиотека для безопасного парсинга JSON, защита от prototype pollution.

**Проблема обычного JSON.parse:**

```typescript
// ❌ Уязвимость
const malicious = '{"__proto__": {"isAdmin": true}}'
JSON.parse(malicious)

// Теперь у ВСЕХ объектов есть isAdmin
const user = {}
console.log(user.isAdmin)  // true (!) - prototype pollution
```

**Решение с @hapi/bourne:**

```typescript
import Bourne from '@hapi/bourne'

const malicious = '{"__proto__": {"isAdmin": true}}'
const safe = Bourne.parse(malicious)

const user = {}
console.log(user.isAdmin)  // undefined - защищено!
```

**Практическое применение:**

```typescript
// api/client.ts
import ky from 'ky'
import Bourne from '@hapi/bourne'

export const api = ky.create({
  hooks: {
    afterResponse: [
      async (request, options, response) => {
        const text = await response.text()
        
        // Безопасный парсинг вместо response.json()
        const data = Bourne.parse(text)
        
        return new Response(JSON.stringify(data), response)
      }
    ]
  }
})
```

---

### Вопросы и ответы

**В1: Зачем Zod, если есть TypeScript?**

**Ответ:** TypeScript работает только на этапе компиляции. В runtime типы не проверяются:

```typescript
// TypeScript
interface User {
  email: string
  age: number
}

function saveUser(user: User) {
  // TypeScript думает, что user корректен
  api.post('/users', user)
}

// Но во время выполнения может прилететь что угодно:
saveUser({ email: 'not-an-email', age: 'not-a-number' } as User)
// TypeScript не поймает, сервер вернёт ошибку
```

**Zod валидирует в runtime:**

```typescript
const userSchema = z.object({
  email: z.string().email(),
  age: z.number().positive()
})

function saveUser(data: unknown) {
  const user = userSchema.parse(data) // Бросит ошибку если невалидно
  api.post('/users', user)
}
```

**Когда использовать Zod:**
- Валидация данных от пользователя (формы)
- Валидация ответов API
- Валидация environment variables
- Валидация URL параметров

**В2: Как безопасно хранить JWT токены?**

**Ответ:**

**❌ НЕ хранить в:**
- `localStorage` / `sessionStorage` — уязвимо к XSS атакам
- Cookies без флагов — уязвимо к CSRF

**✅ Хранить в:**
- **HttpOnly Cookies** — JavaScript не может прочитать, защита от XSS
```typescript
// Сервер устанавливает
Set-Cookie: token=...; HttpOnly; Secure; SameSite=Strict
```

- **Memory (React state)** — самое безопасное, но токен теряется при перезагрузке
```typescript
const [token, setToken] = useState<string | null>(null)
```

**Компромиссное решение:**
- Храним refresh token в HttpOnly Cookie (долгоживущий)
- Access token в памяти (короткоживущий, 15 минут)
- При перезагрузке обновляем access token через refresh token

```typescript
// При загрузке приложения
useEffect(() => {
  const refreshAccessToken = async () => {
    const { accessToken } = await api.post('auth/refresh').json()
    setToken(accessToken)
  }
  
  refreshAccessToken()
}, [])
```

**В3: Как валидировать API ответы с помощью Zod?**

**Ответ:**

```typescript
// schemas/user.ts
import { z } from 'zod'

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  createdAt: z.string().datetime().transform(val => new Date(val))
})

export type User = z.infer<typeof userSchema>

// api/users.ts
import { userSchema } from '@/schemas/user'

export const usersAPI = {
  getById: async (id: string): Promise<User> => {
    const response = await api.get(`users/${id}`).json()
    
    // Валидируем ответ API
    return userSchema.parse(response)
  },
  
  getAll: async (): Promise<User[]> => {
    const response = await api.get('users').json()
    return z.array(userSchema).parse(response)
  }
}
```

Преимущества:
- Гарантия что данные соответствуют ожиданиям
- Защита от изменений API
- Автоматическая типизация
- Трансформации (строки → Date)

**В4: Почему важна валидация телефонных номеров?**

**Ответ:**

**Проблемы без валидации:**
```typescript
// Пользователь вводит
'8 (999) 123-45-67'
'+7 999 123 45 67'
'89991234567'
// Все эти варианты — один и тот же номер!
```

**С libphonenumber-js:**
```typescript
// Все варианты нормализуются к E.164 формату
parsePhoneNumber('8 (999) 123-45-67', 'RU').format('E.164')
// '+79991234567'

parsePhoneNumber('+7 999 123 45 67').format('E.164')
// '+79991234567'

// Можно безопасно сравнивать, хранить в БД, отправлять в SMS-шлюз
```

**Зачем ещё:**
- Определить страну номера
- Проверить тип (мобильный/городской)
- Форматировать для пользователя
- Избежать фальшивых номеров

**В5: Что такое prototype pollution и как защититься?**

**Ответ:** Prototype pollution — атака через изменение `Object.prototype`:

```typescript
// Атакующий отправляет JSON
{
  "__proto__": {
    "isAdmin": true,
    "balance": 1000000
  }
}

// После JSON.parse
JSON.parse(malicious)

// ВСЕ объекты унаследуют эти свойства!
const user = {}
user.isAdmin  // true (!)
user.balance  // 1000000 (!)
```

**Защита:**

1. **@hapi/bourne:**
```typescript
import Bourne from '@hapi/bourne'
Bourne.parse(json)  // Безопасно
```

2. **Object.create(null):**
```typescript
const safe = Object.create(null)
Object.assign(safe, JSON.parse(json))
// У safe нет prototype
```

3. **Object.freeze:**
```typescript
Object.freeze(Object.prototype)
// Запрещаем изменения прототипа
```

4. **Валидация с Zod:**
```typescript
const schema = z.object({
  name: z.string(),
  email: z.string()
  // __proto__ будет отфильтрован
})
```

---

## 7. Developer Experience и сборка

### Turbopack vs Webpack

**Что это:** Turbopack — новый сборщик от создателей Next.js, замена Webpack.

**Webpack** (production build):
- Зрелый, стабильный
- Огромная экосистема плагинов
- Медленная сборка (минуты для больших проектов)
- Используется для production build в Next.js

**Turbopack** (dev mode):
- Невероятно быстрый (Rust)
- Инкрементальная сборка (кэширование)
- HMR за миллисекунды
- Используется только в development (пока)

**Пример скорости:**

```bash
# Webpack (холодный старт)
npm run dev
✓ Ready in 45s

# Turbopack (холодный старт)
npm run dev --turbo
✓ Ready in 3s

# HMR (изменение файла)
# Webpack: ~500ms
# Turbopack: ~50ms
```

**Включение Turbopack:**

```json
// package.json
{
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build"  // Всё ещё Webpack
  }
}
```

---

### Yarn Berry (v3+)

**Что это:** Yarn 3+ с новой архитектурой Plug'n'Play (PnP).

**Отличия от Yarn 1.x / npm:**

**Классический подход (node_modules):**
```
node_modules/
├── package-a/
│   └── node_modules/
│       └── package-b/
└── package-c/
    └── node_modules/
        └── package-b/
```
Проблемы: дубликаты, медленная установка, много файлов.

**Yarn Berry (PnP):**
```
.yarn/
├── cache/           # Zip-архивы пакетов
└── unplugged/       # Нативные модули
.pnp.cjs            # Карта зависимостей
```

Преимущества:
- Мгновенная установка (нет копирования файлов)
- Детерминированные зависимости
- Защита от phantom dependencies

**Настройка:**

```bash
# Установка Yarn Berry
corepack enable
yarn set version stable

# Инициализация
yarn init -2
```

```yaml
# .yarnrc.yml
nodeLinker: pnp  # или 'node-modules' для классического подхода

plugins:
  - path: .yarn/plugins/@yarnpkg/plugin-typescript.cjs
```

**Workspaces (монорепо):**

```json
// package.json
{
  "name": "my-monorepo",
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

```
my-monorepo/
├── apps/
│   ├── web/            # Next.js приложение
│   └── mobile/         # React Native
├── packages/
│   ├── ui/             # Общие компоненты
│   ├── utils/          # Утилиты
│   └── api-client/     # API клиент
└── package.json
```

**Использование workspace пакетов:**

```json
// apps/web/package.json
{
  "dependencies": {
    "@mycompany/ui": "workspace:*",
    "@mycompany/utils": "workspace:*"
  }
}
```

---

### Prettier, ESLint, Oxlint

**Prettier** — форматирование кода:

```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "avoid"
}
```

```json
// package.json
{
  "scripts": {
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,css,md}\""
  }
}
```

**ESLint** — линтинг кода:

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'prettier'  // Отключает конфликтующие с Prettier правила
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_' 
    }],
    '@typescript-eslint/no-explicit-any': 'warn',
    'react-hooks/exhaustive-deps': 'warn'
  }
}
```

**Oxlint** — сверхбыстрый линтер (Rust):

```bash
# Установка
npm install -D oxlint

# Использование
npx oxlint
```

```json
// package.json
{
  "scripts": {
    "lint": "oxlint && tsc --noEmit",  // Oxlint + проверка типов
    "lint:eslint": "eslint ."          // Fallback на ESLint
  }
}
```

**Сравнение скорости:**
- ESLint: ~10s на большом проекте
- Oxlint: ~0.5s (в 20 раз быстрее!)

---

### Husky + lint-staged + commitlint

**Husky** — Git хуки:

```bash
# Установка
npm install -D husky
npx husky init
```

```bash
# .husky/pre-commit
#!/bin/sh
npx lint-staged
```

```bash
# .husky/pre-push
#!/bin/sh
npm run test
npm run build
```

**lint-staged** — запуск линтеров только на изменённых файлах:

```javascript
// .lintstagedrc.js
module.exports = {
  '*.{ts,tsx}': [
    'prettier --write',
    'eslint --fix',
    'bash -c "tsc --noEmit"'  // Проверка типов
  ],
  '*.{json,css,md}': [
    'prettier --write'
  ]
}
```

**commitlint** — валидация сообщений коммитов:

```bash
npm install -D @commitlint/cli @commitlint/config-conventional
```

```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore']
    ],
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']]
  }
}
```

```bash
# .husky/commit-msg
#!/bin/sh
npx --no -- commitlint --edit $1
```

**Примеры валидных коммитов:**
```
feat: add user authentication
fix: resolve memory leak in component
docs: update API documentation
refactor: extract validation logic
test: add tests for login flow
chore: update dependencies
```

**Workflow:**
1. Делаете изменения
2. `git add .`
3. `git commit -m "feat: add feature"` → срабатывает pre-commit
   - lint-staged проверяет только изменённые файлы
   - Prettier форматирует
   - ESLint находит ошибки
   - TypeScript проверяет типы
   - commitlint валидирует сообщение
4. `git push` → срабатывает pre-push
   - Запускаются тесты
   - Проверяется сборка

---

### Вопросы и ответы

**В1: Зачем нужен Turbopack если есть Vite?**

**Ответ:**

**Vite:**
- Универсальный (React, Vue, Svelte)
- esbuild для dev, Rollup для prod
- Отличная скорость
- Большая экосистема плагинов

**Turbopack:**
- Оптимизирован для Next.js
- Rust-based (теоретически быстрее)
- Инкрементальная компиляция (кэш между запусками)
- Встроенная интеграция с React Server Components

**Когда что использовать:**
- Next.js → Turbopack (встроен)
- Другие фреймворки → Vite
- Микрофронтенды, библиотеки → Vite

**В2: Что такое PnP в Yarn Berry и стоит ли его использовать?**

**Ответ:** Plug'n'Play — альтернатива `node_modules`.

**Плюсы PnP:**
- Мгновенная установка зависимостей
- Меньше места на диске
- Детерминированные разрешения модулей
- Защита от phantom dependencies

**Минусы PnP:**
- Некоторые пакеты не совместимы
- Требует настройки IDE
- Сложнее для новичков

**Рекомендация:**
```yaml
# .yarnrc.yml - для новых проектов можно попробовать
nodeLinker: pnp

# Если проблемы - откат на классический подход
nodeLinker: node-modules
```

Многие компании используют `node-modules` режим для стабильности.

**В3: В чём разница между Prettier и ESLint?**

**Ответ:**

**Prettier** — форматирование (code formatting):
- Отступы, кавычки, точки с запятой
- Перенос строк, пробелы
- НЕ находит ошибки в коде
- Работает с любыми языками (JS, CSS, Markdown, JSON)

```typescript
// Prettier исправит
const   x=1  // → const x = 1
```

**ESLint** — линтинг (code quality):
- Находит потенциальные баги
- Плохие практики
- Неиспользуемые переменные
- Проблемы с логикой

```typescript
// ESLint предупредит
const x = 1  // unused variable
if (x = 2)   // assignment in condition
```

**Используйте оба:**
```json
{
  "scripts": {
    "lint": "eslint . && prettier --check .",
    "format": "prettier --write ."
  }
}
```

**В4: Зачем нужен commitlint?**

**Ответ:** Стандартизация сообщений коммитов для:

**1. Автоматической генерации CHANGELOG:**
```
feat: add user profile page     → Features
fix: resolve login bug          → Bug Fixes
```

**2. Semantic versioning:**
```
feat:  → minor version (1.1.0)
fix:   → patch version (1.0.1)
BREAKING CHANGE: → major version (2.0.0)
```

**3. Лучшей навигации по истории:**
```bash
git log --oneline --grep="^feat"  # Все новые фичи
git log --oneline --grep="^fix"   # Все исправления
```

**4. Code review:**
```
feat(auth): add OAuth login
^      ^     ^
|      |     |
тип   scope  описание
```

Сразу понятно что изменилось и где.

**В5: Как настроить TypeScript проверку в pre-commit?**

**Ответ:**

**Проблема:** `tsc --noEmit` проверяет ВСЕ файлы проекта, даже неизменённые (медленно).

**Решение 1 — tsc для изменённых файлов:**
```javascript
// .lintstagedrc.js
module.exports = {
  '*.{ts,tsx}': files => {
    const filePaths = files.join(' ')
    return [
      `prettier --write ${filePaths}`,
      `eslint --fix ${filePaths}`,
      `tsc --noEmit --pretty ${filePaths}`  // Только изменённые
    ]
  }
}
```

**Проблема:** TypeScript может не найти ошибки без полной проверки проекта.

**Решение 2 — полная проверка, но быстрее:**
```javascript
module.exports = {
  '*.{ts,tsx}': [
    'prettier --write',
    'eslint --fix',
    () => 'tsc --noEmit --incremental'  // Инкрементальная сборка
  ]
}
```

**Решение 3 — переносим в CI:**
```javascript
// pre-commit: только быстрые проверки
module.exports = {
  '*.{ts,tsx}': ['prettier --write', 'eslint --fix']
}

// CI/CD: полная проверка
// .github/workflows/ci.yml
- run: tsc --noEmit
- run: npm test
```

---

## 8. Тестирование

### Jest + ts-jest

**Что это:** Jest — фреймворк для тестирования JavaScript/TypeScript. ts-jest — поддержка TypeScript.

**Установка:**

```bash
npm install -D jest ts-jest @types/jest
npx ts-jest config:init
```

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',  // Для React компонентов
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*): '<rootDir>/src/$1',  // Алиасы путей
    '\\.(css|less|scss): 'identity-obj-proxy'  // Мок CSS
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx'
  ]
}
```

**Базовый тест (unit):**

```typescript
// utils/math.ts
export function add(a: number, b: number): number {
  return a + b
}

export function divide(a: number, b: number): number {
  if (b === 0) throw new Error('Division by zero')
  return a / b
}

// utils/math.test.ts
import { add, divide } from './math'

describe('math utils', () => {
  describe('add', () => {
    it('should add two numbers', () => {
      expect(add(2, 3)).toBe(5)
    })
    
    it('should handle negative numbers', () => {
      expect(add(-5, 3)).toBe(-2)
    })
  })
  
  describe('divide', () => {
    it('should divide two numbers', () => {
      expect(divide(10, 2)).toBe(5)
    })
    
    it('should throw error on division by zero', () => {
      expect(() => divide(10, 0)).toThrow('Division by zero')
    })
  })
})
```

**Тестирование React компонентов:**

```bash
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

```typescript
// Button.tsx
interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary'
}

export function Button({ children, onClick, disabled, variant = 'primary' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  )
}

// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })
  
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
  
  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
  
  it('applies variant className', () => {
    render(<Button variant="secondary">Click me</Button>)
    expect(screen.getByRole('button')).toHaveClass('btn-secondary')
  })
})
```

**Тестирование асинхронного кода:**

```typescript
// api/users.ts
export async function fetchUser(id: string) {
  const response = await fetch(`/api/users/${id}`)
  if (!response.ok) throw new Error('User not found')
  return response.json()
}

// api/users.test.ts
import { fetchUser } from './users'

// Мокаем fetch
global.fetch = jest.fn()

describe('fetchUser', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  it('fetches user successfully', async () => {
    const mockUser = { id: '123', name: 'Ivan' }
    
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser
    })
    
    const user = await fetchUser('123')
    
    expect(fetch).toHaveBeenCalledWith('/api/users/123')
    expect(user).toEqual(mockUser)
  })
  
  it('throws error when user not found', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false
    })
    
    await expect(fetchUser('999')).rejects.toThrow('User not found')
  })
})
```

**Тестирование хуков:**

```typescript
// hooks/useCounter.ts
import { useState } from 'react'

export function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue)
  
  const increment = () => setCount(c => c + 1)
  const decrement = () => setCount(c => c - 1)
  const reset = () => setCount(initialValue)
  
  return { count, increment, decrement, reset }
}

// hooks/useCounter.test.ts
import { renderHook, act } from '@testing-library/react'
import { useCounter } from './useCounter'

describe('useCounter', () => {
  it('initializes with default value', () => {
    const { result } = renderHook(() => useCounter())
    expect(result.current.count).toBe(0)
  })
  
  it('initializes with custom value', () => {
    const { result } = renderHook(() => useCounter(10))
    expect(result.current.count).toBe(10)
  })
  
  it('increments counter', () => {
    const { result } = renderHook(() => useCounter())
    
    act(() => {
      result.current.increment()
    })
    
    expect(result.current.count).toBe(1)
  })
  
  it('decrements counter', () => {
    const { result } = renderHook(() => useCounter(5))
    
    act(() => {
      result.current.decrement()
    })
    
    expect(result.current.count).toBe(4)
  })
  
  it('resets to initial value', () => {
    const { result } = renderHook(() => useCounter(10))
    
    act(() => {
      result.current.increment()
      result.current.increment()
      result.current.reset()
    })
    
    expect(result.current.count).toBe(10)
  })
})
```

**Снапшот тесты:**

```typescript
import { render } from '@testing-library/react'
import { UserCard } from './UserCard'

describe('UserCard', () => {
  it('matches snapshot', () => {
    const user = {
      name: 'Иван Иванов',
      email: 'ivan@example.com',
      avatar: '/avatar.jpg'
    }
    
    const { container } = render(<UserCard user={user} />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
```

**Моки модулей:**

```typescript
// services/analytics.ts
export function trackEvent(eventName: string, data: any) {
  window.gtag('event', eventName, data)
}

// Component.test.tsx
import { trackEvent } from '@/services/analytics'

jest.mock('@/services/analytics', () => ({
  trackEvent: jest.fn()
}))

describe('Component with analytics', () => {
  it('tracks click event', () => {
    render(<MyComponent />)
    fireEvent.click(screen.getByRole('button'))
    
    expect(trackEvent).toHaveBeenCalledWith('button_click', {
      buttonName: 'submit'
    })
  })
})
```

---

### Вопросы и ответы

**В1: Что тестировать в первую очередь?**

**Ответ:** Пирамида тестирования (снизу вверх):

1. **Unit тесты (70%)** — чистые функции, утилиты:
   - Валидация
   - Форматирование
   - Бизнес-логика
   - Хуки

2. **Integration тесты (20%)** — взаимодействие компонентов:
   - Формы с валидацией
   - API запросы
   - State management

3. **E2E тесты (10%)** — критические сценарии:
   - Регистрация/логин
   - Оформление заказа
   - Оплата

**Приоритеты:**
- ✅ Критичная бизнес-логика
- ✅ Часто ломающийся код
- ✅ Сложные алгоритмы
- ❌ Тривиальные геттеры/сеттеры
- ❌ Стили (визуальные тесты отдельно)

**В2: Как тестировать компоненты с React Query?**

**Ответ:**

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false }, // Отключаем retry в тестах
      mutations: { retry: false }
    }
  })
}

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  )
}

describe('UserProfile', () => {
  it('displays user data', async () => {
    // Мокаем API
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ name: 'Иван', email: 'ivan@example.com' })
    })
    
    renderWithQueryClient(<UserProfile userId="123" />)
    
    // Ждём загрузки
    expect(screen.getByText(/загрузка/i)).toBeInTheDocument()
    
    // Проверяем результат
    await waitFor(() => {
      expect(screen.getByText('Иван')).toBeInTheDocument()
      expect(screen.getByText('ivan@example.com')).toBeInTheDocument()
    })
  })
})
```

**В3: Как тестировать асинхронную логику?**

**Ответ:**

**1. async/await:**
```typescript
it('loads data', async () => {
  const data = await fetchData()
  expect(data).toEqual({ id: 1 })
})
```

**2. waitFor (для React компонентов):**
```typescript
it('shows loaded data', async () => {
  render(<MyComponent />)
  
  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument()
  })
})
```

**3. findBy (короткая запись waitFor):**
```typescript
it('shows loaded data', async () => {
  render(<MyComponent />)
  
  // Автоматически ждёт появления элемента
  const element = await screen.findByText('Loaded')
  expect(element).toBeInTheDocument()
})
```

**4. Таймауты:**
```typescript
it('shows error after timeout', async () => {
  jest.useFakeTimers()
  render(<MyComponent />)
  
  act(() => {
    jest.advanceTimersByTime(5000) // Перемотка на 5 секунд
  })
  
  expect(screen.getByText('Timeout error')).toBeInTheDocument()
  
  jest.useRealTimers()
})
```

**В4: Что такое coverage и какой процент нужен?**

**Ответ:** Coverage (покрытие кодом) — процент протестированного кода.

```bash
npm test -- --coverage
```

```
File      | % Stmts | % Branch | % Funcs | % Lines |
----------|---------|----------|---------|---------|
utils.ts  |   80.00 |    75.00 |   85.00 |   80.00 |
```

**Метрики:**
- **Statements** — процент выполненных строк
- **Branches** — процент проверенных условий (if/else)
- **Functions** — процент вызванных функций
- **Lines** — процент покрытых строк

**Рекомендации:**
- **80%+** — хорошо для большинства проектов
- **90%+** — отлично, но может быть избыточно
- **100%** — редко нужно, много времени на поддержку

**Важнее качество тестов, чем процент:**
```typescript
// ❌ 100% coverage, но бесполезный тест
it('calls function', () => {
  myFunction()
  expect(true).toBe(true)
})

// ✅ 80% coverage, но проверяет логику
it('calculates discount correctly', () => {
  expect(calculateDiscount(100, 10)).toBe(90)
  expect(calculateDiscount(0, 10)).toBe(0)
})
```

**В5: Как организовать тесты в проекте?**

**Ответ:**

**Подход 1 — рядом с кодом:**
```
src/
  components/
    Button/
      Button.tsx
      Button.test.tsx
      Button.stories.tsx
  utils/
    math.ts
    math.test.ts
```
Плюсы: легко найти, удалить вместе с компонентом

**Подход 2 — отдельная папка:**
```
src/
  components/
    Button/
      Button.tsx
  __tests__/
    components/
      Button.test.tsx
    utils/
      math.test.ts
```
Плюсы: чистая структура, меньше файлов в каждой папке

**Рекомендация:** Подход 1 для небольших проектов, подход 2 для больших.

**Именование:**
- `*.test.ts` — unit тесты
- `*.integration.test.ts` — интеграционные
- `*.e2e.test.ts` — end-to-end

---

## 9. Интеграции и инструменты

### Orval (генерация из OpenAPI)

**Что это:** Генератор TypeScript типов и API клиентов из OpenAPI/Swagger спецификации.

**Установка:**

```bash
npm install -D orval
```

**Конфигурация:**

```javascript
// orval.config.js
module.exports = {
  api: {
    input: './swagger.json', // или URL
    output: {
      target: './src/api/generated.ts',
      client: 'react-query',
      mode: 'tags-split', // Разделить по тегам
      override: {
        mutator: {
          path: './src/api/client.ts',
          name: 'customClient'
        }
      }
    }
  }
}
```

**OpenAPI спецификация (пример):**

```yaml
# swagger.yaml
openapi: 3.0.0
info:
  title: My API
  version: 1.0.0

paths:
  /users:
    get:
      tags:
        - users
      operationId: getUsers
      responses:
        200:
          description: Success
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
  
  /users/{id}:
    get:
      tags:
        - users
      operationId: getUserById
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        200:
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'

components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        email:
          type: string
          format: email
```

**Генерация:**

```bash
npx orval
```

**Сгенерированный код:**

```typescript
// src/api/generated.ts
export interface User {
  id: string
  name: string
  email: string
}

// React Query хуки автоматически!
export const useGetUsers = () => {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => customClient('/users')
  })
}

export const useGetUserById = (id: string) => {
  return useQuery<User>({
    queryKey: ['users', id],
    queryFn: () => customClient(`/users/${id}`)
  })
}
```

**Использование:**

```typescript
// В компоненте
function UsersList() {
  const { data: users, isLoading } = useGetUsers()
  
  if (isLoading) return <div>Загрузка...</div>
  
  return (
    <ul>
      {users?.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  )
}
```

**Преимущества:**
- Типы всегда синхронны с backend
- Автоматические хуки React Query
- Не нужно вручную писать API клиент
- Обновление командой `npx orval`

---

### Eruda (отладка на мобильных)

**Что это:** Мобильная консоль разработчика прямо на экране телефона.

**Установка:**

```bash
npm install eruda
```

**Подключение в development:**

```typescript
// app/layout.tsx или _app.tsx
'use client'

import { useEffect } from 'react'

export default function RootLayout({ children }) {
  useEffect(() => {
    // Только в development и на мобильных
    if (process.env.NODE_ENV === 'development' && /mobile/i.test(navigator.userAgent)) {
      import('eruda').then(eruda => eruda.default.init())
    }
  }, [])
  
  return <html><body>{children}</body></html>
}
```

**Или через query параметр:**

```typescript
useEffect(() => {
  const params = new URLSearchParams(window.location.search)
  if (params.get('debug') === 'true') {
    import('eruda').then(eruda => eruda.default.init())
  }
}, [])

// Использование: https://myapp.com?debug=true
```

**Возможности Eruda:**
- Console — логи, ошибки, warnings
- Elements — инспектор DOM
- Network — все запросы с деталями
- Resources — LocalStorage, Cookies, SessionStorage
- Info — информация о устройстве
- Snippets — выполнение JavaScript кода

**Практический пример:**

```typescript
// Включаем только для определённых пользователей
import { useAtom } from 'jotai'
import { userAtom } from '@/atoms/auth'

function DebugTools() {
  const [user] = useAtom(userAtom)
  
  useEffect(() => {
    if (user?.role === 'admin' || user?.email.endsWith('@company.com')) {
      import('eruda').then(eruda => {
        eruda.default.init()
        console.log('Debug tools enabled for:', user.email)
      })
    }
  }, [user])
  
  return null
}
```

---

### VK Tunnel (туннелирование)

**Что это:** Инструмент для создания публичного URL к localhost (аналог ngrok).

**Установка:**

```bash
npm install -g @vkontakte/vk-tunnel
```

**Использование:**

```bash
# Запускаем Next.js
npm run dev
# Сервер на http://localhost:3000

# В другом терминале создаём туннель
vk-tunnel --insecure --http-protocol-header X-Forwarded-Proto --port 3000

# Получаем публичный URL
# https://abc123.vk-tunnel.com → localhost:3000
```

**Зачем нужно:**

**1. Тестирование на реальных устройствах:**
```bash
# Открываем на телефоне
https://abc123.vk-tunnel.com
```

**2. OAuth callback'и:**
```typescript
// Google OAuth требует https и публичный URL
const REDIRECT_URI = process.env.NODE_ENV === 'development'
  ? 'https://abc123.vk-tunnel.com/auth/callback'
  : 'https://production.com/auth/callback'
```

**3. Webhooks:**
```typescript
// Telegram bot webhook
await telegram.setWebhook('https://abc123.vk-tunnel.com/api/webhook')
```

**4. Демонстрация клиенту:**
```
Отправляем ссылку: https://abc123.vk-tunnel.com
Клиент открывает и видит текущую версию
```

**Конфигурация в package.json:**

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:tunnel": "concurrently \"npm run dev\" \"vk-tunnel --port 3000\""
  }
}
```

**Альтернативы:**
- **ngrok** — самый популярный
- **localtunnel** — open source
- **Cloudflare Tunnel** — от Cloudflare
- **serveo** — через SSH

---

### Вопросы и ответы

**В1: Зачем использовать Orval вместо ручного написания API клиента?**

**Ответ:**

**Без Orval (ручной подход):**
```typescript
// ❌ Проблемы:
// 1. Типы могут расходиться с backend
// 2. Много boilerplate кода
// 3. При изменении API нужно обновлять вручную

interface User {
  id: string
  name: string
  email: string  // Забыли что стал необязательным!
}

async function fetchUsers(): Promise<User[]> {
  const response = await fetch('/api/users')
  return response.json()
}

const { data } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers
})
```

**С Orval:**
```typescript
// ✅ Преимущества:
// 1. Типы генерируются из OpenAPI
// 2. Автоматические хуки
// 3. Одна команда npx orval для синхронизации

import { useGetUsers } from './api/generated'

const { data } = useGetUsers()
// Типы автоматом синхронны с backend
```

**Когда использовать:**
- ✅ Backend отдаёт OpenAPI спецификацию
- ✅ Большое API (50+ endpoints)
- ✅ Частые изменения в API
- ❌ Маленький проект (5-10 endpoints)
- ❌ Backend без OpenAPI

**В2: Безопасно ли использовать Eruda в production?**

**Ответ:** **НЕТ!** Eruda показывает:
- Все network запросы (включая токены в headers)
- LocalStorage (может содержать токены)
- Console logs (могут содержать чувствительные данные)
- Структуру кода

**Правильный подход:**

```typescript
// ❌ НЕПРАВИЛЬНО
import eruda from 'eruda'
eruda.init() // Включено везде!

// ✅ ПРАВИЛЬНО
if (process.env.NODE_ENV === 'development') {
  import('eruda').then(eruda => eruda.default.init())
}

// ✅ ИЛИ для избранных пользователей в production
if (user?.role === 'admin' && user?.debugEnabled) {
  import('eruda').then(eruda => eruda.default.init())
}
```

**Альтернативы для production:**
- **Sentry** — для отслеживания ошибок
- **LogRocket** — записи сессий пользователей
- **Remote debugging** — Chrome DevTools через USB

**В3: Как безопасно использовать туннели?**

**Ответ:**

**Риски:**
- Публичный URL доступен всем
- Могут найти сканеры уязвимостей
- Возможна DDoS атака

**Защита:**

**1. Basic Auth:**
```typescript
// middleware.ts
import { NextResponse } from 'next/server'

export function middleware(request: Request) {
  // Только для tunnel URL
  if (request.headers.get('host')?.includes('vk-tunnel.com')) {
    const auth = request.headers.get('authorization')
    
    if (auth !== 'Basic ' + btoa('admin:secret123')) {
      return new NextResponse('Auth required', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic' }
      })
    }
  }
  
  return NextResponse.next()
}
```

**2. IP whitelist:**
```typescript
const ALLOWED_IPS = ['1.2.3.4', '5.6.7.8']

if (!ALLOWED_IPS.includes(request.headers.get('x-forwarded-for'))) {
  return new NextResponse('Forbidden', { status: 403 })
}
```

**3. Временный токен в URL:**
```typescript
// https://abc123.vk-tunnel.com?token=secret-token-123

if (request.nextUrl.searchParams.get('token') !== process.env.TUNNEL_TOKEN) {
  return new NextResponse('Invalid token', { status: 403 })
}
```

**4. Автоматическое отключение:**
```typescript
// Туннель живёт только 1 час
setTimeout(() => {
  console.log('Tunnel expired, closing...')
  process.exit(0)
}, 60 * 60 * 1000)
```

**В4: Какие есть альтернативы генерации типов кроме Orval?**

**Ответ:**

**1. openapi-typescript:**
```bash
npm install -D openapi-typescript
npx openapi-typescript ./swagger.yaml -o ./types/api.ts
```
Генерирует только типы, без хуков.

**2. swagger-typescript-api:**
```bash
npm install -D swagger-typescript-api
npx swagger-typescript-api -p ./swagger.yaml -o ./src/api -n myApi.ts
```
Генерирует типы + fetch клиент.

**3. @rtk-query/codegen-openapi:**
```bash
npm install -D @rtk-query/codegen-openapi
```
Генерирует RTK Query endpoints.

**4. tRPC (не OpenAPI):**
```typescript
// Если контролируете backend, используйте tRPC
// Типы передаются автоматически без генерации
```

**Сравнение:**
- **Orval** — лучше для React Query, много опций
- **openapi-typescript** — минималистичный, только типы
- **swagger-typescript-api** — хорошо для Axios/Fetch
- **tRPC** — идеально если backend тоже TypeScript

**В5: Как отлаживать проблемы на iOS Safari?**

**Ответ:**

**Способ 1 — Safari Web Inspector (Mac):**
```
1. iPhone: Настройки → Safari → Дополнительно → Web Inspector
2. Подключаем iPhone к Mac через USB
3. Mac: Safari → Разработка → [Ваш iPhone] → [Открытая вкладка]
4. Откроется полноценный DevTools
```

**Способ 2 — Eruda (без Mac):**
```typescript
// Подключаем Eruda на устройстве
https://myapp.com?debug=true
```

**Способ 3 — Remote debugging (любой ПК):**
```bash
# Устанавливаем remotedebug-ios-webkit-adapter
npm install -g remotedebug-ios-webkit-adapter

# Запускаем
remotedebug_ios_webkit_adapter --port=9000

# Открываем Chrome DevTools
chrome://inspect
```

**Способ 4 — Sentry для ошибок:**
```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({ dsn: '...' })

// Все ошибки iOS Safari попадут в Sentry
```

**Частые проблемы iOS Safari:**
- `100vh` — неправильная высота (используйте `-webkit-fill-available`)
- Touch events — работают по-другому
- Date parsing — строгие требования к формату
- LocalStorage — лимит 5MB

---

## 10. Мониторинг и production

### Sentry

**Что это:** Система мониторинга ошибок и производительности в production.

**Установка для Next.js:**

```bash
npx @sentry/wizard@latest -i nextjs
```

**Конфигурация:**

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Отслеживание производительности
  tracesSampleRate: 0.1, // 10% запросов
  
  // Профилирование
  profilesSampleRate: 0.1,
  
  // Окружение
  environment: process.env.NODE_ENV,
  
  // Игнорировать определённые ошибки
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured'
  ],
  
  // До отправки можно модифицировать
  beforeSend(event, hint) {
    // Фильтруем чувствительные данные
    if (event.request) {
      delete event.request.cookies
    }
    return event
  }
})
```

**Отлов ошибок:**

```typescript
// Автоматический отлов
try {
  riskyOperation()
} catch (error) {
  Sentry.captureException(error)
  throw error
}

// Ручная отправка
Sentry.captureMessage('Something went wrong', 'error')

// С контекстом
Sentry.captureException(error, {
  tags: {
    section: 'checkout',
    paymentMethod: 'card'
  },
  extra: {
    orderId: '12345',
    amount: 1000
  },
  level: 'error' // 'fatal' | 'error' | 'warning' | 'info' | 'debug'
})
```

**Отслеживание пользователей:**

```typescript
Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.name
})

// При логауте
Sentry.setUser(null)
```

**Breadcrumbs (хлебные крошки действий):**

```typescript
Sentry.addBreadcrumb({
  category: 'navigation',
  message: 'User navigated to /checkout',
  level: 'info'
})

Sentry.addBreadcrumb({
  category: 'api',
  message: 'POST /api/orders',
  data: { orderId: '12345' },
  level: 'info'
})

// При ошибке Sentry покажет последовательность действий
```

**Performance monitoring:**

```typescript
import * as Sentry from '@sentry/nextjs'

// Автоматически для всех API запросов
// Вручную для custom операций
const transaction = Sentry.startTransaction({
  name: 'ProcessOrder',
  op: 'function'
})

const span = transaction.startChild({
  op: 'db',
  description: 'Save order to database'
})

await saveOrder(order)
span.finish()

transaction.finish()
```

**Source Maps (для деобфускации):**

```javascript
// next.config.js
module.exports = {
  sentry: {
    hideSourceMaps: true, // Не выкладывать в public
    widenClientFileUpload: true
  }
}
```

**Alerts (уведомления):**
```
Sentry Dashboard:
→ Alerts → New Alert Rule
→ Когда: error count > 10 за 5 минут
→ Отправить: email / Slack / PagerDuty
```

---

### Tracing (распределённая трассировка)

**Что это:** Отслеживание запроса через все сервисы (frontend → backend → database).

**OpenTelemetry с Next.js:**

```typescript
// instrumentation.ts (Next.js 14+)
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { NodeSDK } = await import('@opentelemetry/sdk-node')
    const { getNodeAutoInstrumentations } = await import(
      '@opentelemetry/auto-instrumentations-node'
    )