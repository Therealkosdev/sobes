# State менеджеры в React - Полная методичка

## Оглавление
1. [Что такое State и зачем нужны менеджеры](#intro)
2. [Встроенные решения React](#react-native)
3. [Redux Toolkit](#redux)
4. [Zustand](#zustand)
5. [MobX](#mobx)
6. [Recoil](#recoil)
7. [Jotai](#jotai)
8. [Context API + useReducer](#context)
9. [Сравнение и выбор](#comparison)

---

<a name="intro"></a>
## 1. Что такое State и зачем нужны менеджеры

### Что такое State?

**State (состояние)** - это данные, которые меняются со временем и влияют на отображение UI. Например:
- Данные пользователя (имя, аватар)
- Содержимое корзины в интернет-магазине
- Состояние модального окна (открыто/закрыто)
- Список задач в todo-приложении
- Настройки темы (светлая/темная)

### Проблемы без State менеджера

```jsx
// ❌ Проблема: Prop Drilling
function App() {
  const [user, setUser] = useState(null);
  
  return <Layout user={user} setUser={setUser} />;
}

function Layout({ user, setUser }) {
  return <Header user={user} setUser={setUser} />;
}

function Header({ user, setUser }) {
  return <UserProfile user={user} setUser={setUser} />;
}

function UserProfile({ user, setUser }) {
  return <div>{user?.name}</div>;
}
// Пробрасываем props через 3 уровня!
```

**Проблемы:**
1. **Prop Drilling** - пробрасывание props через множество компонентов
2. **Дублирование** - один и тот же state в разных местах
3. **Сложность синхронизации** - изменения в одном месте не отражаются в другом
4. **Переиспользование** - сложно использовать логику в разных компонентах
5. **Производительность** - лишние ререндеры

### Зачем нужны State менеджеры?

State менеджеры решают эти проблемы:
- **Централизация** - единое хранилище данных
- **Доступность** - любой компонент может получить данные без prop drilling
- **Предсказуемость** - четкие правила изменения state
- **Debugging** - легче отследить, где и как менялись данные
- **Производительность** - оптимизация ререндеров

---

<a name="react-native"></a>
## 2. Встроенные решения React

### useState - локальный state

**Когда использовать:** для локального состояния компонента

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}
```

**Плюсы:**
- Простота
- Встроено в React
- Идеально для изолированного state

**Минусы:**
- Не подходит для глобального state
- Prop drilling при передаче в дочерние компоненты

### useReducer - сложная логика

**Когда использовать:** когда логика обновления state сложная

```jsx
const initialState = { count: 0, step: 1 };

function reducer(state, action) {
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
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <input 
        value={state.step} 
        onChange={(e) => dispatch({ 
          type: 'setStep', 
          payload: Number(e.target.value) 
        })}
      />
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </div>
  );
}
```

**Плюсы:**
- Предсказуемые обновления
- Логика в одном месте
- Легко тестировать

**Минусы:**
- Больше boilerplate кода
- Все еще локальный state

---

<a name="redux"></a>
## 3. Redux Toolkit

**Redux** - самый популярный state менеджер. **Redux Toolkit** - официальный современный способ использования Redux с меньшим количеством boilerplate.

### Концепция

```
Action → Dispatch → Reducer → Store → UI
         ↑                              ↓
         └──────────────────────────────┘
```

- **Store** - глобальное хранилище
- **Action** - объект с описанием что произошло
- **Reducer** - функция, которая обновляет state
- **Dispatch** - отправка action

### Установка

```bash
npm install @reduxjs/toolkit react-redux
```

### Базовый пример

```jsx
// store/counterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1; // Immer позволяет мутировать
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;

// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

// App.jsx
import { Provider } from 'react-redux';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
}

// Counter.jsx
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount } from './store/counterSlice';

function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
    </div>
  );
}
```

### Асинхронные действия (thunks)

```jsx
// store/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk
export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (userId) => {
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;

// Использование
function UserProfile({ userId }) {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.user);
  
  useEffect(() => {
    dispatch(fetchUser(userId));
  }, [userId]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>{data?.name}</div>;
}
```

### RTK Query - для API запросов

```jsx
// store/api.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => 'users',
    }),
    getUserById: builder.query({
      query: (id) => `users/${id}`,
    }),
    createUser: builder.mutation({
      query: (newUser) => ({
        url: 'users',
        method: 'POST',
        body: newUser,
      }),
    }),
  }),
});

