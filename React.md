# React - Полная методичка для собеседования с Live Coding

## 1. React Fundamentals - Основы

### 1.1 Компоненты

**Функциональные компоненты (современный подход):**
```jsx
// Базовый компонент
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// С деструктуризацией и default props
function Button({ label = 'Click', onClick, disabled = false }) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

// Arrow function компонент
const Card = ({ title, children }) => (
  <div className="card">
    <h2>{title}</h2>
    {children}
  </div>
);
```

**Классовые компоненты (legacy, но нужно знать):**
```jsx
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

### 1.2 JSX - Важные моменты

```jsx
// className вместо class
<div className="container">

// htmlFor вместо for
<label htmlFor="input-id">

// style как объект
<div style={{ color: 'red', fontSize: '16px' }}>

// Самозакрывающиеся теги
<img src="..." />
<input type="text" />

// Выражения в фигурных скобках
{user.name}
{isActive && <Component />}
{count > 0 ? <Yes /> : <No />}

// Комментарии
{/* Это комментарий */}

// Fragments
<>
  <Child1 />
  <Child2 />
</>
// или
<React.Fragment>
  <Child1 />
  <Child2 />
</React.Fragment>
```

### 1.3 Props

```jsx
// Передача props
<UserCard 
  name="John" 
  age={30} 
  isActive={true}
  hobbies={['reading', 'coding']}
  onClick={() => console.log('clicked')}
/>

// Получение props
function UserCard({ name, age, isActive, hobbies, onClick }) {
  return (
    <div onClick={onClick}>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      {isActive && <span>Active</span>}
      <ul>
        {hobbies.map((hobby, index) => (
          <li key={index}>{hobby}</li>
        ))}
      </ul>
    </div>
  );
}

// Props.children
function Container({ children }) {
  return <div className="container">{children}</div>;
}

// Использование
<Container>
  <h1>Title</h1>
  <p>Content</p>
</Container>

// Spread props
const props = { name: 'John', age: 30 };
<UserCard {...props} />

// Default props
function Button({ label = 'Click me', type = 'button' }) {
  return <button type={type}>{label}</button>;
}
```

### 1.4 State - useState

```jsx
import { useState } from 'react';

// Базовое использование
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  );
}

// Функциональное обновление (ВАЖНО для live coding!)
function Counter() {
  const [count, setCount] = useState(0);
  
  const increment = () => {
    // ❌ Неправильно при множественных обновлениях
    setCount(count + 1);
    
    // ✅ Правильно - использует предыдущее значение
    setCount(prev => prev + 1);
  };
  
  return <button onClick={increment}>{count}</button>;
}

// Multiple state
function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);
  
  return (
    <form>
      <input 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
      />
      <input 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="number"
        value={age} 
        onChange={(e) => setAge(Number(e.target.value))} 
      />
    </form>
  );
}

// Объект в state
function UserForm() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <form>
      <input 
        name="name"
        value={user.name} 
        onChange={handleChange} 
      />
      <input 
        name="email"
        value={user.email} 
        onChange={handleChange} 
      />
    </form>
  );
}

// Массив в state
function TodoList() {
  const [todos, setTodos] = useState([]);
  
  const addTodo = (text) => {
    setTodos(prev => [...prev, { id: Date.now(), text }]);
  };
  
  const removeTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };
  
  const toggleTodo = (id) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed }
        : todo
    ));
  };
  
  return (
    <div>
      {todos.map(todo => (
        <div key={todo.id}>
          <span style={{ 
            textDecoration: todo.completed ? 'line-through' : 'none' 
          }}>
            {todo.text}
          </span>
          <button onClick={() => toggleTodo(todo.id)}>Toggle</button>
          <button onClick={() => removeTodo(todo.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

// Lazy initialization (для дорогих вычислений)
function Component() {
  const [state, setState] = useState(() => {
    const initialState = expensiveComputation();
    return initialState;
  });
}
```

### 1.5 Events - События

```jsx
function EventExamples() {
  // Click events
  const handleClick = (e) => {
    e.preventDefault(); // предотвратить действие по умолчанию
    e.stopPropagation(); // остановить всплытие
    console.log('Clicked!');
  };
  
  // Input events
  const handleChange = (e) => {
    console.log(e.target.value);
  };
  
  // Form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log(Object.fromEntries(formData));
  };
  
  // Keyboard events
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      console.log('Enter pressed');
    }
    if (e.key === 'Escape') {
      console.log('Escape pressed');
    }
  };
  
  // Mouse events
  const handleMouseEnter = () => console.log('Mouse entered');
  const handleMouseLeave = () => console.log('Mouse left');
  
  // Focus events
  const handleFocus = () => console.log('Focused');
  const handleBlur = () => console.log('Blurred');
  
  return (
    <div>
      <button onClick={handleClick}>Click me</button>
      
      <input 
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      
      <form onSubmit={handleSubmit}>
        <input name="username" />
        <button type="submit">Submit</button>
      </form>
      
      <div 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Hover me
      </div>
    </div>
  );
}

// Передача параметров в обработчики
function ListWithHandlers() {
  const items = ['Item 1', 'Item 2', 'Item 3'];
  
  const handleItemClick = (item, index) => {
    console.log(`Clicked ${item} at index ${index}`);
  };
  
  return (
    <ul>
      {items.map((item, index) => (
        <li 
          key={index}
          onClick={() => handleItemClick(item, index)}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
```

## 2. React Hooks - Глубокое погружение

### 2.1 useEffect

```jsx
import { useState, useEffect } from 'react';

// Базовое использование
function Component() {
  const [count, setCount] = useState(0);
  
  // Выполняется после каждого рендера
  useEffect(() => {
    console.log('Component rendered');
  });
  
  // Выполняется один раз при монтировании
  useEffect(() => {
    console.log('Component mounted');
  }, []);
  
  // Выполняется при изменении зависимостей
  useEffect(() => {
    console.log('Count changed:', count);
  }, [count]);
  
  // С cleanup функцией
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Tick');
    }, 1000);
    
    return () => {
      clearInterval(timer); // cleanup
    };
  }, []);
  
  return <div>Count: {count}</div>;
}

// Fetch данных
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let cancelled = false; // флаг для отмены
    
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        
        if (!cancelled) {
          setUser(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    
    fetchUser();
    
    return () => {
      cancelled = true; // отменить при размонтировании
    };
  }, [userId]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>User: {user?.name}</div>;
}

// Event listeners
function WindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return <div>{size.width} x {size.height}</div>;
}

// Document title
function PageTitle({ title }) {
  useEffect(() => {
    document.title = title;
  }, [title]);
  
  return null;
}

// LocalStorage sync
function Counter() {
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem('count');
    return saved ? JSON.parse(saved) : 0;
  });
  
  useEffect(() => {
    localStorage.setItem('count', JSON.stringify(count));
  }, [count]);
  
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}
```

### 2.2 useRef

```jsx
import { useRef, useEffect } from 'react';

// Доступ к DOM элементам
function FocusInput() {
  const inputRef = useRef(null);
  
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  
  return <input ref={inputRef} />;
}

// Хранение предыдущего значения
function Counter() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef();
  
  useEffect(() => {
    prevCountRef.current = count;
  });
  
  const prevCount = prevCountRef.current;
  
  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCount}</p>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
}

// Избежание stale closures
function Timer() {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);
  
  useEffect(() => {
    countRef.current = count;
  });
  
  useEffect(() => {
    const timer = setInterval(() => {
      console.log(countRef.current); // всегда актуальное значение
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <button onClick={() => setCount(c => c + 1)}>
      {count}
    </button>
  );
}

// Измерение DOM элемента
function MeasureElement() {
  const divRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    if (divRef.current) {
      const { width, height } = divRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, []);
  
  return (
    <div>
      <div ref={divRef}>Content</div>
      <p>Width: {dimensions.width}, Height: {dimensions.height}</p>
    </div>
  );
}
```

### 2.3 useMemo и useCallback

```jsx
import { useState, useMemo, useCallback } from 'react';

// useMemo - мемоизация значений
function ExpensiveComponent({ items }) {
  // Без useMemo - вычисляется каждый рендер
  const total = items.reduce((sum, item) => sum + item.price, 0);
  
  // С useMemo - вычисляется только при изменении items
  const total = useMemo(() => {
    console.log('Calculating total...');
    return items.reduce((sum, item) => sum + item.price, 0);
  }, [items]);
  
  return <div>Total: {total}</div>;
}

// useCallback - мемоизация функций
function ParentComponent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  
  // Без useCallback - новая функция каждый рендер
  const increment = () => setCount(c => c + 1);
  
  // С useCallback - та же функция если зависимости не изменились
  const increment = useCallback(() => {
    setCount(c => c + 1);
  }, []);
  
  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <ChildComponent onIncrement={increment} />
    </div>
  );
}

// Child не ре-рендерится при изменении text в Parent
const ChildComponent = React.memo(({ onIncrement }) => {
  console.log('Child rendered');
  return <button onClick={onIncrement}>Increment</button>;
});

