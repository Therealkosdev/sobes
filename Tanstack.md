# TanStack Query (React Query)
### Полная методичка — fetching, caching, mutations, паттерны, оптимизация

---

## Что такое TanStack Query

TanStack Query — библиотека для управления **серверным состоянием** (server state): загрузка, кеширование, синхронизация и обновление данных с сервера.

**Ключевая идея:** серверные данные — это не то же самое, что клиентский state. Они устаревают, требуют повторной загрузки и синхронизации. Zustand/Redux для этого не предназначены.

**Что решает TanStack Query:**
- Кеширование и дедупликация запросов
- Фоновое обновление устаревших данных
- Состояния loading / error / success из коробки
- Повторные попытки при ошибке
- Оптимистичные обновления
- Пагинация и бесконечная прокрутка

```bash
npm install @tanstack/react-query
```

---

## Настройка — QueryClient и Provider

```tsx
// main.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,  // данные свежие 5 минут
      gcTime: 1000 * 60 * 10,    // кеш хранится 10 минут (бывший cacheTime)
      retry: 2,                   // 2 повтора при ошибке
      refetchOnWindowFocus: true, // обновление при фокусе окна
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

---

## useQuery — загрузка данных

```tsx
import { useQuery } from "@tanstack/react-query";

function UserProfile({ userId }: { userId: string }) {
  const {
    data,          // данные (undefined пока грузится)
    isLoading,     // true только при первой загрузке без кеша
    isFetching,    // true при любом фоновом запросе
    isError,       // true при ошибке
    error,         // объект ошибки
    isSuccess,     // true при успехе
    refetch,       // ручной рефетч
  } = useQuery({
    queryKey: ["user", userId],   // ключ кеша — массив
    queryFn: () => api.getUser(userId), // функция загрузки
  });

  if (isLoading) return <Skeleton />;
  if (isError) return <Error message={error.message} />;

  return <div>{data.name}</div>;
}
```

---

## queryKey — ключ кеша

`queryKey` — идентификатор кеша. Массив, где каждый элемент влияет на кеширование.

```ts
// Статический ключ
queryKey: ["users"]

// Динамический ключ — разные данные для разных id
queryKey: ["user", userId]           // ["user", "1"] ≠ ["user", "2"]

// Составной ключ — фильтры, пагинация
queryKey: ["users", { page: 1, filter: "active" }]
queryKey: ["users", "list", { status: "active" }]
```

**Соглашение (Query Key Factory):**

```ts
// queries/userKeys.ts — централизованные ключи
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: UserFilters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// Использование:
queryKey: userKeys.detail(userId)       // ["users", "detail", "123"]
queryKey: userKeys.list({ active: true }) // ["users", "list", { active: true }]

// Инвалидация всех users сразу:
queryClient.invalidateQueries({ queryKey: userKeys.all });
```

---

## queryFn — функция загрузки

```ts
// Простой fetch
queryFn: () => fetch("/api/users").then(res => res.json())

// С axios
queryFn: () => axios.get<User[]>("/api/users").then(res => res.data)

// С параметрами из queryKey
queryFn: ({ queryKey }) => {
  const [, userId] = queryKey; // деструктурируем ключ
  return api.getUser(userId as string);
}

// С AbortController (автоматически передаётся)
queryFn: ({ signal }) =>
  fetch(`/api/users/${userId}`, { signal }).then(res => res.json())
```

---

## Опции useQuery

```ts
useQuery({
  queryKey: ["user", userId],
  queryFn: () => api.getUser(userId),

  // Свежесть данных (не рефетчить, если данные свежее)
  staleTime: 1000 * 60 * 5,    // 5 минут (default: 0)

  // Время хранения неактивного кеша
  gcTime: 1000 * 60 * 10,      // 10 минут (default: 5 мин)

  // Условный запрос — не выполнять если нет userId
  enabled: !!userId,

  // Повторы при ошибке
  retry: 3,
  retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // exponential backoff

  // Рефетч по расписанию (например, live-данные)
  refetchInterval: 1000 * 30,  // каждые 30 секунд

  // Трансформация данных
  select: (data) => data.users.filter(u => u.active),

  // Плейсхолдер пока нет кеша (не показывается isLoading)
  placeholderData: { name: "Loading...", id: "" },

  // Данные из предыдущего queryKey пока грузятся новые
  placeholderData: keepPreviousData, // импорт из @tanstack/react-query
});
```

---

## useMutation — изменение данных

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";

function CreateUserForm() {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: (data: CreateUserDto) => api.createUser(data),

    // После успеха — инвалидируем кеш
    onSuccess: (newUser) => {
      // Вариант 1: инвалидировать — TQ сам перезагрузит
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      // Вариант 2: обновить кеш вручную (без доп. запроса)
      queryClient.setQueryData(userKeys.detail(newUser.id), newUser);
    },

    onError: (error) => {
      toast.error(`Ошибка: ${error.message}`);
    },

    onSettled: () => {
      // Вызывается всегда (успех или ошибка)
      setFormLoading(false);
    },
  });

  const handleSubmit = (data: CreateUserDto) => {
    mutate(data); // fire and forget

    // или await:
    // await mutateAsync(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" disabled={isPending}>
        {isPending ? "Создание..." : "Создать"}
      </button>
      {isError && <p>{error.message}</p>}
    </form>
  );
}
```