export const { useGetUsersQuery, useGetUserByIdQuery, useCreateUserMutation } = api;

// Использование
function UsersList() {
  const { data, isLoading, error } = useGetUsersQuery();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  
  return (
    <ul>
      {data.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
```

**Плюсы Redux:**
- Предсказуемый state flow
- Отличный DevTools
- Огромная экосистема
- Подходит для больших приложений
- Time-travel debugging
- RTK Query упрощает работу с API

**Минусы:**
- Много boilerplate (даже с RTK)
- Крутая кривая обучения
- Может быть избыточен для маленьких проектов

**Когда использовать:**
- Большие приложения
- Сложная бизнес-логика
- Нужна предсказуемость
- Много асинхронных операций

---

<a name="zustand"></a>
## 4. Zustand

**Zustand** - минималистичный и быстрый state менеджер. Очень простой API.

### Установка

```bash
npm install zustand
```

### Базовый пример

```jsx
import { create } from 'zustand';

// Создание store
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

// Использование
function Counter() {
  const count = useStore((state) => state.count);
  const increment = useStore((state) => state.increment);
  const decrement = useStore((state) => state.decrement);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}
```

### Продвинутый пример

```jsx
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

// Store с middleware
const useUserStore = create(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        
        login: async (credentials) => {
          const response = await fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
          });
          const user = await response.json();
          set({ user, isAuthenticated: true });
        },
        
        logout: () => set({ user: null, isAuthenticated: false }),
        
        updateProfile: (updates) => set((state) => ({
          user: { ...state.user, ...updates }
        })),
      }),
      { name: 'user-storage' } // LocalStorage key
    )
  )
);

// Использование
function UserProfile() {
  const { user, updateProfile } = useUserStore();
  
  return (
    <div>
      <h1>{user?.name}</h1>
      <button onClick={() => updateProfile({ name: 'New Name' })}>
        Update Name
      </button>
    </div>
  );
}
```

### Селекторы для оптимизации

```jsx
// ❌ Плохо - подписка на весь store
function Counter() {
  const store = useStore();
  return <div>{store.count}</div>;
}

// ✅ Хорошо - подписка только на нужное
function Counter() {
  const count = useStore((state) => state.count);
  return <div>{count}</div>;
}

// ✅ Множественная подписка
function Counter() {
  const { count, increment } = useStore((state) => ({
    count: state.count,
    increment: state.increment,
  }));
  
  return (
    <div>
      <p>{count}</p>
      <button onClick={increment}>+</button>
    </div>
  );
}
```

### Слайсы (разделение store)

```jsx
const createUserSlice = (set) => ({
  user: null,
  setUser: (user) => set({ user }),
});

const createCartSlice = (set) => ({
  items: [],
  addItem: (item) => set((state) => ({ 
    items: [...state.items, item] 
  })),
});

const useStore = create((...args) => ({
  ...createUserSlice(...args),
  ...createCartSlice(...args),
}));
```

**Плюсы Zustand:**
- Очень простой API
- Минимум boilerplate
- Быстрый
- Не нужен Provider
- Middleware из коробки
- TypeScript поддержка

**Минусы:**
- Меньше экосистемы чем Redux
- Меньше готовых решений

**Когда использовать:**
- Средние и большие проекты
- Нужна простота
- Не нужна вся мощь Redux

---

<a name="mobx"></a>
## 5. MobX

**MobX** - реактивный state менеджер на основе наблюдаемых объектов (observables).

### Установка

```bash
npm install mobx mobx-react-lite
```

### Базовый пример

```jsx
import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react-lite';

// Store класс
class CounterStore {
  count = 0;
  