// Практический пример
function SearchableList({ items }) {
  const [query, setQuery] = useState('');
  
  // Фильтрация только при изменении items или query
  const filteredItems = useMemo(() => {
    console.log('Filtering items...');
    return items.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [items, query]);
  
  // Мемоизированный обработчик
  const handleSearch = useCallback((e) => {
    setQuery(e.target.value);
  }, []);
  
  return (
    <div>
      <input value={query} onChange={handleSearch} />
      {filteredItems.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

### 2.4 useReducer

```jsx
import { useReducer } from 'react';

// Простой пример
const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return initialState;
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}

// Сложный пример - форма
const formInitialState = {
  username: '',
  email: '',
  password: '',
  errors: {},
  isSubmitting: false
};

function formReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value,
        errors: { ...state.errors, [action.field]: null }
      };
    
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.errors,
        isSubmitting: false
      };
    
    case 'SUBMIT_START':
      return {
        ...state,
        isSubmitting: true,
        errors: {}
      };
    
    case 'SUBMIT_SUCCESS':
      return formInitialState;
    
    case 'SUBMIT_ERROR':
      return {
        ...state,
        isSubmitting: false,
        errors: { form: action.error }
      };
    
    default:
      return state;
  }
}

function RegistrationForm() {
  const [state, dispatch] = useReducer(formReducer, formInitialState);
  
  const handleChange = (e) => {
    dispatch({
      type: 'SET_FIELD',
      field: e.target.name,
      value: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: 'SUBMIT_START' });
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify({
          username: state.username,
          email: state.email,
          password: state.password
        })
      });
      
      if (response.ok) {
        dispatch({ type: 'SUBMIT_SUCCESS' });
      } else {
        const data = await response.json();
        dispatch({ type: 'SET_ERRORS', errors: data.errors });
      }
    } catch (error) {
      dispatch({ type: 'SUBMIT_ERROR', error: error.message });
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        value={state.username}
        onChange={handleChange}
      />
      {state.errors.username && <span>{state.errors.username}</span>}
      
      <input
        name="email"
        value={state.email}
        onChange={handleChange}
      />
      {state.errors.email && <span>{state.errors.email}</span>}
      
      <input
        type="password"
        name="password"
        value={state.password}
        onChange={handleChange}
      />
      {state.errors.password && <span>{state.errors.password}</span>}
      
      <button type="submit" disabled={state.isSubmitting}>
        {state.isSubmitting ? 'Submitting...' : 'Register'}
      </button>
      
      {state.errors.form && <div>{state.errors.form}</div>}
    </form>
  );
}
```

### 2.5 useContext

```jsx
import { createContext, useContext, useState } from 'react';

// Создание контекста
const ThemeContext = createContext();

// Provider компонент
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  const value = {
    theme,
    toggleTheme
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook для использования контекста
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Использование
function App() {
  return (
    <ThemeProvider>
      <Header />
      <Main />
    </ThemeProvider>
  );
}

function Header() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header style={{ background: theme === 'light' ? '#fff' : '#333' }}>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </header>
  );
}

// Множественные контексты
const UserContext = createContext();
const SettingsContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({});
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <SettingsContext.Provider value={{ settings, setSettings }}>
        <MainApp />
      </SettingsContext.Provider>
    </UserContext.Provider>
  );
}

// Составной контекст (распространенный паттерн)
const AppContext = createContext();

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState([]);
  
  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);
  
  const addNotification = (notification) => {
    setNotifications(prev => [...prev, notification]);
  };
  
  const value = {
    user,
    theme,
    notifications,
    login,
    logout,
    setTheme,
    addNotification
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
```

### 2.6 Custom Hooks

```jsx
// useFetch - универсальный хук для запросов
function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let cancelled = false;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url, options);
        const json = await response.json();
        
        if (!cancelled) {
          setData(json);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    
    fetchData();
    
    return () => {
      cancelled = true;
    };
  }, [url]);
  
  return { data, loading, error };
}

// Использование
function UserProfile({ userId }) {
  const { data: user, loading, error } = useFetch(`/api/users/${userId}`);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>{user.name}</div>;
}

// useLocalStorage - синхронизация с localStorage
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });
  
  const setStoredValue = (newValue) => {
    try {
      const valueToStore = newValue instanceof Function 
        ? newValue(value) 
        : newValue;
      
      setValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };
  
  return [value, setStoredValue];
}

// Использование
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  
  return (
    <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  );
}

// useDebounce - задержка обновления значения
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

// Использование
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  useEffect(() => {
    if (debouncedSearchTerm) {
      // Выполнить поиск
      console.log('Searching for:', debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);
  
  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}

// useToggle - переключатель
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => {
    setValue(v => !v);
  }, []);
  
  return [value, toggle, setValue];
}

// Использование
function Modal() {
  const [isOpen, toggleOpen] = useToggle(false);
  
  return (
    <div>
      <button onClick={toggleOpen}>Open Modal</button>
      {isOpen && (
        <div className="modal">
          <button onClick={toggleOpen}>Close</button>
        </div>
      )}
    </div>
  );
}

// useOnClickOutside - клик вне элемента
function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

// Использование
function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();
  
  useOnClickOutside(ref, () => setIsOpen(false));
  
  return (
    <div ref={ref}>
      <button onClick={() => setIsOpen(true)}>Open</button>
      {isOpen && <div>Dropdown content</div>}
    </div>
  );
}

// usePrevious - предыдущее значение
function usePrevious(value) {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
}

// useWindowSize - размер окна
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return windowSize;
}
```

## 3. Lists & Keys - Списки и ключи

```jsx
// Базовый список
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}

// ❌ НЕПРАВИЛЬНО - использование индекса как ключа
{items.map((item, index) => (
  <div key={index}>{item}</div>
))}

// ✅ ПРАВИЛЬНО - уникальный ID
{items.map(item => (
  <div key={item.id}>{item.name}</div>
))}

// Список с обработчиками
function ProductList({ products, onDelete }) {
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
          <button onClick={() => onDelete(product.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

// Вложенные списки
function Categories({ categories }) {
  return (
    <div>
      {categories.map(category => (
        <div key={category.id}>
          <h2>{category.name}</h2>
          <ul>
            {category.items.map(item => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// Условный рендеринг в списках
function UserList({ users }) {
  return (
    <div>
      {users.map(user => (
        user.isActive && (
          <div key={user.id}>
            {user.name}
            {user.isPremium && <span>⭐</span>}
          </div>
        )
      ))}
    </div>
  );
}
```

## 4. Формы - Полный гайд

### 4.1 Контролируемые компоненты

```jsx
// Простая форма
function SimpleForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, email });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <button type="submit">Submit</button>
    </form>
  );
}

// Форма с объектом state
function RegistrationForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    country: '',
    terms: false
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
      />
      
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
      />
      
      <input
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm Password"
      />
      
      <input
        name="age"
        type="number"
        value={formData.age}
        onChange={handleChange}
        placeholder="Age"
      />
      
      <select name="country" value={formData.country} onChange={handleChange}>
        <option value="">Select Country</option>
        <option value="us">USA</option>
        <option value="uk">UK</option>
        <option value="ca">Canada</option>
      </select>
      
      <label>
        <input
          name="terms"
          type="checkbox"
          checked={formData.terms}
          onChange={handleChange}
        />
        Accept Terms
      </label>
      
      <button type="submit">Register</button>
    </form>
  );
}

// Форма с валидацией
function FormWithValidation() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const validate = (name, value) => {
    switch (name) {
      case 'email':
        if (!value) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
        return '';
      
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';
      
      default:
        return '';
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    const error = validate(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };
  
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validate(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(Object.keys(formData).reduce((acc, key) => ({
        ...acc,
        [key]: true
      }), {}));
      return;
    }
    
    console.log('Form submitted:', formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Email"
        />
        {touched.email && errors.email && (
          <span className="error">{errors.email}</span>
        )}
      </div>
      
      <div>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Password"
        />
        {touched.password && errors.password && (
          <span className="error">{errors.password}</span>
        )}
      </div>
      
      <button 
        type="submit"
        disabled={Object.keys(errors).some(key => errors[key])}
      >
        Submit
      </button>
    </form>
  );
}

// Multiple choice (radio buttons)
function SurveyForm() {
  const [answer, setAnswer] = useState('');
  
  return (
    <form>
      <label>
        <input
          type="radio"
          value="option1"
          checked={answer === 'option1'}
          onChange={(e) => setAnswer(e.target.value)}
        />
        Option 1
      </label>
      
      <label>
        <input
          type="radio"
          value="option2"
          checked={answer === 'option2'}
          onChange={(e) => setAnswer(e.target.value)}
        />
        Option 2
      </label>
    </form>
  );
}

// Multiple select
function MultiSelectForm() {
  const [selectedOptions, setSelectedOptions] = useState([]);
  
  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedOptions(prev => 
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };
  
  return (
    <div>
      {['option1', 'option2', 'option3'].map(option => (
        <label key={option}>
          <input
            type="checkbox"
            value={option}
            checked={selectedOptions.includes(option)}
            onChange={handleChange}
          />
          {option}
        </label>
      ))}
    </div>
  );
}

// File upload
function FileUploadForm() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*"
      />
      {preview && <img src={preview} alt="Preview" width="200" />}
      <button type="submit" disabled={!file}>Upload</button>
    </form>
  );
}
```

### 4.2 Неконтролируемые компоненты

```jsx
function UncontrolledForm() {
  const nameRef = useRef();
  const emailRef = useRef();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      name: nameRef.current.value,
      email: emailRef.current.value
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input ref={nameRef} defaultValue="John" />
      <input ref={emailRef} type="email" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

## 5. Conditional Rendering - Условный рендеринг

```jsx
// If-Else с переменной
function Greeting({ isLoggedIn }) {
  let content;
  if (isLoggedIn) {
    content = <UserGreeting />;
  } else {
    content = <GuestGreeting />;
  }
  return <div>{content}</div>;
}

// Тернарный оператор
function Greeting({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? <UserGreeting /> : <GuestGreeting />}
    </div>
  );
}

// Логическое И (&&)
function Mailbox({ unreadMessages }) {
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 && (
        <h2>You have {unreadMessages.length} unread messages.</h2>
      )}
    </div>
  );
}

// Логическое ИЛИ (||)
function Username({ username }) {
  return <div>{username || 'Guest'}</div>;
}

// Nullish coalescing (??)
function UserAge({ age }) {
  return <div>Age: {age ?? 'Not specified'}</div>;
}

// Switch statement
function NotificationIcon({ type }) {
  let icon;
  switch (type) {
    case 'success':
      icon = '✅';
      break;
    case 'error':
      icon = '❌';
      break;
    case 'warning':
      icon = '⚠️';
      break;
    default:
      icon = 'ℹ️';
  }
  return <span>{icon}</span>;
}

// Объект для маппинга
function NotificationIcon({ type }) {
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  return <span>{icons[type] || icons.info}</span>;
}

// Early return
function UserProfile({ user }) {
  if (!user) {
    return <div>Please log in</div>;
  }
  
  if (!user.isActive) {
    return <div>Account is inactive</div>;
  }
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

// Множественные условия
function ProductCard({ product, user }) {
  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      
      {user && user.isPremium && product.discount && (
        <span>Discount: {product.discount}%</span>
      )}
      
      {product.inStock ? (
        <button>Add to Cart</button>
      ) : (
        <span>Out of Stock</span>
      )}
    </div>
  );
}

// Render nothing
function ConditionalComponent({ shouldRender }) {
  if (!shouldRender) {
    return null;
  }
  
  return <div>Content</div>;
}
```

## 6. Lifting State Up - Поднятие состояния

```jsx
// Проблема: два компонента должны синхронизировать состояние
// Решение: поднять state до общего родителя

// ❌ Плохо - состояние дублируется
function BadExample() {
  return (
    <div>
      <TemperatureInput scale="c" />
      <TemperatureInput scale="f" />
    </div>
  );
}

function TemperatureInput({ scale }) {
  const [temperature, setTemperature] = useState('');
  // Каждый компонент имеет свое состояние - не синхронизировано!
  
  return (
    <input
      value={temperature}
      onChange={(e) => setTemperature(e.target.value)}
    />
  );
}

// ✅ Хорошо - состояние в родителе
function GoodExample() {
  const [temperature, setTemperature] = useState('');
  const [scale, setScale] = useState('c');
  
  const handleCelsiusChange = (temp) => {
    setScale('c');
    setTemperature(temp);
  };
  
  const handleFahrenheitChange = (temp) => {
    setScale('f');
    setTemperature(temp);
  };
  
  const celsius = scale === 'f' 
    ? tryConvert(temperature, toCelsius)
    : temperature;
    
  const fahrenheit = scale === 'c'
    ? tryConvert(temperature, toFahrenheit)
    : temperature;
  
  return (
    <div>
      <TemperatureInput
        scale="c"
        temperature={celsius}
        onTemperatureChange={handleCelsiusChange}
      />
      <TemperatureInput
        scale="f"
        temperature={fahrenheit}
        onTemperatureChange={handleFahrenheitChange}
      />
      <BoilingVerdict celsius={parseFloat(celsius)} />
    </div>
  );
}

function TemperatureInput({ scale, temperature, onTemperatureChange }) {
  return (
    <fieldset>
      <legend>Enter temperature in {scaleNames[scale]}:</legend>
      <input
        value={temperature}
        onChange={(e) => onTemperatureChange(e.target.value)}
      />
    </fieldset>
  );
}

// Практический пример - Todo List
function TodoApp() {
  const [todos, setTodos] = useState([]);
  
  const addTodo = (text) => {
    setTodos(prev => [...prev, {
      id: Date.now(),
      text,
      completed: false
    }]);
  };
  
  const toggleTodo = (id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };
  
  return (
    <div>
      <TodoInput onAdd={addTodo} />
      <TodoList
        todos={todos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
    </div>
  );
}

function TodoInput({ onAdd }) {
  const [text, setText] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text);
      setText('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add todo..."
      />
      <button type="submit">Add</button>
    </form>
  );
}

function TodoList({ todos, onToggle, onDelete }) {
  return (
    <ul>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span style={{
        textDecoration: todo.completed ? 'line-through' : 'none'
      }}>
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </li>
  );
}
```

## 7. Composition - Композиция компонентов

```jsx
// Children prop
function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

// Использование
<Card>
  <h2>Title</h2>
  <p>Content</p>
</Card>

// Multiple slots
function Dialog({ title, content, actions }) {
  return (
    <div className="dialog">
      <div className="dialog-title">{title}</div>
      <div className="dialog-content">{content}</div>
      <div className="dialog-actions">{actions}</div>
    </div>
  );
}

// Использование
<Dialog
  title={<h2>Confirm</h2>}
  content={<p>Are you sure?</p>}
  actions={
    <>
      <button>Cancel</button>
      <button>Confirm</button>
    </>
  }
/>

// Render props pattern
function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return render(position);
}

// Использование
<MouseTracker
  render={({ x, y }) => (
    <div>Mouse position: {x}, {y}</div>
  )}
/>

// Compound Components pattern
function Tabs({ children }) {
  const [activeIndex, setActiveIndex] = useState(0);
  
  return (
    <div className="tabs">
      {React.Children.map(children, (child, index) => {
        return React.cloneElement(child, {
          isActive: index === activeIndex,
          onActivate: () => setActiveIndex(index)
        });
      })}
    </div>
  );
}

function Tab({ isActive, onActivate, label, children }) {
  return (
    <div>
      <button
        className={isActive ? 'active' : ''}
        onClick={onActivate}
      >
        {label}
      </button>
      {isActive && <div>{children}</div>}
    </div>
  );
}

// Использование
<Tabs>
  <Tab label="Tab 1">Content 1</Tab>
  <Tab label="Tab 2">Content 2</Tab>
  <Tab label="Tab 3">Content 3</Tab>
</Tabs>

// HOC (Higher-Order Component)
function withLoading(Component) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    return <Component {...props} />;
  };
}

// Использование
const UserListWithLoading = withLoading(UserList);

<UserListWithLoading
  isLoading={loading}
  users={users}
/>
```

## 8. Performance Optimization - Оптимизация

### 8.1 React.memo

```jsx
// Без оптимизации - ре-рендерится при каждом рендере родителя
function ExpensiveComponent({ data }) {
  console.log('Rendering ExpensiveComponent');
  return <div>{data}</div>;
}

// С React.memo - ре-рендерится только при изменении props
const ExpensiveComponent = React.memo(function ExpensiveComponent({ data }) {
  console.log('Rendering ExpensiveComponent');
  return <div>{data}</div>;
});

// С кастомным сравнением
const ExpensiveComponent = React.memo(
  function ExpensiveComponent({ user }) {
    return <div>{user.name}</div>;
  },
  (prevProps, nextProps) => {
    // Вернуть true если props равны (НЕ ре-рендерить)
    return prevProps.user.id === nextProps.user.id;
  }
);

// Практический пример
function ParentComponent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  
  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      
      {/* Не ре-рендерится при изменении text */}
      <ExpensiveChild data="static data" />
    </div>
  );
}

const ExpensiveChild = React.memo(({ data }) => {
  console.log('Child rendered');
  return <div>{data}</div>;
});
```

### 8.2 useMemo для дорогих вычислений

```jsx
function ProductList({ products, searchTerm }) {
  // ❌ Плохо - фильтрация при каждом рендере
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // ✅ Хорошо - фильтрация только при изменении зависимостей
  const filteredProducts = useMemo(() => {
    console.log('Filtering products...');
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);
  
  return (
    <ul>
      {filteredProducts.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}

// Сложные вычисления
function DataAnalytics({ data }) {
  const statistics = useMemo(() => {
    console.log('Calculating statistics...');
    
    const sum = data.reduce((acc, val) => acc + val, 0);
    const avg = sum / data.length;
    const max = Math.max(...data);
    const min = Math.min(...data);
    
    return { sum, avg, max, min };
  }, [data]);
  
  return (
    <div>
      <p>Sum: {statistics.sum}</p>
      <p>Average: {statistics.avg}</p>
      <p>Max: {statistics.max}</p>
      <p>Min: {statistics.min}</p>
    </div>
  );
}
```

### 8.3 useCallback для функций

```jsx
function ParentComponent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  
  // ❌ Плохо - новая функция при каждом рендере
  const handleClick = () => {
    console.log('Clicked');
  };
  
  // ✅ Хорошо - та же функция если зависимости не изменились
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []);
  
  const incrementCount = useCallback(() => {
    setCount(c => c + 1);
  }, []);
  
  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <MemoizedChild onClick={incrementCount} />
    </div>
  );
}

const MemoizedChild = React.memo(({ onClick }) => {
  console.log('Child rendered');
  return <button onClick={onClick}>Increment</button>;
});
```

### 8.4 Code Splitting и Lazy Loading

```jsx
import { lazy, Suspense } from 'react';

// Lazy loading компонента
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <HeavyComponent />
      </Suspense>
    </div>
  );
}

// Route-based code splitting
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

// Lazy loading с условием
function ConditionalLazyLoad() {
  const [showHeavy, setShowHeavy] = useState(false);
  
  return (
    <div>
      <button onClick={() => setShowHeavy(true)}>
        Load Heavy Component
      </button>
      
      {showHeavy && (
        <Suspense fallback={<div>Loading...</div>}>
          <HeavyComponent />
        </Suspense>
      )}
    </div>
  );
}
```

### 8.5 Virtualization - Виртуализация длинных списков

```jsx
// Используя react-window
import { FixedSizeList } from 'react-window';

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  );
  
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={35}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}

// Используя react-virtualized
import { List } from 'react-virtualized';

function VirtualizedList({ items }) {
  const rowRenderer = ({ key, index, style }) => (
    <div key={key} style={style}>
      {items[index].name}
    </div>
  );
  
  return (
    <List
      width={300}
      height={600}
      rowCount={items.length}
      rowHeight={35}
      rowRenderer={rowRenderer}
    />
  );
}
```

## 9. Error Boundaries - Обработка ошибок

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
    // Отправить в сервис логирования
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong</h1>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Использование
function App() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}

// Множественные Error Boundaries
function App() {
  return (
    <div>
      <ErrorBoundary fallback={<div>Navigation Error</div>}>
        <Navigation />
      </ErrorBoundary>
      
      <ErrorBoundary fallback={<div>Content Error</div>}>
        <MainContent />
      </ErrorBoundary>
      
      <ErrorBoundary fallback={<div>Sidebar Error</div>}>
        <Sidebar />
      </ErrorBoundary>
    </div>
  );
}
```

## 10. Портал - Portals

```jsx
import { createPortal } from 'react-dom';
// Modal компонент
function Modal({ isOpen, onClose, children }) {
if (!isOpen) return null;
return createPortal(
<div className="modal-overlay" onClick={onClose}>
<div className="modal-content" onClick={(e) => e.stopPropagation()}>
<button onClick={onClose}>×</button>
{children}
</div>
</div>,
document.getElementById('modal-root')
);
}
// Использование
function App() {
const [isOpen, setIsOpen] = useState(false);
return (
<div>
<button onClick={() => setIsOpen(true)}>Open Modal</button>
  <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
    <h2>Modal Title</h2>
    <p>Modal content</p>
  </Modal>
</div>
);
}
// Tooltip с порталом
function Tooltip({ text, children }) {
const [show, setShow] = useState(false);
const [position, setPosition] = useState({ x: 0, y: 0 });
const ref = useRef();
const handleMouseEnter = (e) => {
const rect = e.currentTarget.getBoundingClientRect();
setPosition({ x: rect.left, y: rect.top - 30 });
setShow(true);
};
return (
<>
<span
ref={ref}
onMouseEnter={handleMouseEnter}
onMouseLeave={() => setShow(false)}
>
{children}
</span>
  {show && createPortal(
    <div
      className="tooltip"
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y
      }}
    >
      {text}
    </div>,
    document.body
  )}
</>
);
}

## 11. React Router - Маршрутизация
```jsx
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Link, 
  useNavigate,
  useParams,
  useLocation,
  Navigate,
  Outlet
} from 'react-router-dom';

// Базовая настройка
function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/users">Users</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

// useParams - получение параметров URL
function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [id]);
  
  if (!user) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

