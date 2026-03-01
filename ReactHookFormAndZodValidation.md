# React Hook Form + Zod
### Полная методичка — управление формами, валидация, интеграция

---

## Что такое React Hook Form

React Hook Form (RHF) — библиотека управления формами. Решает всё то, что Zod не умеет:

- Регистрация полей в DOM
- Отслеживание состояния формы (touched, dirty, isSubmitting)
- Управление когда показывать ошибки
- Обработка сабмита
- Производительность — минимум ре-рендеров через uncontrolled inputs

```bash
npm install react-hook-form @hookform/resolvers zod
```

---

## Как RHF работает внутри

RHF использует **uncontrolled inputs** — не хранит значения в React state, а читает их напрямую из DOM через `ref`. Это главная причина почему он быстрее Formik.

```
Formik/обычный подход:
  каждое нажатие клавиши → setState → ре-рендер всей формы

RHF:
  каждое нажатие клавиши → значение в DOM (без setState)
  ре-рендер только при: submit, blur (если настроено), ошибках
```

---

## Базовый useForm

```tsx
import { useForm } from "react-hook-form";

function LoginForm() {
  const {
    register,          // регистрирует поле в форме
    handleSubmit,      // обёртка для onSubmit
    formState,         // состояние формы
    watch,             // подписка на значения
    setValue,          // программная установка значения
    getValues,         // получить текущие значения
    reset,             // сброс формы
    setError,          // установить ошибку вручную
    clearErrors,       // очистить ошибки
    trigger,           // запустить валидацию вручную
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",    // когда валидировать (подробнее ниже)
  });

  const { errors, isSubmitting, isDirty, isValid, touchedFields } = formState;

  const onSubmit = async (data: FormData) => {
    await api.login(data); // data типизирован и провалидирован
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} />
      {errors.email && <p>{errors.email.message}</p>}

      <input type="password" {...register("password")} />
      {errors.password && <p>{errors.password.message}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Вход..." : "Войти"}
      </button>
    </form>
  );
}
```

---

## register — регистрация поля

`register` возвращает пропсы для нативного input: `name`, `ref`, `onChange`, `onBlur`.

```tsx
// Базовая регистрация
<input {...register("email")} />

// С встроенной валидацией RHF (без Zod)
<input {...register("email", {
  required: "Email обязателен",
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Неверный формат email",
  },
  minLength: { value: 5, message: "Минимум 5 символов" },
})} />

// С преобразованием типа (числовой инпут)
<input
  type="number"
  {...register("age", { valueAsNumber: true })}
/>

// Дата
<input
  type="date"
  {...register("birthday", { valueAsDate: true })}
/>
```

---

## mode — когда запускать валидацию

```ts
useForm({
  mode: "onSubmit",   // default — только при сабмите
  mode: "onBlur",     // при потере фокуса
  mode: "onChange",   // при каждом изменении (много ре-рендеров)
  mode: "onTouched",  // первый раз при blur, потом при каждом change
  mode: "all",        // onChange + onBlur
  reValidateMode: "onChange", // после первой ошибки — когда перевалидировать
})
```

**Рекомендация для UX:**
```ts
mode: "onTouched",      // ошибка появляется после того как потрогал поле
reValidateMode: "onChange", // и сразу пропадает когда исправляешь
```

---

## formState — состояние формы

```tsx
const {
  errors,          // объект ошибок { email: { message: "..." } }
  isSubmitting,    // true пока выполняется onSubmit
  isSubmitted,     // true после первого сабмита
  isSubmitSuccessful, // true если сабмит прошёл без ошибок
  isDirty,         // true если хоть одно поле изменено от defaultValues
  isValid,         // true если нет ошибок
  isLoading,       // true если defaultValues — async функция
  touchedFields,   // { email: true } — поля которые были в фокусе
  dirtyFields,     // { email: true } — поля которые изменились
  submitCount,     // сколько раз нажали submit
} = formState;

// ⚠️ Важно: destructure из formState, не из useForm напрямую
// иначе RHF не сможет отслеживать подписки
const { errors } = formState; // ✅
const { formState: { errors } } = useForm(); // ✅
```

---

## watch — подписка на значения