  constructor() {
    makeAutoObservable(this); // Делает все реактивным
  }
  
  increment() {
    this.count++;
  }
  
  decrement() {
    this.count--;
  }
  
  get doubleCount() {
    return this.count * 2;
  }
}

// Создание инстанса
const counterStore = new CounterStore();

// Компонент должен быть обернут в observer
const Counter = observer(() => {
  return (
    <div>
      <p>Count: {counterStore.count}</p>
      <p>Double: {counterStore.doubleCount}</p>
      <button onClick={() => counterStore.increment()}>+</button>
      <button onClick={() => counterStore.decrement()}>-</button>
    </div>
  );
});
```

### Продвинутый пример

```jsx
import { makeAutoObservable, runInAction } from 'mobx';

class UserStore {
  user = null;
  loading = false;
  error = null;
  
  constructor() {
    makeAutoObservable(this);
  }
  
  async fetchUser(userId) {
    this.loading = true;
    this.error = null;
    
    try {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      
      // runInAction для асинхронных обновлений
      runInAction(() => {
        this.user = data;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
        this.loading = false;
      });
    }
  }
  
  get userName() {
    return this.user?.name || 'Guest';
  }
  
  updateUser(updates) {
    this.user = { ...this.user, ...updates };
  }
}

const userStore = new UserStore();

const UserProfile = observer(({ userId }) => {
  useEffect(() => {
    userStore.fetchUser(userId);
  }, [userId]);
  
  if (userStore.loading) return <div>Loading...</div>;
  if (userStore.error) return <div>Error: {userStore.error}</div>;
  
  return <div>{userStore.userName}</div>;
});
```

### React Context для множественных stores

```jsx
import { createContext, useContext } from 'react';

class RootStore {
  constructor() {
    this.userStore = new UserStore();
    this.cartStore = new CartStore();
  }
}

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const store = new RootStore();
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be used within StoreProvider');
  return store;
};

// Использование
const UserProfile = observer(() => {
  const { userStore } = useStore();
  return <div>{userStore.userName}</div>;
});
```

**Плюсы MobX:**
- Очень простая работа с данными (как обычные объекты)
- Автоматическое отслеживание зависимостей
- Минимум boilerplate
- Computed values из коробки
- ООП подход

**Минусы:**
- "Магия" может быть непонятна новичкам
- Менее предсказуемо чем Redux
- Нужно помнить про observer

**Когда использовать:**
- Любите ООП
- Нужна простота
- Много вычисляемых значений

---

<a name="recoil"></a>
## 6. Recoil

**Recoil** - state менеджер от Facebook специально для React. Использует концепцию атомов.

### Установка

```bash
npm install recoil
```

### Базовый пример

```jsx
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

// Атом - единица state
const countState = atom({
  key: 'countState', // уникальный ключ
  default: 0,
});

function App() {
  return (
    <RecoilRoot>
      <Counter />
    </RecoilRoot>
  );
}

function Counter() {
  const [count, setCount] = useRecoilState(countState);
  
  // Или раздельно:
  // const count = useRecoilValue(countState);
  // const setCount = useSetRecoilState(countState);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  );
}
```

### Селекторы (computed values)

```jsx
import { atom, selector, useRecoilValue } from 'recoil';

const todosState = atom({
  key: 'todosState',
  default: [],
});

const filterState = atom({
  key: 'filterState',
  default: 'all',
});

// Селектор - вычисляемое значение
const filteredTodosState = selector({
  key: 'filteredTodosState',
  get: ({ get }) => {
    const todos = get(todosState);
    const filter = get(filterState);
    
    switch (filter) {
      case 'completed':
        return todos.filter(t => t.completed);
      case 'active':
        return todos.filter(t => !t.completed);
      default:
        return todos;
    }
  },
});

const todoStatsState = selector({
  key: 'todoStatsState',
  get: ({ get }) => {
    const todos = get(todosState);
    return {
      total: todos.length,
      completed: todos.filter(t => t.completed).length,
      active: todos.filter(t => !t.completed).length,
    };
  },
});

