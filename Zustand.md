# Zustand
### Полная методичка — store, actions, middleware, паттерны, сравнения

---

## Что такое Zustand

Zustand — минималистичная библиотека управления состоянием для React. Название переводится с немецкого как «состояние».

**Ключевые особенности:**
- Нет провайдеров и оборачивания дерева (`Provider` не нужен)
- Подписка на конкретные части стора — ре-рендер только при изменении нужных данных
- Работает вне React (в сервисах, обработчиках событий)
- Минимум boilerplate по сравнению с Redux

```bash
npm install zustand
```

---

## Базовый store

```ts
// store/counter.store.ts
import { create } from "zustand";

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export const useCounterStore = create<CounterState>((set) => ({
  // State
  count: 0,

  // Actions
  increment: () => set(state => ({ count: state.count + 1 })),
  decrement: () => set(state => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));
```

```tsx
// Использование в компоненте
function Counter() {
  const count = useCounterStore(state => state.count);
  const increment = useCounterStore(state => state.increment);

  return <button onClick={increment}>{count}</button>;
}
```

---

## set и get

`set` — обновляет state. `get` — читает текущий state внутри actions.

```ts
export const useStore = create<State>((set, get) => ({
  count: 0,
  multiplier: 2,

  // set с функцией — получаем prevState
  increment: () => set(state => ({ count: state.count + 1 })),

  // set с объектом — shallow merge (остальные поля не трогаются)
  setCount: (n: number) => set({ count: n }),

  // get — читаем актуальный state внутри action
  doubleIncrement: () => {
    const { count, multiplier } = get();
    set({ count: count + multiplier });
  },

  // replace: true — полная замена state (не merge)
  clear: () => set({ count: 0, multiplier: 2 }, true),
}));
```

---

## Селекторы и оптимизация ре-рендеров

Главное правило: **подписывайся только на то, что используешь**.

```tsx
// ✅ Компонент ре-рендерится только при изменении count
const count = useStore(state => state.count);

// ❌ Компонент ре-рендерится при ЛЮБОМ изменении стора
const store = useStore();
```

### Несколько значений — useShallow

```tsx
import { useShallow } from "zustand/react/shallow";

// ❌ Без shallow — новый объект на каждый рендер → бесконечные ре-рендеры
const { count, name } = useStore(state => ({ count: state.count, name: state.name }));

// ✅ useShallow — shallow compare, ре-рендер только при реальном изменении
const { count, name } = useStore(
  useShallow(state => ({ count: state.count, name: state.name }))
);

// ✅ Альтернатива — отдельные подписки
const count = useStore(state => state.count);
const name = useStore(state => state.name);
```

---

## Async actions

Zustand не требует middleware для асинхронных actions — просто async/await.

```ts
interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  createUser: (data: CreateUserDto) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const users = await api.getUsers();
      set({ users, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  createUser: async (data) => {
    set({ loading: true });
    try {
      const newUser = await api.createUser(data);
      // Добавляем к существующим (иммутабельно)
      set(state => ({ users: [...state.users, newUser], loading: false }));
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },
}));
```

---

## Вложенный state (nested state)

Zustand делает shallow merge — вложенные объекты нужно обновлять вручную.

```ts
interface State {
  user: {
    name: string;
    settings: {
      theme: "light" | "dark";
      language: string;
    };
  };
  updateTheme: (theme: "light" | "dark") => void;
}

export const useStore = create<State>((set) => ({
  user: {
    name: "Alice",
    settings: { theme: "light", language: "ru" },
  },

  // ❌ Так не работает — перезапишет весь user
  // set({ user: { settings: { theme: "dark" } } })

  // ✅ Спред на каждом уровне
  updateTheme: (theme) =>
    set(state => ({
      user: {
        ...state.user,
        settings: { ...state.user.settings, theme },
      },
    })),
}));
```

### Решение — middleware Immer

```bash
npm install immer
```

```ts
import { immer } from "zustand/middleware/immer";

export const useStore = create<State>()(
  immer((set) => ({
    user: { name: "Alice", settings: { theme: "light", language: "ru" } },

    // Мутируем напрямую — Immer создаёт иммутабельную копию
    updateTheme: (theme) =>
      set(state => {
        state.user.settings.theme = theme; // выглядит как мутация, но безопасно
      }),
  }))
);
```

---

## Middleware

Middleware в Zustand оборачивают `create` и добавляют функциональность.

### devtools — Redux DevTools

```ts
import { devtools } from "zustand/middleware";

export const useStore = create<State>()(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set(state => ({ count: state.count + 1 }), false, "increment"),
      //                                                                   ↑ имя action для DevTools
    }),
    { name: "CounterStore" } // имя стора в DevTools
  )
);
```

### persist — сохранение в localStorage / sessionStorage

```ts
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: "auth-storage",           // ключ в localStorage
      storage: createJSONStorage(() => localStorage),
      // Сохранять только часть стора:
      partialize: (state) => ({ token: state.token }),
    }
  )
);
```

### Комбинирование middleware

```ts
import { devtools, persist, immer } from "zustand/middleware";
// immer из zustand/middleware/immer

export const useStore = create<State>()(
  devtools(
    persist(
      immer((set) => ({
        // ...
      })),
      { name: "my-store" }
    ),
    { name: "MyStore" }
  )
);
```

> **Порядок важен:** `devtools` — снаружи, `persist` — внутри devtools, `immer` — самый внутренний.

---

## Разделение стора на слайсы

Для больших сторов удобно разбивать логику на слайсы и объединять.

