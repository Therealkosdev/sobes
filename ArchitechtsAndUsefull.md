#  React & Next.js | Архитектура · AbortController · Middleware · Нейминг файлов

---

## I. Архитектуры React/Next приложений

Архитектура определяет, **как организован код**: где живут компоненты, как они взаимодействуют, какие правила импортов. Правильная архитектура = масштабируемость и низкая когнитивная нагрузка.

---

### 1.1 Feature-Sliced Design (FSD)

Методология специально для фронтенда. Код организован по **бизнес-сущностям и сценариям**, а не по техническим папкам (components/, utils/).

**Слои (каждый может импортировать только нижние):**

```
src/
├── app/       # Инициализация: провайдеры, роутер, глобальные стили
├── pages/     # Страницы (композиция виджетов)
├── widgets/   # Самодостаточные UI-блоки: Header, Sidebar, Feed
├── features/  # Пользовательские сценарии: LoginForm, AddToCart
├── entities/  # Бизнес-сущности: User, Product, Order
└── shared/    # Переиспользуемый код: UI-kit, api, utils, types
```

**Каждый слой — набор слайсов (сегментов):**

```
features/auth/
├── ui/         # React-компоненты фичи
├── model/      # Бизнес-логика: store, selectors
├── api/        # API-запросы
├── lib/        # Вспомогательные утилиты
└── index.ts    # Публичное API — единственная точка входа
```

**Ключевые правила:**
- Импорты только вниз по слоям: `features → entities` ✅, `entities → features` ❌
- Снаружи модуля виден только `index.ts` — **Public API Pattern**

```ts
// ✅ Правильно — через публичное API
import { LoginForm, useAuth } from "@/features/auth";

// ❌ Неправильно — импорт из внутренностей
import { LoginForm } from "@/features/auth/ui/LoginForm";
```

---

### 1.2 Модульная (Feature-based) архитектура

Гибкий вариант без строгих правил импортов. Код группируется по доменным модулям.

```
src/
├── modules/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── store/
│   │   └── api/
│   └── dashboard/
├── shared/
│   ├── ui/
│   └── utils/
└── app/
```

Отличие от FSD: нет жёсткого запрета импортов между модулями. Гибче, но менее предсказуемо.

---

### 1.3 Layers Architecture (Чистая архитектура)

Разделение по **техническим слоям ответственности**. Каждый слой зависит только от нижнего.

```
Presentation  →  Компоненты, Страницы (React)
     ↓
Application   →  Use Cases, Services (бизнес-логика)
     ↓
Domain        →  Entities, Interfaces, Типы
     ↓
Infrastructure →  API, LocalStorage, WebSocket
```

Бизнес-логика в центре **не знает** о UI и базах данных — легко тестировать и менять.

---

### 1.4 Atomic Design

Методология для UI-компонентов. Аналогия с химией:

| Уровень | Что это |
|---|---|
| **Atoms** | Кнопки, инпуты, иконки — нельзя разбить дальше |
| **Molecules** | Группы атомов: SearchBar (Input + Button) |
| **Organisms** | Сложные секции: Header (Logo + Nav + SearchBar) |
| **Templates** | Лейауты без реальных данных |
| **Pages** | Templates + реальные данные из store/API |

Часто комбинируется с FSD: atoms/molecules живут в `shared/ui`.

---

### 1.5 Next.js App Router

С Next.js 13+ — серверо-центричная архитектура. Компоненты по умолчанию **серверные** (Server Components).

**Специальные файлы:**

```
app/
├── layout.tsx      # Оборачивает страницы, сохраняется при навигации
├── page.tsx        # Страница (URL: /)
├── loading.tsx     # Suspense fallback пока грузится page
├── error.tsx       # Error Boundary для роута
├── not-found.tsx   # 404
├── (auth)/         # Route Group — не влияет на URL
│   └── login/page.tsx
├── dashboard/[id]/page.tsx   # Динамический сегмент
└── api/users/route.ts        # Route Handler (GET, POST...)
```

**Server vs Client Components:**