function TodoList() {
  const todos = useRecoilValue(filteredTodosState);
  const stats = useRecoilValue(todoStatsState);
  
  return (
    <div>
      <p>Total: {stats.total}, Active: {stats.active}</p>
      {todos.map(todo => <div key={todo.id}>{todo.text}</div>)}
    </div>
  );
}
```

### Асинхронные селекторы

```jsx
const userQuery = selector({
  key: 'userQuery',
  get: async ({ get }) => {
    const userId = get(currentUserIdState);
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
  },
});

function UserProfile() {
  const user = useRecoilValue(userQuery);
  // Автоматический Suspense!
  return <div>{user.name}</div>;
}

// С Suspense и ErrorBoundary
function App() {
  return (
    <RecoilRoot>
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <UserProfile />
        </Suspense>
      </ErrorBoundary>
    </RecoilRoot>
  );
}
```

### Atom Family - динамические атомы

```jsx
import { atomFamily } from 'recoil';

const todoItemState = atomFamily({
  key: 'todoItemState',
  default: (id) => ({
    id,
    text: '',
    completed: false,
  }),
});

function TodoItem({ id }) {
  const [todo, setTodo] = useRecoilState(todoItemState(id));
  
  return (
    <div>
      <input
        value={todo.text}
        onChange={(e) => setTodo({ ...todo, text: e.target.value })}
      />
    </div>
  );
}
```

**Плюсы Recoil:**
- Идеально интегрирован с React
- Suspense из коробки
- Атомарное обновление
- Легко делить state на части
- Встроенная работа с асинхронностью

**Минусы:**
- Относительно новый
- Меньше экосистемы
- API может измениться

**Когда использовать:**
- Используете Suspense
- Нужна атомарность
- Много асинхронных данных

---

<a name="jotai"></a>
## 7. Jotai

**Jotai** - минималистичный атомарный state менеджер, вдохновленный Recoil.

### Установка

```bash
npm install jotai
```

### Базовый пример

```jsx
import { atom, useAtom } from 'jotai';

// Атом
const countAtom = atom(0);

function Counter() {
  const [count, setCount] = useAtom(countAtom);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
}
```

### Производные атомы

```jsx
const todosAtom = atom([]);
const filterAtom = atom('all');

// Read-only derived atom
const filteredTodosAtom = atom((get) => {
  const todos = get(todosAtom);
  const filter = get(filterAtom);
  
  if (filter === 'completed') return todos.filter(t => t.completed);
  if (filter === 'active') return todos.filter(t => !t.completed);
  return todos;
});

// Read-write derived atom
const uppercaseAtom = atom(
  (get) => get(textAtom).toUpperCase(),
  (get, set, newValue) => set(textAtom, newValue)
);
```

### Асинхронность

```jsx
const userIdAtom = atom(1);

const userAtom = atom(async (get) => {
  const userId = get(userIdAtom);
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
});

function UserProfile() {
  const [user] = useAtom(userAtom);
  // Нужен Suspense!
  return <div>{user.name}</div>;
}
```

**Плюсы Jotai:**
- Очень простой
- Нет Provider (можно использовать)
- TypeScript first
- Маленький размер
- Bottom-up подход

**Минусы:**
- Молодая библиотека
- Меньше примеров и туториалов

**Когда использовать:**
- Нужна простота Zustand + атомы Recoil
- TypeScript проект
- Средние проекты

---

<a name="context"></a>
## 8. Context API + useReducer

Встроенное решение React для глобального state без библиотек.

### Базовый пример

```jsx
import { createContext, useContext, useReducer } from 'react';

// Reducer
const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

// Context
const CounterContext = createContext();

// Provider
export function CounterProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      {children}
    </CounterContext.Provider>
  );
}

// Hook
export function useCounter() {
  const context = useContext(CounterContext);
  if (!context) {
    throw new Error('useCounter must be used within CounterProvider');
  }
  return context;
}

// Использование
function Counter() {
  const { state, dispatch } = useCounter();
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </div>
  );
}