```tsx
// Следить за одним полем
const email = watch("email");

// Следить за несколькими
const [email, password] = watch(["email", "password"]);

// Следить за всей формой
const allValues = watch();

// Условный рендер на основе значения
function ShippingForm() {
  const { register, watch } = useForm();
  const deliveryType = watch("deliveryType");

  return (
    <form>
      <select {...register("deliveryType")}>
        <option value="courier">Курьер</option>
        <option value="pickup">Самовывоз</option>
      </select>

      {deliveryType === "courier" && (
        <input {...register("address")} placeholder="Адрес доставки" />
      )}
    </form>
  );
}
```

---

## setValue и getValues

```tsx
// Установить значение программно
setValue("email", "user@example.com");
setValue("email", "user@example.com", {
  shouldValidate: true,  // запустить валидацию
  shouldDirty: true,     // пометить как изменённое
  shouldTouch: true,     // пометить как потронутое
});

// Получить значения без подписки (не вызывает ре-рендер)
const email = getValues("email");
const allValues = getValues();
const [email, name] = getValues(["email", "name"]);
```

---

## reset — сброс формы

```tsx
// Полный сброс к defaultValues
reset();

// Сброс с новыми значениями (например после загрузки данных)
reset({
  email: user.email,
  name: user.name,
});

// После успешного сабмита
const onSubmit = async (data) => {
  await api.createUser(data);
  reset(); // очистить форму
};
```

---

## setError — ошибки с сервера

```tsx
const { setError } = useForm();

const onSubmit = async (data) => {
  try {
    await api.login(data);
  } catch (err) {
    // Ошибки с сервера привязываем к полям
    if (err.field === "email") {
      setError("email", {
        type: "server",
        message: "Пользователь с таким email не найден",
      });
    }

    // Общая ошибка формы (не привязана к полю)
    setError("root", {
      type: "server",
      message: "Неверный логин или пароль",
    });
  }
};

// Отображение общей ошибки
{errors.root && <p className="form-error">{errors.root.message}</p>}
```

---

## ⭐ Интеграция с Zod — zodResolver

Это главная связка. `zodResolver` берёт Zod-схему и превращает её в валидатор для RHF.

```bash
npm install @hookform/resolvers
```

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// 1. Описываем схему Zod
const LoginSchema = z.object({
  email: z.string()
    .min(1, "Email обязателен")
    .email("Неверный формат email"),
  password: z.string()
    .min(8, "Минимум 8 символов")
    .max(100, "Максимум 100 символов"),
});

// 2. Генерируем тип из схемы — один источник правды
type LoginFormData = z.infer<typeof LoginSchema>;

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema), // 3. Подключаем resolver
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    // data гарантированно прошёл Zod валидацию
    // TypeScript знает точный тип
    await api.login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input {...register("email")} placeholder="Email" />
        {errors.email && <p>{errors.email.message}</p>}
      </div>

      <div>
        <input type="password" {...register("password")} placeholder="Пароль" />
        {errors.password && <p>{errors.password.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting}>Войти</button>
    </form>
  );
}
```

---

## Как zodResolver работает внутри

```
Пользователь заполняет форму
         ↓
RHF собирает значения полей
         ↓
zodResolver передаёт их в schema.safeParse(values)
         ↓
  ┌──── success ────────────────────────────────────┐
  │  result.data → RHF получает валидные данные     │
  │  handleSubmit вызывает onSubmit(data)            │
  └─────────────────────────────────────────────────┘
  ┌──── error ──────────────────────────────────────┐
  │  result.error → ZodError                        │
  │  zodResolver маппит ошибки в формат RHF:        │
  │  { email: { message: "...", type: "..." } }     │
  │  handleSubmit НЕ вызывает onSubmit              │
  └─────────────────────────────────────────────────┘
