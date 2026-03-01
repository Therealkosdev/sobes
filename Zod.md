# Zod
### Полная методичка — схемы, валидация, типы, интеграции

---

## Что такое Zod

Zod — библиотека для **декларативной валидации данных** с автоматической генерацией TypeScript-типов. Валидация и типизация описываются в одном месте — схеме.

**Что решает Zod:**
- Валидация данных с сервера (API response может не совпадать с типами)
- Валидация форм (вместе с React Hook Form)
- Валидация переменных окружения
- Парсинг и трансформация входных данных
- Типизация без дублирования (схема = тип)

```bash
npm install zod
```

---

## Ключевая идея — parse vs safeParse

```ts
import { z } from "zod";

const schema = z.string();

// parse — выбрасывает исключение при ошибке
schema.parse("hello");   // ✅ "hello"
schema.parse(123);       // ❌ throws ZodError

// safeParse — возвращает объект результата, никогда не бросает
const result = schema.safeParse(123);

if (result.success) {
  console.log(result.data);   // типизированные данные
} else {
  console.log(result.error);  // ZodError
}
```

---

## Примитивные типы

```ts
z.string()
z.number()
z.boolean()
z.bigint()
z.date()
z.symbol()
z.undefined()
z.null()
z.void()
z.any()
z.unknown()
z.never()
```

---

## Строки — string

```ts
const schema = z.string()
  .min(2, "Минимум 2 символа")
  .max(100, "Максимум 100 символов")
  .length(10, "Ровно 10 символов")
  .email("Неверный email")
  .url("Неверный URL")
  .uuid("Неверный UUID")
  .regex(/^[a-z]+$/, "Только строчные буквы")
  .startsWith("https://")
  .endsWith(".ru")
  .includes("@")
  .trim()           // трансформация — убирает пробелы
  .toLowerCase()    // трансформация
  .toUpperCase();

// Опциональная строка с дефолтом
z.string().optional()              // string | undefined
z.string().nullable()              // string | null
z.string().nullish()               // string | null | undefined
z.string().default("default")      // если undefined — подставит "default"
```

---

## Числа — number

```ts
const schema = z.number()
  .min(0, "Не меньше 0")
  .max(100, "Не больше 100")
  .positive("Должно быть положительным")   // > 0
  .negative("Должно быть отрицательным")   // < 0
  .nonnegative("Не отрицательное")         // >= 0
  .int("Только целые числа")
  .finite("Конечное число")
  .multipleOf(5, "Кратно 5");

// Коэрция — приведение строки к числу
const coerced = z.coerce.number(); // "42" → 42
```

---

## Объекты — object

```ts
const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  email: z.string().email(),
  age: z.number().int().positive().optional(),
  role: z.enum(["admin", "user", "moderator"]),
  createdAt: z.date(),
});

// Генерация TypeScript типа из схемы
type User = z.infer<typeof UserSchema>;
// Эквивалентно:
// interface User {
//   id: string;
//   name: string;
//   email: string;
//   age?: number;
//   role: "admin" | "user" | "moderator";
//   createdAt: Date;
// }
```

### Методы объекта

```ts
const Base = z.object({ id: z.string(), name: z.string() });

// partial — все поля опциональны
const PartialUser = Base.partial();
// { id?: string; name?: string }

// partial конкретных полей
const Partial = Base.partial({ name: true });
// { id: string; name?: string }

// required — все поля обязательны
const Required = Base.required();

// pick — взять только указанные поля
const OnlyName = Base.pick({ name: true });
// { name: string }

// omit — исключить поля
const WithoutId = Base.omit({ id: true });
// { name: string }

// extend — добавить поля
const Extended = Base.extend({ email: z.string().email() });

// merge — объединить два объекта
const Merged = Base.merge(z.object({ email: z.string() }));

// strict — запретить лишние поля (по умолчанию они игнорируются)
const Strict = Base.strict();

// strip — удалить лишние поля (default поведение)
const Stripped = Base.strip();

// passthrough — пропустить лишние поля как есть
const Passthrough = Base.passthrough();
```

---

## Массивы — array

```ts
const schema = z.array(z.string())
  .min(1, "Минимум 1 элемент")
  .max(10, "Максимум 10 элементов")
  .length(3, "Ровно 3 элемента")
  .nonempty("Массив не должен быть пустым"); // эквивалент min(1)

// Сокращённая запись
const schema2 = z.string().array();

type Tags = z.infer<typeof schema>; // string[]
```

---