// useNavigate - программная навигация
function LoginForm() {
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // ... login logic
    navigate('/dashboard');
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}

// useLocation - текущий URL
function Analytics() {
  const location = useLocation();
  
  useEffect(() => {
    // Отправить аналитику
    console.log('Page view:', location.pathname);
  }, [location]);
  
  return null;
}

// Вложенные роуты
function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <nav>
        <Link to="profile">Profile</Link>
        <Link to="settings">Settings</Link>
      </nav>
      
      <Outlet /> {/* Здесь рендерятся дочерние роуты */}
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />}>
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

// Protected routes
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

// Query parameters
function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const handleSearch = (newQuery) => {
    setSearchParams({ q: newQuery });
  };
  
  return (
    <div>
      <input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <Results query={query} />
    </div>
  );
}
```

## 12. Context API - Управление состоянием
```jsx
// Аутентификация с Context
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Проверить сохраненную сессию
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token)
        .then(setUser)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);
  
  const login = async (credentials) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    const data = await response.json();
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  
  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Использование
function Profile() {
  const { user, logout } = useAuth();
  
  return (
    <div>
      <h1>{user.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

// Theme Context
const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Комбинированный Provider
function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

function App() {
  return (
    <AppProviders>
      <Router>
        <Routes>...</Routes>
      </Router>
    </AppProviders>
  );
}
```

## 13. LIVE CODING ЗАДАЧИ - Практика

### Задача 1: Counter с историей
```jsx
function CounterWithHistory() {
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState([0]);
  
  const increment = () => {
    setCount(prev => {
      const newCount = prev + 1;
      setHistory(h => [...h, newCount]);
      return newCount;
    });
  };
  
  const decrement = () => {
    setCount(prev => {
      const newCount = prev - 1;
      setHistory(h => [...h, newCount]);
      return newCount;
    });
  };
  
  const undo = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      setCount(newHistory[newHistory.length - 1]);
    }
  };
  
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={undo} disabled={history.length <= 1}>
        Undo
      </button>
      <div>
        History: {history.join(' → ')}
      </div>
    </div>
  );
}
```

### Задача 2: Поиск с debounce
```jsx
function SearchWithDebounce() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }
    
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${searchTerm}`);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      
      {loading && <div>Loading...</div>}
      
      <ul>
        {results.map(result => (
          <li key={result.id}>{result.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Задача 3: Todo List с фильтрацией
```jsx
function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, completed
  
  const addTodo = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setTodos(prev => [...prev, {
        id: Date.now(),
        text: input,
        completed: false
      }]);
      setInput('');
    }
  };
  
  const toggleTodo = (id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };
  
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });
  
  const activeCount = todos.filter(t => !t.completed).length;
  
  return (
    <div>
      <form onSubmit={addTodo}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What needs to be done?"
        />
      </form>
      
      <div>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('active')}>
          Active ({activeCount})
        </button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>
      
      <ul>
        {filteredTodos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span style={{
              textDecoration: todo.completed ? 'line-through' : 'none'
            }}>
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>×</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Задача 4: Accordion
```jsx
function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);
  
  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  return (
    <div className="accordion">
      {items.map((item, index) => (
        <div key={index} className="accordion-item">
          <button
            className="accordion-header"
            onClick={() => toggle(index)}
          >
            {item.title}
            <span>{openIndex === index ? '−' : '+'}</span>
          </button>
          
          {openIndex === index && (
            <div className="accordion-content">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Использование
const items = [
  { title: 'Section 1', content: 'Content 1' },
  { title: 'Section 2', content: 'Content 2' },
  { title: 'Section 3', content: 'Content 3' }
];

<Accordion items={items} />
```

### Задача 5: Tabs
```jsx
function Tabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(0);
  
  return (
    <div className="tabs">
      <div className="tab-headers">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={activeTab === index ? 'active' : ''}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="tab-content">
        {tabs[activeTab].content}
      </div>
    </div>
  );
}

// Использование
const tabs = [
  { label: 'Profile', content: <ProfileTab /> },
  { label: 'Settings', content: <SettingsTab /> },
  { label: 'Notifications', content: <NotificationsTab /> }
];

<Tabs tabs={tabs} />
```

### Задача 6: Infinite Scroll
```jsx
function InfiniteScrollList() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef();
  
  useEffect(() => {
    loadMore();
  }, [page]);
  
  const loadMore = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/items?page=${page}&limit=20`);
      const data = await response.json();
      
      setItems(prev => [...prev, ...data.items]);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const lastItemRef = useCallback(node => {
    if (loading) return;
    
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    
    if (node) {
      observerRef.current.observe(node);
    }
  }, [loading, hasMore]);
  
  return (
    <div>
      {items.map((item, index) => {
        if (index === items.length - 1) {
          return (
            <div ref={lastItemRef} key={item.id}>
              {item.name}
            </div>
          );
        }
        return <div key={item.id}>{item.name}</div>;
      })}
      
      {loading && <div>Loading...</div>}
    </div>
  );
}
```

### Задача 7: Modal с управлением фокусом
```jsx
function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef();
  const previousFocusRef = useRef();
  
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      modalRef.current?.focus();
      
      // Заблокировать скролл
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = 'unset';
        previousFocusRef.current?.focus();
      };
    }
  }, [isOpen]);
  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return createPortal(
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')
  );
}
```

### Задача 8: Form с валидацией
```jsx
function RegistrationForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validate = (name, value) => {
    switch (name) {
      case 'username':
        if (!value) return 'Username is required';
        if (value.length < 3) return 'Username must be at least 3 characters';
        return '';
      
      case 'email':
        if (!value) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
        return '';
      
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return 'Password must contain uppercase, lowercase and number';
        }
        return '';
      
      case 'confirmPassword':
        if (!value) return 'Please confirm password';
        if (value !== formData.password) return 'Passwords do not match';
        return '';
      
      default:
        return '';
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validate(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };
  
  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validate(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Валидация всех полей
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validate(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    
    setErrors(newErrors);
    setTouched(Object.keys(formData).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {}));
    
    if (Object.keys(newErrors).length > 0) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        alert('Registration successful!');
        // Очистить форму
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        setTouched({});
      } else {
        const data = await response.json();
        setErrors(data.errors || { form: 'Registration failed' });
      }
    } catch (error) {
      setErrors({ form: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Username"
        />
        {touched.username && errors.username && (
          <span className="error">{errors.username}</span>
        )}
      </div>
      
      <div>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Email"
        />
        {touched.email && errors.email && (
          <span className="error">{errors.email}</span>
        )}
      </div>
      
      <div>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Password"
        />
        {touched.password && errors.password && (
          <span className="error">{errors.password}</span>
        )}
      </div>
      
      <div>
        <input
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Confirm Password"
        />
        {touched.confirmPassword && errors.confirmPassword && (
          <span className="error">{errors.confirmPassword}</span>
        )}
      </div>
      
      {errors.form && <div className="error">{errors.form}</div>}
      
      <button
        type="submit"
        disabled={isSubmitting || Object.values(errors).some(e => e)}
      >
        {isSubmitting ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
```

### Задача 9: Drag and Drop
```jsx
function DragDropList() {
  const [items, setItems] = useState([
    { id: 1, text: 'Item 1' },
    { id: 2, text: 'Item 2' },
    { id: 3, text: 'Item 3' },
    { id: 4, text: 'Item 4' }
  ]);
  
  const [draggedItem, setDraggedItem] = useState(null);
  
  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragOver = (e, index) => {
    e.preventDefault();
    
    if (!draggedItem) return;
    
    const draggedIndex = items.findIndex(i => i.id === draggedItem.id);
    if (draggedIndex === index) return;
    
    const newItems = [...items];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);
    
    setItems(newItems);
  };
  
  const handleDragEnd = () => {
    setDraggedItem(null);
  };
  
  return (
    <div>
      {items.map((item, index) => (
        <div
          key={item.id}
          draggable
          onDragStart={(e) => handleDragStart(e, item)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          style={{
            padding: '10px',
            margin: '5px',
            backgroundColor: draggedItem?.id === item.id ? '#e0e0e0' : '#fff',
            border: '1px solid #ccc',
            cursor: 'move'
          }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
}
```

### Задача 10: Star Rating
```jsx
function StarRating({ totalStars = 5, initialRating = 0, onRate }) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  
  const handleClick = (value) => {
    setRating(value);
    onRate?.(value);
  };
  
  return (
    <div className="star-rating">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        
        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(0)}
            style={{
              fontSize: '2rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: starValue <= (hoverRating || rating) ? '#ffc107' : '#e4e5e9'
            }}
          >
            ★
          </button>
        );
      })}
      <span style={{ marginLeft: '10px' }}>
        {rating} / {totalStars}
      </span>
    </div>
  );
}

// Использование
function ProductReview() {
  const [userRating, setUserRating] = useState(0);
  
  const handleRate = (rating) => {
    setUserRating(rating);
    // Отправить рейтинг на сервер
    console.log('User rated:', rating);
  };
  
  return (
    <div>
      <h3>Rate this product:</h3>
      <StarRating
        totalStars={5}
        initialRating={userRating}
        onRate={handleRate}
      />
    </div>
  );
}
```

## 14. Часто задаваемые вопросы на собеседовании

**1. Что такое Virtual DOM и как он работает?**
Virtual DOM - это легковесная копия реального DOM в памяти. React сравнивает новый Virtual DOM с предыдущим (reconciliation/diffing), определяет минимальные изменения и обновляет только измененные части реального DOM.

**2. В чем разница между controlled и uncontrolled компонентами?**
- Controlled: значение контролируется React state через props
- Uncontrolled: значение хранится в DOM, доступ через ref

**3. Что такое reconciliation?**
Процесс сравнения старого и нового Virtual DOM для определения минимальных изменений.

**4. Зачем нужны ключи (keys) в списках?**
Ключи помогают React идентифицировать элементы при изменении списка, оптимизируя ре-рендеринг.

**5. В чем разница между useEffect и useLayoutEffect?**
- useEffect: асинхронный, запускается после отрисовки
- useLayoutEffect: синхронный, запускается до отрисовки, блокирует рендеринг

**6. Что такое пропс drilling и как его избежать?**
Передача props через много уровней компонентов. Решения: Context API, состояние менеджеры.

**7. В чем разница между state и props?**
- State: внутреннее изменяемое состояние компонента
- Props: внешние неизменяемые данные от родителя

**8. Что такое HOC (Higher-Order Component)?**
Функция, которая принимает компонент и возвращает новый компонент с дополнительной функциональностью.

**9. Когда использовать useMemo vs useCallback?**
- useMemo: мемоизация значений/результатов вычислений
- useCallback: мемоизация функций

**10. Как предотвратить ненужные ре-рендеры?**
- React.memo для компонентов
- useMemo для значений
- useCallback для функций# React - Полная методичка для собеседования с Live Coding

## 1. React Fundamentals - Основы

### 1.1 Компоненты

**Функциональные компоненты (современный подход):**
```jsx
// Базовый компонент
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// С деструктуризацией и default props
function Button({ label = 'Click', onClick, disabled = false }) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

// Arrow function компонент
const Card = ({ title, children }) => (
  <div className="card">
    <h2>{title}</h2>
    {children}
  </div>
);
```

**Классовые компоненты (legacy, но нужно знать):**
```jsx
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

### 1.2 JSX - Важные моменты
```jsx
// className вместо class
<div className="container">

// htmlFor вместо for
<label htmlFor="input-id">

// style как объект
<div style={{ color: 'red', fontSize: '16px' }}>

// Самозакрывающиеся теги
<img src="..." />
<input type="text" />

// Выражения в фигурных скобках
{user.name}
{isActive && <Component />}
{count > 0 ? <Yes /> : <No />}

// Комментарии
{/* Это комментарий */}

// Fragments
<>
  <Child1 />
  <Child2 />
</>
// или
<React.Fragment>
  <Child1 />
  <Child2 />
</React.Fragment>
```

### 1.3 Props
```jsx
// Передача props
<UserCard 
  name="John" 
  age={30} 
  isActive={true}
  hobbies={['reading', 'coding']}
  onClick={() => console.log('clicked')}
/>

// Получение props
function UserCard({ name, age, isActive, hobbies, onClick }) {
  return (
    <div onClick={onClick}>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      {isActive && <span>Active</span>}
      <ul>
        {hobbies.map((hobby, index) => (
          <li key={index}>{hobby}</li>
        ))}
      </ul>
    </div>
  );
}

// Props.children
function Container({ children }) {
  return <div className="container">{children}</div>;
}

// Использование
<Container>
  <h1>Title</h1>
  <p>Content</p>
</Container>

// Spread props
const props = { name: 'John', age: 30 };
<UserCard {...props} />

// Default props
function Button({ label = 'Click me', type = 'button' }) {
  return <button type={type}>{label}</button>;
}
```

### 1.4 State - useState
```jsx
import { useState } from 'react';

// Базовое использование
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  );
}

// Функциональное обновление (ВАЖНО для live coding!)
function Counter() {
  const [count, setCount] = useState(0);
  
  const increment = () => {
    // ❌ Неправильно при множественных обновлениях
    setCount(count + 1);
    
    // ✅ Правильно - использует предыдущее значение
    setCount(prev => prev + 1);
  };
  
  return <button onClick={increment}>{count}</button>;
}

// Multiple state
function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);
  
  return (
    <form>
      <input 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
      />
      <input 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="number"
        value={age} 
        onChange={(e) => setAge(Number(e.target.value))} 
      />
    </form>
  );
}

// Объект в state
function UserForm() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <form>
      <input 
        name="name"
        value={user.name} 
        onChange={handleChange} 
      />
      <input 
        name="email"
        value={user.email} 
        onChange={handleChange} 
      />
    </form>
  );
}

// Массив в state
function TodoList() {
  const [todos, setTodos] = useState([]);
  
  const addTodo = (text) => {
    setTodos(prev => [...prev, { id: Date.now(), text }]);
  };
  
  const removeTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };
  
  const toggleTodo = (id) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed }
        : todo
    ));
  };
  
  return (
    <div>
      {todos.map(todo => (
        <div key={todo.id}>
          <span style={{ 
            textDecoration: todo.completed ? 'line-through' : 'none' 
          }}>
            {todo.text}
          </span>
          <button onClick={() => toggleTodo(todo.id)}>Toggle</button>
          <button onClick={() => removeTodo(todo.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

// Lazy initialization (для дорогих вычислений)
function Component() {
  const [state, setState] = useState(() => {
    const initialState = expensiveComputation();
    return initialState;
  });
}
```

### 1.5 Events - События
```jsx
function EventExamples() {
  // Click events
  const handleClick = (e) => {
    e.preventDefault(); // предотвратить действие по умолчанию
    e.stopPropagation(); // остановить всплытие
    console.log('Clicked!');
  };
  
  // Input events
  const handleChange = (e) => {
    console.log(e.target.value);
  };
  
  // Form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log(Object.fromEntries(formData));
  };
  
  // Keyboard events
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      console.log('Enter pressed');
    }
    if (e.key === 'Escape') {
      console.log('Escape pressed');
    }
  };
  
  // Mouse events
  const handleMouseEnter = () => console.log('Mouse entered');
  const handleMouseLeave = () => console.log('Mouse left');
  
  // Focus events
  const handleFocus = () => console.log('Focused');
  const handleBlur = () => console.log('Blurred');
  
  return (
    <div>
      <button onClick={handleClick}>Click me</button>
      
      <input 
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      
      <form onSubmit={handleSubmit}>
        <input name="username" />
        <button type="submit">Submit</button>
      </form>
      
      <div 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Hover me
      </div>
    </div>
  );
}

// Передача параметров в обработчики
function ListWithHandlers() {
  const items = ['Item 1', 'Item 2', 'Item 3'];
  
  const handleItemClick = (item, index) => {
    console.log(`Clicked ${item} at index ${index}`);
  };
  
  return (
    <ul>
      {items.map((item, index) => (
        <li 
          key={index}
          onClick={() => handleItemClick(item, index)}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
```

## 2. React Hooks - Глубокое погружение

### 2.1 useEffect
```jsx
import { useState, useEffect } from 'react';

// Базовое использование
function Component() {
  const [count, setCount] = useState(0);
  
  // Выполняется после каждого рендера
  useEffect(() => {
    console.log('Component rendered');
  });
  
  // Выполняется один раз при монтировании
  useEffect(() => {
    console.log('Component mounted');
  }, []);
  
  // Выполняется при изменении зависимостей
  useEffect(() => {
    console.log('Count changed:', count);
  }, [count]);
  
  // С cleanup функцией
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Tick');
    }, 1000);
    
    return () => {
      clearInterval(timer); // cleanup
    };
  }, []);
  
  return <div>Count: {count}</div>;
}

// Fetch данных
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let cancelled = false; // флаг для отмены
    
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        
        if (!cancelled) {
          setUser(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    
    fetchUser();
    
    return () => {
      cancelled = true; // отменить при размонтировании
    };
  }, [userId]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>User: {user?.name}</div>;
}

// Event listeners
function WindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return <div>{size.width} x {size.height}</div>;
}

// Document title
function PageTitle({ title }) {
  useEffect(() => {
    document.title = title;
  }, [title]);
  
  return null;
}

// LocalStorage sync
function Counter() {
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem('count');
    return saved ? JSON.parse(saved) : 0;
  });
  
  useEffect(() => {
    localStorage.setItem('count', JSON.stringify(count));
  }, [count]);
  
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}
```

### 2.2 useRef
```jsx
import { useRef, useEffect } from 'react';

// Доступ к DOM элементам
function FocusInput() {
  const inputRef = useRef(null);
  
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  
  return <input ref={inputRef} />;
}

// Хранение предыдущего значения
function Counter() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef();
  
  useEffect(() => {
    prevCountRef.current = count;
  });
  
  const prevCount = prevCountRef.current;
  
  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCount}</p>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
}

// Избежание stale closures
function Timer() {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);
  
  useEffect(() => {
    countRef.current = count;
  });
  
  useEffect(() => {
    const timer = setInterval(() => {
      console.log(countRef.current); // всегда актуальное значение
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <button onClick={() => setCount(c => c + 1)}>
      {count}
    </button>
  );
}

// Измерение DOM элемента
function MeasureElement() {
  const divRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    if (divRef.current) {
      const { width, height } = divRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, []);
  
  return (
    <div>
      <div ref={divRef}>Content</div>
      <p>Width: {dimensions.width}, Height: {dimensions.height}</p>
    </div>
  );
}
```

### 2.3 useMemo и useCallback
```jsx
import { useState, useMemo, useCallback } from 'react';

// useMemo - мемоизация значений
function ExpensiveComponent({ items }) {
  // Без useMemo - вычисляется каждый рендер
  const total = items.reduce((sum, item) => sum + item.price, 0);
  
  // С useMemo - вычисляется только при изменении items
  const total = useMemo(() => {
    console.log('Calculating total...');
    return items.reduce((sum, item) => sum + item.price, 0);
  }, [items]);
  
  return <div>Total: {total}</div>;
}

// useCallback - мемоизация функций
function ParentComponent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  
  // Без useCallback - новая функция каждый рендер
  const increment = () => setCount(c => c + 1);
  
  // С useCallback - та же функция если зависимости не изменились
  const increment = useCallback(() => {
    setCount(c => c + 1);
  }, []);
  
  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <ChildComponent onIncrement={increment} />
    </div>
  );
}

// Child не ре-рендерится при изменении text в Parent
const ChildComponent = React.memo(({ onIncrement }) => {
  console.log('Child rendered');
  return <button onClick={onIncrement}>Increment</button>;
});

// Практический пример
function SearchableList({ items }) {
  const [query, setQuery] = useState('');
  
  // Фильтрация только при изменении items или query
  const filteredItems = useMemo(() => {
    console.log('Filtering items...');
    return items.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [items, query]);
  
  // Мемоизированный обработчик
  const handleSearch = useCallback((e) => {
    setQuery(e.target.value);
  }, []);
  
  return (
    <div>
      <input value={query} onChange={handleSearch} />
      {filteredItems.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

### 2.4 useReducer
```jsx
import { useReducer } from 'react';

// Простой пример
const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return initialState;
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}

// Сложный пример - форма
const formInitialState = {
  username: '',
  email: '',
  password: '',
  errors: {},
  isSubmitting: false
};

function formReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value,
        errors: { ...state.errors, [action.field]: null }
      };
    
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.errors,
        isSubmitting: false
      };
    
    case 'SUBMIT_START':
      return {
        ...state,
        isSubmitting: true,
        errors: {}
      };
    
    case 'SUBMIT_SUCCESS':
      return formInitialState;
    
    case 'SUBMIT_ERROR':
      return {
        ...state,
        isSubmitting: false,
        errors: { form: action.error }
      };
    
    default:
      return state;
  }
}