```

---

## Полный пример — форма регистрации

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Схема с кросс-польной валидацией
const RegisterSchema = z.object({
  name: z.string().min(2, "Минимум 2 символа").max(50),
  email: z.string().min(1, "Обязательное поле").email("Неверный email"),
  password: z.string()
    .min(8, "Минимум 8 символов")
    .regex(/[A-Z]/, "Нужна заглавная буква")
    .regex(/[0-9]/, "Нужна цифра"),
  confirmPassword: z.string().min(1, "Подтвердите пароль"),
  age: z.coerce.number().int().min(18, "Минимальный возраст 18 лет"),
  agreeToTerms: z.boolean().refine(val => val === true, "Примите условия"),
}).refine(
  data => data.password === data.confirmPassword,
  { message: "Пароли не совпадают", path: ["confirmPassword"] }
);

type RegisterFormData = z.infer<typeof RegisterSchema>;

function RegisterForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await api.register(data);
    } catch (err) {
      if (err.status === 409) {
        setError("email", {
          type: "server",
          message: "Этот email уже зарегистрирован",
        });
      } else {
        setError("root", {
          type: "server",
          message: "Ошибка сервера, попробуйте позже",
        });
      }
    }
  };

  if (isSubmitSuccessful) {
    return <p>Регистрация успешна! Проверьте почту.</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {errors.root && (
        <div className="error-banner">{errors.root.message}</div>
      )}

      <div>
        <input {...register("name")} placeholder="Имя" />
        {errors.name && <p>{errors.name.message}</p>}
      </div>

      <div>
        <input {...register("email")} placeholder="Email" />
        {errors.email && <p>{errors.email.message}</p>}
      </div>

      <div>
        <input type="password" {...register("password")} placeholder="Пароль" />
        {errors.password && <p>{errors.password.message}</p>}
      </div>

      <div>
        <input
          type="password"
          {...register("confirmPassword")}
          placeholder="Подтвердите пароль"
        />
        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
      </div>

      <div>
        <input type="number" {...register("age")} placeholder="Возраст" />
        {errors.age && <p>{errors.age.message}</p>}
      </div>

      <div>
        <input type="checkbox" {...register("agreeToTerms")} />
        <label>Принимаю условия использования</label>
        {errors.agreeToTerms && <p>{errors.agreeToTerms.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
      </button>
    </form>
  );
}
```

---

## Controller — для кастомных компонентов

`register` работает только с нативными HTML-элементами. Для кастомных компонентов (UI-библиотеки, кастомные Select, DatePicker) — `Controller`.

```tsx
import { Controller } from "react-hook-form";

function MyForm() {
  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(Schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Кастомный Select */}
      <Controller
        name="role"
        control={control}
        render={({ field, fieldState }) => (
          <div>
            <CustomSelect
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              options={roleOptions}
            />
            {fieldState.error && <p>{fieldState.error.message}</p>}
          </div>
        )}
      />

      {/* DatePicker */}
      <Controller
        name="birthday"
        control={control}
        render={({ field }) => (
          <DatePicker
            selected={field.value}
            onChange={field.onChange}
          />
        )}
      />
    </form>
  );
}
```

---

## useFieldArray — динамические массивы полей

```tsx
import { useFieldArray } from "react-hook-form";

const Schema = z.object({
  contacts: z.array(
    z.object({
      name: z.string().min(1, "Имя обязательно"),
      phone: z.string().min(10, "Неверный телефон"),
    })
  ).min(1, "Добавьте хотя бы один контакт"),
});

type FormData = z.infer<typeof Schema>;

function ContactsForm() {
  const { control, register, handleSubmit, formState: { errors } } =
    useForm<FormData>({ resolver: zodResolver(Schema) });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "contacts",
  });

  return (
    <form onSubmit={handleSubmit(console.log)}>
      {fields.map((field, index) => (
        <div key={field.id}> {/* key — обязательно field.id, не index */}
          <input
            {...register(`contacts.${index}.name`)}
            placeholder="Имя"
          />
          {errors.contacts?.[index]?.name && (
            <p>{errors.contacts[index].name.message}</p>
          )}

          <input
            {...register(`contacts.${index}.phone`)}
            placeholder="Телефон"
          />

          <button type="button" onClick={() => remove(index)}>
            Удалить
          </button>
        </div>
      ))}

      {errors.contacts?.root && <p>{errors.contacts.root.message}</p>}

      <button
        type="button"
        onClick={() => append({ name: "", phone: "" })}
      >
        Добавить контакт
      </button>

      <button type="submit">Сохранить</button>
    </form>
  );
}
```

---

## Схемы Zod для разных сценариев форм