```tsx
// Server Component (default) — рендерится на сервере
// Нет: useState, useEffect, браузерных API
async function UserList() {
  const users = await db.query("SELECT * FROM users"); // прямой доступ к БД!
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}

// Client Component — нужна директива
"use client";
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

> **Правило:** держи `"use client"` как можно глубже в дереве. Оборачивай только то, что требует интерактивности.

---

### 1.6 Micro-Frontend

Разбиение на **независимо деплоящиеся модули**. Главный инструмент — Module Federation (Webpack 5).

```js
// host/webpack.config.js
new ModuleFederationPlugin({
  name: "host",
  remotes: {
    authApp: "authApp@http://localhost:3001/remoteEntry.js",
  },
});

// Использование:
const LoginForm = lazy(() => import("authApp/LoginForm"));
```

Когда использовать: несколько команд, независимые деплои. Минусы: сложность, дублирование зависимостей.

---

## II. AbortController

Web API для **отмены асинхронных операций**: fetch, кастомных промисов, EventListener.

### Базовое API

```ts
const controller = new AbortController();
const signal = controller.signal;

signal.aborted   // boolean — была ли отмена
signal.reason    // причина отмены

controller.abort();                        // отменить
controller.abort(new Error("Причина"));   // с причиной
```

### AbortController + fetch

```ts
const controller = new AbortController();

fetch("/api/users", { signal: controller.signal })
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => {
    if (err.name === "AbortError") return; // штатная отмена — не ошибка!
    console.error("Реальная ошибка:", err);
  });

controller.abort(); // отменяем запрос
```

### Паттерн в useEffect (самый важный)

Без AbortController возможен **race condition**: быстро меняешь `userId`, ответы приходят не в том порядке.

```tsx
useEffect(() => {
  const controller = new AbortController();

  fetch(`/api/users/${userId}`, { signal: controller.signal })
    .then(res => res.json())
    .then(setUser)
    .catch(err => {
      if (err.name !== "AbortError") setError(err);
    });

  // Cleanup: отменяет при смене userId или размонтировании
  return () => controller.abort();
}, [userId]);
```

### Дополнительно

```ts
// Встроенный таймаут — без создания контроллера
fetch("/api/data", { signal: AbortSignal.timeout(5000) });

// Отменить по первому из сигналов
fetch("/api/data", {
  signal: AbortSignal.any([controller.signal, AbortSignal.timeout(10000)]),
});
```

---

## III. Middleware

Функция/слой, которая **перехватывает** запрос/действие до конечного обработчика. Может изменить, прервать или пропустить дальше (`next()`).

```
Request → [Auth] → [RateLimit] → [Cache] → [Handler] → Response
```

### Next.js Middleware

Файл `middleware.ts` в корне проекта. Работает на **Edge Runtime** (до рендеринга страницы).

```ts
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  const response = NextResponse.next();
  response.headers.set("x-custom-header", "value");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|favicon.ico).*)"],
};
```

Возможности: аутентификация, редиректы/rewrite, A/B тесты, i18n, rate limiting, geo-routing.

> **Edge Runtime**: нет Node.js API (fs, crypto). Есть Web Crypto API, fetch, Request/Response.

---

### Redux Middleware

Перехватывает **actions** между `dispatch` и `reducer`.

```ts
// Сигнатура (каррированная функция)
const logger = (store) => (next) => (action) => {
  console.log("Dispatch:", action.type);
  const result = next(action); // передаём дальше
  console.log("New state:", store.getState());
  return result;
};
```

**Redux Thunk** (встроен в Redux Toolkit) — позволяет dispatch-ить функции:

```ts
const fetchUser = (id: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const user = await api.getUser(id);
      dispatch(setUser(user));
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

dispatch(fetchUser("123")); // dispatch принимает функцию — это thunk
```

**Redux Saga** — для сложной асинхронщины:

```ts
function* fetchUserSaga(action: PayloadAction<string>) {
  try {
    const user: User = yield call(api.getUser, action.payload);
    yield put(setUser(user));
  } catch (err) {
    yield put(setError(err.message));
  }
}

function* watchUsers() {
  yield takeLatest("users/fetchUser", fetchUserSaga); // отменяет предыдущий
}
```

---

### Axios Interceptors

Middleware для HTTP-клиента. Паттерн с автообновлением токена:

```ts
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true; // защита от бесконечного цикла
      const { data } = await axios.post("/auth/refresh");
      error.config.headers.Authorization = `Bearer ${data.token}`;
      return api.request(error.config); // повторяем исходный запрос
    }
    return Promise.reject(error);
  }
);
```

---

## IV. Нейминг файлов и расширений

### TypeScript расширения

| Расширение | Назначение |
|---|---|
| `.ts` | Обычный TypeScript: утилиты, сервисы, хуки, типы |
| `.tsx` | TypeScript с JSX — только для React-компонентов |
| `.d.ts` | Declaration file — только типы, без реализации |
| `.mts` / `.cts` | ESM и CommonJS модули для Node.js |

**`.d.ts` — типизация без реализации:**

```ts
// global.d.ts — глобальные декларации
declare module "*.svg" {
  const Component: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default Component;
}