## Enum, Union, Discriminated Union

```ts
// Enum — фиксированный набор значений
const RoleSchema = z.enum(["admin", "user", "moderator"]);
type Role = z.infer<typeof RoleSchema>; // "admin" | "user" | "moderator"

// Получить значения enum
RoleSchema.options; // ["admin", "user", "moderator"]

// Из TypeScript enum
enum Direction { Up = "UP", Down = "DOWN" }
const DirectionSchema = z.nativeEnum(Direction);

// Union — одно из нескольких
const StringOrNumber = z.union([z.string(), z.number()]);
// или короче:
const StringOrNumber2 = z.string().or(z.number());

// Discriminated Union — по дискриминатору (быстрее union)
const Result = z.discriminatedUnion("status", [
  z.object({ status: z.literal("success"), data: z.string() }),
  z.object({ status: z.literal("error"), message: z.string() }),
]);

type Result = z.infer<typeof Result>;
// { status: "success"; data: string } | { status: "error"; message: string }
```

---

## Literal, Tuple, Record

```ts
// Literal — конкретное значение
z.literal("active")    // только "active"
z.literal(42)          // только 42
z.literal(true)        // только true

// Tuple — массив с фиксированной структурой
const Point = z.tuple([z.number(), z.number()]);
type Point = z.infer<typeof Point>; // [number, number]

// с rest элементами
const AtLeastTwo = z.tuple([z.string(), z.string()]).rest(z.string());

// Record — объект с динамическими ключами
const Cache = z.record(z.string(), z.number());
type Cache = z.infer<typeof Cache>; // Record<string, number>

// Record с валидацией ключей
const Config = z.record(z.enum(["dark", "light"]), z.boolean());
```

---

## Трансформации — transform и preprocess

```ts
// transform — преобразование данных после валидации
const schema = z.string()
  .transform(val => val.trim().toLowerCase());

schema.parse("  HELLO  "); // → "hello"

// Изменение типа через transform
const NumberFromString = z.string()
  .transform(val => parseInt(val, 10));

type T = z.infer<typeof NumberFromString>; // number (не string!)

// preprocess — преобразование ДО валидации
const DateSchema = z.preprocess(
  (val) => (typeof val === "string" ? new Date(val) : val),
  z.date()
);

DateSchema.parse("2024-01-01"); // → Date объект
```

---

## Кастомная валидация — refine и superRefine

```ts
// refine — одна кастомная проверка
const PasswordSchema = z.string()
  .min(8)
  .refine(
    val => /[A-Z]/.test(val),
    { message: "Нужна хотя бы одна заглавная буква" }
  )
  .refine(
    val => /[0-9]/.test(val),
    { message: "Нужна хотя бы одна цифра" }
  );

// refine на уровне объекта — кросс-польная валидация
const RegisterSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine(
  data => data.password === data.confirmPassword,
  {
    message: "Пароли не совпадают",
    path: ["confirmPassword"], // к какому полю привязать ошибку
  }
);

// superRefine — несколько ошибок из одной проверки
const schema = z.string().superRefine((val, ctx) => {
  if (val.length < 8) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_small,
      minimum: 8,
      type: "string",
      inclusive: true,
      message: "Минимум 8 символов",
    });
  }
  if (!/[A-Z]/.test(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Нужна заглавная буква",
    });
  }
});
```

---

## Обработка ошибок

```ts
import { z, ZodError } from "zod";

const result = UserSchema.safeParse(rawData);

if (!result.success) {
  const { errors } = result.error;

  // Плоский список ошибок
  errors.forEach(err => {
    console.log(err.path);    // ["email"] или ["address", "city"]
    console.log(err.message); // "Invalid email"
    console.log(err.code);    // "invalid_string"
  });

  // Форматированные ошибки (удобно для форм)
  const formatted = result.error.format();
  // { email: { _errors: ["Invalid email"] }, name: { _errors: [] } }

  // Flat map ошибок
  const flat = result.error.flatten();
  // { fieldErrors: { email: ["Invalid email"] }, formErrors: [] }
}
```

---

## Интеграция с React Hook Form

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email("Неверный email"),
  password: z.string().min(8, "Минимум 8 символов"),
});

type LoginForm = z.infer<typeof LoginSchema>;

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    // data уже прошёл валидацию и типизирован
    api.login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} />
      {errors.email && <p>{errors.email.message}</p>}

      <input type="password" {...register("password")} />
      {errors.password && <p>{errors.password.message}</p>}

      <button type="submit">Войти</button>
    </form>
  );
}
```

---

## Валидация API ответов

```ts
// schemas/api.schemas.ts
const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["admin", "user"]),
});