function App() {
  return (
    <CounterProvider>
      <Counter />
    </CounterProvider>
  );
}
```

### Продвинутый пример с действиями

```jsx
import { createContext, useContext, useReducer, useMemo } from 'react';

const UserContext = createContext();

const initialState = {
  user: null,
  loading: false,
  error: null,
};

function userReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, user: action.payload, loading: false };
    case 'FETCH_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'LOGOUT':
      return { ...state, user: null };
    default:
      return state;
  }
}

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState);
  
  // Мемоизируем действия
  const actions = useMemo(() => ({
    fetchUser: async (userId) => {
      dispatch({ type: 'FETCH_START' });
      try {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_ERROR', payload: error.message });
      }
    },
    logout: () => dispatch({ type: 'LOGOUT' }),
  }), []);
  
  const value = useMemo(() => ({ ...state, ...actions }), [state, actions]);
  
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
```

### Оптимизация - разделение контекстов

```jsx
// ❌ Плохо - один контекст для всего
const AppContext = createContext();
// При изменении любого поля - ререндер всех подписчиков

// ✅ Хорошо - разделить по доменам
const UserContext = createContext();
const CartContext = createContext();
const ThemeContext = createContext();

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <ThemeProvider>
          <MainApp />
        </ThemeProvider>
      </CartProvider>
    </UserProvider>
  );
}
```

**Плюсы Context + useReducer:**
- Встроено в React
- Не нужны дополнительные библиотеки
- Простая концепция
- Подходит для средних проектов

**Минусы:**
- Производительность (все подписчики ререндерятся)
- Много boilerplate для сложных случаев
- Нет DevTools
- Нужно вручную оптимизировать

**Когда использовать:**
- Небольшие и средние проекты
- Не хотите добавлять зависимости
- Простой state

---

<a name="comparison"></a>
## 9. Сравнение и выбор

### Таблица сравнения

| Критерий | Redux Toolkit | Zustand | MobX | Recoil | Jotai | Context |
|----------|--------------|---------|------|--------|-------|---------|
| **Размер** | ~15KB | ~3KB | ~16KB | ~14KB | ~3KB | 0KB |
| **Сложность** | Средняя | Низкая | Средняя | Средняя | Низкая | Низкая |
| **Boilerplate** | Средний | Минимум | Минимум | Минимум | Минимум | Средний |
| **DevTools** | ✅ Отличные | ✅ Есть | ✅ Есть | ✅ Есть | ⚠️ Базовые | ❌ |
| **TypeScript** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Производительность** | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| **Кривая обучения** | Высокая | Низкая | Средняя | Средняя | Низкая | Низкая |
| **Популярность** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

### Блок-схема выбора

```
Начало
  ↓
Размер проекта?
  ↓
├─ Маленький (1-5 компонентов) → useState / useReducer
│
├─ Средний (5-20 компонентов)
│   ↓
│   Нужны DevTools и экосистема?
│   ├─ Да → Redux Toolkit
│   └─ Нет → Zustand или Context API
│
└─ Большой (20+ компонентов)
    ↓
    Какой стиль предпочитаете?
    ├─ Функциональный, строгий → Redux Toolkit
    ├─ Простой, минималистичный → Zustand
    ├─ ООП, реактивный → MobX
    ├─ Атомарный → Recoil / Jotai
    └─ Без зависимостей → Context API
```

### Рекомендации по выбору

**Redux Toolkit - выбирайте если:**
- Большое enterprise приложение
- Нужна строгая предсказуемость
- Команда знакома с Redux
- Нужны мощные DevTools
- Много асинхронных операций
- Нужна time-travel отладка

**Zustand - выбирайте если:**
- Нужна простота
- Средний или большой проект
- Минимум boilerplate
- Быстрый старт
- Не нужна вся экосистема Redux

**MobX - выбирайте если:**
- Любите ООП подход
- Нужна простота работы с данными
- Много computed values
- Команда знакома с observable паттерном

**Recoil - выбирайте если:**
- Используете Suspense
- Нужна атомарность
- Много производных данных
- Асинхронный state
- Официальная поддержка от Facebook

**Jotai - выбирайте если:**
- Нравится концепция атомов
- Нужна простота
- TypeScript проект
- Bottom-up подход

**Context API - выбирайте если:**
- Маленький/средний проект
- Не хотите добавлять зависимости
- Простой state
- Готовы жертвовать производительностью

---

## 10. Практические паттерны

### Паттерн: Разделение по feature

```
src/
├── features/
│   ├── auth/
│   │   ├── authSlice.js (Redux)
│   │   ├── useAuth.js (hook)
│   │   └── components/
│   ├── cart/
│   │   ├── cartSlice.js
│   │   └── components/
│   └── products/
│       ├── productsSlice.js
│       └── components/
└── store/
    └── index.js