function RegistrationForm() {
  const [state, dispatch] = useReducer(formReducer, formInitialState);
  
  const handleChange = (e) => {
    dispatch({
      type: 'SET_FIELD',
      field: e.target.name,
      value: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: 'SUBMIT_START' });
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify({
          username: state.username,
          email: state.email,
          password: state.password
        })
      });
      
      if (response.ok) {
        dispatch({ type: 'SUBMIT_SUCCESS' });
      } else {
        const data = await response.json();
        dispatch({ type: 'SET_ERRORS', errors: data.errors });
      }
    } catch (error) {
      dispatch({ type: 'SUBMIT_ERROR', error: error.message });
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        value={state.username}
        onChange={handleChange}
      />
      {state.errors.username && <span>{state.errors.username}</span>}
      
      <input
        name="email"
        value={state.email}
        onChange={handleChange}
      />
      {state.errors.email && <span>{state.errors.email}</span>}
      
      <input
        type="password"
        name="password"
        value={state.password}
        onChange={handleChange}
      />
      {state.errors.password && <span>{state.errors.password}</span>}
      
      <button type="submit" disabled={state.isSubmitting}>
        {state.isSubmitting ? 'Submitting...' : 'Register'}
      </button>
      
      {state.errors.form && <div>{state.errors.form}</div>}
    </form>
  );
}
```

### 2.5 useContext
```jsx
import { createContext, useContext, useState } from 'react';

// Создание контекста
const ThemeContext = createContext();

// Provider компонент
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  const value = {
    theme,
    toggleTheme
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook для использования контекста
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Использование
function App() {
  return (
    <ThemeProvider>
      <Header />
      <Main />
    </ThemeProvider>
  );
}

function Header() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header style={{ background: theme === 'light' ? '#fff' : '#333' }}>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </header>
  );
}

// Множественные контексты
const UserContext = createContext();
const SettingsContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({});
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <SettingsContext.Provider value={{ settings, setSettings }}>
        <MainApp />
      </SettingsContext.Provider>
    </UserContext.Provider>
  );
}

// Составной контекст (распространенный паттерн)
const AppContext = createContext();

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState([]);
  
  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);
  
  const addNotification = (notification) => {
    setNotifications(prev => [...prev, notification]);
  };
  
  const value = {
    user,
    theme,
    notifications,
    login,
    logout,
    setTheme,
    addNotification
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
```

### 2.6 Custom Hooks
```jsx
// useFetch - универсальный хук для запросов
function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let cancelled = false;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url, options);
        const json = await response.json();
        
        if (!cancelled) {
          setData(json);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    
    fetchData();
    
    return () => {
      cancelled = true;
    };
  }, [url]);
  
  return { data, loading, error };
}

// Использование
function UserProfile({ userId }) {
  const { data: user, loading, error } = useFetch(`/api/users/${userId}`);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>{user.name}</div>;
}

// useLocalStorage - синхронизация с localStorage
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });
  
  const setStoredValue = (newValue) => {
    try {
      const valueToStore = newValue instanceof Function 
        ? newValue(value) 
        : newValue;
      
      setValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };
  
  return [value, setStoredValue];
}

// Использование
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  
  return (
    <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  );
}

// useDebounce - задержка обновления значения
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

// Использование
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  useEffect(() => {
    if (debouncedSearchTerm) {
      // Выполнить поиск
      console.log('Searching for:', debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);
  
  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}

// useToggle - переключатель
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => {
    setValue(v => !v);
  }, []);
  
  return [value, toggle, setValue];
}

// Использование
function Modal() {
  const [isOpen, toggleOpen] = useToggle(false);
  
  return (
    <div>
      <button onClick={toggleOpen}>Open Modal</button>
      {isOpen && (
        <div className="modal">
          <button onClick={toggleOpen}>Close</button>
        </div>
      )}
    </div>
  );
}

// useOnClickOutside - клик вне элемента
function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

// Использование
function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();
  
  useOnClickOutside(ref, () => setIsOpen(false));
  
  return (
    <div ref={ref}>
      <button onClick={() => setIsOpen(true)}>Open</button>
      {isOpen && <div>Dropdown content</div>}
    </div>
  );
}

// usePrevious - предыдущее значение
function usePrevious(value) {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
}

// useWindowSize - размер окна
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return windowSize;
}
```

## 3. Lists & Keys - Списки и ключи
```jsx
// Базовый список
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}

// ❌ НЕПРАВИЛЬНО - использование индекса как ключа
{items.map((item, index) => (
  <div key={index}>{item}</div>
))}

// ✅ ПРАВИЛЬНО - уникальный ID
{items.map(item => (
  <div key={item.id}>{item.name}</div>
))}

