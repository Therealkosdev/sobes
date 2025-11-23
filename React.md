# Полная методичка по React + TypeScript

## 1. Основы компонентов и TSX

### Создание компонента
```tsx
// Функциональный компонент с типизацией props
interface ButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean; // опциональный prop
}

const Button: React.FC<ButtonProps> = ({ text, onClick, disabled = false }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
};

// Альтернативный синтаксис (более популярный)
function Button({ text, onClick, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
}
```

### TSX синтаксис
```tsx
function Example() {
  const name = "Иван";
  const isLoggedIn = true;
  const items = ['Яблоко', 'Банан', 'Апельсин'];

  return (
    <div>
      {/* Вставка переменных */}
      <h1>Привет, {name}!</h1>
      
      {/* Условный рендеринг */}
      {isLoggedIn ? <p>Вы вошли</p> : <p>Войдите</p>}
      
      {/* Условный рендеринг с && */}
      {isLoggedIn && <button>Выйти</button>}
      
      {/* Рендеринг списков */}
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Что такое состояние (State)
State — это данные, которые принадлежат компоненту и могут меняться со временем. Когда вы обновляете state, React перерисовывает компонент, чтобы отобразить новые данные.

Примеры, где нужен state:

+ счётчик

+ модальное окно (открыто/закрыто)

+ текущий выбранный элемент

+ текст, который пользователь вводит в поле

+ флаг загрузки (loading)

+ список задач, товаров, сообщений

State существует только внутри компонента, если не вынесен наружу (например, в Context).
## Что такое хуки (Hooks)
Хуки — это специальные функции, которые позволяют:

+ использовать state (useState),

+ выполнять побочные эффекты (useEffect),

+ работать с рефами (useRef),

+ мемоизировать значения и функции (useMemo, useCallback),

+ работать с контекстом (useContext),

+ создавать собственные хуки.

`Хуки появились в React 16.8 и полностью заменили классовые компоненты в современном React.`

Важные правила хуков:

+ Хуки вызываются только на верхнем уровне компонента. Нельзя вызывать их в циклах, условиях, внутри функций.

+ Хуки вызываются только в React-компонентах или кастомных хуках. Нельзя вызывать в обычных функциях.

+ Порядок вызова хуков должен быть одинаковым в каждом рендере.
## 2. useState - управление состоянием
`useState` — самый базовый хук. Он позволяет компоненту хранить данные.

### Как работает useState:
```tsx
const [value, setValue] = useState(initialValue);
```
+ value — текущее значение.

+ setValue — функция для обновления.

Используйте setValue всегда, иначе React не узнает, что нужно обновить компонент.

<strong>Пример с типизацией `useState()`</strong>
```tsx
import { useState } from 'react';

function Counter() {
  // Базовое использование
  const [count, setCount] = useState<number>(0);
  
  // Состояние с объектом
  const [user, setUser] = useState<{name: string, age: number}>({
    name: 'Иван',
    age: 25
  });
  
  // Состояние с массивом
  const [items, setItems] = useState<string[]>([]);
  
  // Функции для изменения состояния
  const increment = () => {
    setCount(count + 1); // Простое обновление
  };
  
  const incrementByValue = (value: number) => {
    setCount(prev => prev + value); // Функциональное обновление
  };
  
  const updateUser = () => {
    setUser({ ...user, age: user.age + 1 }); // Обновление объекта
  };
  
  const addItem = (item: string) => {
    setItems([...items, item]); // Добавление в массив
  };
  
  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index)); // Удаление из массива
  };

  return (
    <div>
      <p>Счёт: {count}</p>
      <button onClick={increment}>+1</button>
      <button onClick={() => incrementByValue(5)}>+5</button>
    </div>
  );
}
```

### Правильное обновление state (важно!)
Если новое значение зависит от предыдущего — используйте функциональный сеттер:
```tsx
setCount(prev => prev + 1);
```
Почему лучше так:

+ React может объединять обновления,

+ Это уберегает от ошибок при асинхронности.



### Важные правила useState:
- **Не мутируйте** состояние напрямую: `count++` ❌, используйте `setCount(count + 1)` ✅
- Для объектов и массивов создавайте **новые копии** с изменениями
- Используйте функциональное обновление `setState(prev => ...)` когда новое значение зависит от старого

## 3. useEffect - побочные эффекты

```tsx
import { useState, useEffect } from 'react';