```

### Паттерн: Custom hooks для бизнес-логики

```jsx
// useAuth.js
import { useStore } from './store';

export function useAuth() {
  const user = useStore(state => state.user);
  const login = useStore(state => state.login);
  const logout = useStore(state => state.logout);
  
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  
  return {
    user,
    isAuthenticated,
    isAdmin,
    login,
    logout,
  };
}

// Использование
function Header() {
  const { isAuthenticated, logout } = useAuth();
  
  return (
    <header>
      {isAuthenticated && <button onClick={logout}>Logout</button>}
    </header>
  );
}
```

### Паттерн: Optimistic Updates

```jsx
// С Zustand
const useCartStore = create((set) => ({
  items: [],
  
  addItem: async (item) => {
    // Оптимистичное обновление
    set((state) => ({ 
      items: [...state.items, { ...item, id: 'temp-' + Date.now() }] 
    }));
    
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        body: JSON.stringify(item),
      });
      const savedItem = await response.json();
      
      // Замена временного на реальный
      set((state) => ({
        items: state.items.map(i => 
          i.id.startsWith('temp-') ? savedItem : i
        ),
      }));
    } catch (error) {
      // Откат при ошибке
      set((state) => ({
        items: state.items.filter(i => !i.id.startsWith('temp-')),
      }));
    }
  },
}));
```

### Паттерн: Normalized State (Redux)

```jsx
// ❌ Плохо - вложенные данные
const state = {
  posts: [
    {
      id: 1,
      title: 'Post 1',
      author: { id: 1, name: 'John' },
      comments: [
        { id: 1, text: 'Comment 1', author: { id: 2, name: 'Jane' } }
      ]
    }
  ]
};

// ✅ Хорошо - нормализованные данные
const state = {
  posts: {
    byId: {
      1: { id: 1, title: 'Post 1', authorId: 1, commentIds: [1] }
    },
    allIds: [1]
  },
  users: {
    byId: {
      1: { id: 1, name: 'John' },
      2: { id: 2, name: 'Jane' }
    },
    allIds: [1, 2]
  },
  comments: {
    byId: {
      1: { id: 1, text: 'Comment 1', authorId: 2 }
    },
    allIds: [1]
  }
};
```

### Паттерн: Middleware для логирования

```jsx
// Redux Toolkit
const logger = (store) => (next) => (action) => {
  console.log('dispatching', action);
  const result = next(action);
  console.log('next state', store.getState());
  return result;
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger),
});

// Zustand
const log = (config) => (set, get, api) =>
  config(
    (...args) => {
      console.log('  applying', args);
      set(...args);
      console.log('  new state', get());
    },
    get,
    api
  );

const useStore = create(log((set) => ({ /* ... */ })));
```

---

## 11. Типичные ошибки и как их избежать

### Ошибка 1: Мутация state напрямую

```jsx
// ❌ Плохо
const useStore = create((set) => ({
  user: { name: 'John', age: 30 },
  updateAge: (age) => set((state) => {
    state.user.age = age; // Мутация!
    return state;
  }),
}));

// ✅ Хорошо
const useStore = create((set) => ({
  user: { name: 'John', age: 30 },
  updateAge: (age) => set((state) => ({
    user: { ...state.user, age }
  })),
}));
```

### Ошибка 2: Слишком много подписок

```jsx
// ❌ Плохо - подписка на весь store
function Component() {
  const state = useStore(); // Ререндер при любом изменении!
  return <div>{state.count}</div>;
}