// Список с обработчиками
function ProductList({ products, onDelete }) {
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
          <button onClick={() => onDelete(product.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

// Вложенные списки
function Categories({ categories }) {
  return (
    <div>
      {categories.map(category => (
        <div key={category.id}>
          <h2>{category.name}</h2>
          <ul>
            {category.items.map(item => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// Условный рендеринг в списках
function UserList({ users }) {
  return (
    <div>
      {users.map(user => (
        user.isActive && (
          <div key={user.id}>
            {user.name}
            {user.isPremium && <span>⭐</span>}
          </div>
        )
      ))}
    </div>
  );
}
```

## 4. Формы - Полный гайд

### 4.1 Контролируемые компоненты
```jsx
// Простая форма
function SimpleForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, email });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <button type="submit">Submit</button>
    </form>
  );
}

// Форма с объектом state
function RegistrationForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    country: '',
    terms: false
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
      />
      
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
      />
      
      <input
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm Password"
      />
      
      <input
        name="age"
        type="number"
        value={formData.age}
        onChange={handleChange}
        placeholder="Age"
      />
      
      <select name="country" value={formData.country} onChange={handleChange}>
        <option value="">Select Country</option>
        <option value="us">USA</option>
        <option value="uk">UK</option>
        <option value="ca">Canada</option>
      </select>
      
      <label>
        <input
          name="terms"
          type="checkbox"
          checked={formData.terms}
          onChange={handleChange}
        />
        Accept Terms
      </label>
      
      <button type="submit">Register</button>
    </form>
  );
}

// Форма с валидацией
function FormWithValidation() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const validate = (name, value) => {
    switch (name) {
      case 'email':
        if (!value) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
        return '';
      
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';
      
      default:
        return '';
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    const error = validate(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };
  
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validate(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(Object.keys(formData).reduce((acc, key) => ({
        ...acc,
        [key]: true
      }), {}));
      return;
    }
    
    console.log('Form submitted:', formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Email"
        />
        {touched.email && errors.email && (
          <span className="error">{errors.email}</span>
        )}
      </div>
      
      <div>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Password"
        />
        {touched.password && errors.password && (
          <span className="error">{errors.password}</span>
        )}
      </div>
      
      <button 
        type="submit"
        disabled={Object.keys(errors).some(key => errors[key])}
      >
        Submit
      </button>
    </form>
  );
}

// Multiple choice (radio buttons)
function SurveyForm() {
  const [answer, setAnswer] = useState('');
  
  return (
    <form>
      <label>
        <input
          type="radio"
          value="option1"
          checked={answer === 'option1'}
          onChange={(e) => setAnswer(e.target.value)}
        />
        Option 1
      </label>
      
      <label>
        <input
          type="radio"
          value="option2"
          checked={answer === 'option2'}
          onChange={(e) => setAnswer(e.target.value)}
        />
        Option 2
      </label>
    </form>
  );
}

// Multiple select
function MultiSelectForm() {
  const [selectedOptions, setSelectedOptions] = useState([]);
  
  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedOptions(prev => 
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };
  
  return (
    <div>
      {['option1', 'option2', 'option3'].map(option => (
        <label key={option}>
          <input
            type="checkbox"
            value={option}
            checked={selectedOptions.includes(option)}
            onChange={handleChange}
          />
          {option}
        </label>
      ))}
    </div>
  );
}

// File upload
function FileUploadForm() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*"
      />
      {preview && <img src={preview} alt="Preview" width="200" />}
      <button type="submit" disabled={!file}>Upload</button>
    </form>
  );
}
```

### 4.2 Неконтролируемые компоненты
```jsx
function UncontrolledForm() {
  const nameRef = useRef();
  const emailRef = useRef();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      name: nameRef.current.value,
      email: emailRef.current.value
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input ref={nameRef} defaultValue="John" />
      <input ref={emailRef} type="email" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

## 5. Conditional Rendering - Условный рендеринг
```jsx
// If-Else с переменной
function Greeting({ isLoggedIn }) {
  let content;
  if (isLoggedIn) {
    content = <UserGreeting />;
  } else {
    content = <GuestGreeting />;
  }
  return <div>{content}</div>;
}

// Тернарный оператор
function Greeting({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? <UserGreeting /> : <GuestGreeting />}
    </div>
  );
}

// Логическое И (&&)
function Mailbox({ unreadMessages }) {
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 && (
        <h2>You have {unreadMessages.length} unread messages.</h2>
      )}
    </div>
  );
}

// Логическое ИЛИ (||)
function Username({ username }) {
  return <div>{username || 'Guest'}</div>;
}

// Nullish coalescing (??)
function UserAge({ age }) {
  return <div>Age: {age ?? 'Not specified'}</div>;
}

// Switch statement
function NotificationIcon({ type }) {
  let icon;
  switch (type) {
    case 'success':
      icon = '✅';
      break;
    case 'error':
      icon = '❌';
      break;
    case 'warning':
      icon = '⚠️';
      break;
    default:
      icon = 'ℹ️';
  }
  return <span>{icon}</span>;
}

// Объект для маппинга
function NotificationIcon({ type }) {
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  return <span>{icons[type] || icons.info}</span>;
}

// Early return
function UserProfile({ user }) {
  if (!user) {
    return <div>Please log in</div>;
  }
  
  if (!user.isActive) {
    return <div>Account is inactive</div>;
  }
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

// Множественные условия
function ProductCard({ product, user }) {
  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      
      {user && user.isPremium && product.discount && (
        <span>Discount: {product.discount}%</span>
      )}
      
      {product.inStock ? (
        <button>Add to Cart</button>
      ) : (
        <span>Out of Stock</span>
      )}
    </div>
  );
}

// Render nothing
function ConditionalComponent({ shouldRender }) {
  if (!shouldRender) {
    return null;
  }
  
  return <div>Content</div>;
}
```

## 6. Lifting State Up - Поднятие состояния
```jsx
// Проблема: два компонента должны синхронизировать состояние
// Решение: поднять state до общего родителя

// ❌ Плохо - состояние дублируется
function BadExample() {
  return (
    <div>
      <TemperatureInput scale="c" />
      <TemperatureInput scale="f" />
    </div>
  );
}

function TemperatureInput({ scale }) {
  const [temperature, setTemperature] = useState('');
  // Каждый компонент имеет свое состояние - не синхронизировано!
  
  return (
    <input
      value={temperature}
      onChange={(e) => setTemperature(e.target.value)}
    />
  );
}

// ✅ Хорошо - состояние в родителе
function GoodExample() {
  const [temperature, setTemperature] = useState('');
  const [scale, setScale] = useState('c');
  
  const handleCelsiusChange = (temp) => {
    setScale('c');
    setTemperature(temp);
  };
  
  const handleFahrenheitChange = (temp) => {
    setScale('f');
    setTemperature(temp);
  };
  
  const celsius = scale === 'f' 
    ? tryConvert(temperature, toCelsius)
    : temperature;
    
  const fahrenheit = scale === 'c'
    ? tryConvert(temperature, toFahrenheit)
    : temperature;
  
  return (
    <div>
      <TemperatureInput
        scale="c"
        temperature={celsius}
        onTemperatureChange={handleCelsiusChange}
      />
      <TemperatureInput
        scale="f"
        temperature={fahrenheit}
        onTemperatureChange={handleFahrenheitChange}
      />
      <BoilingVerdict celsius={parseFloat(celsius)} />
    </div>
  );
}

function TemperatureInput({ scale, temperature, onTemperatureChange }) {
  return (
    <fieldset>
      <legend>Enter temperature in {scaleNames[scale]}:</legend>
      <input
        value={temperature}
        onChange={(e) => onTemperatureChange(e.target.value)}
      />
    </fieldset>
  );
}

// Практический пример - Todo List
function TodoApp() {
  const [todos, setTodos] = useState([]);
  
  const addTodo = (text) => {
    setTodos(prev => [...prev, {
      id: Date.now(),
      text,
      completed: false
    }]);
  };
  
  const toggleTodo = (id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };
  
  return (
    <div>
      <TodoInput onAdd={addTodo} />
      <TodoList
        todos={todos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
    </div>
  );
}

function TodoInput({ onAdd }) {
  const [text, setText] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text);
      setText('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add todo..."
      />
      <button type="submit">Add</button>
    </form>
  );
}

function TodoList({ todos, onToggle, onDelete }) {
  return (
    <ul>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span style={{
        textDecoration: todo.completed ? 'line-through' : 'none'
      }}>
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </li>
  );
}
```

## 7. Composition - Композиция компонентов
```jsx
// Children prop
function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

// Использование
<Card>
  <h2>Title</h2>
  <p>Content</p>
</Card>

// Multiple slots
function Dialog({ title, content, actions }) {
  return (
    <div className="dialog">
      <div className="dialog-title">{title}</div>
      <div className="dialog-content">{content}</div>
      <div className="dialog-actions">{actions}</div>
    </div>
  );
}

// Использование
<Dialog
  title={<h2>Confirm</h2>}
  content={<p>Are you sure?</p>}
  actions={
    <>
      <button>Cancel</button>
      <button>Confirm</button>
    </>
  }
/>

// Render props pattern
function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return render(position);
}

// Использование
<MouseTracker
  render={({ x, y }) => (
    <div>Mouse position: {x}, {y}</div>
  )}
/>

// Compound Components pattern
function Tabs({ children }) {
  const [activeIndex, setActiveIndex] = useState(0);
  
  return (
    <div className="tabs">
      {React.Children.map(children, (child, index) => {
        return React.cloneElement(child, {
          isActive: index === activeIndex,
          onActivate: () => setActiveIndex(index)
        });
      })}
    </div>
  );
}

function Tab({ isActive, onActivate, label, children }) {
  return (
    <div>
      <button
        className={isActive ? 'active' : ''}
        onClick={onActivate}
      >
        {label}
      </button>
      {isActive && <div>{children}</div>}
    </div>
  );
}

// Использование
<Tabs>
  <Tab label="Tab 1">Content 1</Tab>
  <Tab label="Tab 2">Content 2</Tab>
  <Tab label="Tab 3">Content 3</Tab>
</Tabs>

// HOC (Higher-Order Component)
function withLoading(Component) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    return <Component {...props} />;
  };
}

// Использование
const UserListWithLoading = withLoading(UserList);

<UserListWithLoading
  isLoading={loading}
  users={users}
/>
```

## 8. Performance Optimization - Оптимизация

### 8.1 React.memo
```jsx
// Без оптимизации - ре-рендерится при каждом рендере родителя
function ExpensiveComponent({ data }) {
  console.log('Rendering ExpensiveComponent');
  return <div>{data}</div>;
}

// С React.memo - ре-рендерится только при изменении props
const ExpensiveComponent = React.memo(function ExpensiveComponent({ data }) {
  console.log('Rendering ExpensiveComponent');
  return <div>{data}</div>;
});

// С кастомным сравнением
const ExpensiveComponent = React.memo(
  function ExpensiveComponent({ user }) {
    return <div>{user.name}</div>;
  },
  (prevProps, nextProps) => {
    // Вернуть true если props равны (НЕ ре-рендерить)
    return prevProps.user.id === nextProps.user.id;
  }
);

// Практический пример
function ParentComponent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  
  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      
      {/* Не ре-рендерится при изменении text */}
      <ExpensiveChild data="static data" />
    </div>
  );
}

const ExpensiveChild = React.memo(({ data }) => {
  console.log('Child rendered');
  return <div>{data}</div>;
});
```

### 8.2 useMemo для дорогих вычислений
```jsx
function ProductList({ products, searchTerm }) {
  // ❌ Плохо - фильтрация при каждом рендере
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // ✅ Хорошо - фильтрация только при изменении зависимостей
  const filteredProducts = useMemo(() => {
    console.log('Filtering products...');
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);
  
  return (
    <ul>
      {filteredProducts.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}

// Сложные вычисления
function DataAnalytics({ data }) {
  const statistics = useMemo(() => {
    console.log('Calculating statistics...');
    
    const sum = data.reduce((acc, val) => acc + val, 0);
    const avg = sum / data.length;
    const max = Math.max(...data);
    const min = Math.min(...data);
    
    return { sum, avg, max, min };
  }, [data]);
  
  return (
    <div>
      <p>Sum: {statistics.sum}</p>
      <p>Average: {statistics.avg}</p>
      <p>Max: {statistics.max}</p>
      <p>Min: {statistics.min}</p>
    </div>
  );
}
```

### 8.3 useCallback для функций
```jsx
function ParentComponent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  
  // ❌ Плохо - новая функция при каждом рендере
  const handleClick = () => {
    console.log('Clicked');
  };
  
  // ✅ Хорошо - та же функция если зависимости не изменились
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []);
  
  const incrementCount = useCallback(() => {
    setCount(c => c + 1);
  }, []);
  
  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <MemoizedChild onClick={incrementCount} />
    </div>
  );
}

const MemoizedChild = React.memo(({ onClick }) => {
  console.log('Child rendered');
  return <button onClick={onClick}>Increment</button>;
});
```

### 8.4 Code Splitting и Lazy Loading
```jsx
import { lazy, Suspense } from 'react';

// Lazy loading компонента
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <HeavyComponent />
      </Suspense>
    </div>
  );
}

// Route-based code splitting
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

// Lazy loading с условием
function ConditionalLazyLoad() {
  const [showHeavy, setShowHeavy] = useState(false);
  
  return (
    <div>
      <button onClick={() => setShowHeavy(true)}>
        Load Heavy Component
      </button>
      
      {showHeavy && (
        <Suspense fallback={<div>Loading...</div>}>
          <HeavyComponent />
        </Suspense>
      )}
    </div>
  );
}
```

### 8.5 Virtualization - Виртуализация длинных списков
```jsx
// Используя react-window
import { FixedSizeList } from 'react-window';

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  );
  
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={35}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}

// Используя react-virtualized
import { List } from 'react-virtualized';

function VirtualizedList({ items }) {
  const rowRenderer = ({ key, index, style }) => (
    <div key={key} style={style}>
      {items[index].name}
    </div>
  );
  
  return (
    <List
      width={300}
      height={600}
      rowCount={items.length}
      rowHeight={35}
      rowRenderer={rowRenderer}
    />
  );
}
```

## 9. Error Boundaries - Обработка ошибок
```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
    // Отправить в сервис логирования
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong</h1>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Использование
function App() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}

// Множественные Error Boundaries
function App() {
  return (
    <div>
      <ErrorBoundary fallback={<div>Navigation Error</div>}>
        <Navigation />
      </ErrorBoundary>
      
      <ErrorBoundary fallback={<div>Content Error</div>}>
        <MainContent />
      </ErrorBoundary>
      
      <ErrorBoundary fallback={<div>Sidebar Error</div>}>
        <Sidebar />
      </ErrorBoundary>
    </div>
  );
}
```

**10. Как предотвратить ненужные ре-рендеры?**
- React.memo для компонентов
- useMemo для значений
- useCallback для функций
- Правильная структура state

## 15. Redux - State Management

### 15.1 Redux Toolkit (современный подход)

```jsx
// store.js
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer
  }
});

// counterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0
  },
  reducers: {
    increment: (state) => {
      state.value += 1; // можно мутировать благодаря Immer
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    reset: (state) => {
      state.value = 0;
    }
  }
});

export const { increment, decrement, incrementByAmount, reset } = counterSlice.actions;
export default counterSlice.reducer;

// App.js
import { Provider } from 'react-redux';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
}

// Counter.js
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, reset } from './counterSlice';

function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();
  
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
      <button onClick={() => dispatch(reset())}>Reset</button>
    </div>
  );
}
```

### 15.2 Async операции с createAsyncThunk

```jsx
// userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk для загрузки пользователя
export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    loading: false,
    error: null
  },
  reducers: {
    clearUser: (state) => {
      state.data = null;
      state.error = null;
    }
  },
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
        state.error = action.payload;
      });
  }
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;

// UserProfile.js
function UserProfile({ userId }) {
  const dispatch = useDispatch();
  const { data: user, loading, error } = useSelector((state) => state.user);
  
  useEffect(() => {
    dispatch(fetchUser(userId));
  }, [userId, dispatch]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return null;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

### 15.3 Redux с нормализованными данными

```jsx
// postsSlice.js
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const postsAdapter = createEntityAdapter({
  selectId: (post) => post.id,
  sortComparer: (a, b) => b.date.localeCompare(a.date)
});

const postsSlice = createSlice({
  name: 'posts',
  initialState: postsAdapter.getInitialState({
    loading: false,
    error: null
  }),
  reducers: {
    postAdded: postsAdapter.addOne,
    postUpdated: postsAdapter.updateOne,
    postRemoved: postsAdapter.removeOne,
    postsReceived: postsAdapter.setAll
  }
});

export const { postAdded, postUpdated, postRemoved, postsReceived } = postsSlice.actions;

// Selectors
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds
} = postsAdapter.getSelectors((state) => state.posts);

export default postsSlice.reducer;
```

### 15.4 RTK Query - для API запросов

```jsx
// api.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Post', 'User'],
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => '/posts',
      providesTags: ['Post']
    }),
    getPost: builder.query({
      query: (id) => `/posts/${id}`,
      providesTags: (result, error, id) => [{ type: 'Post', id }]
    }),
    createPost: builder.mutation({
      query: (newPost) => ({
        url: '/posts',
        method: 'POST',
        body: newPost
      }),
      invalidatesTags: ['Post']
    }),
    updatePost: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/posts/${id}`,
        method: 'PATCH',
        body: patch
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Post', id }]
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Post']
    })
  })
});

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation
} = apiSlice;

// PostsList.js
function PostsList() {
  const { data: posts, isLoading, isError, error } = useGetPostsQuery();
  
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}

// CreatePost.js
function CreatePost() {
  const [createPost, { isLoading }] = useCreatePostMutation();
  const [title, setTitle] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPost({ title }).unwrap();
      setTitle('');
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

## 16. Zustand - Легкий State Manager

```jsx
// store.js
import create from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 })
}));

// Counter.js
function Counter() {
  const { count, increment, decrement, reset } = useStore();
  
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

// С middleware (persist)
import create from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      user: null,
      login: (userData) => set({ user: userData }),
      logout: () => set({ user: null })
    }),
    {
      name: 'user-storage'
    }
  )
);

