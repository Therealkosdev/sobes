# TypeScript

## Замыкания (closures)
Замыкание — функция, которая «запоминает» окружение (переменные) в момент её создания и может обращаться к этим переменным позже, даже если внешний контекст уже завершил выполнение.

```typescript
function makeCounter(start = 0) {
  let count = start; // состояние в замыкании

  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    get() {
      return count;
    }
  };
}

const c = makeCounter(10);
console.log(c.get());      // 10
console.log(c.increment()); // 11
console.log(c.decrement()); // 10
```

переменная доступена только через методы возвращённого объекта — приватное состояние

Подводные камни

Если замыкание находится в цикле и использует одно и то же изменяемое значение, можно ошибиться (особенно с var). В TS/ES6 используйте let.

Замыкания удерживают ссылки на объекты — возможны утечки памяти при неправильном использовании (например, большие структуры данных в замыкании, которые уже не нужны).


## Debounce (дебаунс)
Debounce — функция-обёртка, которая откладывает выполнение целевой функции до тех пор, пока не пройдёт заданный интервал с момента последнего вызова. Полезно для ввода пользователя, ресайза окна, автосохранения и т.д.

Поведение

* Если события идут часто, функция выполнится лишь один раз спустя wait миллисекунд после последнего события.

* Часто имеет опции immediate (выполнить сразу при первом вызове) и cancel (отменить ожидающий вызов).

Классический пример:
```typescript
function debounceForm (fn:()=> any, delay: number) {
    let timer: any = null;

    return function () {
        if (timer!==null) {
            clearTimeout(timer);
        }

        timer = setTimeout(()=> {
            fn();
            timer = null;
        },delay)
    }
}



const sendForm = () => {
    console.log('Form sended');
}

const debForm = debounceForm(sendForm, 5000);

debForm();
debForm();
debForm();
debForm();
```

Пример с immediate:
```typescript
function debounce(fn: (...args: any[]) => void, delay: number, immediate = false) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let calledImmediate = false; // флаг — уже вызывали немедленно?

  return function (...args: any[]) {
    const callNow = immediate && !calledImmediate; // нужно ли вызвать сразу?

    if (timer) {
      clearTimeout(timer);
    }

    if (callNow) {
      fn(...args); // вызовем прямо сейчас
      calledImmediate = true; // помечаем, что уже вызвали
    }

    timer = setTimeout(() => {
      timer = null;
      calledImmediate = false; // по истечении задержки позволяем вызвать снова
    }, delay);
  };
}
```

## Throttle (троттлинг)

Throttle ограничивает вызовы функции так, чтобы она выполнялась не чаще чем раз в limit миллисекунд, даже если событий много.

```
function throttle<T extends AnyFn>(fn: T, limit = 200) {
  let lastCall = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();

    if (now - lastCall >= limit) {
      lastCall = now;
      fn.apply(this, args);
    } else {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        lastCall = Date.now();
        fn.apply(this, args);
      }, limit - (now - lastCall));
    }
  } as T;
}

```

#### Когда использовать

Для скролла, навигации, live-статистики — когда нужно получать регулярные обновления, но ограниченно.


## Memoization (memo)

Memoization — кэширование результатов функции при повторных вызовах с теми же аргументами. Особенно полезно для тяжёлых чистых (pure) функций.


### Практические сценарии (где что применять)

Замыкания: фабрики функций, приватные счётчики, кэш, модульная инкапсуляция.

reduce: сводить массив в Map/объект, суммирование, агрегирование.
в
debounce: автодополнение, ввод в поля, ресайз обработчик.

throttle: скролл-обработчики, отправка метрик — не более N раз в секунду.

memoize: тяжёлые чистые вычисления (фибоначчи, сложные вычисления), селекторы в Redux (reselect), expensive-render предотвращение.


# Ассинхронность
Асинхронность — это способность программы не блокировать выполнение других операций, пока выполняется длительная задача (например, запрос к серверу или чтение файла).

В JavaScript (и TypeScript, как его надстройке) всё выполняется в одном потоке. Чтобы не "замораживать" интерфейс при длительных операциях, используется асинхронное выполнение.
## Promises
Promise — это объект, который представляет будущее значение асинхронной операции.
Он может быть в трёх состояниях:

* pending (выполнение операции)
* fullfilled/resolved (оперция полностью завершена)
* rejected (ошибка операции)