// ✅ Хорошо - подписка только на нужное
function Component() {
  const count = useStore(state => state.count);
  return <div>{count}</div>;
}
```

### Ошибка 3: Асинхронность без обработки ошибок

```jsx
// ❌ Плохо
const fetchUser = async (id) => {
  const data = await fetch(`/api/users/${id}`).then(r => r.json());
  set({ user: data });
};

// ✅ Хорошо
const fetchUser = async (id) => {
  set({ loading: true, error: null });
  try {
    const data = await fetch(`/api/users/${id}`).then(r => r.json());
    set({ user: data, loading: false });
  } catch (error) {
    set({ error: error.message, loading: false });
  }
};
```

### Ошибка 4: Создание store внутри компонента

```jsx
// ❌ Плохо - создается новый store при каждом рендере!
function App() {
  const store = create((set) => ({ count: 0 }));
  return <div />;
}

// ✅ Хорошо - store вне компонента
const useStore = create((set) => ({ count: 0 }));

function App() {
  return <div />;
}
```

---

## 12. Тестирование

### Redux Toolkit

```jsx
import { configureStore } from '@reduxjs/toolkit';
import counterReducer, { increment } from './counterSlice';

describe('counterSlice', () => {
  it('should handle increment', () => {
    const store = configureStore({ reducer: { counter: counterReducer } });
    
    store.dispatch(increment());
    
    expect(store.getState().counter.value).toBe(1);
  });
});
```

### Zustand

```jsx
import { renderHook, act } from '@testing-library/react';
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

describe('useStore', () => {
  it('should increment count', () => {
    const { result } = renderHook(() => useStore());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
});
```

---

## 13. Шпаргалка команд

### Redux Toolkit

```jsx
// Создание slice
const slice = createSlice({
  name: 'feature',
  initialState: {},
  reducers: {
    action: (state, action) => {}
  }
});

// Async thunk
const fetchData = createAsyncThunk('feature/fetch', async () => {});

// В компоненте
const data = useSelector(state => state.feature);
const dispatch = useDispatch();
dispatch(action());
```

### Zustand

```jsx
// Создание store
const useStore = create((set, get) => ({
  data: null,
  action: () => set({ data: 'new' })
}));

// В компоненте
const data = useStore(state => state.data);
const action = useStore(state => state.action);
```

### MobX

```jsx
// Store
class Store {
  data = null;
  constructor() { makeAutoObservable(this); }
  action() { this.data = 'new'; }
}

// В компоненте
const Component = observer(() => {
  return <div>{store.data}</div>;
});
```

### Recoil

```jsx
// Атом
const dataAtom = atom({ key: 'data', default: null });

// В компоненте
const [data, setData] = useRecoilState(dataAtom);
const data = useRecoilValue(dataAtom);
const setData = useSetRecoilState(dataAtom);
```

### Jotai

```jsx
// Атом
const dataAtom = atom(null);

// В компоненте
const [data, setData] = useAtom(dataAtom);
```

---

## 14. Заключение

### Мои рекомендации для собеседования:

1. **Знайте основы всех популярных**: Redux, Zustand, MobX, Recoil
2. **Понимайте концепции**: immutability, unidirectional data flow, reactive programming
3. **Умейте объяснить выбор**: почему выбрали конкретный менеджер для проекта
4. **Знайте паттерны**: normalized state, optimistic updates, middleware
5. **Понимайте производительность**: селекторы, мемоизация, подписки

### Что изучить в первую очередь:

1. **Context API + useReducer** - база React
2. **Redux Toolkit** - стандарт индустрии
3. **Zustand** - современная альтернатива

### Ресурсы для изучения:

- Redux: https://redux-toolkit.js.org/
- Zustand: https://github.com/pmndrs/zustand
- MobX: https://mobx.js.org/
- Recoil: https://recoiljs.org/
- Jotai: https://jotai.org/

---

**Удачи на собеседовании! 🚀**