---

## Инвалидация и обновление кеша

```ts
const queryClient = useQueryClient();

// Инвалидировать (пометить устаревшим — рефетч при следующем использовании)
queryClient.invalidateQueries({ queryKey: ["users"] });

// Инвалидировать и сразу рефетчить
queryClient.invalidateQueries({ queryKey: ["users"], refetchType: "active" });

// Обновить кеш вручную (без запроса)
queryClient.setQueryData(["user", userId], updatedUser);

// Обновить через функцию (как setState)
queryClient.setQueryData<User>(["user", userId], (old) => ({
  ...old!,
  name: "New Name",
}));

// Получить данные из кеша
const user = queryClient.getQueryData<User>(["user", userId]);

// Предзагрузить данные (например, при hover)
queryClient.prefetchQuery({
  queryKey: ["user", userId],
  queryFn: () => api.getUser(userId),
});
```

---

## Оптимистичное обновление

Обновляем UI **до** ответа сервера, откатываем при ошибке.

```ts
const queryClient = useQueryClient();

const { mutate } = useMutation({
  mutationFn: (updatedUser: User) => api.updateUser(updatedUser),

  onMutate: async (updatedUser) => {
    // 1. Отменяем фоновые запросы (чтобы не затёрли оптимистик)
    await queryClient.cancelQueries({ queryKey: userKeys.detail(updatedUser.id) });

    // 2. Сохраняем предыдущее значение (для отката)
    const previousUser = queryClient.getQueryData<User>(userKeys.detail(updatedUser.id));

    // 3. Обновляем кеш оптимистично
    queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);

    // 4. Возвращаем контекст для onError
    return { previousUser };
  },

  onError: (error, updatedUser, context) => {
    // Откатываем к предыдущему значению
    queryClient.setQueryData(
      userKeys.detail(updatedUser.id),
      context?.previousUser
    );
  },

  onSettled: (data, error, updatedUser) => {
    // Синхронизируем с сервером в любом случае
    queryClient.invalidateQueries({ queryKey: userKeys.detail(updatedUser.id) });
  },
});
```

---

## Dependent Queries (зависимые запросы)

```ts
// Запрос 2 зависит от результата запроса 1
function UserOrders({ userId }: { userId: string }) {
  const { data: user } = useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => api.getUser(userId),
  });

  const { data: orders } = useQuery({
    queryKey: ["orders", user?.accountId],
    queryFn: () => api.getOrders(user!.accountId),
    enabled: !!user?.accountId, // не запускать пока нет accountId
  });
}
```

---

## Parallel Queries

```ts
// Несколько независимых запросов одновременно
function Dashboard() {
  const usersQuery = useQuery({ queryKey: ["users"], queryFn: api.getUsers });
  const statsQuery = useQuery({ queryKey: ["stats"], queryFn: api.getStats });
  const newsQuery = useQuery({ queryKey: ["news"], queryFn: api.getNews });

  if (usersQuery.isLoading || statsQuery.isLoading) return <Loader />;
}

// Динамическое количество — useQueries
function UserProfiles({ userIds }: { userIds: string[] }) {
  const results = useQueries({
    queries: userIds.map(id => ({
      queryKey: userKeys.detail(id),
      queryFn: () => api.getUser(id),
    })),
  });

  const isLoading = results.some(r => r.isLoading);
  const users = results.map(r => r.data).filter(Boolean);
}
```

---

## Пагинация

```tsx
import { keepPreviousData } from "@tanstack/react-query";

function UserList() {
  const [page, setPage] = useState(1);

  const { data, isPlaceholderData } = useQuery({
    queryKey: ["users", "list", { page }],
    queryFn: () => api.getUsers({ page, limit: 10 }),
    placeholderData: keepPreviousData, // показывать предыдущие данные пока грузятся новые
  });

  return (
    <div>
      <ul style={{ opacity: isPlaceholderData ? 0.5 : 1 }}>
        {data?.users.map(u => <li key={u.id}>{u.name}</li>)}
      </ul>
      <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>←</button>
      <button
        onClick={() => setPage(p => p + 1)}
        disabled={isPlaceholderData || !data?.hasNextPage}
      >→</button>
    </div>
  );
}
```

---

## Бесконечная прокрутка — useInfiniteQuery

