# 🎯 Методичка: Паттерны проектирования для React + TypeScript

## 📚 Содержание
1. [Strategy (Стратегия)](#strategy)
2. [Factory (Фабрика)](#factory)
3. [Observer (Наблюдатель)](#observer)
4. [Command (Команда)](#command)
5. [Compound Components (Составные компоненты)](#compound)
6. [Higher-Order Component (HOC)](#hoc)
7. [Render Props](#render-props)
8. [Provider Pattern](#provider)
9. [Custom Hooks Pattern](#custom-hooks)
10. [Presenter/Container Pattern](#presenter-container)

---

<a name="strategy"></a>
## 1. Strategy (Стратегия)

### 📖 Когда использовать:
- Нужно выбирать алгоритм во время выполнения
- Множество похожих операций (валидация, фильтрация, сортировка)
- Избегаем гигантские `if-else` или `switch-case`

### ✅ Применение:
- Системы фильтрации/сортировки
- Валидация форм с разными правилами
- Обработка платежей (разные платёжные системы)
- Форматирование данных

### 💻 Пример: Валидация форм

```typescript
// Интерфейс стратегии
type ValidationStrategy = (value: string) => string | null;

// Конкретные стратегии
const validationStrategies: Record<string, ValidationStrategy> = {
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : 'Неверный формат email';
  },
  
  password: (value) => {
    if (value.length < 8) return 'Минимум 8 символов';
    if (!/[A-Z]/.test(value)) return 'Нужна заглавная буква';
    if (!/[0-9]/.test(value)) return 'Нужна цифра';
    return null;
  },
  
  phone: (value) => {
    const phoneRegex = /^\+?[1-9]\d{10,14}$/;
    return phoneRegex.test(value) ? null : 'Неверный формат телефона';
  },
  
  required: (value) => {
    return value.trim() ? null : 'Обязательное поле';
  }
};

// Компонент
interface FormFieldProps {
  value: string;
  onChange: (value: string) => void;
  validationType: keyof typeof validationStrategies;
  label: string;
}

const FormField: React.FC<FormFieldProps> = ({ 
  value, 
  onChange, 
  validationType, 
  label 
}) => {
  const [error, setError] = useState<string | null>(null);

  const validate = () => {
    const strategy = validationStrategies[validationType];
    const result = strategy(value);
    setError(result);
  };

  return (
    <div>
      <label>{label}</label>
      <input 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        onBlur={validate}
      />
      {error && <span style={{ color: 'red' }}>{error}</span>}
    </div>
  );
};

// Использование
<FormField 
  value={email}
  onChange={setEmail}
  validationType="email"
  label="Email"
/>
```

---

<a name="factory"></a>
## 2. Factory (Фабрика)

### 📖 Когда использовать:
- Создание объектов/компонентов по условию
- Сложная логика инициализации
- Нужно скрыть детали создания от клиента

### ✅ Применение:
- Динамическая отрисовка разных типов контента
- Создание уведомлений (success, error, warning)
- Генерация UI элементов по типу данных

### 💻 Пример: Фабрика уведомлений

```typescript
// Типы уведомлений
type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  type: NotificationType;
  message: string;
  icon: string;
  backgroundColor: string;
}

// Фабрика
class NotificationFactory {
  private static configs: Record<NotificationType, Omit<Notification, 'message'>> = {
    success: {
      type: 'success',
      icon: '✓',
      backgroundColor: '#4caf50'
    },
    error: {
      type: 'error',
      icon: '✕',
      backgroundColor: '#f44336'
    },
    warning: {
      type: 'warning',
      icon: '⚠',
      backgroundColor: '#ff9800'
    },
    info: {
      type: 'info',
      icon: 'ℹ',
      backgroundColor: '#2196f3'
    }
  };

  static create(type: NotificationType, message: string): Notification {
    return {
      ...this.configs[type],
      message
    };
  }
}

// Компонент
interface NotificationProps {
  notification: Notification;
}

const NotificationComponent: React.FC<NotificationProps> = ({ notification }) => {
  return (
    <div style={{ 
      backgroundColor: notification.backgroundColor,
      padding: '16px',
      borderRadius: '8px',
      color: 'white'
    }}>
      <span style={{ marginRight: '8px' }}>{notification.icon}</span>
      {notification.message}
    </div>
  );
};

// Использование
const App = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (type: NotificationType, message: string) => {
    const notification = NotificationFactory.create(type, message);
    setNotifications(prev => [...prev, notification]);
  };

  return (
    <div>
      <button onClick={() => addNotification('success', 'Успешно сохранено!')}>
        Success
      </button>
      <button onClick={() => addNotification('error', 'Произошла ошибка')}>
        Error
      </button>
      
      {notifications.map((notif, i) => (
        <NotificationComponent key={i} notification={notif} />
      ))}
    </div>
  );
};
```

---

<a name="observer"></a>
## 3. Observer (Наблюдатель)

### 📖 Когда использовать:
- Один объект изменяется → много других реагируют
- Реактивные обновления UI
- Event-driven архитектура

### ✅ Применение:
- Системы уведомлений
- Логирование действий пользователя
- Синхронизация состояния между компонентами
- WebSocket подписки

### 💻 Пример: Event Bus для уведомлений

```typescript
// Event Bus (Observable)
type EventCallback = (data: any) => void;

class EventBus {
  private events: Map<string, EventCallback[]> = new Map();

  subscribe(eventName: string, callback: EventCallback): () => void {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    
    this.events.get(eventName)!.push(callback);

    // Возвращаем функцию отписки
    return () => {
      const callbacks = this.events.get(eventName);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) callbacks.splice(index, 1);
      }
    };
  }

  publish(eventName: string, data?: any): void {
    const callbacks = this.events.get(eventName);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }
}

// Singleton instance
export const eventBus = new EventBus();

// Компонент-издатель
const UserForm: React.FC = () => {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    // Публикуем событие
    eventBus.publish('user:created', { name, timestamp: Date.now() });
    setName('');
  };

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={handleSubmit}>Создать пользователя</button>
    </div>
  );
};

// Компонент-подписчик
const ActivityLog: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Подписываемся на событие
    const unsubscribe = eventBus.subscribe('user:created', (data) => {
      setLogs(prev => [...prev, `Создан пользователь: ${data.name}`]);
    });

    // Отписываемся при размонтировании
    return unsubscribe;
  }, []);

  return (
    <div>
      <h3>Лог активности:</h3>
      {logs.map((log, i) => <div key={i}>{log}</div>)}
    </div>
  );
};
```

---

<a name="command"></a>
## 4. Command (Команда)

### 📖 Когда использовать:
- Нужен Undo/Redo функционал
- Очередь операций
- Логирование всех действий
- Отложенное выполнение

### ✅ Применение:
- Редакторы (текст, графика)
- Управление состоянием с историей
- Макросы и автоматизация
- Транзакции

### 💻 Пример: Undo/Redo для текстового редактора

```typescript
// Интерфейс команды
interface Command {
  execute(): void;
  undo(): void;
}

// Конкретная команда
class InsertTextCommand implements Command {
  private prevText: string;

  constructor(
    private editor: { text: string },
    private newText: string,
    private position: number
  ) {
    this.prevText = editor.text;
  }

  execute(): void {
    const before = this.editor.text.slice(0, this.position);
    const after = this.editor.text.slice(this.position);
    this.editor.text = before + this.newText + after;
  }

  undo(): void {
    this.editor.text = this.prevText;
  }
}

// История команд
class CommandHistory {
  private history: Command[] = [];
  private currentIndex = -1;

  execute(command: Command): void {
    // Удаляем "будущее" если мы не в конце истории
    this.history = this.history.slice(0, this.currentIndex + 1);
    
    command.execute();
    this.history.push(command);
    this.currentIndex++;
  }

  undo(): void {
    if (this.currentIndex >= 0) {
      this.history[this.currentIndex].undo();
      this.currentIndex--;
    }
  }

  redo(): void {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      this.history[this.currentIndex].execute();
    }
  }

  canUndo(): boolean {
    return this.currentIndex >= 0;
  }

  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }
}

// React компонент
const TextEditor: React.FC = () => {
  const [editor] = useState({ text: '' });
  const [history] = useState(new CommandHistory());
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const insertText = (text: string, position: number) => {
    const command = new InsertTextCommand(editor, text, position);
    history.execute(command);
    forceUpdate();
  };

  const handleUndo = () => {
    history.undo();
    forceUpdate();
  };

  const handleRedo = () => {
    history.redo();
    forceUpdate();
  };

  return (
    <div>
      <div>
        <button onClick={handleUndo} disabled={!history.canUndo()}>
          Undo
        </button>
        <button onClick={handleRedo} disabled={!history.canRedo()}>
          Redo
        </button>
      </div>
      
      <textarea 
        value={editor.text}
        onChange={(e) => {
          const newText = e.target.value;
          const diff = newText.length - editor.text.length;
          if (diff > 0) {
            const addedText = newText.slice(editor.text.length);
            insertText(addedText, editor.text.length);
          }
        }}
      />
    </div>
  );
};
```

---

<a name="compound"></a>
## 5. Compound Components (Составные компоненты)

### 📖 Когда использовать:
- Компоненты должны работать вместе
- Нужна гибкая композиция
- Скрываем сложную логику от пользователя

### ✅ Применение:
- Dropdown меню
- Tabs компоненты
- Accordion/Collapse
- Modal окна

### 💻 Пример: Tabs компонент

```typescript
// Context для связи компонентов
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('useTabs must be used within Tabs');
  return context;
};

// Главный компонент
interface TabsProps {
  children: React.ReactNode;
  defaultTab?: string;
}

const Tabs: React.FC<TabsProps> & {
  List: typeof TabsList;
  Tab: typeof Tab;
  Panel: typeof TabPanel;
} = ({ children, defaultTab = '' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
};

// Суб-компоненты
const TabsList: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #ddd' }}>{children}</div>;
};

interface TabProps {
  id: string;
  children: React.ReactNode;
}

const Tab: React.FC<TabProps> = ({ id, children }) => {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === id;

  return (
    <button
      onClick={() => setActiveTab(id)}
      style={{
        padding: '12px 24px',
        border: 'none',
        background: isActive ? '#2196f3' : 'transparent',
        color: isActive ? 'white' : 'black',
        cursor: 'pointer',
        borderRadius: '4px 4px 0 0'
      }}
    >
      {children}
    </button>
  );
};

interface TabPanelProps {
  id: string;
  children: React.ReactNode;
}

const TabPanel: React.FC<TabPanelProps> = ({ id, children }) => {
  const { activeTab } = useTabs();
  
  if (activeTab !== id) return null;
  
  return <div style={{ padding: '16px' }}>{children}</div>;
};

// Связываем суб-компоненты
Tabs.List = TabsList;
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;

// Использование
const App = () => {
  return (
    <Tabs defaultTab="profile">
      <Tabs.List>
        <Tabs.Tab id="profile">Профиль</Tabs.Tab>
        <Tabs.Tab id="settings">Настройки</Tabs.Tab>
        <Tabs.Tab id="notifications">Уведомления</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel id="profile">
        <h2>Профиль пользователя</h2>
      </Tabs.Panel>
      
      <Tabs.Panel id="settings">
        <h2>Настройки приложения</h2>
      </Tabs.Panel>
      
      <Tabs.Panel id="notifications">
        <h2>Центр уведомлений</h2>
      </Tabs.Panel>
    </Tabs>
  );
};
```

---

<a name="hoc"></a>
## 6. Higher-Order Component (HOC)

### 📖 Когда использовать:
- Переиспользование логики между компонентами
- Добавление функциональности "сверху"
- Middleware для компонентов

### ✅ Применение:
- Проверка авторизации
- Логирование
- Обработка ошибок
- Загрузка данных

### 💻 Пример: HOC для авторизации

```typescript
// HOC для защиты роутов
interface WithAuthProps {
  user: { name: string; role: string } | null;
}

function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: string
) {
  return (props: Omit<P, keyof WithAuthProps>) => {
    const [user, setUser] = useState<WithAuthProps['user']>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      // Имитация проверки авторизации
      setTimeout(() => {
        const mockUser = { name: 'John', role: 'admin' };
        setUser(mockUser);
        setLoading(false);
      }, 1000);
    }, []);

    if (loading) {
      return <div>Загрузка...</div>;
    }

    if (!user) {
      return <div>Необходима авторизация</div>;
    }

    if (requiredRole && user.role !== requiredRole) {
      return <div>Недостаточно прав доступа</div>;
    }

    return <Component {...(props as P)} user={user} />;
  };
}

// Использование
interface DashboardProps extends WithAuthProps {
  title: string;
}

const Dashboard: React.FC<DashboardProps> = ({ user, title }) => {
  return (
    <div>
      <h1>{title}</h1>
      <p>Привет, {user?.name}!</p>
    </div>
  );
};

// Защищённый компонент
const ProtectedDashboard = withAuth(Dashboard, 'admin');

// В App
<ProtectedDashboard title="Панель администратора" />
```

---

<a name="render-props"></a>
## 7. Render Props

### 📖 Когда использовать:
- Нужна гибкость в рендеринге
- Переиспользование логики с разным UI
- Инверсия контроля рендеринга

### ✅ Применение:
- Списки с кастомным рендерингом
- Состояния загрузки
- Tooltip/Popover компоненты

### 💻 Пример: DataFetcher с render props

```typescript
interface DataFetcherProps<T> {
  url: string;
  children: (state: {
    data: T | null;
    loading: boolean;
    error: Error | null;
    refetch: () => void;
  }) => React.ReactNode;
}

function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url);
      const json = await response.json();
      setData(json);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return <>{children({ data, loading, error, refetch: fetchData })}</>;
}

// Использование
interface User {
  id: number;
  name: string;
  email: string;
}

const UserList = () => {
  return (
    <DataFetcher<User[]> url="/api/users">
      {({ data, loading, error, refetch }) => {
        if (loading) return <div>Загрузка...</div>;
        if (error) return <div>Ошибка: {error.message}</div>;
        
        return (
          <div>
            <button onClick={refetch}>Обновить</button>
            <ul>
              {data?.map(user => (
                <li key={user.id}>{user.name} - {user.email}</li>
              ))}
            </ul>
          </div>
        );
      }}
    </DataFetcher>
  );
};
```

---

<a name="provider"></a>
## 8. Provider Pattern

### 📖 Когда использовать:
- Глобальное состояние
- Избегаем prop drilling
- Конфигурация приложения

### ✅ Применение:
- Темы (theme)
- Локализация (i18n)
- Авторизация
- Настройки приложения

### 💻 Пример: Theme Provider

```typescript
// Типы темы
type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  colors: {
    background: string;
    text: string;
    primary: string;
  };
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// Custom hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

// Provider
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  const themes = {
    light: {
      background: '#ffffff',
      text: '#000000',
      primary: '#2196f3'
    },
    dark: {
      background: '#1a1a1a',
      text: '#ffffff',
      primary: '#90caf9'
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const value: ThemeContextValue = {
    theme,
    toggleTheme,
    colors: themes[theme]
  };

  return (
    <ThemeContext.Provider value={value}>
      <div style={{ 
        backgroundColor: themes[theme].background,
        color: themes[theme].text,
        minHeight: '100vh'
      }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

// Использование в компонентах
const Header = () => {
  const { theme, toggleTheme, colors } = useTheme();

  return (
    <header style={{ background: colors.primary, padding: '16px' }}>
      <h1>Моё приложение</h1>
      <button onClick={toggleTheme}>
        Переключить на {theme === 'light' ? 'тёмную' : 'светлую'} тему
      </button>
    </header>
  );
};

// В App.tsx
const App = () => {
  return (
    <ThemeProvider>
      <Header />
      <main>Контент приложения</main>
    </ThemeProvider>
  );
};
```

---

<a name="custom-hooks"></a>
## 9. Custom Hooks Pattern

### 📖 Когда использовать:
- Переиспользуемая логика состояния
- Абстракция сложных эффектов
- Композиция поведения

### ✅ Применение:
- Работа с API
- Обработка форм
- WebSocket подключения
- LocalStorage синхронизация

### 💻 Пример: useLocalStorage hook

```typescript
function useLocalStorage<T>(key: string, initialValue: T) {
  // Ленивая инициализация
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // Обёртка над setState
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  // Синхронизация между вкладками
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue] as const;
}

// Использование
const UserSettings = () => {
  const [settings, setSettings] = useLocalStorage('userSettings', {
    notifications: true,
    theme: 'light'
  });

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={settings.notifications}
          onChange={(e) => setSettings({
            ...settings,
            notifications: e.target.checked
          })}
        />
        Уведомления
      </label>
      
      <select
        value={settings.theme}
        onChange={(e) => setSettings({
          ...settings,
          theme: e.target.value
        })}
      >
        <option value="light">Светлая</option>
        <option value="dark">Тёмная</option>
      </select>
    </div>
  );
};
```

### 💻 Пример: useDebounce hook

```typescript
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Использование: поиск с задержкой
const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Выполняем поиск только после 500мс бездействия
      fetch(`/api/search?q=${debouncedSearchTerm}`)
        .then(res => res.json())
        .then(data => console.log(data));
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Поиск..."
    />
  );
};
```

---

<a name="presenter-container"></a>
## 10. Presenter/Container Pattern

### 📖 Когда использовать:
- Разделение логики и представления
- Тестирование UI отдельно от логики
- Переиспользование UI с разной логикой

### ✅ Применение:
- Сложные формы
- Списки с фильтрацией
- Дашборды
- Любые компоненты с бизнес-логикой

### 💻 Пример: Todo List

```typescript
// Presenter (чистый UI, без логики)
interface TodoListPresenterProps {
  todos: Array<{ id: string; text: string; completed: boolean }>;
  filter: 'all' | 'active' | 'completed';
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
  onAdd: (text: string) => void;
}

const TodoListPresenter: React.FC<TodoListPresenterProps> = ({
  todos,
  filter,
  onToggle,
  onDelete,
  onFilterChange,
  onAdd
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onAdd(input);
      setInput('');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Новая задача..."
        />
        <button type="submit">Добавить</button>
      </form>

      <div>
        {['all', 'active', 'completed'].map(f => (
          <button
            key={f}
            onClick={() => onFilterChange(f as any)}
            style={{ fontWeight: filter === f ? 'bold' : 'normal' }}
          >
            {f}