// Async действия
const useStore = create((set) => ({
  posts: [],
  loading: false,
  error: null,
  
  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      set({ posts: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  }
}));

// Использование
function PostsList() {
  const { posts, loading, error, fetchPosts } = useStore();
  
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}

// Selectors для оптимизации
const useStore = create((set) => ({
  todos: [],
  addTodo: (text) => set((state) => ({
    todos: [...state.todos, { id: Date.now(), text, completed: false }]
  }))
}));

// Компонент ре-рендерится только при изменении активных todos
function ActiveTodos() {
  const activeTodos = useStore((state) => 
    state.todos.filter(todo => !todo.completed)
  );
  
  return (
    <ul>
      {activeTodos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

## 17. React Query (TanStack Query) - Server State

```jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Настройка
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Posts />
    </QueryClientProvider>
  );
}

// Fetch данных
function Posts() {
  const { data: posts, isLoading, isError, error } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await fetch('/api/posts');
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    }
  });
  
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}

// Mutations
function CreatePost() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: async (newPost) => {
      const response = await fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify(newPost)
      });
      return response.json();
    },
    onSuccess: () => {
      // Инвалидировать и обновить кеш
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });
  
  const [title, setTitle] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ title });
    setTitle('');
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create'}
      </button>
      {mutation.isError && <div>Error: {mutation.error.message}</div>}
    </form>
  );
}

// С параметрами
function Post({ postId }) {
  const { data: post, isLoading } = useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      const response = await fetch(`/api/posts/${postId}`);
      return response.json();
    }
  });
  
  if (isLoading) return <div>Loading...</div>;
  
  return <div>{post.title}</div>;
}

// Оптимистичные обновления
function TodoList() {
  const queryClient = useQueryClient();
  
  const toggleMutation = useMutation({
    mutationFn: async ({ id, completed }) => {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ completed })
      });
      return response.json();
    },
    onMutate: async ({ id, completed }) => {
      // Отменить текущие запросы
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      
      // Сохранить предыдущие данные
      const previousTodos = queryClient.getQueryData(['todos']);
      
      // Оптимистично обновить
      queryClient.setQueryData(['todos'], (old) =>
        old.map(todo =>
          todo.id === id ? { ...todo, completed } : todo
        )
      );
      
      return { previousTodos };
    },
    onError: (err, variables, context) => {
      // Откатить при ошибке
      queryClient.setQueryData(['todos'], context.previousTodos);
    },
    onSettled: () => {
      // Всегда обновить после завершения
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    }
  });
  
  const { data: todos } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos
  });
  
  return (
    <ul>
      {todos?.map(todo => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={(e) => toggleMutation.mutate({
              id: todo.id,
              completed: e.target.checked
            })}
          />
          {todo.text}
        </li>
      ))}
    </ul>
  );
}

// Pagination
function PaginatedPosts() {
  const [page, setPage] = useState(1);
  
  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ['posts', page],
    queryFn: () => fetchPosts(page),
    placeholderData: keepPreviousData // Показывать старые данные пока загружаются новые
  });
  
  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {data.posts.map(post => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      )}
      
      <button
        onClick={() => setPage(p => Math.max(1, p - 1))}
        disabled={page === 1}
      >
        Previous
      </button>
      
      <span>{page}</span>
      
      <button
        onClick={() => setPage(p => p + 1)}
        disabled={isPlaceholderData || !data?.hasMore}
      >
        Next
      </button>
    </div>
  );
}

// Infinite scroll
function InfinitePosts() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage
  });
  
  return (
    <div>
      {data?.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.posts.map(post => (
            <div key={post.id}>{post.title}</div>
          ))}
        </React.Fragment>
      ))}
      
      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage
          ? 'Loading more...'
          : hasNextPage
          ? 'Load More'
          : 'Nothing more to load'}
      </button>
    </div>
  );
}
```

## 18. Дополнительные Live Coding задачи

### Задача 11: Автокомплит
```jsx
function Autocomplete({ suggestions }) {
  const [input, setInput] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  
  const handleChange = (e) => {
    const userInput = e.target.value;
    setInput(userInput);
    
    const filtered = suggestions.filter(
      suggestion =>
        suggestion.toLowerCase().includes(userInput.toLowerCase())
    );
    
    setFilteredSuggestions(filtered);
    setShowSuggestions(true);
    setActiveSuggestionIndex(0);
  };
  
  const handleClick = (suggestion) => {
    setInput(suggestion);
    setFilteredSuggestions([]);
    setShowSuggestions(false);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      if (activeSuggestionIndex < filteredSuggestions.length - 1) {
        setActiveSuggestionIndex(activeSuggestionIndex + 1);
      }
    } else if (e.key === 'ArrowUp') {
      if (activeSuggestionIndex > 0) {
        setActiveSuggestionIndex(activeSuggestionIndex - 1);
      }
    } else if (e.key === 'Enter') {
      setInput(filteredSuggestions[activeSuggestionIndex]);
      setShowSuggestions(false);
    }
  };
  
  return (
    <div className="autocomplete">
      <input
        type="text"
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type to search..."
      />
      
      {showSuggestions && input && filteredSuggestions.length > 0 && (
        <ul className="suggestions">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              className={index === activeSuggestionIndex ? 'active' : ''}
              onClick={() => handleClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### Задача 12: Таймер обратного отсчета
```jsx
function Countdown({ initialSeconds }) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    let interval = null;
    
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(s => s - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
    }
    
    return () => clearInterval(interval);
  }, [isActive, seconds]);
  
  const toggle = () => setIsActive(!isActive);
  
  const reset = () => {
    setSeconds(initialSeconds);
    setIsActive(false);
  };
  
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="countdown">
      <h1>{formatTime(seconds)}</h1>
      <button onClick={toggle}>
        {isActive ? 'Pause' : 'Start'}
      </button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

### Задача 13: Пагинация
```jsx
function Pagination({ items, itemsPerPage = 10 }) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(items.length / itemsPerPage);
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  return (
    <div>
      <ul>
        {currentItems.map((item, index) => (
          <li key={index}>{item.name}</li>
        ))}
      </ul>
      
      <div className="pagination">
        <button onClick={goToPrev} disabled={currentPage === 1}>
          Previous
        </button>
        
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
        
        <button onClick={goToNext} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
      
      <p>
        Page {currentPage} of {totalPages}
      </p>
    </div>
  );
}
```

### Задача 14: Dark Mode Toggle
```jsx
function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });
  
  useEffect(() => {
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [isDark]);
  
  return (
    <button onClick={() => setIsDark(!isDark)}>
      {isDark ? '🌞' : '🌙'}
    </button>
  );
}

// CSS
/*
:root[data-theme='light'] {
  --bg-color: #ffffff;
  --text-color: #000000;
}

:root[data-theme='dark'] {
  --bg-color: #1a1a1a;
  --text-color: #ffffff;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
}
*/
```

### Задача 15: Shopping Cart
```jsx
function ShoppingCart() {
  const [cart, setCart] = useState([]);
  
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };
  
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };
  
  const updateQuantity = (productId, quantity) => {
    if (quantity === 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };
  
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };
  
  return (
    <div>
      <h2>Cart ({getTotalItems()} items)</h2>
      
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <ul>
            {cart.map(item => (
              <li key={item.id}>
                <span>{item.name}</span>
                <span>${item.price}</span>
                <input
                  type="number"
                  min="0"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.id, parseInt(e.target.value))
                  }
                />
                <span>${item.price * item.quantity}</span>
                <button onClick={() => removeFromCart(item.id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          
          <div>
            <strong>Total: ${getTotalPrice().toFixed(2)}</strong>
          </div>
        </>
      )}
    </div>
  );
}
```

## 19. Советы для Live Coding

**Перед началом:**
1. Уточните требования - задавайте вопросы
2. Обсудите подход - проговорите план решения
3. Начните с простого - базовая функциональность сначала
4. Комментируйте код - объясняйте что делаете

**Во время кодинга:**
1. Думайте вслух - делитесь мыслями
2. Пишите чистый код - читаемые имена переменных
3. Тестируйте по ходу - проверяйте работоспособность
4. Не паникуйте при ошибках - исправляйте спокойно

**Частые ошибки:**
- Забывают добавить key в списках
- Мутируют state напрямую
- Не добавляют cleanup в useEffect
- Создают функции/объекты внутри рендера без мемоизации
- Забывают обработать loading/error состояния

**Чек-лист:**
- ✅ Компонент рендерится корректно
- ✅ Обработаны все события
- ✅ Добавлена валидация (если нужна)
- ✅ Нет предупреждений в консоли
- ✅ Код читаемый и понятный
- ✅ Edge cases учтены

---

**Удачи на собеседовании! 🚀**import { createPortal } from 'react-dom';

// Modal компонент
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose}>×</button>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')
  );
}

// Использование
function App() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2>Modal Title</h2>
        <p>Modal content</p>
      </Modal>
    </div>
  );
}

// Tooltip с порталом
function Tooltip({ text, children }) {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef();
  
  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({ x: rect.left, y: rect.top - 30 });
    setShow(true);
  };
  
  return (
    <>
      <span
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </span>
      
      {show && createPortal(
        <div
          className="tooltip"
          style={{
            position: 'fixed',
            left: position.x,
            top: position.y
          }}
        >
          {text}
        </div>,
        document.body
      )}
    </>
  );
}
```

## 11. React Router - Маршрутизация

```jsx
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Link, 
  useNavigate,
  useParams,
  useLocation,
  Navigate,
  Outlet
} from 'react-router-dom';

// Базовая настройка
function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/users">Users</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

// useParams - получение параметров URL
function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [id]);
  
  if (!user) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

// useNavigate - программная навигация
function LoginForm() {
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // ... login logic
    navigate('/dashboard');
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}

// useLocation - текущий URL
function Analytics() {
  const location = useLocation();
  
  useEffect(() => {
    // Отправить аналитику
    console.log('Page view:', location.pathname);
  }, [location]);
  
  return null;
}

// Вложенные роуты
function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <nav>
        <Link to="profile">Profile</Link>
        <Link to="settings">Settings</Link>
      </nav>
      
      <Outlet /> {/* Здесь рендерятся дочерние роуты */}
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />}>
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

// Protected routes
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

// Query parameters
function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const handleSearch = (newQuery) => {
    setSearchParams({ q: newQuery });
  };
  
  return (
    <div>
      <input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <Results query={query} />
    </div>
  );
}
```

## 12. Context API - Управление состоянием

```jsx
// Аутентификация с Context
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Проверить сохраненную сессию
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token)
        .then(setUser)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);
  
  const login = async (credentials) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    const data = await response.json();
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  
  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Использование