declare global {
  interface Window {
    analytics: AnalyticsInstance;
  }
}
```

---

### .module.css / .module.scss — CSS Modules

Локальная область видимости стилей — webpack генерирует уникальные хеш-классы.

```tsx
// Button.module.css
.button { background: #3b82f6; }

// Button.tsx
import styles from "./Button.module.css";
// styles.button → "Button_button__xK3pQ"
<button className={styles.button}>Click</button>
```

**`.module.ts`** — не стандарт React/TypeScript. Встречается в:
- **Angular**: обязательный суффикс для `NgModule` (`AuthModule`, `AppModule`)
- Командные конвенции: обозначение "главного файла модуля"

---

### Тестовые расширения

| Расширение | Инструмент |
|---|---|
| `.test.ts` / `.test.tsx` | Jest (unit тесты) |
| `.spec.ts` / `.spec.tsx` | Jest / Jasmine |
| `.e2e.ts` | Playwright, Cypress |
| `.cy.ts` | Cypress |
| `.stories.tsx` | Storybook |

---

### Специальные файлы Next.js App Router

```
page.tsx          # Страница — обязательный default export
layout.tsx        # Layout — сохраняется при навигации
loading.tsx       # Suspense fallback
error.tsx         # Error Boundary
not-found.tsx     # 404
route.ts          # API Route Handler (GET, POST...)
template.tsx      # Как layout, но пересоздаётся при навигации
middleware.ts     # Middleware (в корне проекта, не в app/)
```

---

### Конвенции именования

```
kebab-case   →  user-profile.tsx, use-auth.ts   (рекомендует Next.js, FSD)
PascalCase   →  UserProfile.tsx, AuthModal.tsx   (компоненты React)
camelCase    →  useAuth.ts, formatDate.ts        (хуки, утилиты)
```

**Суффиксы для ясности:**

```
user.service.ts      # Сервис
user.store.ts        # Zustand / Jotai store
user.slice.ts        # Redux Toolkit slice
user.schema.ts       # Zod / Yup схема
user.types.ts        # Только типы
user.utils.ts        # Утилиты
user.constants.ts    # Константы
user.context.tsx     # React Context
user.mock.ts         # Mock-данные для тестов
```

---

### Barrel Exports (Public API Pattern)

`index.ts` — единая точка входа в модуль. Внутренняя структура скрыта.

```ts
// features/auth/index.ts
export { LoginForm } from "./ui/LoginForm";
export { useAuth } from "./model/useAuth";
export { authReducer } from "./model/authSlice";
export type { AuthUser } from "./model/types";
// Всё остальное — детали реализации, не экспортируются

// Использование:
import { LoginForm, useAuth } from "@/features/auth"; // чисто и коротко
```

> **Осторожно:** barrel файлы могут мешать tree-shaking. В Next.js App Router с серверными компонентами иногда лучше использовать прямые импорты.

---

*Frontend Interview Guide · Middle / Middle+ · 2026*