function DataFetcher() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  // Выполняется один раз при монтировании
  useEffect(() => {
    console.log('Компонент смонтирован');
    
    return () => {
      console.log('Компонент размонтирован (cleanup)');
    };
  }, []); // Пустой массив зависимостей

  // Выполняется при изменении count
  useEffect(() => {
    console.log('Count изменился:', count);
  }, [count]); // count в зависимостях

  // Загрузка данных
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://api.example.com/data');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Ошибка:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Таймер с очисткой
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Тик');
    }, 1000);

    return () => clearInterval(timer); // Cleanup function
  }, []);

  return <div>{loading ? 'Загрузка...' : 'Данные загружены'}</div>;
}
```

### Правила useEffect:
- **Без массива зависимостей**: выполняется после каждого рендера
- **Пустой массив `[]`**: выполняется только при монтировании
- **С зависимостями `[a, b]`**: выполняется при изменении `a` или `b`
- **Cleanup function**: возвращаемая функция выполняется при размонтировании или перед следующим эффектом

## 4. useRef - ссылки на DOM элементы и хранение значений

```tsx
import { useRef, useEffect } from 'react';

function FocusInput() {
  // Ссылка на DOM элемент
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Хранение значения, которое не вызывает ре-рендер
  const countRef = useRef<number>(0);
  
  useEffect(() => {
    // Автофокус при монтировании
    inputRef.current?.focus();
  }, []);
  
  const handleClick = () => {
    countRef.current += 1; // Изменение не вызывает ре-рендер
    console.log('Клики:', countRef.current);
    
    // Работа с DOM
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }
  };

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={handleClick}>Очистить</button>
    </div>
  );
}
```

## 5. useMemo - мемоизация вычислений

```tsx
import { useState, useMemo } from 'react';

function ExpensiveCalculation() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState<number[]>([1, 2, 3, 4, 5]);

  // Дорогое вычисление выполняется только при изменении items
  const sum = useMemo(() => {
    console.log('Вычисление суммы...');
    return items.reduce((acc, item) => acc + item, 0);
  }, [items]); // Пересчитывается только когда items изменяется

  // Без useMemo это вычисление выполнялось бы при каждом рендере
  const average = useMemo(() => {
    return sum / items.length;
  }, [sum, items.length]);

  return (
    <div>
      <p>Сумма: {sum}</p>
      <p>Среднее: {average}</p>
      <button onClick={() => setCount(count + 1)}>
        Ре-рендер (count: {count})
      </button>
    </div>
  );
}
```

### Когда использовать useMemo:
- ✅ Дорогие вычисления (сложные расчёты, фильтрация больших массивов)
- ✅ Предотвращение ненужных пересчётов
- ❌ Не используйте для простых операций (больше вреда, чем пользы)

## 6. useCallback - мемоизация функций

```tsx
import { useState, useCallback } from 'react';

interface ItemProps {
  id: number;
  onDelete: (id: number) => void;
}

// Дочерний компонент
const Item = React.memo(({ id, onDelete }: ItemProps) => {
  console.log('Item рендерится:', id);
  return <button onClick={() => onDelete(id)}>Удалить {id}</button>;
});