```ts
// store/slices/auth.slice.ts
import { StateCreator } from "zustand";

export interface AuthSlice {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const createAuthSlice: StateCreator<
  AuthSlice & CartSlice, // знает о соседних слайсах
  [],
  [],
  AuthSlice
> = (set) => ({
  token: null,
  login: (token) => set({ token }),
  logout: () => set({ token: null }),
});
```

```ts
// store/slices/cart.slice.ts
export interface CartSlice {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  clearCart: () => void;
}

export const createCartSlice: StateCreator<
  AuthSlice & CartSlice,
  [],
  [],
  CartSlice
> = (set) => ({
  items: [],
  addItem: (item) => set(state => ({ items: [...state.items, item] })),
  clearCart: () => set({ items: [] }),
});
```

```ts
// store/index.ts — объединяем слайсы
import { create } from "zustand";

export const useStore = create<AuthSlice & CartSlice>()((...args) => ({
  ...createAuthSlice(...args),
  ...createCartSlice(...args),
}));
```

---

## Доступ к стору вне компонентов

```ts
// Читать state снаружи React
const token = useAuthStore.getState().token;

// Вызывать actions снаружи React (в axios interceptors, утилитах)
useAuthStore.getState().logout();

// Подписка без React (например, в сервисах)
const unsub = useAuthStore.subscribe(
  (state) => state.token, // selector
  (token) => {            // callback при изменении
    if (!token) redirectToLogin();
  }
);

// Отписаться
unsub();
```

---

## Сброс стора

```ts
const initialState = {
  count: 0,
  user: null,
  loading: false,
};

export const useStore = create<State>((set) => ({
  ...initialState,

  // Сброс к начальному состоянию
  reset: () => set(initialState),
}));
```

---

## Подписка с subscribeWithSelector

Позволяет подписаться на изменение конкретного поля без React.

```ts
import { subscribeWithSelector } from "zustand/middleware";

export const useStore = create<State>()(
  subscribeWithSelector((set) => ({
    count: 0,
    increment: () => set(state => ({ count: state.count + 1 })),
  }))
);

// Подписка на конкретное поле
const unsub = useStore.subscribe(
  state => state.count,     // selector
  (count, prevCount) => {   // callback
    console.log(`count: ${prevCount} → ${count}`);
  },
  { equalityFn: (a, b) => a === b, fireImmediately: true }
);
```

---

## Паттерн: computed values (вычисляемые значения)

Zustand не имеет встроенных computed. Два подхода:

```ts
// Способ 1 — геттер внутри стора (пересчитывается при каждом обращении)
export const useStore = create<State>((set, get) => ({
  items: [],
  get total() {
    return get().items.reduce((sum, item) => sum + item.price, 0);
  },
}));

// Способ 2 — селектор в компоненте (рекомендуется)
const total = useCartStore(state =>
  state.items.reduce((sum, item) => sum + item.price, 0)
);

// Способ 3 — мемоизированный селектор (для дорогих вычислений)
import { useMemo } from "react";

function CartSummary() {
  const items = useCartStore(state => state.items);
  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price, 0),
    [items]
  );
  return <div>Итого: {total}</div>;
}
```

---

## Тестирование стора

```ts
// store/counter.test.ts
import { useCounterStore } from "./counter.store";

// Сбрасываем стор перед каждым тестом
beforeEach(() => {
  useCounterStore.setState({ count: 0 });
});

test("increment увеличивает count", () => {
  const { increment } = useCounterStore.getState();
  increment();
  expect(useCounterStore.getState().count).toBe(1);
});

test("reset сбрасывает count", () => {
  useCounterStore.setState({ count: 10 });
  useCounterStore.getState().reset();
  expect(useCounterStore.getState().count).toBe(0);
});

// Тест async action
test("fetchUsers загружает пользователей", async () => {
  vi.spyOn(api, "getUsers").mockResolvedValue([{ id: "1", name: "Alice" }]);

  await useUserStore.getState().fetchUsers();

  expect(useUserStore.getState().users).toHaveLength(1);
  expect(useUserStore.getState().loading).toBe(false);
});
```

---

## Zustand vs Redux Toolkit

| | Zustand | Redux Toolkit |
|---|---|---|
| Boilerplate | Минимальный | Средний (slice, action, selector) |
| Провайдер | Не нужен | `<Provider store={store}>` |
| DevTools | Через middleware | Встроен |
| Async | Просто async/await | `createAsyncThunk` |
| Middleware | Простое API | Мощная система |
| Вычисляемые значения | Ручные селекторы | `createSelector` (reselect) |
| TypeScript | Отличная поддержка | Отличная поддержка |
| Когда выбрать | Малые/средние проекты, простая логика | Большие команды, сложные зависимости |

---

## Частые ошибки

```tsx
// ❌ Подписка на весь стор — ре-рендер при любом изменении
const state = useStore(); // плохо

// ✅ Только нужное поле
const count = useStore(s => s.count);

// ❌ Инлайн-селектор с объектом без useShallow — всегда новая ссылка
const { a, b } = useStore(s => ({ a: s.a, b: s.b })); // бесконечный ре-рендер

// ✅ useShallow
const { a, b } = useStore(useShallow(s => ({ a: s.a, b: s.b })));

// ❌ Мутация state напрямую
set(state => { state.count = 5 }); // работает только с immer!

// ✅ Иммутабельно
set(state => ({ count: 5 }));

// ❌ Глубокий вложенный state без immer — много спредов
set(s => ({ a: { ...s.a, b: { ...s.a.b, c: 5 } } }));

// ✅ С immer — читаемо
set(s => { s.a.b.c = 5; });
```