### Опциональные поля с пустой строкой

```ts
// Проблема: пустой input отправляет "" — z.string().optional() не принимает ""
const Schema = z.object({
  nickname: z.string().optional(), // ❌ "" не является undefined
});

// ✅ Решение — преобразование пустой строки в undefined
const Schema = z.object({
  nickname: z.string()
    .transform(val => val === "" ? undefined : val)
    .optional(),
});

// Или через preprocess:
const optionalString = z.preprocess(
  val => val === "" ? undefined : val,
  z.string().optional()
);
```

### Числовой инпут

```ts
// input type="number" возвращает строку ""  если пусто, "42" если заполнено
const Schema = z.object({
  // z.coerce.number() преобразует строку в число
  price: z.coerce.number().positive("Цена должна быть положительной"),

  // Опциональное число
  discount: z.coerce.number().min(0).max(100).optional()
    .or(z.literal("").transform(() => undefined)),
});
```

### Checkbox и radio

```ts
const Schema = z.object({
  // Одиночный checkbox — boolean
  agree: z.boolean().refine(v => v, "Необходимо согласие"),

  // Группа radio — enum
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Выберите пол" }),
  }),

  // Мультивыбор (несколько checkbox) — массив
  interests: z.array(z.string()).min(1, "Выберите хотя бы один интерес"),
});
```

### Файл

```ts
const Schema = z.object({
  avatar: z
    .instanceof(FileList)
    .refine(files => files.length > 0, "Выберите файл")
    .refine(
      files => files[0]?.size <= 5 * 1024 * 1024,
      "Файл не более 5MB"
    )
    .refine(
      files => ["image/jpeg", "image/png"].includes(files[0]?.type),
      "Только JPEG и PNG"
    ),
});
```

---

## Производительность — изоляция ре-рендеров

```tsx
// ❌ watch() на весь стор — ре-рендер при каждом изменении любого поля
function Form() {
  const { watch } = useForm();
  const values = watch(); // всё поле
}

// ✅ watch конкретного поля
const email = watch("email"); // ре-рендер только при изменении email

// ✅ Вынести поле в отдельный компонент
function EmailField({ control }: { control: Control<FormData> }) {
  const { field, fieldState } = useController({ name: "email", control });
  // этот компонент ре-рендерится только когда меняется email
  return (
    <div>
      <input {...field} />
      {fieldState.error && <p>{fieldState.error.message}</p>}
    </div>
  );
}
```

---

## RHF + Zod vs Formik + Yup

| | RHF + Zod | Formik + Yup |
|---|---|---|
| Производительность | ✅ Uncontrolled (быстро) | ⚠️ Controlled (много ре-рендеров) |
| TypeScript | ✅ Отличный (z.infer) | ⚠️ Частичный |
| Размер бандла | ✅ ~30kb суммарно | ⚠️ ~60kb суммарно |
| Валидация | ✅ Zod — мощная, типобезопасная | ⚠️ Yup — менее типобезопасный |
| Динамические поля | ✅ useFieldArray | ⚠️ FieldArray (сложнее) |
| Статус | ✅ Активная разработка | ⚠️ Поддержка, не развивается |
| Когда выбрать | Новые проекты | Легаси / уже используется |

---

## Частые ошибки

```tsx
// ❌ Не destructure errors из formState напрямую из useForm
const { errors } = useForm(); // не будет обновляться реактивно

// ✅ Через formState
const { formState: { errors } } = useForm();
// или
const { formState } = useForm();
const { errors } = formState;

// ❌ key по index в useFieldArray
fields.map((field, i) => <div key={i}>...</div>)

// ✅ key по field.id — RHF генерирует уникальный id
fields.map((field, i) => <div key={field.id}>...</div>)

// ❌ register на кастомном компоненте без поддержки ref
<CustomInput {...register("email")} /> // ref не пробросится

// ✅ Controller для кастомных компонентов
<Controller name="email" control={control} render={({ field }) =>
  <CustomInput {...field} />
} />

// ❌ defaultValues не указан — поля undefined при reset
useForm(); // reset() не знает к чему сбрасывать

// ✅ Всегда указывай defaultValues
useForm({ defaultValues: { email: "", name: "" } });
```