function TodoList() {
  const [items, setItems] = useState([1, 2, 3]);
  const [count, setCount] = useState(0);

  // БЕЗ useCallback - функция пересоздаётся каждый рендер
  // const handleDelete = (id: number) => {
  //   setItems(items.filter(item => item !== id));
  // };

  // С useCallback - функция создаётся один раз
  const handleDelete = useCallback((id: number) => {
    setItems(prev => prev.filter(item => item !== id));
  }, []); // Пустой массив, т.к. используем функциональное обновление

  return (
    <div>
      {items.map(item => (
        <Item key={item} id={item} onDelete={handleDelete} />
      ))}
      <button onClick={() => setCount(count + 1)}>
        Ре-рендер (count: {count})
      </button>
    </div>
  );
}
```

### Разница useMemo vs useCallback:
- `useMemo(() => value, deps)` - мемоизирует **результат вычисления**
- `useCallback((args) => {}, deps)` - мемоизирует **саму функцию**
- `useCallback(fn, deps)` = `useMemo(() => fn, deps)`

## 7. useContext - глобальное состояние

```tsx
import { createContext, useContext, useState, ReactNode } from 'react';

// Создание контекста
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Провайдер контекста
function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Хук для использования контекста
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme должен использоваться внутри ThemeProvider');
  }
  return context;
}

// Использование в компонентах
function Button() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button 
      style={{ background: theme === 'light' ? '#fff' : '#333' }}
      onClick={toggleTheme}
    >
      Тема: {theme}
    </button>
  );
}

// App
function App() {
  return (
    <ThemeProvider>
      <Button />
    </ThemeProvider>
  );
}
```

## 8. useReducer - сложное управление состоянием

```tsx
import { useReducer } from 'react';

// Типы для состояния и действий
interface State {
  count: number;
  history: number[];
}

type Action = 
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'incrementBy'; payload: number }
  | { type: 'reset' };

// Reducer функция
function counterReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return {
        count: state.count + 1,
        history: [...state.history, state.count + 1]
      };
    case 'decrement':
      return {
        count: state.count - 1,
        history: [...state.history, state.count - 1]
      };
    case 'incrementBy':
      return {
        count: state.count + action.payload,
        history: [...state.history, state.count + action.payload]
      };
    case 'reset':
      return { count: 0, history: [0] };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(counterReducer, {
    count: 0,
    history: [0]
  });

  return (
    <div>
      <p>Счёт: {state.count}</p>
      <p>История: {state.history.join(', ')}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+1</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-1</button>
      <button onClick={() => dispatch({ type: 'incrementBy', payload: 5 })}>+5</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Сброс</button>
    </div>
  );
}
```

## 9. Custom Hooks - создание собственных хуков

```tsx
import { useState, useEffect } from 'react';

// Хук для работы с localStorage
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Ошибка сохранения в localStorage:', error);
    }
  }, [key, value]);

  return [value, setValue] as const;
}

// Хук для загрузки данных
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) throw new Error('Ошибка загрузки');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

// Хук для debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Использование
function SearchComponent() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [savedData, setSavedData] = useLocalStorage('myData', { name: '' });

  useEffect(() => {
    if (debouncedSearch) {
      console.log('Поиск:', debouncedSearch);
      // Выполнить поиск
    }
  }, [debouncedSearch]);

  return (
    <div>
      <input 
        value={search} 
        onChange={(e) => setSearch(e.target.value)} 
        placeholder="Поиск..."
      />
      <p>Сохранённые данные: {savedData.name}</p>
    </div>
  );
}
```

## 10. Передача функций и обработка событий

```tsx
import { useState, ChangeEvent, FormEvent } from 'react';