```typescript
const promise = new Promise<string>((resolve, reject) => {
  setTimeout(() => {
    const success = Math.random() > 0.5;

    if (success) {
      resolve("✅ Успех!");
    } else {
      reject("❌ Ошибка!");
    }
  }, 1000);
});
```

Здесь `Promise<string>` — это тип:
промис вернёт строку при успешном завершении (resolve("...")).

#### Использование .then и .catch

```typescript
promise
  .then((result) => {
    console.log("Результат:", result);
  })
  .catch((error) => {
    console.error("Ошибка:", error);
  })
  .finally(() => {
    console.log("Всегда выполнится (очистка, закрытие, и т.п.)");
  });
```

Как работает цепочка then

.then() возвращает новый промис.

Можно строить цепочки для последовательных асинхронных шагов:

### Встроенные методы Promise API

🔹 Promise.all([...])

Ждёт все промисы.
Если один упадёт, всё падает.


```typescript
await Promise.all([fetchA(), fetchB(), fetchC()]);
```

🔹 Promise.allSettled([...])
Возвращает результат каждого, независимо от ошибок.
```typescript
const results = await Promise.allSettled([
  fetchA(),
  fetchB(),
  fetchC()
]);

results.forEach(r => {
  if (r.status === "fulfilled") console.log(r.value);
  else console.error(r.reason);
});
```
🔹 Promise.race([...])

Возвращает первый завершившийся промис (успешный или с ошибкой).
```typescript
const first = await Promise.race([fast(), slow()]);
```

🔹 Promise.any([...])

Возвращает первый успешный промис (если все упадут — ошибка AggregateError).

```typescript
const result = await Promise.any([fail(), ok()]);
```

## Async/Await
async/await — это удобный синтаксис для работы с Promise в TypeScript (и JavaScript).
Он позволяет писать асинхронный код так, будто он синхронный.

Под капотом async/await — это просто обёртка над Promise и .then().


Пример: без async/await:


```typescript
getUser()
  .then(user => getPosts(user.id))
  .then(posts => console.log(posts))
  .catch(err => console.error(err));
```


```typescript
async function example() {
  try {
    const user = await getUser();
    const posts = await getPosts(user.id);
    console.log(posts);
  } catch (err) {
    console.error(err);
  }
}
```
Код выглядит линейно и читаемо, но делает то же самое.

async перед функцией:

* делает её асинхронной,

* заставляет её всегда возвращать Promise.

```typescript
async function test() {
  try {
    const res = await fetch("https://bad-url");
    const json = await res.json();
  } catch (err) {
    console.error("Ошибка запроса:", err);
  }
}
```

Пример обработки API
```typescript
type User = { id: number; name: string };
type Post = { id: number; title: string; userId: number };

async function fetchUser(id: number): Promise<User> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  if (!res.ok) throw new Error("User not found");
  return res.json();
}

async function fetchPosts(userId: number): Promise<Post[]> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
  return res.json();
}

async function main() {
  try {
    const user = await fetchUser(1);
    const posts = await fetchPosts(user.id);
    console.log(`${user.name} has ${posts.length} posts`);
  } catch (err) {
    console.error("Ошибка:", err);
  } finally {
    console.log("✅ Завершено");
  }
}
main();
```
✅ async делает функцию асинхронной и возвращает Promise. </br>
✅ await ждёт завершения промиса и возвращает результат.</br>
✅ Вместе дают удобный, линейный способ писать асинхронный код.</br>
✅ Работают только с Promise.</br>
✅ Всегда обрабатывайте ошибки (try/catch или .catch()).


## Объекты (Objects)

Основные методы Object

Object.keys() - получить массив ключей

```typescript

```
```typescript
const user = { name: 'Иван', age: 25, city: 'Москва' };
const keys = Object.keys(user); // ['name', 'age', 'city']
```
Object.values() - получить массив значений
```typescript
const user = { name: 'Иван', age: 25, city: 'Москва' };
const values = Object.values(user); // ['Иван', 25, 'Москва']
```
Object.entries() - получить массив пар [ключ, значение]
```typescript
const user = { name: 'Иван', age: 25, city: 'Москва' };
const entries = Object.entries(user); 
// [['name', 'Иван'], ['age', 25], ['city', 'Москва']]
```
Object.fromEntries() - создать объект из массива пар
```typescript
const entries: [string, string | number][] = [['name', 'Иван'], ['age', 25]];
const user = Object.fromEntries(entries); // { name: 'Иван', age: 25 }
```
Проход по объектам
`for...in`

