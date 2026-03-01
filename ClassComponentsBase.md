# React Class Components
### Полная методичка — жизненный цикл, state, паттерны, отличия от хуков

---

## Что такое классовый компонент

Классовый компонент — это ES6-класс, который наследует `React.Component` или `React.PureComponent` и имеет обязательный метод `render()`.

```tsx
import React from "react";

class MyComponent extends React.Component {
  render() {
    return <div>Hello</div>;
  }
}
```

> Сегодня классовые компоненты считаются **legacy**, но активно встречаются в старых кодовых базах. Знать их на Middle+ обязательно.

---

## Структура классового компонента

```tsx
import React from "react";

// Типизация пропсов и стейта
interface Props {
  title: string;
  initialCount?: number;
}

interface State {
  count: number;
  loading: boolean;
}

class Counter extends React.Component<Props, State> {
  // 1. Инициализация state
  state: State = {
    count: this.props.initialCount ?? 0,
    loading: false,
  };

  // 2. Методы (стрелочные — чтобы не терять this)
  handleIncrement = () => {
    this.setState(prev => ({ count: prev.count + 1 }));
  };

  // 3. Обязательный метод render
  render() {
    const { title } = this.props;
    const { count } = this.state;

    return (
      <div>
        <h1>{title}</h1>
        <p>Count: {count}</p>
        <button onClick={this.handleIncrement}>+</button>
      </div>
    );
  }
}
```

---

## State и setState

### Инициализация state

```tsx
class MyComponent extends React.Component<Props, State> {
  // Способ 1 — как поле класса (современный, рекомендуется)
  state: State = { count: 0 };

  // Способ 2 — через constructor (старый стиль)
  constructor(props: Props) {
    super(props); // обязательно!
    this.state = { count: 0 };
  }
}
```

### setState — обновление состояния

`setState` — **асинхронный**. React может батчить несколько вызовов.

```tsx
// ❌ Неправильно — читаем this.state внутри setState
this.setState({ count: this.state.count + 1 });

// ✅ Правильно — функциональный setState (получаем актуальный state)
this.setState(prevState => ({ count: prevState.count + 1 }));

// setState с callback — выполняется ПОСЛЕ обновления DOM
this.setState({ count: 0 }, () => {
  console.log("State обновлён:", this.state.count); // 0
});

// Частичное обновление — React делает shallow merge
this.setState({ loading: true }); // count не трогается
```

### Почему нельзя менять state напрямую

```tsx
// ❌ Неправильно — React не узнает об изменении, ре-рендера не будет
this.state.count = 5;

// ✅ Всегда через setState
this.setState({ count: 5 });
```

---

## Жизненный цикл (Lifecycle)

```
Mounting      →  Updating     →  Unmounting
─────────────    ──────────      ──────────
constructor      getDerivedStateFromProps
render           shouldComponentUpdate
DOM update       render
componentDidMount  getSnapshotBeforeUpdate
                 componentDidUpdate
                                componentWillUnmount
```

### Mounting (монтирование)

```tsx
class MyComponent extends React.Component<Props, State> {
  state = { data: null };

  // 1. constructor — инициализация (если нужен)
  constructor(props: Props) {
    super(props);
    this.state = { data: null };
  }

  // 2. render — обязательный, возвращает JSX
  render() {
    return <div>{this.state.data}</div>;
  }

  // 3. componentDidMount — после вставки в DOM
  // Аналог useEffect(() => {}, [])
  componentDidMount() {
    // Здесь можно: fetch, подписки, работа с DOM, таймеры
    fetch("/api/data")
      .then(res => res.json())
      .then(data => this.setState({ data }));
  }
}
```

### Updating (обновление)

```tsx
// Вызывается при каждом обновлении props или state
// Аналог useEffect(() => {}, [props.id])
componentDidUpdate(prevProps: Props, prevState: State) {
  // Всегда сравнивай! Без условия — бесконечный цикл
  if (prevProps.userId !== this.props.userId) {
    this.fetchUser(this.props.userId);
  }

  if (prevState.count !== this.state.count) {
    console.log("count изменился:", this.state.count);
  }
}
```

### Unmounting (размонтирование)

```tsx
// Аналог return () => {} в useEffect
componentWillUnmount() {
  // Чистим за собой: отписки, таймеры, отмена запросов
  clearInterval(this.timerId);
  this.subscription.unsubscribe();
  this.controller.abort();
}
```

### shouldComponentUpdate

```tsx
// Оптимизация — контролируем, нужен ли ре-рендер
// Аналог React.memo для классов
shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
  // Ре-рендер только если count изменился
  return nextState.count !== this.state.count;
}
```

### getDerivedStateFromProps

```tsx
// Статический метод — вызывается перед каждым render
// Для синхронизации state с props (используй редко!)
static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
  if (props.initialCount !== state.count) {
    return { count: props.initialCount }; // обновляем state
  }
  return null; // state не меняем
}
```

### getSnapshotBeforeUpdate

```tsx
// Вызывается прямо перед обновлением DOM
// Возвращаемое значение передаётся в componentDidUpdate
getSnapshotBeforeUpdate(prevProps: Props, prevState: State): number | null {
  // Пример: запомнить позицию скролла перед обновлением
  if (prevProps.messages.length < this.props.messages.length) {
    return this.listRef.scrollHeight;
  }
  return null;
}

componentDidUpdate(prevProps: Props, prevState: State, snapshot: number | null) {
  if (snapshot !== null) {
    this.listRef.scrollTop += this.listRef.scrollHeight - snapshot;
  }
}
```