function Form() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: 0
  });

  // Обработка изменения input
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Обработка submit
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Отправка формы:', formData);
  };

  // Функция с параметрами
  const handleClick = (id: number, message: string) => {
    console.log(`ID: ${id}, Сообщение: ${message}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Имя"
      />
      
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />

      {/* Передача функции с аргументами */}
      <button type="button" onClick={() => handleClick(1, 'Привет')}>
        Кнопка с параметрами
      </button>

      <button type="submit">Отправить</button>
    </form>
  );
}
```

## 11. React.memo - оптимизация компонентов

```tsx
import { memo } from 'react';

interface ChildProps {
  count: number;
  onIncrement: () => void;
}

// Компонент ре-рендерится только если props изменились
const Child = memo(({ count, onIncrement }: ChildProps) => {
  console.log('Child рендерится');
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={onIncrement}>Increment</button>
    </div>
  );
});

// С кастомной функцией сравнения
const ChildWithCustomCompare = memo(
  ({ count, onIncrement }: ChildProps) => {
    return <div>Count: {count}</div>;
  },
  (prevProps, nextProps) => {
    // Возвращаем true если props одинаковые (не нужен ре-рендер)
    return prevProps.count === nextProps.count;
  }
);
```

## 12. Типизация событий и общие типы

```tsx
import { 
  MouseEvent, 
  ChangeEvent, 
  FormEvent, 
  KeyboardEvent,
  FocusEvent 
} from 'react';

function EventsExample() {
  // Mouse events
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    console.log('Клик по кнопке', e.currentTarget);
  };

  // Input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log('Новое значение:', e.target.value);
  };

  // Form submit
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Форма отправлена');
  };

  // Keyboard events
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('Enter нажат');
    }
  };

  // Focus events
  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    console.log('Input получил фокус');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
      />
      <button onClick={handleClick}>Отправить</button>
    </form>
  );
}

// Общие полезные типы
type User = {
  id: number;
  name: string;
  email?: string; // опциональное поле
};

type Status = 'loading' | 'success' | 'error'; // Union type

interface ApiResponse<T> { // Generic type
  data: T;
  status: number;
  message: string;
}
```

## 13. Практические паттерны

### Compound Components Pattern
```tsx
interface TabsContextType {
  activeTab: number;
  setActiveTab: (index: number) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

function Tabs({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }: { children: ReactNode }) {
  return <div className="tab-list">{children}</div>;
}

function Tab({ index, children }: { index: number; children: ReactNode }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tab must be used within Tabs');
  
  return (
    <button 
      onClick={() => context.setActiveTab(index)}
      className={context.activeTab === index ? 'active' : ''}
    >
      {children}
    </button>
  );
}

function TabPanel({ index, children }: { index: number; children: ReactNode }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabPanel must be used within Tabs');
  
  return context.activeTab === index ? <div>{children}</div> : null;
}

// Использование
function App() {
  return (
    <Tabs>
      <TabList>
        <Tab index={0}>Вкладка 1</Tab>
        <Tab index={1}>Вкладка 2</Tab>
      </TabList>
      <TabPanel index={0}>Контент 1</TabPanel>
      <TabPanel index={1}>Контент 2</TabPanel>
    </Tabs>
  );
}
```

### Render Props Pattern
```tsx
interface MousePosition {
  x: number;
  y: number;
}

interface MouseTrackerProps {
  render: (position: MousePosition) => ReactNode;
}

function MouseTracker({ render }: MouseTrackerProps) {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return <>{render(position)}</>;
}

// Использование
function App() {
  return (
    <MouseTracker 
      render={({ x, y }) => (
        <div>Позиция мыши: {x}, {y}</div>
      )}
    />
  );
}
```

## Ключевые правила React:

1. **Правила хуков:**
   - Вызывайте только на верхнем уровне (не в циклах, условиях, вложенных функциях)
   - Вызывайте только в React функциях (компонентах или custom hooks)

2. **Иммутабельность:**
   - Никогда не изменяйте state напрямую
   - Создавайте новые объекты/массивы при обновлении

3. **Зависимости:**
   - Всегда указывайте все зависимости в useEffect, useMemo, useCallback
   - React предупредит о пропущенных зависимостях

4. **Оптимизация:**
   - Не оптимизируйте преждевременно
   - Используйте memo, useMemo, useCallback только когда есть проблемы с производительностью

5. **Ключи в списках:**
   - Используйте уникальные и стабильные ключи
   - Не используйте индекс массива как ключ (если порядок может меняться)