function Profile() {
  const { user, logout } = useAuth();
  
  return (
    <div>
      <h1>{user.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

// Theme Context
const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Комбинированный Provider
function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

function App() {
  return (
    <AppProviders>
      <Router>
        <Routes>...</Routes>
      </Router>
    </AppProviders>
  );
}
```

## 13. LIVE CODING ЗАДАЧИ - Практика

### Задача 1: Counter с историей
```jsx
function CounterWithHistory() {
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState([0]);
  
  const increment = () => {
    setCount(prev => {
      const newCount = prev + 1;
      setHistory(h => [...h, newCount]);
      return newCount;
    });
  };
  
  const decrement = () => {
    setCount(prev => {
      const newCount = prev - 1;
      setHistory(h => [...h, newCount]);
      return newCount;
    });
  };
  
  const undo = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      setCount(newHistory[newHistory.length - 1]);
    }
  };
  
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={undo} disabled={history.length <= 1}>
        Undo
      </button>
      <div>
        History: {history.join(' → ')}
      </div>
    </div>
  );
}
```

### Задача 2: Поиск с debounce
```jsx
function SearchWithDebounce() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }
    
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${searchTerm}`);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      
      {loading && <div>Loading...</div>}
      
      <ul>
        {results.map(result => (
          <li key={result.id}>{result.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Задача 3: Todo List с фильтрацией
```jsx
function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, completed
  
  const addTodo = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setTodos(prev => [...prev, {
        id: Date.now(),
        text: input,
        completed: false
      }]);
      setInput('');
    }
  };
  
  const toggleTodo = (id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };
  
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });
  
  const activeCount = todos.filter(t => !t.completed).length;
  
  return (
    <div>
      <form onSubmit={addTodo}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What needs to be done?"
        />
      </form>
      
      <div>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('active')}>
          Active ({activeCount})
        </button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>
      
      <ul>
        {filteredTodos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span style={{
              textDecoration: todo.completed ? 'line-through' : 'none'
            }}>
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>×</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Задача 4: Accordion
```jsx
function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);
  
  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  return (
    <div className="accordion">
      {items.map((item, index) => (
        <div key={index} className="accordion-item">
          <button
            className="accordion-header"
            onClick={() => toggle(index)}
          >
            {item.title}
            <span>{openIndex === index ? '−' : '+'}</span>
          </button>
          
          {openIndex === index && (
            <div className="accordion-content">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Использование
const items = [
  { title: 'Section 1', content: 'Content 1' },
  { title: 'Section 2', content: 'Content 2' },
  { title: 'Section 3', content: 'Content 3' }
];

<Accordion items={items} />
```

### Задача 5: Tabs
```jsx
function Tabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(0);
  
  return (
    <div className="tabs">
      <div className="tab-headers">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={activeTab === index ? 'active' : ''}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="tab-content">
        {tabs[activeTab].content}
      </div>
    </div>
  );
}

// Использование
const tabs = [
  { label: 'Profile', content: <ProfileTab /> },
  { label: 'Settings', content: <SettingsTab /> },
  { label: 'Notifications', content: <NotificationsTab /> }
];

<Tabs tabs={tabs} />
```

### Задача 6: Infinite Scroll
```jsx
function InfiniteScrollList() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef();
  
  useEffect(() => {
    loadMore();
  }, [page]);
  
  const loadMore = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/items?page=${page}&limit=20`);
      const data = await response.json();
      
      setItems(prev => [...prev, ...data.items]);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const lastItemRef = useCallback(node => {
    if (loading) return;
    
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    
    if (node) {
      observerRef.current.observe(node);
    }
  }, [loading, hasMore]);
  
  return (
    <div>
      {items.map((item, index) => {
        if (index === items.length - 1) {
          return (
            <div ref={lastItemRef} key={item.id}>
              {item.name}
            </div>
          );
        }
        return <div key={item.id}>{item.name}</div>;
      })}
      
      {loading && <div>Loading...</div>}
    </div>
  );
}
```

### Задача 7: Modal с управлением фокусом
```jsx
function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef();
  const previousFocusRef = useRef();
  
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      modalRef.current?.focus();
      
      // Заблокировать скролл
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = 'unset';
        previousFocusRef.current?.focus();
      };
    }
  }, [isOpen]);
  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return createPortal(
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')
  );
}
```

### Задача 8: Form с валидацией
```jsx
function RegistrationForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validate = (name, value) => {
    switch (name) {
      case 'username':
        if (!value) return 'Username is required';
        if (value.length < 3) return 'Username must be at least 3 characters';
        return '';
      
      case 'email':
        if (!value) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
        return '';
      
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return 'Password must contain uppercase, lowercase and number';
        }
        return '';
      
      case 'confirmPassword':
        if (!value) return 'Please confirm password';
        if (value !== formData.password) return 'Passwords do not match';
        return '';
      
      default:
        return '';
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validate(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };
  
  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validate(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Валидация всех полей
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validate(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    
    setErrors(newErrors);
    setTouched(Object.keys(formData).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {}));
    
    if (Object.keys(newErrors).length > 0) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        alert('Registration successful!');
        // Очистить форму
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        setTouched({});
      } else {
        const data = await response.json();
        setErrors(data.errors || { form: 'Registration failed' });
      }
    } catch (error) {
      setErrors({ form: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Username"
        />
        {touched.username && errors.username && (
          <span className="error">{errors.username}</span>
        )}
      </div>
      
      <div>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Email"
        />
        {touched.email && errors.email && (
          <span className="error">{errors.email}</span>
        )}
      </div>
      
      <div>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Password"
        />
        {touched.password && errors.password && (
          <span className="error">{errors.password}</span>
        )}
      </div>
      
      <div>
        <input
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Confirm Password"
        />
        {touched.confirmPassword && errors.confirmPassword && (
          <span className="error">{errors.confirmPassword}</span>
        )}
      </div>
      
      {errors.form && <div className="error">{errors.form}</div>}
      
      <button
        type="submit"
        disabled={isSubmitting || Object.values(errors).some(e => e)}
      >
        {isSubmitting ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
```

### Задача 9: Drag and Drop
```jsx
function DragDropList() {
  const [items, setItems] = useState([
    { id: 1, text: 'Item 1' },
    { id: 2, text: 'Item 2' },
    { id: 3, text: 'Item 3' },
    { id: 4, text: 'Item 4' }
  ]);
  
  const [draggedItem, setDraggedItem] = useState(null);
  
  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragOver = (e, index) => {
    e.preventDefault();
    
    if (!draggedItem) return;
    
    const draggedIndex = items.findIndex(i => i.id === draggedItem.id);
    if (draggedIndex === index) return;
    
    const newItems = [...items];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);
    
    setItems(newItems);
  };
  
  const handleDragEnd = () => {
    setDraggedItem(null);
  };
  
  return (
    <div>
      {items.map((item, index) => (
        <div
          key={item.id}
          draggable
          onDragStart={(e) => handleDragStart(e, item)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          style={{
            padding: '10px',
            margin: '5px',
            backgroundColor: draggedItem?.id === item.id ? '#e0e0e0' : '#fff',
            border: '1px solid #ccc',
            cursor: 'move'
          }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
}
```

### Задача 10: Star Rating
```jsx
function StarRating({ totalStars = 5, initialRating = 0, onRate }) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  
  const handleClick = (value) => {
    setRating(value);
    onRate?.(value);
  };
  
  return (
    <div className="star-rating">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        
        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(0)}
            style={{
              fontSize: '2rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: starValue <= (hoverRating || rating) ? '#ffc107' : '#e4e5e9'
            }}
          >
            ★
          </button>
        );
      })}
      <span style={{ marginLeft: '10px' }}>
        {rating} / {totalStars}
      </span>
    </div>
  );
}

// Использование
function ProductReview() {
  const [userRating, setUserRating] = useState(0);
  
  const handleRate = (rating) => {
    setUserRating(rating);
    // Отправить рейтинг на сервер
    console.log('User rated:', rating);
  };
  
  return (
    <div>
      <h3>Rate this product:</h3>
      <StarRating
        totalStars={5}
        initialRating={userRating}
        onRate={handleRate}
      />
    </div>
  );
}
```

## 14. Часто задаваемые вопросы на собеседовании

**1. Что такое Virtual DOM и как он работает?**
Virtual DOM - это легковесная копия реального DOM в памяти. React сравнивает новый Virtual DOM с предыдущим (reconciliation/diffing), определяет минимальные изменения и обновляет только измененные части реального DOM.

**2. В чем разница между controlled и uncontrolled компонентами?**
- Controlled: значение контролируется React state через props
- Uncontrolled: значение хранится в DOM, доступ через ref

**3. Что такое reconciliation?**
Процесс сравнения старого и нового Virtual DOM для определения минимальных изменений.

**4. Зачем нужны ключи (keys) в списках?**
Ключи помогают React идентифицировать элементы при изменении списка, оптимизируя ре-рендеринг.

**5. В чем разница между useEffect и useLayoutEffect?**
- useEffect: асинхронный, запускается после отрисовки
- useLayoutEffect: синхронный, запускается до отрисовки, блокирует рендеринг

**6. Что такое пропс drilling и как его избежать?**
Передача props через много уровней компонентов. Решения: Context API, состояние менеджеры.

**7. В чем разница между state и props?**
- State: внутреннее изменяемое состояние компонента
- Props: внешние неизменяемые данные от родителя

**8. Что такое HOC (Higher-Order Component)?**
Функция, которая принимает компонент и возвращает новый компонент с дополнительной функциональностью.

**9. Когда использовать useMemo vs useCallback?**
- useMemo: мемоизация значений/результатов вычислений
- useCallback: мемоизация функций

**10. Как предотвратить ненужные ре-рендеры?**
- React.memo для компонентов
- useMemo для значений
- useCallback для функций# React - Полная методичка для собеседования с Live Coding

## 1. React Fundamentals - Основы

### 1.1 Компоненты

**Функциональные компоненты (современный подход):**
```jsx
// Базовый компонент
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// С деструктуризацией и default props
function Button({ label = 'Click', onClick, disabled = false }) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

// Arrow function компонент
const Card = ({ title, children }) => (
  <div className="card">
    <h2>{title}</h2>
    {children}
  </div>
);
```

**Классовые компоненты (legacy, но нужно знать):**
```jsx
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

### 1.2 JSX - Важные моменты

```jsx
// className вместо class
<div className="container">

// htmlFor вместо for
<label htmlFor="input-id">

// style как объект
<div style={{ color: 'red', fontSize: '16px' }}>

// Самозакрывающиеся теги
<img src="..." />
<input type="text" />

// Выражения в фигурных скобках
{user.name}
{isActive && <Component />}
{count > 0 ? <Yes /> : <No />}

// Комментарии
{/* Это комментарий */}

// Fragments
<>
  <Child1 />
  <Child2 />
</>
// или
<React.Fragment>
  <Child1 />
  <Child2 />
</React.Fragment>
```

### 1.3 Props

```jsx
// Передача props
<UserCard 
  name="John" 
  age={30} 
  isActive={true}
  hobbies={['reading', 'coding']}
  onClick={() => console.log('clicked')}
/>

// Получение props
function UserCard({ name, age, isActive, hobbies, onClick }) {
  return (
    <div onClick={onClick}>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      {isActive && <span>Active</span>}
      <ul>
        {hobbies.map((hobby, index) => (
          <li key={index}>{hobby}</li>
        ))}
      </ul>
    </div>
  );
}

// Props.children
function Container({ children }) {
  return <div className="container">{children}</div>;
}

// Использование
<Container>
  <h1>Title</h1>
  <p>Content</p>
</Container>

// Spread props
const props = { name: 'John', age: 30 };
<UserCard {...props} />

// Default props
function Button({ label = 'Click me', type = 'button' }) {
  return <button type={type}>{label}</button>;
}
```

### 1.4 State - useState

```jsx
import { useState } from 'react';

// Базовое использование
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  );
}

// Функциональное обновление (ВАЖНО для live coding!)
function Counter() {
  const [count, setCount] = useState(0);
  
  const increment = () => {
    // ❌ Неправильно при множественных обновлениях
    setCount(count + 1);
    
    // ✅ Правильно - использует предыдущее значение
    setCount(prev => prev + 1);
  };
  
  return <button onClick={increment}>{count}</button>;
}

// Multiple state
function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);
  
  return (
    <form>
      <input 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
      />
      <input 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="number"
        value={age} 
        onChange={(e) => setAge(Number(e.target.value))} 
      />
    </form>
  );
}

// Объект в state
function UserForm() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <form>
      <input 
        name="name"
        value={user.name} 
        onChange={handleChange} 
      />
      <input 
        name="email"
        value={user.email} 
        onChange={handleChange} 
      />
    </form>
  );
}

// Массив в state
function TodoList() {
  const [todos, setTodos] = useState([]);
  
  const addTodo = (text) => {
    setTodos(prev => [...prev, { id: Date.now(), text }]);
  };
  
  const removeTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };
  
  const toggleTodo = (id) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed }
        : todo
    ));
  };
  
  return (
    <div>
      {todos.map(todo => (
        <div key={todo.id}>
          <span style={{ 
            textDecoration: todo.completed ? 'line-through' : 'none' 
          }}>
            {todo.text}
          </span>
          <button onClick={() => toggleTodo(todo.id)}>Toggle</button>
          <button onClick={() => removeTodo(todo.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

// Lazy initialization (для дорогих вычислений)
function Component() {
  const [state, setState] = useState(() => {
    const initialState = expensiveComputation();
    return initialState;
  });
}
```

### 1.5 Events - События

```jsx
function EventExamples() {
  // Click events
  const handleClick = (e) => {
    e.preventDefault(); // предотвратить действие по умолчанию
    e.stopPropagation(); // остановить всплытие
    console.log('Clicked!');
  };
  
  // Input events
  const handleChange = (e) => {
    console.log(e.target.value);
  };
  
  // Form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log(Object.fromEntries(formData));
  };
  
  // Keyboard events
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      console.log('Enter pressed');
    }
    if (e.key === 'Escape') {
      console.log('Escape pressed');
    }
  };
  
  // Mouse events
  const handleMouseEnter = () => console.log('Mouse entered');
  const handleMouseLeave = () => console.log('Mouse left');
  
  // Focus events
  const handleFocus = () => console.log('Focused');
  const handleBlur = () => console.log('Blurred');
  
  return (
    <div>
      <button onClick={handleClick}>Click me</button>
      
      <input 
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      
      <form onSubmit={handleSubmit}>
        <input name="username" />
        <button type="submit">Submit</button>
      </form>
      
      <div 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Hover me
      </div>
    </div>
  );
}

// Передача параметров в обработчики
function ListWithHandlers() {
  const items = ['Item 1', 'Item 2', 'Item 3'];
  
  const handleItemClick = (item, index) => {
    console.log(`Clicked ${item} at index ${index}`);
  };
  
  return (
    <ul>
      {items.map((item, index) => (
        <li 
          key={index}
          onClick={() => handleItemClick(item, index)}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
```

## 2. React Hooks - Глубокое погружение

### 2.1 useEffect

```jsx
import { useState, useEffect } from 'react';

// Базовое использование
function Component() {
  const [count, setCount] = useState(0);
  
  // Выполняется после каждого рендера
  useEffect(() => {
    console.log('Component rendered');
  });
  
  // Выполняется один раз при монтировании
  useEffect(() => {
    console.log('Component mounted');
  }, []);
  
  // Выполняется при изменении зависимостей
  useEffect(() => {
    console.log('Count changed:', count);
  }, [count]);
  
  // С cleanup функцией
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Tick');
    }, 1000);
    
    return () => {
      clearInterval(timer); // cleanup
    };
  }, []);
  
  return <div>Count: {count}</div>;
}

// Fetch данных
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let cancelled = false; // флаг для отмены
    
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        
        if (!cancelled) {
          setUser(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    
    fetchUser();
    
    return () => {
      cancelled = true; // отменить при размонтировании
    };
  }, [userId]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>User: {user?.name}</div>;
}

// Event listeners
function WindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return <div>{size.width} x {size.height}</div>;
}

// Document title
function PageTitle({ title }) {
  useEffect(() => {
    document.title = title;
  }, [title]);
  
  return null;
}

// LocalStorage sync
function Counter() {
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem('count');
    return saved ? JSON.parse(saved) : 0;
  });
  
  useEffect(() => {
    localStorage.setItem('count', JSON.stringify(count));
  }, [count]);
  
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}
```

### 2.2 useRef

```jsx
import { useRef, useEffect } from 'react';

// Доступ к DOM элементам
function FocusInput() {
  const inputRef = useRef(null);
  
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  
  return <input ref={inputRef} />;
}

// Хранение предыдущего значения
function Counter() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef();
  
  useEffect(() => {
    prevCountRef.current = count;
  });
  
  const prevCount = prevCountRef.current;
  
  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCount}</p>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
}

// Избежание stale closures
function Timer() {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);
  
  useEffect(() => {
    countRef.current = count;
  });
  
  useEffect(() => {
    const timer = setInterval(() => {
      console.log(countRef.current); // всегда актуальное значение
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <button onClick={() => setCount(c => c + 1)}>
      {count}
    </button>
  );
}

// Измерение DOM элемента
function MeasureElement() {
  const divRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    if (divRef.current) {
      const { width, height } = divRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, []);
  
  return (
    <div>
      <div ref={divRef}>Content</div>
      <p>Width: {dimensions.width}, Height: {dimensions.height}</p>
    </div>
  );
}
```

### 2.3 useMemo и useCallback

```jsx
import { useState, useMemo, useCallback } from 'react';

// useMemo - мемоизация значений
function ExpensiveComponent({ items }) {
  // Без useMemo - вычисляется каждый рендер
  const total = items.reduce((sum, item) => sum + item.price, 0);
  
  // С useMemo - вычисляется только при изменении items
  const total = useMemo(() => {
    console.log('Calculating total...');
    return items.reduce((sum, item) => sum + item.price, 0);
  }, [items]);
  
  return <div>Total: {total}</div>;
}

// useCallback - мемоизация функций
function ParentComponent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  
  // Без useCallback - новая функция каждый рендер
  const increment = () => setCount(c => c + 1);
  
  // С useCallback - та же функция если зависимости не изменились
  const increment = useCallback(() => {
    setCount(c => c + 1);
  }, []);
  
  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <ChildComponent onIncrement={increment} />
    </div>
  );
}

// Child не ре-рендерится при изменении text в Parent
const ChildComponent = React.memo(({ onIncrement }) => {
  console.log('Child rendered');
  return <button onClick={onIncrement}>Increment</button>;
});

// Практический пример
function SearchableList({ items }) {
  const [query, setQuery] = useState('');
  
  // Фильтрация только при изменении items или query
  const filteredItems = useMemo(() => {
    console.log('Filtering items...');
    return items.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [items, query]);
  
  // Мемоизированный обработчик
  const handleSearch = useCallback((e) => {
    setQuery(e.target.value);
  }, []);
  
  return (
    <div>
      <input value={query} onChange={handleSearch} />
      {filteredItems.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

### 2.4 useReducer

```jsx
import { useReducer } from 'react';

// Простой пример
const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return initialState;
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}

// Сложный пример - форма
const formInitialState = {
  username: '',
  email: '',
  password: '',
  errors: {},
  isSubmitting: false
};

function formReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value,
        errors: { ...state.errors, [action.field]: null }
      };
    
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.errors,
        isSubmitting: false
      };
    
    case 'SUBMIT_START':
      return {
        ...state,
        isSubmitting: true,
        errors: {}
      };
    
    case 'SUBMIT_SUCCESS':
      return formInitialState;
    
    case 'SUBMIT_ERROR':
      return {
        ...state,
        isSubmitting: false,
        errors: { form: action.error }
      };
    
    default:
      return state;
  }
}

function RegistrationForm() {
  const [state, dispatch] = useReducer(formReducer, formInitialState);
  
  const handleChange = (e) => {
    dispatch({
      type: 'SET_FIELD',
      field: e.target.name,
      value: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: 'SUBMIT_START' });
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify({
          username: state.username,
          email: state.email,
          password: state.password
        })
      });
      
      if (response.ok) {
        dispatch({ type: 'SUBMIT_SUCCESS' });
      } else {
        const data = await response.json();
        dispatch({ type: 'SET_ERRORS', errors: data.errors });
      }
    } catch (error) {
      dispatch({ type: 'SUBMIT_ERROR', error: error.message });
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        value={state.username}
        onChange={handleChange}
      />
      {state.errors.username && <span>{state.errors.username}</span>}
      
      <input
        name="email"
        value={state.email}
        onChange={handleChange}
      />
      {state.errors.email && <span>{state.errors.email}</span>}
      
      <input
        type="password"
        name="password"
        value={state.password}
        onChange={handleChange}
      />
      {state.errors.password && <span>{state.errors.password}</span>}
      
      <button type="submit" disabled={state.isSubmitting}>
        {state.isSubmitting ? 'Submitting...' : 'Register'}
      </button>
      
      {state.errors.form && <div>{state.errors.form}</div>}
    </form>
  );
}
```

### 2.5 useContext

```jsx
import { createContext, useContext, useState } from 'react';

// Создание контекста
const ThemeContext = createContext();

// Provider компонент
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  const value = {
    theme,
    toggleTheme
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook для использования контекста
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Использование
function App() {
  return (
    <ThemeProvider>
      <Header />
      <Main />
    </ThemeProvider>
  );
}

function Header() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header style={{ background: theme === 'light' ? '#fff' : '#333' }}>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </header>
  );
}

// Множественные контексты
const UserContext = createContext();
const SettingsContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({});
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <SettingsContext.Provider value={{ settings, setSettings }}>
        <MainApp />
      </SettingsContext.Provider>
    </UserContext.Provider>
  );
}

// Составной контекст (распространенный паттерн)
const AppContext = createContext();

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState([]);
  
  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);
  
  const addNotification = (notification) => {
    setNotifications(prev => [...prev, notification]);
  };
  
  const value = {
    user,
    theme,
    notifications,
    login,
    logout,
    setTheme,
    addNotification
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
```

### 2.6 Custom Hooks

```jsx
// useFetch - универсальный хук для запросов
function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let cancelled = false;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url, options);
        const json = await response.json();
        
        if (!cancelled) {
          setData(json);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    
    fetchData();
    
    return () => {
      cancelled = true;
    };
  }, [url]);
  
  return { data, loading, error };
}

// Использование
function UserProfile({ userId }) {
  const { data: user, loading, error } = useFetch(`/api/users/${userId}`);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>{user.name}</div>;
}

// useLocalStorage - синхронизация с localStorage
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });
  
  const setStoredValue = (newValue) => {
    try {
      const valueToStore = newValue instanceof Function 
        ? newValue(value) 
        : newValue;
      
      setValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };
  
  return [value, setStoredValue];
}

// Использование
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  
  return (
    <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  );
}

// useDebounce - задержка обновления значения
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

// Использование
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  useEffect(() => {
    if (debouncedSearchTerm) {
      // Выполнить поиск
      console.log('Searching for:', debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);
  
  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}

// useToggle - переключатель
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => {
    setValue(v => !v);
  }, []);
  
  return [value, toggle, setValue];
}

// Использование
function Modal() {
  const [isOpen, toggleOpen] = useToggle(false);
  
  return (
    <div>
      <button onClick={toggleOpen}>Open Modal</button>
      {isOpen && (
        <div className="modal">
          <button onClick={toggleOpen}>Close</button>
        </div>
      )}
    </div>
  );
}

// useOnClickOutside - клик вне элемента
function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