```tsx
import { useInfiniteQuery } from "@tanstack/react-query";
import { useIntersectionObserver } from "@/shared/hooks";

function InfiniteUserList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["users", "infinite"],
    queryFn: ({ pageParam }) => api.getUsers({ cursor: pageParam, limit: 10 }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor, // undefined = конец
  });

  // Автоподгрузка при скролле к концу
  const { ref } = useIntersectionObserver({
    onChange: (inView) => { if (inView && hasNextPage) fetchNextPage(); },
  });

  const allUsers = data?.pages.flatMap(page => page.users) ?? [];

  return (
    <ul>
      {allUsers.map(u => <li key={u.id}>{u.name}</li>)}
      <li ref={ref}>
        {isFetchingNextPage ? <Spinner /> : null}
      </li>
    </ul>
  );
}
```

---

## Кастомные хуки — правильная абстракция

```ts
// queries/useUser.ts
export function useUser(userId: string) {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => api.getUser(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
}

// queries/useUsers.ts
export function useUsers(filters?: UserFilters) {
  return useQuery({
    queryKey: userKeys.list(filters ?? {}),
    queryFn: () => api.getUsers(filters),
  });
}

// mutations/useUpdateUser.ts
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.updateUser,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

// Использование в компоненте — чисто и без деталей запросов
function UserPage({ id }: { id: string }) {
  const { data: user, isLoading } = useUser(id);
  const { mutate: updateUser } = useUpdateUser();
  // ...
}
```

---

## Глобальные колбеки и обработка ошибок

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: false, // или true — бросать в Error Boundary
    },
  },
});

// Глобальный обработчик (через QueryCache)
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (error instanceof ApiError && error.status === 401) {
        authStore.logout();
      }
      toast.error(`Ошибка загрузки: ${error.message}`);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      toast.error(error.message);
    },
  }),
});
```

---

## Состояния запроса — полная картина

```
                     ┌─────────────────┐
                     │    fetching     │ ← isFetching: true
                     └────────┬────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
         ┌────────┐     ┌──────────┐    ┌─────────┐
         │ fresh  │     │  stale   │    │  error  │
         │        │     │          │    │         │
         │ данные │     │ данные   │    │isError  │
         │ свежие │     │ устарели │    │  true   │
         └────────┘     └──────────┘    └─────────┘
              │               │
         staleTime        автоматический
         не истёк          рефетч при
                          фокусе окна,
                         переподключении
```

| Флаг | Когда true |
|---|---|
| `isLoading` | Нет кеша + идёт загрузка (= `isPending && isFetching`) |
| `isPending` | Нет данных в кеше (нет ни данных, ни ошибки) |
| `isFetching` | Идёт любой запрос (фоновый рефетч тоже) |
| `isSuccess` | Данные успешно загружены |
| `isError` | Все попытки завершились ошибкой |
| `isStale` | Данные устарели (staleTime истёк) |
| `isPlaceholderData` | Показываются placeholderData |

---

## Prefetching — предзагрузка

```tsx
// При hover на ссылку — грузим заранее
function UserLink({ userId }: { userId: string }) {
  const queryClient = useQueryClient();

  const prefetch = () => {
    queryClient.prefetchQuery({
      queryKey: userKeys.detail(userId),
      queryFn: () => api.getUser(userId),
      staleTime: 1000 * 60, // не рефетчить если данные свежее минуты
    });
  };

  return (
    <Link to={`/users/${userId}`} onMouseEnter={prefetch}>
      Профиль
    </Link>
  );
}

// SSR / Next.js — prefetch на сервере
// app/users/page.tsx
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

async function UsersPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: userKeys.lists(),
    queryFn: api.getUsers,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserList /> {/* уже имеет данные на клиенте */}
    </HydrationBoundary>
  );
}
```

---

## TanStack Query vs useEffect + useState

```tsx
// ❌ Вручную — много boilerplate, race conditions, нет кеширования
function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetch("/api/users", { signal: controller.signal })
      .then(res => res.json())
      .then(setUsers)
      .catch(err => { if (err.name !== "AbortError") setError(err); })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);
}

// ✅ TanStack Query — декларативно, с кешем, рефетчем, ретраями
function UserList() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.getUsers(),
  });
}
```

---

## Частые ошибки

```ts
// ❌ queryKey не включает зависимости — кеш не инвалидируется при смене userId
queryKey: ["user"],
queryFn: () => api.getUser(userId) // userId меняется, но ключ — нет

// ✅ зависимости в ключе
queryKey: ["user", userId],

// ❌ enabled не используется — запрос падает при отсутствии параметра
queryFn: () => api.getUser(userId), // userId может быть undefined

// ✅ отключаем пока нет параметра
enabled: !!userId,

// ❌ инвалидация слишком широкая — рефетчит всё подряд
queryClient.invalidateQueries({ queryKey: [] }); // инвалидирует ВСЁ

// ✅ точечная инвалидация
queryClient.invalidateQueries({ queryKey: userKeys.lists() });

// ❌ mutate внутри useEffect или рендера
useEffect(() => { mutate(data); }, []); // антипаттерн

// ✅ mutate только в обработчиках событий
<button onClick={() => mutate(data)}>Сохранить</button>
```

---

*TanStack Query · Frontend Interview Guide · 2026*