---

## React.PureComponent

Автоматически реализует `shouldComponentUpdate` с **поверхностным сравнением** (shallow compare) props и state.

```tsx
// React.Component — ре-рендерится при каждом setState родителя
class Regular extends React.Component<Props> { ... }

// React.PureComponent — ре-рендерится только если props/state изменились
class Pure extends React.PureComponent<Props> { ... }
```

**Важно:** shallow compare — только первый уровень. Вложенные объекты сравниваются по ссылке.

```tsx
// ❌ Не сработает — объект тот же по ссылке, shallow compare не видит изменения
this.setState({ user: this.state.user }); // user.name изменился внутри

// ✅ Создаём новый объект
this.setState({ user: { ...this.state.user, name: "New Name" } });
```

---

## Error Boundaries

**Единственное**, для чего классовые компоненты незаменимы в 2024+. Функциональные компоненты не могут быть Error Boundary.

```tsx
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  // Вызывается при ошибке в дочерних компонентах
  // Возвращает новый state (аналог getDerivedStateFromProps)
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  // Для логирования ошибок (Sentry, аналитика)
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Ошибка:", error);
    console.error("Компонент:", info.componentStack);
    Sentry.captureException(error);
  }

  render() {
    if (this.state.hasError) {
      return <div>Что-то пошло не так: {this.state.error?.message}</div>;
    }
    return this.props.children;
  }
}

// Использование
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

> В 2024+ появился хук `use()` и экспериментальный `useErrorBoundary` в некоторых библиотеках, но официального API для function component Error Boundary в React пока нет.

---

## Работа с ref

```tsx
class MyInput extends React.Component {
  // Создание ref
  inputRef = React.createRef<HTMLInputElement>();

  componentDidMount() {
    // Фокус после монтирования
    this.inputRef.current?.focus();
  }

  render() {
    return <input ref={this.inputRef} />;
  }
}
```

---

## Callback refs (старый стиль)

```tsx
class MyComponent extends React.Component {
  inputEl: HTMLInputElement | null = null;

  setRef = (el: HTMLInputElement | null) => {
    this.inputEl = el;
  };

  render() {
    return <input ref={this.setRef} />;
  }
}
```

---

## Context в классовых компонентах

```tsx
const ThemeContext = React.createContext("light");

// Способ 1 — contextType (только один контекст)
class MyComponent extends React.Component {
  static contextType = ThemeContext;
  context!: React.ContextType<typeof ThemeContext>;

  render() {
    return <div className={this.context}>Content</div>; // "light" или "dark"
  }
}

// Способ 2 — Consumer (несколько контекстов)
class MyComponent extends React.Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {theme => <div className={theme}>Content</div>}
      </ThemeContext.Consumer>
    );
  }
}
```

---

## Проблема потери `this`

В классах `this` зависит от контекста вызова. Обработчики событий теряют `this`.

```tsx
class MyComponent extends React.Component {
  // ❌ Способ 1 — обычный метод, this теряется при передаче в onClick
  handleClick() {
    console.log(this.state); // TypeError: Cannot read properties of undefined
  }

  // ✅ Способ 2 — стрелочная функция (рекомендуется)
  handleClick = () => {
    console.log(this.state); // работает
  };

  // ✅ Способ 3 — bind в constructor
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  // ✅ Способ 4 — bind в JSX (создаёт новую функцию на каждый рендер — не рекомендуется)
  render() {
    return <button onClick={this.handleClick.bind(this)}>Click</button>;
  }
}
```

---

## Сравнение: Class vs Hooks

| | Class Component | Function + Hooks |
|---|---|---|
| State | `this.setState()` | `useState()` |
| Монтирование | `componentDidMount` | `useEffect(() => {}, [])` |
| Обновление | `componentDidUpdate` | `useEffect(() => {}, [deps])` |
| Размонтирование | `componentWillUnmount` | `return () => {}` в useEffect |
| Оптимизация | `PureComponent` / `shouldComponentUpdate` | `React.memo` / `useMemo` |
| Контекст | `contextType` / `Consumer` | `useContext()` |
| Ref | `createRef()` | `useRef()` |
| Error Boundary | ✅ Только классы | ❌ Недоступно |
| Переиспользование логики | HOC, Render Props | Кастомные хуки |
| Читаемость | Больше boilerplate | Компактнее |

---

## Устаревшие методы (знать, но не использовать)

```tsx
// ❌ UNSAFE — переименованы с React 16.3, удалены тренды в пользу аналогов
UNSAFE_componentWillMount()       // → используй componentDidMount
UNSAFE_componentWillReceiveProps() // → используй getDerivedStateFromProps
UNSAFE_componentWillUpdate()       // → используй getSnapshotBeforeUpdate
```

Эти методы вызывают проблемы с Concurrent Mode и Suspense. Если встречаешь в коде — флаг для рефакторинга.

---

## Когда классовые компоненты нужны сегодня

1. **Error Boundary** — единственный реальный use-case
2. **Легаси кодовая база** — читать, понимать, постепенно мигрировать
3. **Некоторые сторонние библиотеки** — требуют классы

**Во всех остальных случаях — функциональные компоненты + хуки.**

---

## Быстрый шаблон Error Boundary (копипаст)

```tsx
class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{ fallback?: React.ReactNode }>,
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <div>Что-то пошло не так</div>;
    }
    return this.props.children;
  }
}
```