const UsersResponseSchema = z.object({
  users: z.array(UserSchema),
  total: z.number(),
  page: z.number(),
});

// api/users.api.ts
async function getUsers(): Promise<UsersResponse> {
  const response = await fetch("/api/users");
  const raw = await response.json();

  // Парсим и валидируем — если схема не совпадает, получим ошибку
  const result = UsersResponseSchema.safeParse(raw);

  if (!result.success) {
    console.error("API вернул неожиданную структуру:", result.error.format());
    throw new Error("Неверный формат ответа API");
  }

  return result.data; // типизировано как UsersResponse
}

type UsersResponse = z.infer<typeof UsersResponseSchema>;
```

---

## Валидация переменных окружения

```ts
// env.ts
import { z } from "zod";

const EnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32, "JWT secret слишком короткий"),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

// Валидируем при старте приложения
const env = EnvSchema.parse(process.env);

export { env };

// Использование:
// env.PORT — number (не string!)
// env.NODE_ENV — "development" | "production" | "test"
```

---

## Рекурсивные схемы

```ts
// Для дерева или вложенных структур
interface Category {
  id: string;
  name: string;
  children: Category[];
}

const CategorySchema: z.ZodType<Category> = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string(),
    children: z.array(CategorySchema),
  })
);
```

---

## Полезные паттерны

### Схемы создания и обновления из базовой

```ts
// Базовая схема — полная сущность
const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(["admin", "user"]),
  createdAt: z.date(),
});

// Схема создания — без серверных полей
const CreateUserSchema = UserSchema.omit({ id: true, createdAt: true });

// Схема обновления — все поля опциональны, без серверных
const UpdateUserSchema = UserSchema.omit({ id: true, createdAt: true }).partial();

type User = z.infer<typeof UserSchema>;
type CreateUserDto = z.infer<typeof CreateUserSchema>;
type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
```

### Переиспользуемые поля

```ts
// shared/schemas/common.ts
export const IdSchema = z.string().uuid();
export const EmailSchema = z.string().email().toLowerCase().trim();
export const PasswordSchema = z.string().min(8).max(100);
export const PhoneSchema = z.string().regex(/^\+7\d{10}$/, "Неверный формат телефона");
export const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
```

### Extend для вариаций

```ts
const BaseProductSchema = z.object({
  name: z.string(),
  price: z.number().positive(),
});

const PhysicalProductSchema = BaseProductSchema.extend({
  weight: z.number(),
  dimensions: z.object({ w: z.number(), h: z.number(), d: z.number() }),
});

const DigitalProductSchema = BaseProductSchema.extend({
  downloadUrl: z.string().url(),
  fileSize: z.number(),
});
```

---

## Zod vs другие библиотеки валидации

| | Zod | Yup | Joi |
|---|---|---|---|
| TypeScript | ✅ Нативный (схема = тип) | ⚠️ Частичный | ⚠️ Через @types |
| Размер бандла | ~14kb | ~40kb | ~140kb |
| Производительность | Высокая | Средняя | Средняя |
| API | Функциональный | Fluent | Fluent |
| React Hook Form | ✅ Официальный resolver | ✅ Официальный resolver | ✅ Есть resolver |
| Трансформации | ✅ Встроены | ⚠️ Ограничено | ✅ Есть |
| Когда выбрать | TypeScript проекты | Легаси / Formik | Node.js backend |

---

## Частые ошибки

```ts
// ❌ Использовать TypeScript тип вместо z.infer
// Дублируем — схема и тип расходятся
interface User { id: string; name: string; }
const UserSchema = z.object({ id: z.string(), name: z.string() });

// ✅ Один источник правды
const UserSchema = z.object({ id: z.string(), name: z.string() });
type User = z.infer<typeof UserSchema>;

// ❌ parse там где может быть ошибка
const data = schema.parse(untrustedData); // необработанное исключение

// ✅ safeParse для ненадёжных данных
const result = schema.safeParse(untrustedData);
if (!result.success) { /* обработать */ }

// ❌ Не валидировать API ответы
const data: User = await fetch("/api/user").then(r => r.json()); // доверяем слепо

// ✅ Валидировать всё что приходит снаружи
const raw = await fetch("/api/user").then(r => r.json());
const data = UserSchema.parse(raw); // гарантированно User
```

---

*Zod · Frontend Interview Guide · 2026*