```typescript
for (const key in person) {
    if (Object.hasOwn(person, key)) {  // защита от унаследованных свойств
        console.log(key, person[key as keyof typeof person]);
    }
}
```

`foreach`
```typescript
Object.keys(person).forEach(key => {
    console.log(key, person[key as keyof typeof person]);
});

```

`Object.entries` - `foreach` + `Object.entries` (и ключ и значение)

```typescript
Object.entries(person).forEach(([key, value]) => {
    console.log(key, value);
});
```

<strong>ТАК ЖЕ ДЛЯ ПОИСКА КЛЮЧА ПО ЗНАЧЕНИЮ</strong>
```typescript
function findKeyByValue(obj: Record<string, any>, value: any): string | null {
  for (const [key, val] of Object.entries(obj)) {
    if (val === value) {
      return key;
    }
  }
  return null; // если не нашли
}

const person = {
  name: "Alice",
  age: 25,
  city: "London"
};

console.log(findKeyByValue(person, 25)); // age
console.log(findKeyByValue(person, "London")); // city
console.log(findKeyByValue(person, "Bob")); // null
```
## Фильтрации и сортировки (встроенные методы)

### Find
Ищет первый элемент, удовлетворяющий условию, и возвращает его. Если ничего не найдено — undefined. По факту работает как foreach -> объявляем переменную (по факту один элемент того что фильтруем) => условие

```typescript

```
```typescript
array.find((item, index, array) => условие);
// array
const nums = [10, 20, 30];
const result = nums.find(n => n > 15); // 20

//object
const ages = { Alice: 25, Bob: 30, Carol: 22 };
const entry = Object.entries(ages).find(([name, age]) => age > 25);
console.log(entry); // ["Bob", 30]

```
### Filter 
Возвращает новый массив из элементов, которые прошли фильтр (условие true). Алгоритм такой же как и у find.
```typescript
const nums = [10, 20, 30];
const filtered = nums.filter(n => n >= 20); // [20, 30]
// объект
const marks = { Alice: 85, Bob: 92, Charlie: 78 };
const filtered = Object.entries(marks)
  .filter(([name, grade]) => grade > 80);
console.log(Object.fromEntries(filtered)); 
// { Alice: 85, Bob: 92 }
```
### map()
Создает новый массив, преобразовав каждый элемент по правилу. Так же как и цикл, объявляем значение (каждый айтем того над чем работаем)->условие изменения

```typescript
const nums = [1, 2, 3];
const doubled = nums.map(n => n * 2); // [2, 4, 6]

//Объект
const products = { apple: 50, banana: 30, orange: 40 };
const increased = Object.fromEntries(
  Object.entries(products).map(([name, price]) => [name, price * 1.1])
);
console.log(increased); // { apple: 55, banana: 33, orange: 44 }
```

### reduce() 
Сводит (аккумулирует) массив в одно значение.
reduce((итог, элемент)=>[итог]действие[элемент], начальное значение итога (0 или ""))

```typescript
const nums = [10, 20, 30];
const sum = nums.reduce((acc, n) => acc + n, 0); // 60


const salaries = { John: 1000, Jane: 1500, Bob: 1200 };
const totalSalary = Object.values(salaries).reduce((acc, sal) => acc + sal, 0);
console.log(totalSalary); // 3700
```

### some()
Проверяет, что хотя бы один элемент массива удовлетворяет условию.

```typescript
const nums = [1, 2, 3];
const hasOdd = nums.some(n => n % 2 !== 0); // true

const settings = { darkMode: true, notifications: false };
const anyTrue = Object.values(settings).some(v => v === true); // true
```

### every()
Проверяет, что все элементы массива удовлетворяют условию.

```typescript
const nums = [2, 4, 6];
const allEven = nums.every(n => n % 2 === 0); // true

const settings = { darkMode: true, isAdmin: false };
const allEnabled = Object.values(settings).every(v => v === true); // false
```
Что и где использовать:
| Задача                                         | Комбинация                                           |
| ----------------------------------------------- | ---------------------------------------------------- |
| Найти пару `[ключ, значение]` по значению       | `Object.entries().find()`                            |
| Оставить только нужные пары                     | `Object.entries().filter()` → `Object.fromEntries()` |
| Изменить все значения                           | `Object.entries().map()` → `Object.fromEntries()`    |
| Получить сумму всех чисел                       | `Object.values().reduce()`                           |
| Проверить, есть ли хотя бы одно значение `true` | `Object.values().some()`                             |
| Проверить все значения                          | `Object.values().every()`                            |