// Использование
function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();
  
  useOnClickOutside(ref, () => setIsOpen(false));
  
  return (
    <div ref={ref}>
      <button onClick={() => setIsOpen(true)}>Open</button>
      {isOpen && <div>Dropdown content</div>}
    </div>
  );
}

// usePrevious - предыдущее значение
function usePrevious(value) {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
}

// useWindowSize - размер окна
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return windowSize;
}
```

## 3. Lists & Keys - Списки и ключи

```jsx
// Базовый список
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}

// ❌ НЕПРАВИЛЬНО - использование индекса как ключа
{items.map((item, index) => (
  <div key={index}>{item}</div>
))}

// ✅ ПРАВИЛЬНО - уникальный ID
{items.map(item => (
  <div key={item.id}>{item.name}</div>
))}

// Список с обработчиками
function ProductList({ products, onDelete }) {
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
          <button onClick={() => onDelete(product.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

// Вложенные списки
function Categories({ categories }) {
  return (
    <div>
      {categories.map(category => (
        <div key={category.id}>
          <h2>{category.name}</h2>
          <ul>
            {category.items.map(item => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// Условный рендеринг в списках
function UserList({ users }) {
  return (
    <div>
      {users.map(user => (
        user.isActive && (
          <div key={user.id}>
            {user.name}
            {user.isPremium && <span>⭐</span>}
          </div>
        )
      ))}
    </div>
  );
}
```

## 4. Формы - Полный гайд

### 4.1 Контролируемые компоненты

```jsx
// Простая форма
function SimpleForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, email });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <button type="submit">Submit</button>
    </form>
  );
}

// Форма с объектом state
function RegistrationForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    country: '',
    terms: false
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
      />
      
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
      />
      
      <input
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm Password"
      />
      
      <input
        name="age"
        type="number"
        value={formData.age}
        onChange={handleChange}
        placeholder="Age"
      />
      
      <select name="country" value={formData.country} onChange={handleChange}>
        <option value="">Select Country</option>
        <option value="us">USA</option>
        <option value="uk">UK</option>
        <option value="ca">Canada</option>
      </select>
      
      <label>
        <input
          name="terms"
          type="checkbox"
          checked={formData.terms}
          onChange={handleChange}
        />
        Accept Terms
      </label>
      
      <button type="submit">Register</button>
    </form>
  );
}

// Форма с валидацией
function FormWithValidation() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const validate = (name, value) => {
    switch (name) {
      case 'email':
        if (!value) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
        return '';
      
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';
      
      default:
        return '';
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    const error = validate(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };
  
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validate(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(Object.keys(formData).reduce((acc, key) => ({
        ...acc,
        [key]: true
      }), {}));
      return;
    }
    
    console.log('Form submitted:', formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Email"
        />
        {touched.email && errors.email && (
          <span className="error">{errors.email}</span>
        )}
      </div>
      
      <div>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Password"
        />
        {touched.password && errors.password && (
          <span className="error">{errors.password}</span>
        )}
      </div>
      
      <button 
        type="submit"
        disabled={Object.keys(errors).some(key => errors[key])}
      >
        Submit
      </button>
    </form>
  );
}

// Multiple choice (radio buttons)
function SurveyForm() {
  const [answer, setAnswer] = useState('');
  
  return (
    <form>
      <label>
        <input
          type="radio"
          value="option1"
          checked={answer === 'option1'}
          onChange={(e) => setAnswer(e.target.value)}
        />
        Option 1
      </label>
      
      <label>
        <input
          type="radio"
          value="option2"
          checked={answer === 'option2'}
          onChange={(e) => setAnswer(e.target.value)}
        />
        Option 2
      </label>
    </form>
  );
}

// Multiple select
function MultiSelectForm() {
  const [selectedOptions, setSelectedOptions] = useState([]);
  
  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedOptions(prev => 
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };
  
  return (
    <div>
      {['option1', 'option2', 'option3'].map(option => (
        <label key={option}>
          <input
            type="checkbox"
            value={option}
            checked={selectedOptions.includes(option)}
            onChange={handleChange}
          />
          {option}
        </label>
      ))}
    </div>
  );
}

// File upload
function FileUploadForm() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*"
      />
      {preview && <img src={preview} alt="Preview" width="200" />}
      <button type="submit" disabled={!file}>Upload</button>
    </form>
  );
}
```

### 4.2 Неконтролируемые компоненты

```jsx
function UncontrolledForm() {
  const nameRef = useRef();
  const emailRef = useRef();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      name: nameRef.current.value,
      email: emailRef.current.value
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input ref={nameRef} defaultValue="John" />
      <input ref={emailRef} type="email" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

## 5. Conditional Rendering - Условный рендеринг

```jsx
// If-Else с переменной
function Greeting({ isLoggedIn }) {
  let content;
  if (isLoggedIn) {
    content = <UserGreeting />;
  } else {
    content = <GuestGreeting />;
  }
  return <div>{content}</div>;
}

// Тернарный оператор
function Greeting({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? <UserGreeting /> : <GuestGreeting />}
    </div>
  );
}

// Логическое И (&&)
function Mailbox({ unreadMessages }) {
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 && (
        <h2>You have {unreadMessages.length} unread messages.</h2>
      )}
    </div>
  );
}

// Логическое ИЛИ (||)
function Username({ username }) {
  return <div>{username || 'Guest'}</div>;
}

// Nullish coalescing (??)
function UserAge({ age }) {
  return <div>Age: {age ?? 'Not specified'}</div>;
}

// Switch statement
function NotificationIcon({ type }) {
  let icon;
  switch (type) {
    case 'success':
      icon = '✅';
      break;
    case 'error':
      icon = '❌';
      break;
    case 'warning':
      icon = '⚠️';
      break;
    default:
      icon = 'ℹ️';
  }
  return <span>{icon}</span>;
}

// Объект для маппинга
function NotificationIcon({ type }) {
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  return <span>{icons[type] || icons.info}</span>;
}

// Early return
function UserProfile({ user }) {
  if (!user) {
    return <div>Please log in</div>;
  }
  
  if (!user.isActive) {
    return <div>Account is inactive</div>;
  }
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

// Множественные условия
function ProductCard({ product, user }) {
  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      
      {user && user.isPremium && product.discount && (
        <span>Discount: {product.discount}%</span>
      )}
      
      {product.inStock ? (
        <button>Add to Cart</button>
      ) : (
        <span>Out of Stock</span>
      )}
    </div>
  );
}

// Render nothing
function ConditionalComponent({ shouldRender }) {
  if (!shouldRender) {
    return null;
  }
  
  return <div>Content</div>;
}
```

## 6. Lifting State Up - Поднятие состояния

```jsx
// Проблема: два компонента должны синхронизировать состояние
// Решение: поднять state до общего родителя

// ❌ Плохо - состояние дублируется
function BadExample() {
  return (
    <div>
      <TemperatureInput scale="c" />
      <TemperatureInput scale="f" />
    </div>
  );
}

function TemperatureInput({ scale }) {
  const [temperature, setTemperature] = useState('');
  // Каждый компонент имеет свое состояние - не синхронизировано!
  
  return (
    <input
      value={temperature}
      onChange={(e) => setTemperature(e.target.value)}
    />
  );
}

// ✅ Хорошо - состояние в родителе
function GoodExample() {
  const [temperature, setTemperature] = useState('');
  const [scale, setScale] = useState('c');
  
  const handleCelsiusChange = (temp) => {
    setScale('c');
    setTemperature(temp);
  };
  
  const handleFahrenheitChange = (temp) => {
    setScale('f');
    setTemperature(temp);
  };
  
  const celsius = scale === 'f' 
    ? tryConvert(temperature, toCelsius)
    : temperature;
    
  const fahrenheit = scale === 'c'
    ? tryConvert(temperature, toFahrenheit)
    : temperature;
  
  return (
    <div>
      <TemperatureInput
        scale="c"
        temperature={celsius}
        onTemperatureChange={handleCelsiusChange}
      />
      <TemperatureInput
        scale="f"
        temperature={fahrenheit}
        onTemperatureChange={handleFahrenheitChange}
      />
      <BoilingVerdict celsius={parseFloat(celsius)} />
    </div>
  );
}

function TemperatureInput({ scale, temperature, onTemperatureChange }) {
  return (
    <fieldset>
      <legend>Enter temperature in {scaleNames[scale]}:</legend>
      <input
        value={temperature}
        onChange={(e) => onTemperatureChange(e.target.value)}
      />
    </fieldset>
  );
}

// Практический пример - Todo List
function TodoApp() {
  const [todos, setTodos] = useState([]);
  
  const addTodo = (text) => {
    setTodos(prev => [...prev, {
      id: Date.now(),
      text,
      completed: false
    }]);
  };
  
  const toggleTodo = (id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };
  
  return (
    <div>
      <TodoInput onAdd={addTodo} />
      <TodoList
        todos={todos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
    </div>
  );
}

function TodoInput({ onAdd }) {
  const [text, setText] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text);
      setText('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add todo..."
      />
      <button type="submit">Add</button>
    </form>
  );
}

function TodoList({ todos, onToggle, onDelete }) {
  return (
    <ul>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span style={{
        textDecoration: todo.completed ? 'line-through' : 'none'
      }}>
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </li>
  );
}
```

## 7. Composition - Композиция компонентов

```jsx
// Children prop
function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

// Использование
<Card>
  <h2>Title</h2>
  <p>Content</p>
</Card>

// Multiple slots
function Dialog({ title, content, actions }) {
  return (
    <div className="dialog">
      <div className="dialog-title">{title}</div>
      <div className="dialog-content">{content}</div>
      <div className="dialog-actions">{actions}</div>
    </div>
  );
}

// Использование
<Dialog
  title={<h2>Confirm</h2>}
  content={<p>Are you sure?</p>}
  actions={
    <>
      <button>Cancel</button>
      <button>Confirm</button>
    </>
  }
/>

// Render props pattern
function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return render(position);
}

// Использование
<MouseTracker
  render={({ x, y }) => (
    <div>Mouse position: {x}, {y}</div>
  )}
/>

// Compound Components pattern
function Tabs({ children }) {
  const [activeIndex, setActiveIndex] = useState(0);
  
  return (
    <div className="tabs">
      {React.Children.map(children, (child, index) => {
        return React.cloneElement(child, {
          isActive: index === activeIndex,
          onActivate: () => setActiveIndex(index)
        });
      })}
    </div>
  );
}

function Tab({ isActive, onActivate, label, children }) {
  return (
    <div>
      <button
        className={isActive ? 'active' : ''}
        onClick={onActivate}
      >
        {label}
      </button>
      {isActive && <div>{children}</div>}
    </div>
  );
}

// Использование
<Tabs>
  <Tab label="Tab 1">Content 1</Tab>
  <Tab label="Tab 2">Content 2</Tab>
  <Tab label="Tab 3">Content 3</Tab>
</Tabs>

// HOC (Higher-Order Component)
function withLoading(Component) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    return <Component {...props} />;
  };
}

// Использование
const UserListWithLoading = withLoading(UserList);

<UserListWithLoading
  isLoading={loading}
  users={users}
/>
```

## 8. Performance Optimization - Оптимизация

### 8.1 React.memo

```jsx
// Без оптимизации - ре-рендерится при каждом рендере родителя
function ExpensiveComponent({ data }) {
  console.log('Rendering ExpensiveComponent');
  return <div>{data}</div>;
}

// С React.memo - ре-рендерится только при изменении props
const ExpensiveComponent = React.memo(function ExpensiveComponent({ data }) {
  console.log('Rendering ExpensiveComponent');
  return <div>{data}</div>;
});

// С кастомным сравнением
const ExpensiveComponent = React.memo(
  function ExpensiveComponent({ user }) {
    return <div>{user.name}</div>;
  },
  (prevProps, nextProps) => {
    // Вернуть true если props равны (НЕ ре-рендерить)
    return prevProps.user.id === nextProps.user.id;
  }
);

// Практический пример
function ParentComponent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  
  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      
      {/* Не ре-рендерится при изменении text */}
      <ExpensiveChild data="static data" />
    </div>
  );
}

const ExpensiveChild = React.memo(({ data }) => {
  console.log('Child rendered');
  return <div>{data}</div>;
});
```

### 8.2 useMemo для дорогих вычислений

```jsx
function ProductList({ products, searchTerm }) {
  // ❌ Плохо - фильтрация при каждом рендере
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // ✅ Хорошо - фильтрация только при изменении зависимостей
  const filteredProducts = useMemo(() => {
    console.log('Filtering products...');
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);
  
  return (
    <ul>
      {filteredProducts.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}

// Сложные вычисления
function DataAnalytics({ data }) {
  const statistics = useMemo(() => {
    console.log('Calculating statistics...');
    
    const sum = data.reduce((acc, val) => acc + val, 0);
    const avg = sum / data.length;
    const max = Math.max(...data);
    const min = Math.min(...data);
    
    return { sum, avg, max, min };
  }, [data]);
  
  return (
    <div>
      <p>Sum: {statistics.sum}</p>
      <p>Average: {statistics.avg}</p>
      <p>Max: {statistics.max}</p>
      <p>Min: {statistics.min}</p>
    </div>
  );
}
```

### 8.3 useCallback для функций

```jsx
function ParentComponent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  
  // ❌ Плохо - новая функция при каждом рендере
  const handleClick = () => {
    console.log('Clicked');
  };
  
  // ✅ Хорошо - та же функция если зависимости не изменились
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []);
  
  const incrementCount = useCallback(() => {
    setCount(c => c + 1);
  }, []);
  
  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <MemoizedChild onClick={incrementCount} />
    </div>
  );
}

const MemoizedChild = React.memo(({ onClick }) => {
  console.log('Child rendered');
  return <button onClick={onClick}>Increment</button>;
});
```

### 8.4 Code Splitting и Lazy Loading

```jsx
import { lazy, Suspense } from 'react';

// Lazy loading компонента
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <HeavyComponent />
      </Suspense>
    </div>
  );
}

// Route-based code splitting
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

// Lazy loading с условием
function ConditionalLazyLoad() {
  const [showHeavy, setShowHeavy] = useState(false);
  
  return (
    <div>
      <button onClick={() => setShowHeavy(true)}>
        Load Heavy Component
      </button>
      
      {showHeavy && (
        <Suspense fallback={<div>Loading...</div>}>
          <HeavyComponent />
        </Suspense>
      )}
    </div>
  );
}
```

### 8.5 Virtualization - Виртуализация длинных списков

```jsx
// Используя react-window
import { FixedSizeList } from 'react-window';

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  );
  
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={35}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}

// Используя react-virtualized
import { List } from 'react-virtualized';

function VirtualizedList({ items }) {
  const rowRenderer = ({ key, index, style }) => (
    <div key={key} style={style}>
      {items[index].name}
    </div>
  );
  
  return (
    <List
      width={300}
      height={600}
      rowCount={items.length}
      rowHeight={35}
      rowRenderer={rowRenderer}
    />
  );
}
```

## 9. Error Boundaries - Обработка ошибок

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
    // Отправить в сервис логирования
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong</h1>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Использование
function App() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}

// Множественные Error Boundaries
function App() {
  return (
    <div>
      <ErrorBoundary fallback={<div>Navigation Error</div>}>
        <Navigation />
      </ErrorBoundary>
      
      <ErrorBoundary fallback={<div>Content Error</div>}>
        <MainContent />
      </ErrorBoundary>
      
      <ErrorBoundary fallback={<div>Sidebar Error</div>}>
        <Sidebar />
      </ErrorBoundary>
    </div>
  );
}
```

## 10. Портал - Portals

```jsx
import { createPortal } from 'react-dom';

// Modal компонент
function Modal({ isOpen, onClose,