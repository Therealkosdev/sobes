# JavaScript & TypeScript - Полная теоретическая база для собеседования

## 1. Массивы - Полный гайд

### 1.1 Основные методы массивов

#### Методы изменяющие массив (Mutating)

```javascript
const arr = [1, 2, 3, 4, 5];

// push() - добавить в конец
arr.push(6); // [1, 2, 3, 4, 5, 6]

// pop() - удалить с конца
const last = arr.pop(); // last = 6, arr = [1, 2, 3, 4, 5]

// unshift() - добавить в начало
arr.unshift(0); // [0, 1, 2, 3, 4, 5]

// shift() - удалить с начала
const first = arr.shift(); // first = 0, arr = [1, 2, 3, 4, 5]

// splice(start, deleteCount, ...items) - универсальный метод
arr.splice(2, 1); // удалить 1 элемент с индекса 2: [1, 2, 4, 5]
arr.splice(2, 0, 3); // вставить 3 на индекс 2: [1, 2, 3, 4, 5]
arr.splice(2, 1, 99); // заменить элемент: [1, 2, 99, 4, 5]

// reverse() - перевернуть массив
arr.reverse(); // [5, 4, 99, 2, 1]

// sort() - сортировать
arr.sort(); // сортировка как строк
arr.sort((a, b) => a - b); // числовая сортировка по возрастанию
arr.sort((a, b) => b - a); // по убыванию

// fill(value, start, end) - заполнить значением
arr.fill(0); // [0, 0, 0, 0, 0]
arr.fill(1, 2, 4); // [0, 0, 1, 1, 0]
```

#### Методы НЕ изменяющие массив (Non-mutating)

```javascript
const arr = [1, 2, 3, 4, 5];

// concat() - объединить массивы
const arr2 = arr.concat([6, 7]); // [1, 2, 3, 4, 5, 6, 7]

// slice(start, end) - получить часть массива
const part = arr.slice(1, 3); // [2, 3]
const copy = arr.slice(); // копия массива

// join(separator) - объединить в строку
const str = arr.join('-'); // "1-2-3-4-5"

// indexOf(element) - найти индекс
const index = arr.indexOf(3); // 2

// lastIndexOf(element) - найти индекс с конца
const lastIndex = [1, 2, 3, 2, 1].lastIndexOf(2); // 3

// includes(element) - проверить наличие
const hasThree = arr.includes(3); // true

// toString() - преобразовать в строку
const str2 = arr.toString(); // "1,2,3,4,5"
```

#### Итерационные методы

```javascript
const arr = [1, 2, 3, 4, 5];

// forEach() - выполнить функцию для каждого элемента
arr.forEach((item, index, array) => {
  console.log(`arr[${index}] = ${item}`);
});

// map() - создать новый массив, применив функцию
const doubled = arr.map(x => x * 2); // [2, 4, 6, 8, 10]

// filter() - отфильтровать элементы
const even = arr.filter(x => x % 2 === 0); // [2, 4]

// reduce() - свести к одному значению
const sum = arr.reduce((acc, x) => acc + x, 0); // 15

// reduceRight() - то же, но справа налево
const result = [1, 2, 3].reduceRight((acc, x) => acc + x, 0); // 6

// find() - найти первый элемент
const found = arr.find(x => x > 3); // 4

// findIndex() - найти индекс первого элемента
const foundIndex = arr.findIndex(x => x > 3); // 3

// findLast() - найти последний элемент (ES2023)
const lastFound = arr.findLast(x => x > 3); // 5

// findLastIndex() - индекс последнего (ES2023)
const lastFoundIndex = arr.findLastIndex(x => x > 3); // 4

// some() - есть ли хотя бы один элемент
const hasEven = arr.some(x => x % 2 === 0); // true

// every() - все ли элементы удовлетворяют условию
const allPositive = arr.every(x => x > 0); // true

// flat() - сделать массив плоским
const nested = [1, [2, 3], [4, [5, 6]]];
const flat1 = nested.flat(); // [1, 2, 3, 4, [5, 6]]
const flat2 = nested.flat(2); // [1, 2, 3, 4, 5, 6]
const flatAll = nested.flat(Infinity); // полностью плоский

// flatMap() - map + flat
const arr2 = [1, 2, 3];
const result = arr2.flatMap(x => [x, x * 2]); // [1, 2, 2, 4, 3, 6]
```

### 1.2 Продвинутые техники с массивами

```javascript
// Удаление дубликатов
const arr = [1, 2, 2, 3, 3, 4];
const unique = [...new Set(arr)]; // [1, 2, 3, 4]

// Поиск пересечения массивов
const arr1 = [1, 2, 3, 4];
const arr2 = [3, 4, 5, 6];
const intersection = arr1.filter(x => arr2.includes(x)); // [3, 4]

// Разница массивов
const difference = arr1.filter(x => !arr2.includes(x)); // [1, 2]

// Объединение массивов (union)
const union = [...new Set([...arr1, ...arr2])]; // [1, 2, 3, 4, 5, 6]

// Группировка элементов
const items = [
  { category: 'fruit', name: 'apple' },
  { category: 'fruit', name: 'banana' },
  { category: 'vegetable', name: 'carrot' }
];

const grouped = items.reduce((acc, item) => {
  if (!acc[item.category]) {
    acc[item.category] = [];
  }
  acc[item.category].push(item);
  return acc;
}, {});
// { fruit: [...], vegetable: [...] }

// Подсчет элементов
const fruits = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
const count = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1;
  return acc;
}, {});
// { apple: 3, banana: 2, orange: 1 }

// Разбиение массива на части (chunk)
function chunk(arr, size) {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
}
chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]

// Перемешивание массива (shuffle)
function shuffle(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Поиск максимального/минимального
const numbers = [5, 2, 8, 1, 9];
const max = Math.max(...numbers); // 9
const min = Math.min(...numbers); // 1

// Создание диапазона чисел
const range = (start, end) => 
  Array.from({ length: end - start + 1 }, (_, i) => start + i);
range(1, 5); // [1, 2, 3, 4, 5]

// Транспонирование матрицы
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];
const transposed = matrix[0].map((_, i) => matrix.map(row => row[i]));
// [[1, 4, 7], [2, 5, 8], [3, 6, 9]]
```

### 1.3 TypeScript и массивы

```typescript
// Типизация массивов
const numbers: number[] = [1, 2, 3];
const strings: Array<string> = ['a', 'b', 'c'];

// Readonly массивы
const readonlyArr: readonly number[] = [1, 2, 3];
// readonlyArr.push(4); // Ошибка!

// Кортежи (Tuples)
const tuple: [string, number] = ['age', 30];
const tuple2: [string, number, boolean?] = ['name', 25]; // опциональный элемент

// Typed array methods
interface User {
  id: number;
  name: string;
}

const users: User[] = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' }
];

const names: string[] = users.map(u => u.name);
const john: User | undefined = users.find(u => u.name === 'John');

// Utility types для массивов
type ArrayElement<T> = T extends (infer U)[] ? U : never;
type UserType = ArrayElement<typeof users>; // User

// Generic функции с массивами
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}
```

## 2. Строки - Полный гайд

### 2.1 Основные методы строк

```javascript
const str = "Hello World";

// Длина строки
console.log(str.length); // 11

// Доступ к символам
console.log(str[0]); // "H"
console.log(str.charAt(0)); // "H"
console.log(str.charCodeAt(0)); // 72 (код символа)

// Поиск подстроки
console.log(str.indexOf('World')); // 6
console.log(str.lastIndexOf('o')); // 7
console.log(str.includes('World')); // true
console.log(str.startsWith('Hello')); // true
console.log(str.endsWith('World')); // true

// Извлечение подстроки
console.log(str.slice(0, 5)); // "Hello"
console.log(str.slice(-5)); // "World"
console.log(str.substring(0, 5)); // "Hello"
console.log(str.substr(6, 5)); // "World" (deprecated)

// Изменение регистра
console.log(str.toLowerCase()); // "hello world"
console.log(str.toUpperCase()); // "HELLO WORLD"

// Замена
console.log(str.replace('World', 'JavaScript')); // "Hello JavaScript"
console.log(str.replaceAll('o', '0')); // "Hell0 W0rld"

// Разделение и объединение
console.log(str.split(' ')); // ["Hello", "World"]
console.log(['Hello', 'World'].join(' ')); // "Hello World"

// Удаление пробелов
const str2 = "  Hello World  ";
console.log(str2.trim()); // "Hello World"
console.log(str2.trimStart()); // "Hello World  "
console.log(str2.trimEnd()); // "  Hello World"

// Дополнение строки
console.log('5'.padStart(3, '0')); // "005"
console.log('5'.padEnd(3, '0')); // "500"

// Повторение
console.log('abc'.repeat(3)); // "abcabcabc"

// Сравнение
console.log('a'.localeCompare('b')); // -1 (a < b)
console.log('b'.localeCompare('a')); // 1 (b > a)
console.log('a'.localeCompare('a')); // 0 (равны)
```

### 2.2 Шаблонные литералы (Template Literals)

```javascript
const name = 'John';
const age = 30;

// Базовое использование
const greeting = `Hello, ${name}!`;

// Многострочные строки
const multiline = `
  Line 1
  Line 2
  Line 3
`;

// Вложенные выражения
const message = `${name} is ${age >= 18 ? 'adult' : 'minor'}`;

// Tagged templates
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    return `${result}${str}<strong>${values[i] || ''}</strong>`;
  }, '');
}

const text = highlight`Name: ${name}, Age: ${age}`;
// "Name: <strong>John</strong>, Age: <strong>30</strong>"
```

### 2.3 Регулярные выражения

```javascript
// Создание регулярного выражения
const regex1 = /pattern/flags;
const regex2 = new RegExp('pattern', 'flags');

// Флаги:
// g - global (все совпадения)
// i - case insensitive (без учета регистра)
// m - multiline (многострочный режим)
// s - dotall (. включает \n)
// u - unicode
// y - sticky (поиск с конкретной позиции)

// Методы RegExp
const str = "Hello World";
const pattern = /o/g;

console.log(pattern.test(str)); // true (есть совпадение)
console.log(pattern.exec(str)); // ["o", index: 4, ...]

// Методы String с regex
console.log(str.match(/o/g)); // ["o", "o"]
console.log(str.search(/World/)); // 6
console.log(str.replace(/o/g, '0')); // "Hell0 W0rld"
console.log(str.split(/\s/)); // ["Hello", "World"]

// Группы захвата
const dateStr = "2024-01-15";
const datePattern = /(\d{4})-(\d{2})-(\d{2})/;
const [, year, month, day] = dateStr.match(datePattern);
// year = "2024", month = "01", day = "15"

// Именованные группы
const datePattern2 = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const { groups: { year, month, day } } = dateStr.match(datePattern2);

// Lookahead и lookbehind
const text = "price: $100";
console.log(text.match(/\$(?=\d+)/)); // ["$"] - за $ следует число
console.log(text.match(/(?<=\$)\d+/)); // ["100"] - число после $

// Часто используемые паттерны
const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^https?:\/\/.+/,
  phone: /^\+?[\d\s-()]+$/,
  hexColor: /^#[0-9A-Fa-f]{6}$/,
  ipAddress: /^(\d{1,3}\.){3}\d{1,3}$/,
  creditCard: /^\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}$/
};
```

### 2.4 Продвинутые техники со строками

```javascript
// Reverse строки
function reverseString(str) {
  return str.split('').reverse().join('');
  // или
  return [...str].reverse().join('');
}

// Проверка на палиндром
function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}

// Capitalize first letter
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Title case
function titleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

// Camel case to snake case
function camelToSnake(str) {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

// Snake case to camel case
function snakeToCamel(str) {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

// Truncate строки
function truncate(str, maxLength, suffix = '...') {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

// Подсчет слов
function wordCount(str) {
  return str.trim().split(/\s+/).length;
}

// Escape HTML
function escapeHtml(str) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return str.replace(/[&<>"']/g, m => map[m]);
}

// Levenshtein distance (расстояние между строками)
function levenshtein(a, b) {
  const matrix = [];
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}
```

### 2.5 TypeScript и строки

```typescript
// String literal types
type Direction = 'left' | 'right' | 'up' | 'down';
const dir: Direction = 'left';

// Template literal types
type Greeting = `Hello ${string}`;
const greeting: Greeting = 'Hello World';

type EventName = `on${Capitalize<string>}`;
const event: EventName = 'onClick';

// String manipulation types
type Uppercase<S extends string> = intrinsic;
type Lowercase<S extends string> = intrinsic;
type Capitalize<S extends string> = intrinsic;
type Uncapitalize<S extends string> = intrinsic;

type Name = 'john';
type UpperName = Uppercase<Name>; // 'JOHN'
type CapitalName = Capitalize<Name>; // 'John'

// Typed string methods
function processString(str: string): string {
  return str.trim().toLowerCase();
}

// Брендированные строки
type Email = string & { readonly __brand: 'Email' };
type URL = string & { readonly __brand: 'URL' };

function createEmail(str: string): Email {
  if (!str.includes('@')) throw new Error('Invalid email');
  return str as Email;
}
```

## 3. Map и Set

### 3.1 Map - Словарь ключ-значение

```javascript
// Создание Map
const map = new Map();

// Добавление элементов
map.set('name', 'John');
map.set('age', 30);
map.set(1, 'number key');
map.set({ id: 1 }, 'object key');

// Получение значений
console.log(map.get('name')); // "John"
console.log(map.get('unknown')); // undefined

// Проверка наличия ключа
console.log(map.has('name')); // true

// Удаление элемента
map.delete('age');

// Размер Map
console.log(map.size); // 2

// Очистка Map
map.clear();

// Инициализация с данными
const map2 = new Map([
  ['key1', 'value1'],
  ['key2', 'value2']
]);

// Итерация
const map3 = new Map([
  ['name', 'John'],
  ['age', 30]
]);

// Перебор ключей
for (const key of map3.keys()) {
  console.log(key);
}

// Перебор значений
for (const value of map3.values()) {
  console.log(value);
}

// Перебор пар ключ-значение
for (const [key, value] of map3.entries()) {
  console.log(`${key}: ${value}`);
}

// forEach
map3.forEach((value, key) => {
  console.log(`${key}: ${value}`);
});

// Преобразование
const obj = Object.fromEntries(map3); // в объект
const arr = Array.from(map3); // в массив
```

### 3.2 WeakMap - Слабые ссылки

```javascript
// WeakMap - ключи только объекты, автоматическая сборка мусора
const weakMap = new WeakMap();

let obj = { id: 1 };
weakMap.set(obj, 'some data');

console.log(weakMap.get(obj)); // "some data"

// Когда obj будет удален, запись в WeakMap тоже удалится
obj = null; // теперь объект может быть удален сборщиком мусора

// Методы WeakMap
weakMap.set(key, value);
weakMap.get(key);
weakMap.has(key);
weakMap.delete(key);

// Применение: приватные данные
const privateData = new WeakMap();

class Person {
  constructor(name) {
    privateData.set(this, { name });
  }
  
  getName() {
    return privateData.get(this).name;
  }
}
```

### 3.3 Set - Множество уникальных значений

```javascript
// Создание Set
const set = new Set();

// Добавление элементов
set.add(1);
set.add(2);
set.add(2); // дубликат игнорируется
set.add('hello');
set.add({ id: 1 });

// Размер Set
console.log(set.size); // 4

// Проверка наличия
console.log(set.has(1)); // true

// Удаление элемента
set.delete(1);

// Очистка Set
set.clear();

// Инициализация с данными
const set2 = new Set([1, 2, 3, 3, 4]); // [1, 2, 3, 4]

// Итерация
for (const value of set2) {
  console.log(value);
}

set2.forEach(value => {
  console.log(value);
});

// Преобразование
const arr = Array.from(set2); // в массив
const arr2 = [...set2]; // или через spread

// Удаление дубликатов из массива
const numbers = [1, 2, 2, 3, 3, 4];
const unique = [...new Set(numbers)]; // [1, 2, 3, 4]
```

### 3.4 WeakSet - Слабые ссылки

```javascript
// WeakSet - только объекты, автоматическая сборка мусора
const weakSet = new WeakSet();

let obj1 = { id: 1 };
let obj2 = { id: 2 };

weakSet.add(obj1);
weakSet.add(obj2);

console.log(weakSet.has(obj1)); // true

weakSet.delete(obj1);

// Применение: отслеживание посещенных объектов
const visited = new WeakSet();

function process(obj) {
  if (visited.has(obj)) {
    return; // уже обработан
  }
  
  visited.add(obj);
  // обработка...
}
```

### 3.5 Продвинутые техники

```javascript
// Операции над множествами

// Объединение (Union)
const setA = new Set([1, 2, 3]);
const setB = new Set([3, 4, 5]);
const union = new Set([...setA, ...setB]); // {1, 2, 3, 4, 5}

// Пересечение (Intersection)
const intersection = new Set([...setA].filter(x => setB.has(x))); // {3}

// Разность (Difference)
const difference = new Set([...setA].filter(x => !setB.has(x))); // {1, 2}

// Симметрическая разность
const symDiff = new Set([
  ...[...setA].filter(x => !setB.has(x)),
  ...[...setB].filter(x => !setA.has(x))
]); // {1, 2, 4, 5}

// Подмножество
const isSubset = (subset, set) => {
  return [...subset].every(item => set.has(item));
};

// Map как кеш
class Cache {
  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }
  
  get(key) {
    if (!this.cache.has(key)) return undefined;
    
    // LRU: переместить в конец
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    
    return value;
  }
  
  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    
    this.cache.set(key, value);
    
    // Удалить самый старый элемент, если превышен размер
    if (this.cache.size > this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }
}

// Группировка с Map
const items = [
  { category: 'fruit', name: 'apple' },
  { category: 'fruit', name: 'banana' },
  { category: 'vegetable', name: 'carrot' }
];

const grouped = items.reduce((map, item) => {
  const group = map.get(item.category) || [];
  group.push(item);
  map.set(item.category, group);
  return map;
}, new Map());
```

### 3.6 TypeScript и Map/Set

```typescript
// Типизация Map
const map1: Map<string, number> = new Map();
map1.set('age', 30);

// Generic Map
interface User {
  id: number;
  name: string;
}

const userMap: Map<number, User> = new Map();
userMap.set(1, { id: 1, name: 'John' });

// Типизация Set
const set1: Set<number> = new Set([1, 2, 3]);
const set2: Set<string> = new Set(['a', 'b', 'c']);

// Record vs Map
// Record - для статических ключей
type UserRecord = Record<string, User>;
const users: UserRecord = {
  '1': { id: 1, name: 'John' }
};

// Map - для динамических ключей
const userMap2 = new Map<number, User>();
```

## 4. Замыкания (Closures)

### 4.3 Практические примеры замыканий

```javascript
// 1. Приватные переменные (Module Pattern)
const calculator = (function() {
  let result = 0; // приватная переменная
  
  return {
    add(n) {
      result += n;
      return this;
    },
    subtract(n) {
      result -= n;
      return this;
    },
    getResult() {
      return result;
    }
  };
})();

calculator.add(5).subtract(2).getResult(); // 3
console.log(calculator.result); // undefined - приватная переменная

// 2. Фабрика функций
function createMultiplier(multiplier) {
  return function(number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15

// 3. Каррирование
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function(...nextArgs) {
      return curried.apply(this, args.concat(nextArgs));
    };
  };
}

function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6

// 4. Мемоизация
function memoize(fn) {
  const cache = {};
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (cache[key]) {
      console.log('From cache');
      return cache[key];
    }
    
    const result = fn.apply(this, args);
    cache[key] = result;
    return result;
  };
}

const fibonacci = memoize(function(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

// 5. Event handlers с замыканиями
function setupButtons() {
  for (let i = 0; i < 5; i++) {
    const button = document.createElement('button');
    button.textContent = `Button ${i}`;
    
    // Замыкание сохраняет правильное значение i
    button.addEventListener('click', function() {
      console.log(`Clicked button ${i}`);
    });
    
    document.body.appendChild(button);
  }
}

// 6. Debounce
function debounce(func, delay) {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

const debouncedSearch = debounce(function(query) {
  console.log('Searching for:', query);
}, 500);

// 7. Throttle
function throttle(func, limit) {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// 8. Once - выполнить функцию один раз
function once(fn) {
  let called = false;
  let result;
  
  return function(...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}

const initialize = once(() => {
  console.log('Initializing...');
  return 'initialized';
});

initialize(); // "Initializing..." -> "initialized"
initialize(); // -> "initialized" (без лога)
```

### 4.4 Распространенные ошибки с замыканиями

```javascript
// ❌ ОШИБКА: var в цикле
for (var i = 0; i < 5; i++) {
  setTimeout(function() {
    console.log(i); // выведет 5, 5, 5, 5, 5
  }, 100);
}

// ✅ РЕШЕНИЕ 1: let вместо var
for (let i = 0; i < 5; i++) {
  setTimeout(function() {
    console.log(i); // выведет 0, 1, 2, 3, 4
  }, 100);
}

// ✅ РЕШЕНИЕ 2: IIFE
for (var i = 0; i < 5; i++) {
  (function(j) {
    setTimeout(function() {
      console.log(j); // выведет 0, 1, 2, 3, 4
    }, 100);
  })(i);
}

// ❌ ОШИБКА: утечка памяти
function createHeavyObject() {
  const heavyData = new Array(1000000).fill('data');
  
  return function() {
    // Даже если не используем heavyData,
    // он остается в памяти из-за замыкания
    console.log('Function called');
  };
}

// ✅ РЕШЕНИЕ: явно освобождать ресурсы
function createHeavyObject() {
  let heavyData = new Array(1000000).fill('data');
  
  return {
    doSomething() {
      console.log('Function called');
    },
    cleanup() {
      heavyData = null; // освободить память
    }
  };
}
```

### 4.5 Замыкания и this

```javascript
const obj = {
  name: 'Object',
  
  // Стрелочная функция - this из внешнего контекста
  arrowMethod: () => {
    console.log(this.name); // undefined (this = window/global)
  },
  
  // Обычная функция - this = obj
  normalMethod: function() {
    console.log(this.name); // "Object"
    
    // Вложенная функция теряет контекст
    function inner() {
      console.log(this.name); // undefined
    }
    inner();
    
    // Стрелочная функция сохраняет контекст
    const arrowInner = () => {
      console.log(this.name); // "Object"
    };
    arrowInner();
  }
};
```

## 5. Контекст (this)

### 5.1 Что такое this?

`this` - это ключевое слово, которое ссылается на объект, в контексте которого выполняется функция.

**Значение this зависит от способа вызова функции:**

### 5.2 Способы определения this

```javascript
// 1. Global context
console.log(this); // window (в браузере) или global (в Node.js)

function globalFunction() {
  console.log(this); // window в обычном режиме, undefined в strict mode
}

// 2. Object method
const obj = {
  name: 'Object',
  method() {
    console.log(this.name); // "Object"
  }
};
obj.method(); // this = obj

// 3. Constructor function
function Person(name) {
  this.name = name; // this = новый объект
}
const person = new Person('John');

// 4. Явное связывание: call, apply, bind
function greet(greeting) {
  console.log(`${greeting}, ${this.name}`);
}

const user = { name: 'John' };

greet.call(user, 'Hello'); // "Hello, John"
greet.apply(user, ['Hello']); // "Hello, John"

const boundGreet = greet.bind(user, 'Hello');
boundGreet(); // "Hello, John"

// 5. Arrow functions - this из внешнего контекста
const obj2 = {
  name: 'Object',
  
  regularMethod: function() {
    console.log(this.name); // "Object"
  },
  
  arrowMethod: () => {
    console.log(this.name); // undefined (this из глобального контекста)
  },
  
  methodWithArrow: function() {
    const arrow = () => {
      console.log(this.name); // "Object" (this из methodWithArrow)
    };
    arrow();
  }
};

// 6. Event handlers
document.getElementById('button').addEventListener('click', function() {
  console.log(this); // <button> элемент
});

document.getElementById('button').addEventListener('click', () => {
  console.log(this); // window (стрелочная функция)
});

// 7. Class methods
class MyClass {
  constructor(name) {
    this.name = name;
  }
  
  method() {
    console.log(this.name);
  }
  
  arrowMethod = () => {
    console.log(this.name); // всегда экземпляр класса
  }
}

const instance = new MyClass('Instance');
instance.method(); // "Instance"

const detached = instance.method;
detached(); // undefined (потерян контекст)

const detachedArrow = instance.arrowMethod;
detachedArrow(); // "Instance" (контекст сохранен)
```

### 5.3 Правила определения this (по приоритету)

1. **new binding** - при вызове с `new`, this = новый объект
2. **Explicit binding** - call, apply, bind
3. **Implicit binding** - вызов как метод объекта
4. **Default binding** - глобальный объект (или undefined в strict mode)
5. **Arrow functions** - лексический this (из внешней функции)

```javascript
// Примеры приоритета
function foo() {
  console.log(this.name);
}

const obj1 = { name: 'obj1', foo };
const obj2 = { name: 'obj2' };

// Implicit binding
obj1.foo(); // "obj1"

// Explicit binding побеждает implicit
obj1.foo.call(obj2); // "obj2"

// new побеждает explicit
const boundFoo = foo.bind(obj1);
const instance = new boundFoo(); // this = новый объект (не obj1)
```

### 5.4 Распространенные проблемы с this

```javascript
// Проблема 1: Потеря контекста при передаче метода
const obj = {
  name: 'Object',
  greet() {
    console.log(`Hello, ${this.name}`);
  }
};

obj.greet(); // "Hello, Object"

const greet = obj.greet;
greet(); // "Hello, undefined" - потерян контекст

// Решение 1: bind
const boundGreet = obj.greet.bind(obj);
boundGreet(); // "Hello, Object"

// Решение 2: стрелочная функция
const obj2 = {
  name: 'Object',
  greet: () => {
    console.log(`Hello, ${this.name}`); // НЕ РАБОТАЕТ!
  }
};

// Решение 3: wrapper function
setTimeout(() => obj.greet(), 1000);

// Проблема 2: this в коллбэках
class Counter {
  constructor() {
    this.count = 0;
  }
  
  increment() {
    this.count++;
  }
  
  startIncrementing() {
    // ❌ Потеря контекста
    setInterval(this.increment, 1000);
    
    // ✅ Решение 1: стрелочная функция
    setInterval(() => this.increment(), 1000);
    
    // ✅ Решение 2: bind
    setInterval(this.increment.bind(this), 1000);
  }
}

// Проблема 3: this в nested functions
const obj3 = {
  name: 'Object',
  
  method() {
    console.log(this.name); // "Object"
    
    function nested() {
      console.log(this.name); // undefined - потерян контекст
    }
    nested();
    
    // Решение: стрелочная функция
    const nestedArrow = () => {
      console.log(this.name); // "Object"
    };
    nestedArrow();
  }
};
```

### 5.5 this в TypeScript

```typescript
// Типизация this
interface User {
  name: string;
  greet(this: User): void;
}

const user: User = {
  name: 'John',
  greet() {
    console.log(this.name); // TypeScript знает, что this - User
  }
};

// ThisType helper
interface Methods {
  greet(): void;
}

interface State {
  name: string;
}

const obj: Methods & ThisType<State & Methods> = {
  greet() {
    console.log(this.name); // this имеет тип State & Methods
  }
};
```

## 6. Event Loop - Цикл событий

### 6.1 Что такое Event Loop?

**Event Loop** - механизм, который позволяет JavaScript выполнять неблокирующие операции, несмотря на то, что JavaScript однопоточный.

### 6.2 Компоненты Event Loop

```
┌───────────────────────────┐
│      Call Stack           │ Стек вызовов (синхронный код)
└───────────────────────────┘
            ↓
┌───────────────────────────┐
│      Web APIs             │ setTimeout, fetch, DOM events
└───────────────────────────┘
            ↓
┌───────────────────────────┐
│   Callback Queue          │ Макрозадачи (tasks)
│   (Task Queue)            │
└───────────────────────────┘
            ↓
┌───────────────────────────┐
│   Microtask Queue         │ Микрозадачи (Promises, queueMicrotask)
└───────────────────────────┘
            ↓
┌───────────────────────────┐
│      Event Loop           │ Координатор
└───────────────────────────┘
```

### 6.3 Как работает Event Loop?

```javascript
// Пример работы Event Loop
console.log('1'); // Call Stack

setTimeout(() => {
  console.log('2'); // Callback Queue (макрозадача)
}, 0);

Promise.resolve().then(() => {
  console.log('3'); // Microtask Queue
});

console.log('4'); // Call Stack

// Вывод: 1, 4, 3, 2
```

**Порядок выполнения:**
1. Выполняется весь синхронный код в Call Stack
2. Выполняются ВСЕ микрозадачи (Promises)
3. Выполняется ОДНА макрозадача (setTimeout, setInterval)
4. Повторяется с шага 2

### 6.4 Макрозадачи vs Микрозадачи

```javascript
// Макрозадачи (Task Queue):
setTimeout(() => {}, 0);
setInterval(() => {}, 0);
setImmediate(() => {}); // Node.js
// I/O операции
// UI rendering

// Микрозадачи (Microtask Queue):
Promise.resolve().then(() => {});
queueMicrotask(() => {});
process.nextTick(() => {}); // Node.js (приоритетнее Promise)
// MutationObserver

// Пример разницы
console.log('Start');

setTimeout(() => {
  console.log('setTimeout 1');
  
  Promise.resolve().then(() => {
    console.log('Promise in setTimeout');
  });
}, 0);

Promise.resolve().then(() => {
  console.log('Promise 1');
  
  setTimeout(() => {
    console.log('setTimeout in Promise');
  }, 0);
});

setTimeout(() => {
  console.log('setTimeout 2');
}, 0);

Promise.resolve().then(() => {
  console.log('Promise 2');
});

console.log('End');

// Вывод:
// Start
// End
// Promise 1
// Promise 2
// setTimeout 1
// Promise in setTimeout
// setTimeout 2
// setTimeout in Promise
```

### 6.5 Подробный пример

```javascript
console.log('Script start'); // 1

setTimeout(() => {
  console.log('setTimeout'); // 7
}, 0);

Promise.resolve()
  .then(() => {
    console.log('Promise 1'); // 4
  })
  .then(() => {
    console.log('Promise 2'); // 5
  });

async function async1() {
  console.log('async1 start'); // 2
  await async2();
  console.log('async1 end'); // 6 (await = Promise.then)
}

async function async2() {
  console.log('async2'); // 3
}

async1();

console.log('Script end'); // 4

// Порядок выполнения:
// 1. Script start (синхронный)
// 2. async1 start (синхронный)
// 3. async2 (синхронный)
// 4. Script end (синхронный)
// --- Стек пуст, выполняем микрозадачи ---
// 5. Promise 1 (микрозадача)
// 6. Promise 2 (микрозадача)
// 7. async1 end (микрозадача от await)
// --- Все микрозадачи выполнены, берем макрозадачу ---
// 8. setTimeout (макрозадача)
```

### 6.6 Блокирующий vs Неблокирующий код

```javascript
// ❌ Блокирующий код (синхронный)
function blockingOperation() {
  const start = Date.now();
  while (Date.now() - start < 3000) {
    // Блокирует Event Loop на 3 секунды
  }
  console.log('Done');
}

blockingOperation(); // UI замерзнет!

// ✅ Неблокирующий код (асинхронный)
function nonBlockingOperation() {
  setTimeout(() => {
    console.log('Done');
  }, 3000);
}

nonBlockingOperation(); // UI работает нормально
```

### 6.7 Визуализация Event Loop

```javascript
// Шаг за шагом
console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve()
  .then(() => console.log('3'))
  .then(() => console.log('4'));

console.log('5');

// Выполнение:

// === Call Stack ===
// console.log('1') -> выполнено
// setTimeout -> отправлено в Web API
// Promise.resolve().then -> отправлено в Microtask Queue
// console.log('5') -> выполнено

// === Call Stack пуст ===
// Event Loop проверяет Microtask Queue

// === Microtask Queue ===
// then(() => console.log('3')) -> выполнено
// then(() => console.log('4')) -> выполнено

// === Microtask Queue пуст ===
// Event Loop берет задачу из Task Queue

// === Task Queue ===
// setTimeout callback -> выполнено

// Результат: 1, 5, 3, 4, 2
```

### 6.8 requestAnimationFrame и Event Loop

```javascript
// requestAnimationFrame выполняется ПОСЛЕ микрозадач, но ДО следующей макрозадачи

console.log('Start');

setTimeout(() => {
  console.log('setTimeout');
}, 0);

Promise.resolve().then(() => {
  console.log('Promise');
});

requestAnimationFrame(() => {
  console.log('rAF');
});

console.log('End');

// Вывод: Start, End, Promise, rAF, setTimeout
```

### 6.9 Node.js Event Loop

Node.js имеет более сложный Event Loop с несколькими фазами:

```javascript
// Фазы Node.js Event Loop:
// 1. timers (setTimeout, setInterval)
// 2. pending callbacks (I/O callbacks)
// 3. idle, prepare (внутренние)
// 4. poll (новые I/O события)
// 5. check (setImmediate)
// 6. close callbacks (socket.on('close'))

// process.nextTick имеет НАИВЫСШИЙ приоритет
process.nextTick(() => {
  console.log('nextTick'); // 1
});

Promise.resolve().then(() => {
  console.log('Promise'); // 2
});

setTimeout(() => {
  console.log('setTimeout'); // 4
}, 0);

setImmediate(() => {
  console.log('setImmediate'); // 3
});

// В Node.js: nextTick, Promise, setImmediate, setTimeout
```

## 7. Async/Await и Promises

### 7.1 Promises - Основы

**Promise** - объект, представляющий результат асинхронной операции.

```javascript
// Создание Promise
const promise = new Promise((resolve, reject) => {
  // Асинхронная операция
  const success = true;
  
  if (success) {
    resolve('Success!'); // выполнено успешно
  } else {
    reject('Error!'); // ошибка
  }
});

// Состояния Promise:
// 1. pending - начальное состояние
// 2. fulfilled - операция выполнена успешно
// 3. rejected - операция завершилась с ошибкой

// Использование Promise
promise
  .then(result => {
    console.log(result); // "Success!"
    return 'Next value';
  })
  .then(result => {
    console.log(result); // "Next value"
  })
  .catch(error => {
    console.error(error);
  })
  .finally(() => {
    console.log('Always executed');
  });
```

### 7.2 Promise методы

```javascript
// Promise.resolve() - создать fulfilled Promise
const resolved = Promise.resolve('value');

// Promise.reject() - создать rejected Promise
const rejected = Promise.reject('error');

// Promise.all() - ждать выполнения всех Promise
const promises = [
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
];

Promise.all(promises)
  .then(results => {
    console.log(results); // [1, 2, 3]
  })
  .catch(error => {
    // Если хотя бы один Promise rejected
    console.error(error);
  });

// Promise.allSettled() - ждать завершения всех Promise
Promise.allSettled([
  Promise.resolve(1),
  Promise.reject('error'),
  Promise.resolve(3)
]).then(results => {
  console.log(results);
  // [
  //   { status: 'fulfilled', value: 1 },
  //   { status: 'rejected', reason: 'error' },
  //   { status: 'fulfilled', value: 3 }
  // ]
});

// Promise.race() - первый выполненный Promise
Promise.race([
  new Promise(resolve => setTimeout(() => resolve(1), 1000)),
  new Promise(resolve => setTimeout(() => resolve(2), 500))
]).then(result => {
  console.log(result); // 2 (первый завершился)
});

// Promise.any() - первый успешный Promise
Promise.any([
  Promise.reject('error 1'),
  Promise.resolve(2),
  Promise.resolve(3)
]).then(result => {
  console.log(result); // 2
}).catch(error => {
  // AggregateError если все rejected
  console.error(error);
});
```

### 7.3 Promise Chaining

```javascript
// Цепочка Promise
fetch('/api/user')
  .then(response => response.json())
  .then(user => {
    console.log(user);
    return fetch(`/api/posts?userId=${user.id}`);
  })
  .then(response => response.json())
  .then(posts => {
    console.log(posts);
  })
  .catch(error => {
    console.error('Error:', error);
  });

// Возврат Promise из then()
function getUserPosts(userId) {
  return fetch(`/api/users/${userId}`)
    .then(response => response.json())
    .then(user => {
      return fetch(`/api/posts?userId=${user.id}`);
    })
    .then(response => response.json());
}

getUserPosts(1).then(posts => console.log(posts));
```

### 7.4 Async/Await

**async/await** - синтаксический сахар над Promises.

```javascript
// Функция с async всегда возвращает Promise
async function fetchData() {
  return 'data'; // автоматически обернется в Promise.resolve('data')
}

fetchData().then(data => console.log(data)); // "data"

// await приостанавливает выполнение функции
async function getData() {
  const response = await fetch('/api/data');
  const data = await response.json();
  return data;
}

// Обработка ошибок с try-catch
async function getUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error; // пробросить ошибку дальше
  }
}

// Параллельное выполнение
async function getMultipleData() {
  // ❌ Последовательно (медленно)
  const user = await fetch('/api/user').then(r => r.json());
  const posts = await fetch('/api/posts').then(r => r.json());
  
  // ✅ Параллельно (быстро)
  const [user, posts] = await Promise.all([
    fetch('/api/user').then(r => r.json()),
    fetch('/api/posts').then(r => r.json())
  ]);
  
  return { user, posts };
}
```

### 7.5 Продвинутые техники

```javascript
// Retry с экспоненциальной задержкой
async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      if (i === retries - 1) throw error;
      
      // Экспоненциальная задержка
      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Timeout для Promise
function timeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), ms)
    )
  ]);
}

// Использование
timeout(fetch('/api/data'), 5000)
  .then(response => response.json())
  .catch(error => console.error(error));

// Sequential execution
async function sequential(tasks) {
  const results = [];
  
  for (const task of tasks) {
    const result = await task();
    results.push(result);
  }
  
  return results;
}

// Parallel execution с ограничением
async function parallelLimit(tasks, limit) {
  const results = [];
  const executing = [];
  
  for (const task of tasks) {
    const promise = task().then(result => {
      executing.splice(executing.indexOf(promise), 1);
      return result;
    });
    
    results.push(promise);
    executing.push(promise);
    
    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }
  
  return Promise.all(results);
}

// Promise pool
class PromisePool {
  constructor(limit) {
    this.limit = limit;
    this.running = 0;
    this.queue = [];
  }
  
  async add(fn) {
    while (this.running >= this.limit) {
      await Promise.race(this.queue);
    }
    
    this.running++;
    
    const promise = fn().finally(() => {
      this.running--;
      const index = this.queue.indexOf(promise);
      if (index !== -1) {
        this.queue.splice(index, 1);
      }
    });
    
    this.queue.push(promise);
    
    return promise;
  }
}

// Использование
const pool = new PromisePool(3); // максимум 3 одновременных запроса

const tasks = urls.map(url =>
  () => fetch(url).then(r => r.json())
);

const results = await Promise.all(
  tasks.map(task => pool.add(task))
);
```

### 7.6 Async итераторы

```javascript
// Async итератор
const asyncIterable = {
  [Symbol.asyncIterator]() {
    let i = 0;
    
    return {
      async next() {
        if (i < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return { value: i++, done: false };
        }
        
        return { done: true };
      }
    };
  }
};

// Использование
for await (const value of asyncIterable) {
  console.log(value); // 0, 1, 2 (с задержкой)
}

// Async generator
async function* asyncGenerator() {
  let i = 0;
  
  while (i < 3) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    yield i++;
  }
}

for await (const value of asyncGenerator()) {
  console.log(value); // 0, 1, 2 (с задержкой)
}

// Практический пример: пагинация
async function* fetchPages(url) {
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    const response = await fetch(`${url}?page=${page}`);
    const data = await response..1 Что такое замыкание?

**Замыкание** - это функция, которая имеет доступ к переменным из внешней функции даже после того, как внешняя функция завершила выполнение.

```javascript
function createCounter() {
  let count = 0; // приватная переменная
  
  return function() {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
```

### 4.2 Как работают замыкания?

```javascript
function outer() {
  const outerVar = 'I am outer';
  
  function inner() {
    console.log(outerVar); // доступ к outerVar
  }
  
  return inner;
}

const innerFunc = outer();
innerFunc(); // "I am outer"
// outer() уже завершилась, но inner() сохранил доступ к outerVar
```

**Механизм:**
1. Когда создается функция, она сохраняет ссылку на свою лексическую область видимости
2. При вызове функции используется сохраненная область видимости, а не текущая
3. Переменные из внешней функции живут, пока существует ссылка на внутреннюю функцию

### 4 async function* fetchPages(url) {
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    const response = await fetch(`${url}?page=${page}`);
    const data = await response.json();
    
    yield data.items;
    
    hasMore = data.hasMore;
    page++;
  }
}

// Использование
for await (const items of fetchPages('/api/items')) {
  console.log('Page items:', items);
}
```

### 7.7 TypeScript и Promises

```typescript
// Типизация Promise
const promise: Promise<string> = new Promise((resolve, reject) => {
  resolve('Success');
});

// Async функции
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// Generic Promise functions
async function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
    }
  }
  throw new Error('All retries failed');
}

// Типизация Promise.all
const [users, posts]: [User[], Post[]] = await Promise.all([
  fetchUsers(),
  fetchPosts()
]);
```

## 8. ES5 vs ES6+ - Ключевые отличия

### 8.1 Переменные

```javascript
// ES5
var x = 10;
var x = 20; // можно переопределить
// function scope

// ES6+
let y = 10;
// let y = 20; // Ошибка! Нельзя переопределить
// block scope

const z = 10;
// z = 20; // Ошибка! Нельзя переприсвоить
// block scope
```

### 8.2 Arrow Functions

```javascript
// ES5
var add = function(a, b) {
  return a + b;
};

// ES6+
const add = (a, b) => a + b;

// Разница в this
// ES5
var obj = {
  name: 'ES5',
  method: function() {
    setTimeout(function() {
      console.log(this.name); // undefined
    }, 100);
  }
};

// ES6+
const obj2 = {
  name: 'ES6',
  method() {
    setTimeout(() => {
      console.log(this.name); // "ES6" - лексический this
    }, 100);
  }
};
```

### 8.3 Classes

```javascript
// ES5 - Constructor functions
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.greet = function() {
  console.log('Hello, ' + this.name);
};

Person.staticMethod = function() {
  console.log('Static method');
};

// Наследование в ES5
function Employee(name, age, job) {
  Person.call(this, name, age);
  this.job = job;
}

Employee.prototype = Object.create(Person.prototype);
Employee.prototype.constructor = Employee;

// ES6+ - Classes
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  greet() {
    console.log(`Hello, ${this.name}`);
  }
  
  static staticMethod() {
    console.log('Static method');
  }
}

// Наследование в ES6+
class Employee extends Person {
  constructor(name, age, job) {
    super(name, age);
    this.job = job;
  }
  
  work() {
    console.log(`${this.name} is working as ${this.job}`);
  }
}
```

### 8.4 Template Literals

```javascript
// ES5
var name = 'John';
var age = 30;
var message = 'Hello, ' + name + '! You are ' + age + ' years old.';

// ES6+
const name = 'John';
const age = 30;
const message = `Hello, ${name}! You are ${age} years old.`;

// Многострочные строки
// ES5
var multiline = 'Line 1\n' +
  'Line 2\n' +
  'Line 3';

// ES6+
const multiline = `
  Line 1
  Line 2
  Line 3
`;
```

### 8.5 Деструктуризация

```javascript
// ES5
var arr = [1, 2, 3];
var a = arr[0];
var b = arr[1];
var c = arr[2];

var obj = { x: 10, y: 20 };
var x = obj.x;
var y = obj.y;

// ES6+
const arr = [1, 2, 3];
const [a, b, c] = arr;

const obj = { x: 10, y: 20 };
const { x, y } = obj;

// Значения по умолчанию
const { x = 0, y = 0 } = {};

// Переименование
const { x: newX, y: newY } = obj;

// Rest
const [first, ...rest] = [1, 2, 3, 4];
const { a, ...others } = { a: 1, b: 2, c: 3 };
```

### 8.6 Spread и Rest

```javascript
// ES5
var arr1 = [1, 2, 3];
var arr2 = [4, 5, 6];
var combined = arr1.concat(arr2);

function sum() {
  var args = Array.prototype.slice.call(arguments);
  return args.reduce(function(a, b) { return a + b; }, 0);
}

// ES6+
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];

const sum = (...numbers) => numbers.reduce((a, b) => a + b, 0);

// Копирование объектов
const obj = { a: 1, b: 2 };
const copy = { ...obj };
const extended = { ...obj, c: 3 };
```

### 8.7 Default Parameters

```javascript
// ES5
function greet(name, greeting) {
  name = name || 'Guest';
  greeting = greeting || 'Hello';
  console.log(greeting + ', ' + name);
}

// ES6+
function greet(name = 'Guest', greeting = 'Hello') {
  console.log(`${greeting}, ${name}`);
}
```

### 8.8 Modules

```javascript
// ES5 - CommonJS (Node.js)
// module.js
module.exports = {
  add: function(a, b) { return a + b; },
  subtract: function(a, b) { return a - b; }
};

// main.js
var math = require('./module');
console.log(math.add(1, 2));

// ES6+ - ES Modules
// module.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

export default class Calculator {
  // ...
}

// main.js
import Calculator, { add, subtract } from './module.js';
console.log(add(1, 2));
```

### 8.9 Promises

```javascript
// ES5 - Callbacks
function fetchData(callback) {
  setTimeout(function() {
    callback(null, 'data');
  }, 1000);
}

fetchData(function(error, data) {
  if (error) {
    console.error(error);
  } else {
    console.log(data);
  }
});

// ES6+ - Promises
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('data');
    }, 1000);
  });
}

fetchData()
  .then(data => console.log(data))
  .catch(error => console.error(error));

// ES2017 - Async/Await
async function getData() {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
```

### 8.10 Другие важные добавления

```javascript
// Object literal enhancements
// ES5
var x = 10, y = 20;
var obj = {
  x: x,
  y: y,
  method: function() {}
};

// ES6+
const obj = {
  x,
  y,
  method() {},
  [dynamicKey]: 'value' // computed property names
};

// for...of
const arr = [1, 2, 3];
for (const item of arr) {
  console.log(item);
}

// Map и Set
const map = new Map();
map.set('key', 'value');

const set = new Set([1, 2, 3, 3]); // {1, 2, 3}

// Symbol
const sym = Symbol('description');

// Generators
function* generator() {
  yield 1;
  yield 2;
  yield 3;
}

// Array methods
[1, 2, 3].find(x => x > 1); // 2
[1, 2, 3].findIndex(x => x > 1); // 1
[1, 2, 3].includes(2); // true
Array.from('hello'); // ['h', 'e', 'l', 'l', 'o']

// String methods
'hello'.startsWith('he'); // true
'hello'.endsWith('lo'); // true
'hello'.includes('ll'); // true
'ab'.repeat(3); // 'ababab'

// Object methods
Object.assign({}, { a: 1 }, { b: 2 }); // { a: 1, b: 2 }
Object.entries({ a: 1, b: 2 }); // [['a', 1], ['b', 2]]
Object.values({ a: 1, b: 2 }); // [1, 2]
Object.keys({ a: 1, b: 2 }); // ['a', 'b']
```

## 9. Dependency Injection (DI)

### 9.1 Что такое Dependency Injection?

**Dependency Injection** - паттерн проектирования, при котором зависимости объекта передаются извне, а не создаются внутри самого объекта.

### 9.2 Проблема без DI

```javascript
// ❌ Плохо - жесткая зависимость
class UserService {
  constructor() {
    this.api = new ApiClient(); // жесткая связь
    this.logger = new Logger(); // жесткая связь
  }
  
  async getUser(id) {
    this.logger.log('Fetching user');
    return this.api.get(`/users/${id}`);
  }
}

// Проблемы:
// 1. Невозможно подменить ApiClient для тестирования
// 2. Нельзя переиспользовать экземпляры
// 3. Сложно изменить реализацию
```

### 9.3 Решение с DI

```javascript
// ✅ Хорошо - зависимости внедряются
class UserService {
  constructor(apiClient, logger) {
    this.api = apiClient;
    this.logger = logger;
  }
  
  async getUser(id) {
    this.logger.log('Fetching user');
    return this.api.get(`/users/${id}`);
  }
}

// Использование
const apiClient = new ApiClient();
const logger = new Logger();
const userService = new UserService(apiClient, logger);

// Для тестирования легко подменить зависимости
const mockApi = new MockApiClient();
const mockLogger = new MockLogger();
const testService = new UserService(mockApi, mockLogger);
```

### 9.4 Типы DI

```javascript
// 1. Constructor Injection (самый распространенный)
class Service {
  constructor(dependency) {
    this.dependency = dependency;
  }
}

// 2. Setter Injection
class Service {
  setDependency(dependency) {
    this.dependency = dependency;
  }
}

// 3. Interface Injection (редко в JS)
class Service {
  injectDependency(dependency) {
    this.dependency = dependency;
  }
}
```

### 9.5 DI Container

```javascript
// Простой DI Container
class Container {
  constructor() {
    this.services = new Map();
  }
  
  register(name, definition) {
    this.services.set(name, definition);
  }
  
  get(name) {
    const service = this.services.get(name);
    
    if (!service) {
      throw new Error(`Service ${name} not found`);
    }
    
    if (typeof service === 'function') {
      return service(this);
    }
    
    return service;
  }
}

// Использование
const container = new Container();

// Регистрация сервисов
container.register('logger', new Logger());
container.register('apiClient', new ApiClient());

container.register('userService', (c) => {
  return new UserService(
    c.get('apiClient'),
    c.get('logger')
  );
});

// Получение сервиса
const userService = container.get('userService');
```

### 9.6 Продвинутый DI Container

```javascript
class AdvancedContainer {
  constructor() {
    this.services = new Map();
    this.singletons = new Map();
  }
  
  // Регистрация singleton
  singleton(name, factory) {
    this.services.set(name, { type: 'singleton', factory });
  }
  
  // Регистрация transient (новый экземпляр каждый раз)
  transient(name, factory) {
    this.services.set(name, { type: 'transient', factory });
  }
  
  get(name) {
    const service = this.services.get(name);
    
    if (!service) {
      throw new Error(`Service ${name} not found`);
    }
    
    if (service.type === 'singleton') {
      if (!this.singletons.has(name)) {
        this.singletons.set(name, service.factory(this));
      }
      return this.singletons.get(name);
    }
    
    return service.factory(this);
  }
}

// Использование
const container = new AdvancedContainer();

container.singleton('logger', () => new Logger());
container.singleton('config', () => new Config());

container.transient('userService', (c) => {
  return new UserService(
    c.get('apiClient'),
    c.get('logger')
  );
});
```

### 9.7 TypeScript и DI

```typescript
// Интерфейсы для зависимостей
interface ILogger {
  log(message: string): void;
}

interface IApiClient {
  get<T>(url: string): Promise<T>;
  post<T>(url: string, data: any): Promise<T>;
}

// Класс с типизированными зависимостями
class UserService {
  constructor(
    private apiClient: IApiClient,
    private logger: ILogger
  ) {}
  
  async getUser(id: number): Promise<User> {
    this.logger.log(`Fetching user ${id}`);
    return this.apiClient.get<User>(`/users/${id}`);
  }
}

// DI Container с типами
class TypedContainer {
  private services = new Map<string, any>();
  
  register<T>(name: string, factory: (c: TypedContainer) => T): void {
    this.services.set(name, factory);
  }
  
  get<T>(name: string): T {
    const factory = this.services.get(name);
    if (!factory) {
      throw new Error(`Service ${name} not found`);
    }
    return factory(this);
  }
}

// InversifyJS - популярная DI библиотека для TypeScript
import { Container, injectable, inject } from 'inversify';

@injectable()
class Logger implements ILogger {
  log(message: string) {
    console.log(message);
  }
}

@injectable()
class UserService {
  constructor(
    @inject('ILogger') private logger: ILogger,
    @inject('IApiClient') private apiClient: IApiClient
  ) {}
}
```

## 10. Dependency Inversion Principle (DIP)

### 10.1 Что такое DIP?

**Dependency Inversion Principle** - один из принципов SOLID. Гласит:
1. Модули высокого уровня не должны зависеть от модулей низкого уровня. Оба должны зависеть от абстракций.
2. Абстракции не должны зависеть от деталей. Детали должны зависеть от абстракций.

### 10.2 Проблема без DIP

```javascript
// ❌ Плохо - прямая зависимость от конкретной реализации
class MySQLDatabase {
  connect() {
    console.log('Connected to MySQL');
  }
  
  query(sql) {
    console.log('Executing MySQL query:', sql);
    return [];
  }
}

class UserRepository {
  constructor() {
    this.db = new MySQLDatabase(); // жесткая зависимость
  }
  
  findById(id) {
    return this.db.query(`SELECT * FROM users WHERE id = ${id}`);
  }
}

// Проблема: если нужно переключиться на PostgreSQL,
// придется менять UserRepository
```

### 10.3 Решение с DIP

```javascript
// ✅ Хорошо - зависимость от абстракции
// Абстракция (интерфейс)
class IDatabase {
  connect() { throw new Error('Not implemented'); }
  query(sql) { throw new Error('Not implemented'); }
}

// Реализации
class MySQLDatabase extends IDatabase {
  connect() {
    console.log('Connected to MySQL');
  }
  
  query(sql) {
    console.log('Executing MySQL query:', sql);
    return [];
  }
}

class PostgreSQLDatabase extends IDatabase {
  connect() {
    console.log('Connected to PostgreSQL');
  }
  
  query(sql) {
    console.log('Executing PostgreSQL query:', sql);
    return [];
  }
}

// Высокоуровневый модуль зависит от абстракции
class UserRepository {
  constructor(database) { // зависимость от IDatabase
    this.db = database;
  }
  
  findById(id) {
    return this.db.query(`SELECT * FROM users WHERE id = ${id}`);
  }
}

// Использование
const mysqlDb = new MySQLDatabase();
const userRepo1 = new UserRepository(mysqlDb);

const postgresDb = new PostgreSQLDatabase();
const userRepo2 = new UserRepository(postgresDb);
```

### 10.4 DIP с TypeScript

```typescript
// Интерфейс (абстракция)
interface IDatabase {
  connect(): Promise<void>;
  query<T>(sql: string): Promise<T[]>;
  disconnect(): Promise<void>;
}

// Реализации
class MySQLDatabase implements IDatabase {
  async connect(): Promise<void> {
    console.log('Connected to MySQL');
  }
  
  async query<T>(sql: string): Promise<T[]> {
    console.log('Executing MySQL query:', sql);
    return [];
  }
  
  async disconnect(): Promise<void> {
    console.log('Disconnected from MySQL');
  }
}

class PostgreSQLDatabase implements IDatabase {
  async connect(): Promise<void> {
    console.log('Connected to PostgreSQL');
  }
  
  async query<T>(sql: string): Promise<T[]> {
    console.log('Executing PostgreSQL query:', sql);
    return [];
  }
  
  async disconnect(): Promise<void> {
    console.log('Disconnected from PostgreSQL');
  }
}

// Репозиторий зависит от абстракции
class UserRepository {
  constructor(private database: IDatabase) {}
  
  async findById(id: number): Promise<User | null> {
    const results = await this.database.query<User>(
      `SELECT * FROM users WHERE id = ${id}`
    );
    return results[0] || null;
  }
  
  async findAll(): Promise<User[]> {
    return this.database.query<User>('SELECT * FROM users');
  }
}

// Использование с DI
const database: IDatabase = new MySQLDatabase();
const userRepository = new UserRepository(database);
```

### 10.5 Практический пример - Слои приложения

```typescript
// Domain Layer - абстракции
interface IUserRepository {
  findById(id: number): Promise<User | null>;
  save(user: User): Promise<User>;
  delete(id: number): Promise<void>;
}

interface IEmailService {
  send(to: string, subject: string, body: string): Promise<void>;
}

// Application Layer - бизнес-логика
class UserService {
  constructor(
    private userRepository: IUserRepository,
    private emailService: IEmailService
  ) {}
  
  async registerUser(data: UserRegistrationData): Promise<User> {
    const user = new User(data);
    await this.userRepository.save(user);
    
    await this.emailService.send(
      user.email,
      'Welcome!',
      'Thank you for registering'
    );
    
    return user;
  }
}

// Infrastructure Layer - реализации
class DatabaseUserRepository implements IUserRepository {
  async findById(id: number): Promise<User | null> {
    // Реальная работа с БД
    return null;
  }
  
  async save(user: User): Promise<User> {
    // Сохранение в БД
    return user;
  }
  
  async delete(id: number): Promise<void> {
    // Удаление из БД
  }
}

class SMTPEmailService implements IEmailService {
  async send(to: string, subject: string, body: string): Promise<void> {
    // Отправка через SMTP
    console.log(`Sending email to ${to}`);
  }
}

// Composition Root - сборка зависимостей
function createUserService(): UserService {
  const userRepository: IUserRepository = new DatabaseUserRepository();
  const emailService: IEmailService = new SMTPEmailService();
  
  return new UserService(userRepository, emailService);
}

// Для тестирования легко подменить реализации
class MockUserRepository implements IUserRepository {
  private users: User[] = [];
  
  async findById(id: number): Promise<User | null> {
    return this.users.find(u => u.id === id) || null;
  }
  
  async save(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }
  
  async delete(id: number): Promise<void> {
    this.users = this.users.filter(u => u.id !== id);
  }
}

class MockEmailService implements IEmailService {
  sentEmails: Array<{ to: string; subject: string; body: string }> = [];
  
  async send(to: string, subject: string, body: string): Promise<void> {
    this.sentEmails.push({ to, subject, body });
  }
}

// Тесты
const mockUserRepo = new MockUserRepository();
const mockEmailService = new MockEmailService();
const testUserService = new UserService(mockUserRepo, mockEmailService);
```

### 10.6 Преимущества DIP

1. **Гибкость** - легко заменить реализацию
2. **Тестируемость** - легко подменить зависимости моками
3. **Переиспользуемость** - высокоуровневые модули не зависят от деталей
4. **Масштабируемость** - легко добавлять новые реализации
5. **Поддерживаемость** - изменения в низкоуровневых модулях не влияют на высокоуровневые

## 11. TypeScript - Ключевые моменты для собеседования

### 11.1 Базовые типы

```typescript
// Примитивные типы
let str: string = 'hello';
let num: number = 42;
let bool: boolean = true;
let nothing: null = null;
let undef: undefined = undefined;
let sym: symbol = Symbol('sym');
let big: bigint = 100n;

// Any - отключает проверку типов
let anything: any = 'string';
anything = 123; // ОК

// Unknown - безопасная версия any
let value: unknown = 'string';
// value.toUpperCase(); // Ошибка!
if (typeof value === 'string') {
  value.toUpperCase(); // ОК
}

// Void - отсутствие типа
function log(): void {
  console.log('hello');
}

// Never - функция никогда не возвращает значение
function throwError(): never {
  throw new Error('Error');
}

function infiniteLoop(): never {
  while (true) {}
}

// Object types
let obj: { name: string; age: number } = {
  name: 'John',
  age: 30
};

// Array types
let arr1: number[] = [1, 2, 3];
let arr2: Array<number> = [1, 2, 3];

// Tuple types
let tuple: [string, number] = ['hello', 42];

// Enum types
enum Color {
  Red,
  Green,
  Blue
}
let color: Color = Color.Red;

// Const enum (оптимизация)
const enum Direction {
  Up,
  Down,
  Left,
  Right
}
```

### 11.2 Union и Intersection Types

```typescript
// Union - или/или
type StringOrNumber = string | number;
let value: StringOrNumber = 'hello';
value = 42; // ОК

// Type guards для union
function processValue(value: string | number) {
  if (typeof value === 'string') {
    return value.toUpperCase();
  } else {
    return value.toFixed(2);
  }
}

// Discriminated Unions
type Success = { status: 'success'; data: string };
type Error = { status: 'error'; message: string };
type Result = Success | Error;

function handleResult(result: Result) {
  if (result.status === 'success') {
    console.log(result.data); // TypeScript знает тип
  } else {
    console.log(result.message);
  }
}

// Intersection - и
type Person = { name: string };
type Employee = { employeeId: number };
type Staff = Person & Employee;

const staff: Staff = {
  name: 'John',
  employeeId: 123
};
```

### 11.3 Type Aliases vs Interfaces

```typescript
// Type Alias
type User = {
  name: string;
  age: number;
};

// Interface
interface User {
  name: string;
  age: number;
}

// Основные отличия:

// 1. Interface можно расширять (extends)
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// 2. Interface можно переопределять (declaration merging)
interface Window {
  title: string;
}

interface Window {
  width: number;
}

// Результат: Window имеет title и width

// 3. Type более гибкий
type ID = string | number;
type Callback = (data: string) => void;
type Tree<T> = { value: T; left?: Tree<T>; right?: Tree<T> };

// Когда использовать что:
// - Interface - для объектов, классов, API контрактов
// - Type - для union, intersection, mapped types, utility types
```

### 11.4 Generics

```typescript
// Базовый generic
function identity<T>(arg: T): T {
  return arg;
}

identity<number>(42);
identity('hello'); // type inference

// Generic constraints
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length > b.length ? a : b;
}

longest('hello', 'world'); // ОК
longest([1, 2], [1, 2, 3]); // ОК
// longest(10, 20); // Ошибка! number не имеет length

// Multiple type parameters
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

// Generic interfaces
interface Box<T> {
  value: T;
}

const numberBox: Box<number> = { value: 42 };
const stringBox: Box<string> = { value: 'hello' };

// Generic classes
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

// Generic type aliases
type Nullable<T> = T | null;
type ArrayOrSingle<T> = T | T[];
```

### 11.5 Utility Types

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Partial - все свойства опциональные
type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; age?: number }

// Required - все свойства обязательные
type RequiredUser = Required<PartialUser>;

// Readonly - все свойства только для чтения
type ReadonlyUser = Readonly<User>;

// Pick - выбрать определенные свойства
type UserPreview = Pick<User, 'id' | 'name'>;
// { id: number; name: string }

// Omit - исключить определенные свойства
type UserWithoutEmail = Omit<User, 'email'>;
// { id: number; name: string; age: number }

// Record - создать тип с заданными ключами
type UserRoles = Record<string, boolean>;
// { [key: string]: boolean }

// Exclude - исключить типы из union
type T1 = Exclude<string | number | boolean, boolean>;
// string | number

// Extract - извлечь типы из union
type T2 = Extract<string | number | boolean, string | boolean>;
// string | boolean

// NonNullable - исключить null и undefined
type T3 = NonNullable<string | null | undefined>;
// string

// ReturnType - получить тип возвращаемого значения# JavaScript & TypeScript - Полная теоретическая база для собеседования

## 1. Массивы - Полный гайд

### 1.1 Основные методы массивов

#### Методы изменяющие массив (Mutating)

```javascript
const arr = [1, 2, 3, 4, 5];

// push() - добавить в конец
arr.push(6); // [1, 2, 3, 4, 5, 6]

// pop() - удалить с конца
const last = arr.pop(); // last = 6, arr = [1, 2, 3, 4, 5]

// unshift() - добавить в начало
arr.unshift(0); // [0, 1, 2, 3, 4, 5]

// shift() - удалить с начала
const first = arr.shift(); // first = 0, arr = [1, 2, 3, 4, 5]

// splice(start, deleteCount, ...items) - универсальный метод
arr.splice(2, 1); // удалить 1 элемент с индекса 2: [1, 2, 4, 5]
arr.splice(2, 0, 3); // вставить 3 на индекс 2: [1, 2, 3, 4, 5]
arr.splice(2, 1, 99); // заменить элемент: [1, 2, 99, 4, 5]

// reverse() - перевернуть массив
arr.reverse(); // [5, 4, 99, 2, 1]

// sort() - сортировать
arr.sort(); // сортировка как строк
arr.sort((a, b) => a - b); // числовая сортировка по возрастанию
arr.sort((a, b) => b - a); // по убыванию

// fill(value, start, end) - заполнить значением
arr.fill(0); // [0, 0, 0, 0, 0]
arr.fill(1, 2, 4); // [0, 0, 1, 1, 0]
```

#### Методы НЕ изменяющие массив (Non-mutating)

```javascript
const arr = [1, 2, 3, 4, 5];

// concat() - объединить массивы
const arr2 = arr.concat([6, 7]); // [1, 2, 3, 4, 5, 6, 7]

// slice(start, end) - получить часть массива
const part = arr.slice(1, 3); // [2, 3]
const copy = arr.slice(); // копия массива

// join(separator) - объединить в строку
const str = arr.join('-'); // "1-2-3-4-5"

// indexOf(element) - найти индекс
const index = arr.indexOf(3); // 2

// lastIndexOf(element) - найти индекс с конца
const lastIndex = [1, 2, 3, 2, 1].lastIndexOf(2); // 3

// includes(element) - проверить наличие
const hasThree = arr.includes(3); // true

// toString() - преобразовать в строку
const str2 = arr.toString(); // "1,2,3,4,5"
```

#### Итерационные методы

```javascript
const arr = [1, 2, 3, 4, 5];

// forEach() - выполнить функцию для каждого элемента
arr.forEach((item, index, array) => {
  console.log(`arr[${index}] = ${item}`);
});

// map() - создать новый массив, применив функцию
const doubled = arr.map(x => x * 2); // [2, 4, 6, 8, 10]

// filter() - отфильтровать элементы
const even = arr.filter(x => x % 2 === 0); // [2, 4]

// reduce() - свести к одному значению
const sum = arr.reduce((acc, x) => acc + x, 0); // 15

// reduceRight() - то же, но справа налево
const result = [1, 2, 3].reduceRight((acc, x) => acc + x, 0); // 6

// find() - найти первый элемент
const found = arr.find(x => x > 3); // 4

// findIndex() - найти индекс первого элемента
const foundIndex = arr.findIndex(x => x > 3); // 3

// findLast() - найти последний элемент (ES2023)
const lastFound = arr.findLast(x => x > 3); // 5

// findLastIndex() - индекс последнего (ES2023)
const lastFoundIndex = arr.findLastIndex(x => x > 3); // 4

// some() - есть ли хотя бы один элемент
const hasEven = arr.some(x => x % 2 === 0); // true

// every() - все ли элементы удовлетворяют условию
const allPositive = arr.every(x => x > 0); // true

// flat() - сделать массив плоским
const nested = [1, [2, 3], [4, [5, 6]]];
const flat1 = nested.flat(); // [1, 2, 3, 4, [5, 6]]
const flat2 = nested.flat(2); // [1, 2, 3, 4, 5, 6]
const flatAll = nested.flat(Infinity); // полностью плоский

// flatMap() - map + flat
const arr2 = [1, 2, 3];
const result = arr2.flatMap(x => [x, x * 2]); // [1, 2, 2, 4, 3, 6]
```

### 1.2 Продвинутые техники с массивами

```javascript
// Удаление дубликатов
const arr = [1, 2, 2, 3, 3, 4];
const unique = [...new Set(arr)]; // [1, 2, 3, 4]

// Поиск пересечения массивов
const arr1 = [1, 2, 3, 4];
const arr2 = [3, 4, 5, 6];
const intersection = arr1.filter(x => arr2.includes(x)); // [3, 4]

// Разница массивов
const difference = arr1.filter(x => !arr2.includes(x)); // [1, 2]

// Объединение массивов (union)
const union = [...new Set([...arr1, ...arr2])]; // [1, 2, 3, 4, 5, 6]

// Группировка элементов
const items = [
  { category: 'fruit', name: 'apple' },
  { category: 'fruit', name: 'banana' },
  { category: 'vegetable', name: 'carrot' }
];

const grouped = items.reduce((acc, item) => {
  if (!acc[item.category]) {
    acc[item.category] = [];
  }
  acc[item.category].push(item);
  return acc;
}, {});
// { fruit: [...], vegetable: [...] }

// Подсчет элементов
const fruits = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
const count = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1;
  return acc;
}, {});
// { apple: 3, banana: 2, orange: 1 }

// Разбиение массива на части (chunk)
function chunk(arr, size) {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
}
chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]

// Перемешивание массива (shuffle)
function shuffle(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Поиск максимального/минимального
const numbers = [5, 2, 8, 1, 9];
const max = Math.max(...numbers); // 9
const min = Math.min(...numbers); // 1

// Создание диапазона чисел
const range = (start, end) => 
  Array.from({ length: end - start + 1 }, (_, i) => start + i);
range(1, 5); // [1, 2, 3, 4, 5]

// Транспонирование матрицы
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];
const transposed = matrix[0].map((_, i) => matrix.map(row => row[i]));
// [[1, 4, 7], [2, 5, 8], [3, 6, 9]]
```

### 1.3 TypeScript и массивы

```typescript
// Типизация массивов
const numbers: number[] = [1, 2, 3];
const strings: Array<string> = ['a', 'b', 'c'];

// Readonly массивы
const readonlyArr: readonly number[] = [1, 2, 3];
// readonlyArr.push(4); // Ошибка!

// Кортежи (Tuples)
const tuple: [string, number] = ['age', 30];
const tuple2: [string, number, boolean?] = ['name', 25]; // опциональный элемент

// Typed array methods
interface User {
  id: number;
  name: string;
}

const users: User[] = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' }
];

const names: string[] = users.map(u => u.name);
const john: User | undefined = users.find(u => u.name === 'John');

// Utility types для массивов
type ArrayElement<T> = T extends (infer U)[] ? U : never;
type UserType = ArrayElement<typeof users>; // User

// Generic функции с массивами
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}
```

## 2. Строки - Полный гайд

### 2.1 Основные методы строк

```javascript
const str = "Hello World";

// Длина строки
console.log(str.length); // 11

// Доступ к символам
console.log(str[0]); // "H"
console.log(str.charAt(0)); // "H"
console.log(str.charCodeAt(0)); // 72 (код символа)

// Поиск подстроки
console.log(str.indexOf('World')); // 6
console.log(str.lastIndexOf('o')); // 7
console.log(str.includes('World')); // true
console.log(str.startsWith('Hello')); // true
console.log(str.endsWith('World')); // true

// Извлечение подстроки
console.log(str.slice(0, 5)); // "Hello"
console.log(str.slice(-5)); // "World"
console.log(str.substring(0, 5)); // "Hello"
console.log(str.substr(6, 5)); // "World" (deprecated)

// Изменение регистра
console.log(str.toLowerCase()); // "hello world"
console.log(str.toUpperCase()); // "HELLO WORLD"

// Замена
console.log(str.replace('World', 'JavaScript')); // "Hello JavaScript"
console.log(str.replaceAll('o', '0')); // "Hell0 W0rld"

// Разделение и объединение
console.log(str.split(' ')); // ["Hello", "World"]
console.log(['Hello', 'World'].join(' ')); // "Hello World"

// Удаление пробелов
const str2 = "  Hello World  ";
console.log(str2.trim()); // "Hello World"
console.log(str2.trimStart()); // "Hello World  "
console.log(str2.trimEnd()); // "  Hello World"

// Дополнение строки
console.log('5'.padStart(3, '0')); // "005"
console.log('5'.padEnd(3, '0')); // "500"

// Повторение
console.log('abc'.repeat(3)); // "abcabcabc"

// Сравнение
console.log('a'.localeCompare('b')); // -1 (a < b)
console.log('b'.localeCompare('a')); // 1 (b > a)
console.log('a'.localeCompare('a')); // 0 (равны)
```

### 2.2 Шаблонные литералы (Template Literals)

```javascript
const name = 'John';
const age = 30;

// Базовое использование
const greeting = `Hello, ${name}!`;

// Многострочные строки
const multiline = `
  Line 1
  Line 2
  Line 3
`;

// Вложенные выражения
const message = `${name} is ${age >= 18 ? 'adult' : 'minor'}`;

// Tagged templates
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    return `${result}${str}<strong>${values[i] || ''}</strong>`;
  }, '');
}

const text = highlight`Name: ${name}, Age: ${age}`;
// "Name: <strong>John</strong>, Age: <strong>30</strong>"
```

### 2.3 Регулярные выражения

```javascript
// Создание регулярного выражения
const regex1 = /pattern/flags;
const regex2 = new RegExp('pattern', 'flags');

// Флаги:
// g - global (все совпадения)
// i - case insensitive (без учета регистра)
// m - multiline (многострочный режим)
// s - dotall (. включает \n)
// u - unicode
// y - sticky (поиск с конкретной позиции)

// Методы RegExp
const str = "Hello World";
const pattern = /o/g;

console.log(pattern.test(str)); // true (есть совпадение)
console.log(pattern.exec(str)); // ["o", index: 4, ...]

// Методы String с regex
console.log(str.match(/o/g)); // ["o", "o"]
console.log(str.search(/World/)); // 6
console.log(str.replace(/o/g, '0')); // "Hell0 W0rld"
console.log(str.split(/\s/)); // ["Hello", "World"]

// Группы захвата
const dateStr = "2024-01-15";
const datePattern = /(\d{4})-(\d{2})-(\d{2})/;
const [, year, month, day] = dateStr.match(datePattern);
// year = "2024", month = "01", day = "15"

// Именованные группы
const datePattern2 = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const { groups: { year, month, day } } = dateStr.match(datePattern2);

// Lookahead и lookbehind
const text = "price: $100";
console.log(text.match(/\$(?=\d+)/)); // ["$"] - за $ следует число
console.log(text.match(/(?<=\$)\d+/)); // ["100"] - число после $

// Часто используемые паттерны
const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^https?:\/\/.+/,
  phone: /^\+?[\d\s-()]+$/,
  hexColor: /^#[0-9A-Fa-f]{6}$/,
  ipAddress: /^(\d{1,3}\.){3}\d{1,3}$/,
  creditCard: /^\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}$/
};
```

### 2.4 Продвинутые техники со строками

```javascript
// Reverse строки
function reverseString(str) {
  return str.split('').reverse().join('');
  // или
  return [...str].reverse().join('');
}

// Проверка на палиндром
function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}

// Capitalize first letter
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Title case
function titleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

// Camel case to snake case
function camelToSnake(str) {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

// Snake case to camel case
function snakeToCamel(str) {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

// Truncate строки
function truncate(str, maxLength, suffix = '...') {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

// Подсчет слов
function wordCount(str) {
  return str.trim().split(/\s+/).length;
}

// Escape HTML
function escapeHtml(str) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return str.replace(/[&<>"']/g, m => map[m]);
}

// Levenshtein distance (расстояние между строками)
function levenshtein(a, b) {
  const matrix = [];
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}
```

### 2.5 TypeScript и строки

```typescript
// String literal types
type Direction = 'left' | 'right' | 'up' | 'down';
const dir: Direction = 'left';

// Template literal types
type Greeting = `Hello ${string}`;
const greeting: Greeting = 'Hello World';

type EventName = `on${Capitalize<string>}`;
const event: EventName = 'onClick';

// String manipulation types
type Uppercase<S extends string> = intrinsic;
type Lowercase<S extends string> = intrinsic;
type Capitalize<S extends string> = intrinsic;
type Uncapitalize<S extends string> = intrinsic;

type Name = 'john';
type UpperName = Uppercase<Name>; // 'JOHN'
type CapitalName = Capitalize<Name>; // 'John'

// Typed string methods
function processString(str: string): string {
  return str.trim().toLowerCase();
}

// Брендированные строки
type Email = string & { readonly __brand: 'Email' };
type URL = string & { readonly __brand: 'URL' };

function createEmail(str: string): Email {
  if (!str.includes('@')) throw new Error('Invalid email');
  return str as Email;
}
```

## 3. Map и Set

### 3.1 Map - Словарь ключ-значение

```javascript
// Создание Map
const map = new Map();

// Добавление элементов
map.set('name', 'John');
map.set('age', 30);
map.set(1, 'number key');
map.set({ id: 1 }, 'object key');

// Получение значений
console.log(map.get('name')); // "John"
console.log(map.get('unknown')); // undefined

// Проверка наличия ключа
console.log(map.has('name')); // true

// Удаление элемента
map.delete('age');

// Размер Map
console.log(map.size); // 2

// Очистка Map
map.clear();

// Инициализация с данными
const map2 = new Map([
  ['key1', 'value1'],
  ['key2', 'value2']
]);

// Итерация
const map3 = new Map([
  ['name', 'John'],
  ['age', 30]
]);

// Перебор ключей
for (const key of map3.keys()) {
  console.log(key);
}

// Перебор значений
for (const value of map3.values()) {
  console.log(value);
}

// Перебор пар ключ-значение
for (const [key, value] of map3.entries()) {
  console.log(`${key}: ${value}`);
}

// forEach
map3.forEach((value, key) => {
  console.log(`${key}: ${value}`);
});

// Преобразование
const obj = Object.fromEntries(map3); // в объект
const arr = Array.from(map3); // в массив
```

### 3.2 WeakMap - Слабые ссылки

```javascript
// WeakMap - ключи только объекты, автоматическая сборка мусора
const weakMap = new WeakMap();

let obj = { id: 1 };
weakMap.set(obj, 'some data');

console.log(weakMap.get(obj)); // "some data"

// Когда obj будет удален, запись в WeakMap тоже удалится
obj = null; // теперь объект может быть удален сборщиком мусора

// Методы WeakMap
weakMap.set(key, value);
weakMap.get(key);
weakMap.has(key);
weakMap.delete(key);

// Применение: приватные данные
const privateData = new WeakMap();

class Person {
  constructor(name) {
    privateData.set(this, { name });
  }
  
  getName() {
    return privateData.get(this).name;
  }
}
```

### 3.3 Set - Множество уникальных значений

```javascript
// Создание Set
const set = new Set();

// Добавление элементов
set.add(1);
set.add(2);
set.add(2); // дубликат игнорируется
set.add('hello');
set.add({ id: 1 });

// Размер Set
console.log(set.size); // 4

// Проверка наличия
console.log(set.has(1)); // true

// Удаление элемента
set.delete(1);

// Очистка Set
set.clear();

// Инициализация с данными
const set2 = new Set([1, 2, 3, 3, 4]); // [1, 2, 3, 4]

// Итерация
for (const value of set2) {
  console.log(value);
}

set2.forEach(value => {
  console.log(value);
});

// Преобразование
const arr = Array.from(set2); // в массив
const arr2 = [...set2]; // или через spread

// Удаление дубликатов из массива
const numbers = [1, 2, 2, 3, 3, 4];
const unique = [...new Set(numbers)]; // [1, 2, 3, 4]
```

### 3.4 WeakSet - Слабые ссылки

```javascript
// WeakSet - только объекты, автоматическая сборка мусора
const weakSet = new WeakSet();

let obj1 = { id: 1 };
let obj2 = { id: 2 };

weakSet.add(obj1);
weakSet.add(obj2);

console.log(weakSet.has(obj1)); // true

weakSet.delete(obj1);

// Применение: отслеживание посещенных объектов
const visited = new WeakSet();

function process(obj) {
  if (visited.has(obj)) {
    return; // уже обработан
  }
  
  visited.add(obj);
  // обработка...
}
```

### 3.5 Продвинутые техники

```javascript
// Операции над множествами

// Объединение (Union)
const setA = new Set([1, 2, 3]);
const setB = new Set([3, 4, 5]);
const union = new Set([...setA, ...setB]); // {1, 2, 3, 4, 5}

// Пересечение (Intersection)
const intersection = new Set([...setA].filter(x => setB.has(x))); // {3}

// Разность (Difference)
const difference = new Set([...setA].filter(x => !setB.has(x))); // {1, 2}

// Симметрическая разность
const symDiff = new Set([
  ...[...setA].filter(x => !setB.has(x)),
  ...[...setB].filter(x => !setA.has(x))
]); // {1, 2, 4, 5}

// Подмножество
const isSubset = (subset, set) => {
  return [...subset].every(item => set.has(item));
};

// Map как кеш
class Cache {
  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }
  
  get(key) {
    if (!this.cache.has(key)) return undefined;
    
    // LRU: переместить в конец
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    
    return value;
  }
  
  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    
    this.cache.set(key, value);
    
    // Удалить самый старый элемент, если превышен размер
    if (this.cache.size > this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }
}

// Группировка с Map
const items = [
  { category: 'fruit', name: 'apple' },
  { category: 'fruit', name: 'banana' },
  { category: 'vegetable', name: 'carrot' }
];

const grouped = items.reduce((map, item) => {
  const group = map.get(item.category) || [];
  group.push(item);
  map.set(item.category, group);
  return map;
}, new Map());
```

### 3.6 TypeScript и Map/Set

```typescript
// Типизация Map
const map1: Map<string, number> = new Map();
map1.set('age', 30);

// Generic Map
interface User {
  id: number;
  name: string;
}

const userMap: Map<number, User> = new Map();
userMap.set(1, { id: 1, name: 'John' });

// Типизация Set
const set1: Set<number> = new Set([1, 2, 3]);
const set2: Set<string> = new Set(['a', 'b', 'c']);

// Record vs Map
// Record - для статических ключей
type UserRecord = Record<string, User>;
const users: UserRecord = {
  '1': { id: 1, name: 'John' }
};

// Map - для динамических ключей
const userMap2 = new Map<number, User>();
```

## 4. Замыкания (Closures)

### 4.3 Практические примеры замыканий

```javascript
// 1. Приватные переменные (Module Pattern)
const calculator = (function() {
  let result = 0; // приватная переменная
  
  return {
    add(n) {
      result += n;
      return this;
    },
    subtract(n) {
      result -= n;
      return this;
    },
    getResult() {
      return result;
    }
  };
})();

calculator.add(5).subtract(2).getResult(); // 3
console.log(calculator.result); // undefined - приватная переменная

// 2. Фабрика функций
function createMultiplier(multiplier) {
  return function(number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15

// 3. Каррирование
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function(...nextArgs) {
      return curried.apply(this, args.concat(nextArgs));
    };
  };
}

function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6

// 4. Мемоизация
function memoize(fn) {
  const cache = {};
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (cache[key]) {
      console.log('From cache');
      return cache[key];
    }
    
    const result = fn.apply(this, args);
    cache[key] = result;
    return result;
  };
}

const fibonacci = memoize(function(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

// 5. Event handlers с замыканиями
function setupButtons() {
  for (let i = 0; i < 5; i++) {
    const button = document.createElement('button');
    button.textContent = `Button ${i}`;
    
    // Замыкание сохраняет правильное значение i
    button.addEventListener('click', function() {
      console.log(`Clicked button ${i}`);
    });
    
    document.body.appendChild(button);
  }
}

// 6. Debounce
function debounce(func, delay) {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

const debouncedSearch = debounce(function(query) {
  console.log('Searching for:', query);
}, 500);

// 7. Throttle
function throttle(func, limit) {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// 8. Once - выполнить функцию один раз
function once(fn) {
  let called = false;
  let result;
  
  return function(...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}

const initialize = once(() => {
  console.log('Initializing...');
  return 'initialized';
});

initialize(); // "Initializing..." -> "initialized"
initialize(); // -> "initialized" (без лога)
```

### 4.4 Распространенные ошибки с замыканиями

```javascript
// ❌ ОШИБКА: var в цикле
for (var i = 0; i < 5; i++) {
  setTimeout(function() {
    console.log(i); // выведет 5, 5, 5, 5, 5
  }, 100);
}

// ✅ РЕШЕНИЕ 1: let вместо var
for (let i = 0; i < 5; i++) {
  setTimeout(function() {
    console.log(i); // выведет 0, 1, 2, 3, 4
  }, 100);
}

// ✅ РЕШЕНИЕ 2: IIFE
for (var i = 0; i < 5; i++) {
  (function(j) {
    setTimeout(function() {
      console.log(j); // выведет 0, 1, 2, 3, 4
    }, 100);
  })(i);
}

// ❌ ОШИБКА: утечка памяти
function createHeavyObject() {
  const heavyData = new Array(1000000).fill('data');
  
  return function() {
    // Даже если не используем heavyData,
    // он остается в памяти из-за замыкания
    console.log('Function called');
  };
}

// ✅ РЕШЕНИЕ: явно освобождать ресурсы
function createHeavyObject() {
  let heavyData = new Array(1000000).fill('data');
  
  return {
    doSomething() {
      console.log('Function called');
    },
    cleanup() {
      heavyData = null; // освободить память
    }
  };
}
```

### 4.5 Замыкания и this

```javascript
const obj = {
  name: 'Object',
  
  // Стрелочная функция - this из внешнего контекста
  arrowMethod: () => {
    console.log(this.name); // undefined (this = window/global)
  },
  
  // Обычная функция - this = obj
  normalMethod: function() {
    console.log(this.name); // "Object"
    
    // Вложенная функция теряет контекст
    function inner() {
      console.log(this.name); // undefined
    }
    inner();
    
    // Стрелочная функция сохраняет контекст
    const arrowInner = () => {
      console.log(this.name); // "Object"
    };
    arrowInner();
  }
};
```

## 5. Контекст (this)

### 5.1 Что такое this?

`this` - это ключевое слово, которое ссылается на объект, в контексте которого выполняется функция.

**Значение this зависит от способа вызова функции:**

### 5.2 Способы определения this

```javascript
// 1. Global context
console.log(this); // window (в браузере) или global (в Node.js)

function globalFunction() {
  console.log(this); // window в обычном режиме, undefined в strict mode
}

// 2. Object method
const obj = {
  name: 'Object',
  method() {
    console.log(this.name); // "Object"
  }
};
obj.method(); // this = obj

// 3. Constructor function
function Person(name) {
  this.name = name; // this = новый объект
}
const person = new Person('John');

// 4. Явное связывание: call, apply, bind
function greet(greeting) {
  console.log(`${greeting}, ${this.name}`);
}

const user = { name: 'John' };

greet.call(user, 'Hello'); // "Hello, John"
greet.apply(user, ['Hello']); // "Hello, John"

const boundGreet = greet.bind(user, 'Hello');
boundGreet(); // "Hello, John"

// 5. Arrow functions - this из внешнего контекста
const obj2 = {
  name: 'Object',
  
  regularMethod: function() {
    console.log(this.name); // "Object"
  },
  
  arrowMethod: () => {
    console.log(this.name); // undefined (this из глобального контекста)
  },
  
  methodWithArrow: function() {
    const arrow = () => {
      console.log(this.name); // "Object" (this из methodWithArrow)
    };
    arrow();
  }
};

// 6. Event handlers
document.getElementById('button').addEventListener('click', function() {
  console.log(this); // <button> элемент
});

document.getElementById('button').addEventListener('click', () => {
  console.log(this); // window (стрелочная функция)
});

// 7. Class methods
class MyClass {
  constructor(name) {
    this.name = name;
  }
  
  method() {
    console.log(this.name);
  }
  
  arrowMethod = () => {
    console.log(this.name); // всегда экземпляр класса
  }
}

const instance = new MyClass('Instance');
instance.method(); // "Instance"

const detached = instance.method;
detached(); // undefined (потерян контекст)

const detachedArrow = instance.arrowMethod;
detachedArrow(); // "Instance" (контекст сохранен)
```

### 5.3 Правила определения this (по приоритету)

1. **new binding** - при вызове с `new`, this = новый объект
2. **Explicit binding** - call, apply, bind
3. **Implicit binding** - вызов как метод объекта
4. **Default binding** - глобальный объект (или undefined в strict mode)
5. **Arrow functions** - лексический this (из внешней функции)

```javascript
// Примеры приоритета
function foo() {
  console.log(this.name);
}

const obj1 = { name: 'obj1', foo };
const obj2 = { name: 'obj2' };

// Implicit binding
obj1.foo(); // "obj1"

// Explicit binding побеждает implicit
obj1.foo.call(obj2); // "obj2"

// new побеждает explicit
const boundFoo = foo.bind(obj1);
const instance = new boundFoo(); // this = новый объект (не obj1)
```

### 5.4 Распространенные проблемы с this

```javascript
// Проблема 1: Потеря контекста при передаче метода
const obj = {
  name: 'Object',
  greet() {
    console.log(`Hello, ${this.name}`);
  }
};

obj.greet(); // "Hello, Object"

const greet = obj.greet;
greet(); // "Hello, undefined" - потерян контекст

// Решение 1: bind
const boundGreet = obj.greet.bind(obj);
boundGreet(); // "Hello, Object"

// Решение 2: стрелочная функция
const obj2 = {
  name: 'Object',
  greet: () => {
    console.log(`Hello, ${this.name}`); // НЕ РАБОТАЕТ!
  }
};

// Решение 3: wrapper function
setTimeout(() => obj.greet(), 1000);

// Проблема 2: this в коллбэках
class Counter {
  constructor() {
    this.count = 0;
  }
  
  increment() {
    this.count++;
  }
  
  startIncrementing() {
    // ❌ Потеря контекста
    setInterval(this.increment, 1000);
    
    // ✅ Решение 1: стрелочная функция
    setInterval(() => this.increment(), 1000);
    
    // ✅ Решение 2: bind
    setInterval(this.increment.bind(this), 1000);
  }
}

// Проблема 3: this в nested functions
const obj3 = {
  name: 'Object',
  
  method() {
    console.log(this.name); // "Object"
    
    function nested() {
      console.log(this.name); // undefined - потерян контекст
    }
    nested();
    
    // Решение: стрелочная функция
    const nestedArrow = () => {
      console.log(this.name); // "Object"
    };
    nestedArrow();
  }
};
```

### 5.5 this в TypeScript

```typescript
// Типизация this
interface User {
  name: string;
  greet(this: User): void;
}

const user: User = {
  name: 'John',
  greet() {
    console.log(this.name); // TypeScript знает, что this - User
  }
};

// ThisType helper
interface Methods {
  greet(): void;
}

interface State {
  name: string;
}

const obj: Methods & ThisType<State & Methods> = {
  greet() {
    console.log(this.name); // this имеет тип State & Methods
  }
};
```

## 6. Event Loop - Цикл событий

### 6.1 Что такое Event Loop?

**Event Loop** - механизм, который позволяет JavaScript выполнять неблокирующие операции, несмотря на то, что JavaScript однопоточный.

### 6.2 Компоненты Event Loop

```
┌───────────────────────────┐
│      Call Stack           │ Стек вызовов (синхронный код)
└───────────────────────────┘
            ↓
┌───────────────────────────┐
│      Web APIs             │ setTimeout, fetch, DOM events
└───────────────────────────┘
            ↓
┌───────────────────────────┐
│   Callback Queue          │ Макрозадачи (tasks)
│   (Task Queue)            │
└───────────────────────────┘
            ↓
┌───────────────────────────┐
│   Microtask Queue         │ Микрозадачи (Promises, queueMicrotask)
└───────────────────────────┘
            ↓
┌───────────────────────────┐
│      Event Loop           │ Координатор
└───────────────────────────┘
```

### 6.3 Как работает Event Loop?

```javascript
// Пример работы Event Loop
console.log('1'); // Call Stack

setTimeout(() => {
  console.log('2'); // Callback Queue (макрозадача)
}, 0);

Promise.resolve().then(() => {
  console.log('3'); // Microtask Queue
});

console.log('4'); // Call Stack

// Вывод: 1, 4, 3, 2
```

**Порядок выполнения:**
1. Выполняется весь синхронный код в Call Stack
2. Выполняются ВСЕ микрозадачи (Promises)
3. Выполняется ОДНА макрозадача (setTimeout, setInterval)
4. Повторяется с шага 2

### 6.4 Макрозадачи vs Микрозадачи

```javascript
// Макрозадачи (Task Queue):
setTimeout(() => {}, 0);
setInterval(() => {}, 0);
setImmediate(() => {}); // Node.js
// I/O операции
// UI rendering

// Микрозадачи (Microtask Queue):
Promise.resolve().then(() => {});
queueMicrotask(() => {});
process.nextTick(() => {}); // Node.js (приоритетнее Promise)
// MutationObserver

// Пример разницы
console.log('Start');

setTimeout(() => {
  console.log('setTimeout 1');
  
  Promise.resolve().then(() => {
    console.log('Promise in setTimeout');
  });
}, 0);

Promise.resolve().then(() => {
  console.log('Promise 1');
  
  setTimeout(() => {
    console.log('setTimeout in Promise');
  }, 0);
});

setTimeout(() => {
  console.log('setTimeout 2');
}, 0);

Promise.resolve().then(() => {
  console.log('Promise 2');
});

console.log('End');

// Вывод:
// Start
// End
// Promise 1
// Promise 2
// setTimeout 1
// Promise in setTimeout
// setTimeout 2
// setTimeout in Promise
```

### 6.5 Подробный пример

```javascript
console.log('Script start'); // 1

setTimeout(() => {
  console.log('setTimeout'); // 7
}, 0);

Promise.resolve()
  .then(() => {
    console.log('Promise 1'); // 4
  })
  .then(() => {
    console.log('Promise 2'); // 5
  });

async function async1() {
  console.log('async1 start'); // 2
  await async2();
  console.log('async1 end'); // 6 (await = Promise.then)
}

async function async2() {
  console.log('async2'); // 3
}

async1();

console.log('Script end'); // 4

// Порядок выполнения:
// 1. Script start (синхронный)
// 2. async1 start (синхронный)
// 3. async2 (синхронный)
// 4. Script end (синхронный)
// --- Стек пуст, выполняем микрозадачи ---
// 5. Promise 1 (микрозадача)
// 6. Promise 2 (микрозадача)
// 7. async1 end (микрозадача от await)
// --- Все микрозадачи выполнены, берем макрозадачу ---
// 8. setTimeout (макрозадача)
```

### 6.6 Блокирующий vs Неблокирующий код

```javascript
// ❌ Блокирующий код (синхронный)
function blockingOperation() {
  const start = Date.now();
  while (Date.now() - start < 3000) {
    // Блокирует Event Loop на 3 секунды
  }
  console.log('Done');
}

blockingOperation(); // UI замерзнет!

// ✅ Неблокирующий код (асинхронный)
function nonBlockingOperation() {
  setTimeout(() => {
    console.log('Done');
  }, 3000);
}

nonBlockingOperation(); // UI работает нормально
```

### 6.7 Визуализация Event Loop

```javascript
// Шаг за шагом
console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve()
  .then(() => console.log('3'))
  .then(() => console.log('4'));

console.log('5');

// Выполнение:

// === Call Stack ===
// console.log('1') -> выполнено
// setTimeout -> отправлено в Web API
// Promise.resolve().then -> отправлено в Microtask Queue
// console.log('5') -> выполнено

// === Call Stack пуст ===
// Event Loop проверяет Microtask Queue

// === Microtask Queue ===
// then(() => console.log('3')) -> выполнено
// then(() => console.log('4')) -> выполнено

// === Microtask Queue пуст ===
// Event Loop берет задачу из Task Queue

// === Task Queue ===
// setTimeout callback -> выполнено

// Результат: 1, 5, 3, 4, 2
```

### 6.8 requestAnimationFrame и Event Loop

```javascript
// requestAnimationFrame выполняется ПОСЛЕ микрозадач, но ДО следующей макрозадачи

console.log('Start');

setTimeout(() => {
  console.log('setTimeout');
}, 0);

Promise.resolve().then(() => {
  console.log('Promise');
});

requestAnimationFrame(() => {
  console.log('rAF');
});

console.log('End');

// Вывод: Start, End, Promise, rAF, setTimeout
```

### 6.9 Node.js Event Loop

Node.js имеет более сложный Event Loop с несколькими фазами:

```javascript
// Фазы Node.js Event Loop:
// 1. timers (setTimeout, setInterval)
// 2. pending callbacks (I/O callbacks)
// 3. idle, prepare (внутренние)
// 4. poll (новые I/O события)
// 5. check (setImmediate)
// 6. close callbacks (socket.on('close'))

// process.nextTick имеет НАИВЫСШИЙ приоритет
process.nextTick(() => {
  console.log('nextTick'); // 1
});

Promise.resolve().then(() => {
  console.log('Promise'); // 2
});

setTimeout(() => {
  console.log('setTimeout'); // 4
}, 0);

setImmediate(() => {
  console.log('setImmediate'); // 3
});

// В Node.js: nextTick, Promise, setImmediate, setTimeout
```

## 7. Async/Await и Promises

### 7.1 Promises - Основы

**Promise** - объект, представляющий результат асинхронной операции.

```javascript
// Создание Promise
const promise = new Promise((resolve, reject) => {
  // Асинхронная операция
  const success = true;
  
  if (success) {
    resolve('Success!'); // выполнено успешно
  } else {
    reject('Error!'); // ошибка
  }
});

// Состояния Promise:
// 1. pending - начальное состояние
// 2. fulfilled - операция выполнена успешно
// 3. rejected - операция завершилась с ошибкой

// Использование Promise
promise
  .then(result => {
    console.log(result); // "Success!"
    return 'Next value';
  })
  .then(result => {
    console.log(result); // "Next value"
  })
  .catch(error => {
    console.error(error);
  })
  .finally(() => {
    console.log('Always executed');
  });
```

### 7.2 Promise методы

```javascript
// Promise.resolve() - создать fulfilled Promise
const resolved = Promise.resolve('value');

// Promise.reject() - создать rejected Promise
const rejected = Promise.reject('error');

// Promise.all() - ждать выполнения всех Promise
const promises = [
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
];

Promise.all(promises)
  .then(results => {
    console.log(results); // [1, 2, 3]
  })
  .catch(error => {
    // Если хотя бы один Promise rejected
    console.error(error);
  });

// Promise.allSettled() - ждать завершения всех Promise
Promise.allSettled([
  Promise.resolve(1),
  Promise.reject('error'),
  Promise.resolve(3)
]).then(results => {
  console.log(results);
  // [
  //   { status: 'fulfilled', value: 1 },
  //   { status: 'rejected', reason: 'error' },
  //   { status: 'fulfilled', value: 3 }
  // ]
});

// Promise.race() - первый выполненный Promise
Promise.race([
  new Promise(resolve => setTimeout(() => resolve(1), 1000)),
  new Promise(resolve => setTimeout(() => resolve(2), 500))
]).then(result => {
  console.log(result); // 2 (первый завершился)
});

// Promise.any() - первый успешный Promise
Promise.any([
  Promise.reject('error 1'),
  Promise.resolve(2),
  Promise.resolve(3)
]).then(result => {
  console.log(result); // 2
}).catch(error => {
  // AggregateError если все rejected
  console.error(error);
});
```

### 7.3 Promise Chaining

```javascript
// Цепочка Promise
fetch('/api/user')
  .then(response => response.json())
  .then(user => {
    console.log(user);
    return fetch(`/api/posts?userId=${user.id}`);
  })
  .then(response => response.json())
  .then(posts => {
    console.log(posts);
  })
  .catch(error => {
    console.error('Error:', error);
  });

// Возврат Promise из then()
function getUserPosts(userId) {
  return fetch(`/api/users/${userId}`)
    .then(response => response.json())
    .then(user => {
      return fetch(`/api/posts?userId=${user.id}`);
    })
    .then(response => response.json());
}

getUserPosts(1).then(posts => console.log(posts));
```

### 7.4 Async/Await

**async/await** - синтаксический сахар над Promises.

```javascript
// Функция с async всегда возвращает Promise
async function fetchData() {
  return 'data'; // автоматически обернется в Promise.resolve('data')
}

fetchData().then(data => console.log(data)); // "data"

// await приостанавливает выполнение функции
async function getData() {
  const response = await fetch('/api/data');
  const data = await response.json();
  return data;
}

// Обработка ошибок с try-catch
async function getUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error; // пробросить ошибку дальше
  }
}

// Параллельное выполнение
async function getMultipleData() {
  // ❌ Последовательно (медленно)
  const user = await fetch('/api/user').then(r => r.json());
  const posts = await fetch('/api/posts').then(r => r.json());
  
  // ✅ Параллельно (быстро)
  const [user, posts] = await Promise.all([
    fetch('/api/user').then(r => r.json()),
    fetch('/api/posts').then(r => r.json())
  ]);
  
  return { user, posts };
}
```

### 7.5 Продвинутые техники

```javascript
// Retry с экспоненциальной задержкой
async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      if (i === retries - 1) throw error;
      
      // Экспоненциальная задержка
      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Timeout для Promise
function timeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), ms)
    )
  ]);
}

// Использование
timeout(fetch('/api/data'), 5000)
  .then(response => response.json())
  .catch(error => console.error(error));

// Sequential execution
async function sequential(tasks) {
  const results = [];
  
  for (const task of tasks) {
    const result = await task();
    results.push(result);
  }
  
  return results;
}

// Parallel execution с ограничением
async function parallelLimit(tasks, limit) {
  const results = [];
  const executing = [];
  
  for (const task of tasks) {
    const promise = task().then(result => {
      executing.splice(executing.indexOf(promise), 1);
      return result;
    });
    
    results.push(promise);
    executing.push(promise);
    
    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }
  
  return Promise.all(results);
}

// Promise pool
class PromisePool {
  constructor(limit) {
    this.limit = limit;
    this.running = 0;
    this.queue = [];
  }
  
  async add(fn) {
    while (this.running >= this.limit) {
      await Promise.race(this.queue);
    }
    
    this.running++;
    
    const promise = fn().finally(() => {
      this.running--;
      const index = this.queue.indexOf(promise);
      if (index !== -1) {
        this.queue.splice(index, 1);
      }
    });
    
    this.queue.push(promise);
    
    return promise;
  }
}

// Использование
const pool = new PromisePool(3); // максимум 3 одновременных запроса

const tasks = urls.map(url =>
  () => fetch(url).then(r => r.json())
);

const results = await Promise.all(
  tasks.map(task => pool.add(task))
);
```

### 7.6 Async итераторы

```javascript
// Async итератор
const asyncIterable = {
  [Symbol.asyncIterator]() {
    let i = 0;
    
    return {
      async next() {
        if (i < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return { value: i++, done: false };
        }
        
        return { done: true };
      }
    };
  }
};

// Использование
for await (const value of asyncIterable) {
  console.log(value); // 0, 1, 2 (с задержкой)
}

// Async generator
async function* asyncGenerator() {
  let i = 0;
  
  while (i < 3) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    yield i++;
  }
}

for await (const value of asyncGenerator()) {
  console.log(value); // 0, 1, 2 (с задержкой)
}

// Практический пример: пагинация
async function* fetchPages(url) {
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    const response = await fetch(`${url}?page=${page}`);
    const data = await response..1 Что такое замыкание?

**Замыкание** - это функция, которая имеет доступ к переменным из внешней функции даже после того, как внешняя функция завершила выполнение.

```javascript
function createCounter() {
  let count = 0; // приватная переменная
  
  return function() {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
```

### 4.2 Как работают замыкания?

```javascript
function outer() {
  const outerVar = 'I am outer';
  
  function inner() {
    console.log(outerVar); // доступ к outerVar
  }
  
  return inner;
}

const innerFunc = outer();
innerFunc(); // "I am outer"
// outer() уже завершилась, но inner() сохранил доступ к outerVar
```

**Механизм:**
1. Когда создается функция, она сохраняет ссылку на свою лексическую область видимости
2. При вызове функции используется сохраненная область видимости, а не текущая
3. Переменные из внешней функции живут, пока существует ссылка на внутреннюю функцию

### 4 // ReturnType - получить тип возвращаемого значения
function getUser() {
  return { id: 1, name: 'John' };
}

type User = ReturnType<typeof getUser>;
// { id: number; name: string }

// Parameters - получить типы параметров функции
function createUser(name: string, age: number) {
  return { name, age };
}

type CreateUserParams = Parameters<typeof createUser>;
// [string, number]

// Awaited - получить тип из Promise
type T4 = Awaited<Promise<string>>;
// string
```

### 11.6 Mapped Types

```typescript
// Базовый mapped type
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

interface User {
  name: string;
  age: number;
}

type NullableUser = Nullable<User>;
// { name: string | null; age: number | null }

// Модификаторы
type ReadonlyUser = {
  readonly [P in keyof User]: User[P];
};

type OptionalUser = {
  [P in keyof User]?: User[P];
};

// Удаление модификаторов
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Фильтрация свойств
type FilterByType<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P];
};

interface Example {
  name: string;
  age: number;
  isActive: boolean;
}

type StringProps = FilterByType<Example, string>;
// { name: string }

// Переименование ключей
type Getters<T> = {
  [P in keyof T as `get${Capitalize<string & P>}`]: () => T[P];
};

type UserGetters = Getters<User>;
// { getName: () => string; getAge: () => number }
```

### 11.7 Conditional Types

```typescript
// Базовый conditional type
type IsString<T> = T extends string ? true : false;

type T1 = IsString<string>; // true
type T2 = IsString<number>; // false

// Вложенные conditional types
type TypeName<T> =
  T extends string ? "string" :
  T extends number ? "number" :
  T extends boolean ? "boolean" :
  T extends undefined ? "undefined" :
  T extends Function ? "function" :
  "object";

// Infer keyword
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type ArrayElementType<T> = T extends (infer U)[] ? U : never;
type T3 = ArrayElementType<string[]>; // string

// Distributive conditional types
type ToArray<T> = T extends any ? T[] : never;
type T4 = ToArray<string | number>;
// string[] | number[] (распределяется по union)

// Практический пример
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type T5 = UnwrapPromise<Promise<string>>; // string
type T6 = UnwrapPromise<number>; // number
```

### 11.8 Template Literal Types

```typescript
// Базовый пример
type Greeting = `Hello ${string}`;
const g1: Greeting = "Hello World"; // OK
// const g2: Greeting = "Hi World"; // Ошибка!

// С union types
type Direction = "left" | "right" | "up" | "down";
type MoveAction = `move-${Direction}`;
// "move-left" | "move-right" | "move-up" | "move-down"

// Встроенные утилиты
type UpperName = Uppercase<"john">; // "JOHN"
type LowerName = Lowercase<"JOHN">; // "john"
type CapitalName = Capitalize<"john">; // "John"
type UncapitalName = Uncapitalize<"John">; // "john"

// Практический пример - Event system
type EventName = "click" | "focus" | "blur";
type EventHandler<E extends EventName> = `on${Capitalize<E>}`;

type Handlers = {
  [E in EventName as EventHandler<E>]: (event: Event) => void;
};
// {
//   onClick: (event: Event) => void;
//   onFocus: (event: Event) => void;
//   onBlur: (event: Event) => void;
// }
```

### 11.9 Type Guards и Type Predicates

```typescript
// typeof type guard
function processValue(value: string | number) {
  if (typeof value === "string") {
    return value.toUpperCase(); // value is string
  } else {
    return value.toFixed(2); // value is number
  }
}

// instanceof type guard
class Dog {
  bark() {
    console.log("Woof!");
  }
}

class Cat {
  meow() {
    console.log("Meow!");
  }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark(); // animal is Dog
  } else {
    animal.meow(); // animal is Cat
  }
}

// in type guard
interface Bird {
  fly(): void;
  layEggs(): void;
}

interface Fish {
  swim(): void;
  layEggs(): void;
}

function move(animal: Bird | Fish) {
  if ("fly" in animal) {
    animal.fly(); // animal is Bird
  } else {
    animal.swim(); // animal is Fish
  }
}

// Custom type guard (type predicate)
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function process(value: unknown) {
  if (isString(value)) {
    console.log(value.toUpperCase()); // value is string
  }
}

// Более сложный type guard
interface User {
  name: string;
  email: string;
}

function isUser(obj: any): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.name === "string" &&
    typeof obj.email === "string"
  );
}

// Assertion functions
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("Value must be a string");
  }
}

function process2(value: unknown) {
  assertIsString(value);
  console.log(value.toUpperCase()); // value is string
}
```

### 11.10 Декораторы (Decorators)

```typescript
// Включить в tsconfig.json:
// "experimentalDecorators": true

// Class decorator
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
}

// Method decorator
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyKey} with`, args);
    const result = originalMethod.apply(this, args);
    console.log(`Result:`, result);
    return result;
  };
  
  return descriptor;
}

class Calculator {
  @log
  add(a: number, b: number) {
    return a + b;
  }
}

// Property decorator
function readonly(target: any, propertyKey: string) {
  Object.defineProperty(target, propertyKey, {
    writable: false
  });
}

class Person {
  @readonly
  name: string = "John";
}

// Parameter decorator
function required(target: any, propertyKey: string, parameterIndex: number) {
  console.log(`Parameter ${parameterIndex} is required in ${propertyKey}`);
}

class UserService {
  createUser(@required name: string, age: number) {
    // ...
  }
}

// Decorator factory
function minLength(length: number) {
  return function(target: any, propertyKey: string) {
    let value: string;
    
    Object.defineProperty(target, propertyKey, {
      get() {
        return value;
      },
      set(newValue: string) {
        if (newValue.length < length) {
          throw new Error(`${propertyKey} must be at least ${length} characters`);
        }
        value = newValue;
      }
    });
  };
}

class User {
  @minLength(3)
  username: string;
}
```

### 11.11 Namespace vs Module

```typescript
// Namespace (старый способ, legacy)
namespace Validation {
  export interface StringValidator {
    isValid(s: string): boolean;
  }
  
  export class EmailValidator implements StringValidator {
    isValid(s: string) {
      return /\S+@\S+\.\S+/.test(s);
    }
  }
}

const validator = new Validation.EmailValidator();

// Module (современный способ)
// validation.ts
export interface StringValidator {
  isValid(s: string): boolean;
}

export class EmailValidator implements StringValidator {
  isValid(s: string) {
    return /\S+@\S+\.\S+/.test(s);
  }
}

// main.ts
import { EmailValidator } from './validation';
const validator = new EmailValidator();
```

### 11.12 Типизация сложных сценариев

```typescript
// Deep Readonly
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P];
};

// Deep Partial
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? DeepPartial<T[P]>
    : T[P];
};

// Function overloading
function createElement(tag: "div"): HTMLDivElement;
function createElement(tag: "span"): HTMLSpanElement;
function createElement(tag: string): HTMLElement;
function createElement(tag: string): HTMLElement {
  return document.createElement(tag);
}

const div = createElement("div"); // HTMLDivElement
const span = createElement("span"); // HTMLSpanElement

// Типизация this
interface Counter {
  count: number;
  increment(this: Counter): void;
}

const counter: Counter = {
  count: 0,
  increment() {
    this.count++; // this правильно типизирован
  }
};

// Abstract classes
abstract class Animal {
  abstract makeSound(): void;
  
  move() {
    console.log("Moving...");
  }
}

class Dog extends Animal {
  makeSound() {
    console.log("Woof!");
  }
}

// Const assertions
const colors = ["red", "green", "blue"] as const;
type Color = typeof colors[number]; // "red" | "green" | "blue"

const config = {
  api: "https://api.example.com",
  timeout: 5000
} as const;

// config.api = "..."; // Ошибка! readonly

// Indexed Access Types
interface User {
  name: string;
  age: number;
  email: string;
}

type UserName = User["name"]; // string
type UserKeys = keyof User; // "name" | "age" | "email"
type UserValues = User[keyof User]; // string | number
```

### 11.13 Type vs Interface - Когда что использовать?

```typescript
// Используйте Interface когда:
// 1. Определяете форму объекта или класса
interface User {
  id: number;
  name: string;
}

// 2. Нужно расширение (extends)
interface Admin extends User {
  role: string;
}

// 3. Нужно declaration merging
interface Window {
  myCustomProperty: string;
}

// Используйте Type когда:
// 1. Работаете с union/intersection
type ID = string | number;
type Result = Success & { timestamp: Date };

// 2. Создаете mapped types
type Nullable<T> = { [P in keyof T]: T[P] | null };

// 3. Используете conditional types
type NonNullable<T> = T extends null | undefined ? never : T;

// 4. Создаете tuple types
type Point = [number, number];

// 5. Работаете с template literal types
type EventHandler = `on${string}`;
```

## 12. Масштабирование приложений

### 12.1 Архитектурные паттерны

```typescript
// 1. Feature-based структура
src/
  features/
    auth/
      components/
      hooks/
      services/
      store/
      types/
      index.ts
    users/
      components/
      hooks/
      services/
      store/
      types/
      index.ts
  shared/
    components/
    hooks/
    utils/

// 2. Layer-based структура
src/
  presentation/    // UI компоненты
  application/     // Бизнес-логика
  domain/          // Entities, бизнес-правила
  infrastructure/  // API, БД, внешние сервисы
```

### 12.2 Code Splitting

```typescript
// React lazy loading
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Suspense>
  );
}

// Dynamic imports
async function loadModule() {
  const module = await import('./heavy-module');
  module.doSomething();
}

// Webpack magic comments
const Dashboard = lazy(() => 
  import(/* webpackChunkName: "dashboard" */ './pages/Dashboard')
);
```

### 12.3 Performance оптимизация

```typescript
// 1. Мемоизация
const MemoizedComponent = React.memo(Component, (prev, next) => {
  return prev.id === next.id; // не ре-рендерить если id не изменился
});

// 2. useMemo для тяжелых вычислений
const expensiveValue = useMemo(() => {
  return complexCalculation(data);
}, [data]);

// 3. useCallback для функций
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// 4. Virtualization для длинных списков
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={10000}
  itemSize={35}
>
  {Row}
</FixedSizeList>

// 5. Debounce/Throttle
const debouncedSearch = useMemo(
  () => debounce((query) => search(query), 500),
  []
);

// 6. Web Workers для тяжелых вычислений
const worker = new Worker('worker.js');
worker.postMessage({ data: largeDataset });
worker.onmessage = (e) => {
  console.log('Result:', e.data);
};
```

### 12.4 State Management масштабирование

```typescript
// 1. Разделение store по доменам
// store/index.ts
export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    posts: postsReducer,
    comments: commentsReducer
  }
});

// 2. Нормализация данных
interface NormalizedState {
  users: {
    byId: Record<string, User>;
    allIds: string[];
  };
  posts: {
    byId: Record<string, Post>;
    allIds: string[];
  };
}

// 3. Selectors с мемоизацией
import { createSelector } from 'reselect';

const selectUsers = (state: RootState) => state.users.byId;
const selectUserIds = (state: RootState) => state.users.allIds;

const selectAllUsers = createSelector(
  [selectUsers, selectUserIds],
  (users, ids) => ids.map(id => users[id])
);

// 4. Middleware для side effects
const apiMiddleware: Middleware = store => next => action => {
  if (action.type === 'FETCH_USER') {
    fetch(`/api/users/${action.payload}`)
      .then(res => res.json())
      .then(data => store.dispatch({ type: 'USER_LOADED', payload: data }));
  }
  return next(action);
};
```

### 12.5 Error Handling в масштабе

```typescript
// 1. Error Boundary
class ErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Отправить в Sentry, LogRocket и т.д.
    logErrorToService(error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

// 2. Централизованная обработка ошибок API
class ApiClient {
  async request<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new ApiError(response.status, await response.text());
      }
      
      return response.json();
    } catch (error) {
      // Централизованная обработка
      if (error instanceof ApiError) {
        if (error.status === 401) {
          // Redirect to login
          window.location.href = '/login';
        }
      }
      
      // Логирование
      logger.error('API Error', error);
      
      throw error;
    }
  }
}

// 3. Error types
class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ValidationError extends Error {
  constructor(
    public fields: Record<string, string[]>
  ) {
    super('Validation failed');
    this.name = 'ValidationError';
  }
}
```

### 12.6 Testing в масштабе

```typescript
// 1. Unit tests
describe('UserService', () => {
  let service: UserService;
  let mockApi: jest.Mocked<ApiClient>;
  
  beforeEach(() => {
    mockApi = {
      get: jest.fn(),
      post: jest.fn()
    } as any;
    
    service = new UserService(mockApi);
  });
  
  it('should fetch user by id', async () => {
    const user = { id: 1, name: 'John' };
    mockApi.get.mockResolvedValue(user);
    
    const result = await service.getUser(1);
    
    expect(result).toEqual(user);
    expect(mockApi.get).toHaveBeenCalledWith('/users/1');
  });
});

// 2. Integration tests
describe('User Flow', () => {
  it('should register and login user', async () => {
    const { getByText, getByLabelText } = render(<App />);
    
    // Register
    fireEvent.click(getByText('Register'));
    fireEvent.change(getByLabelText('Email'), {
      target: { value: 'user@example.com' }
    });
    fireEvent.click(getByText('Submit'));
    
    // Verify
    await waitFor(() => {
      expect(getByText('Welcome')).toBeInTheDocument();
    });
  });
});

// 3. E2E tests (Playwright/Cypress)
test('user can complete purchase', async ({ page }) => {
  await page.goto('/products');
  await page.click('[data-testid="product-1"]');
  await page.click('[data-testid="add-to-cart"]');
  await page.click('[data-testid="checkout"]');
  await page.fill('[name="card-number"]', '4242424242424242');
  await page.click('[data-testid="submit-payment"]');
  
  await expect(page.locator('.success-message')).toBeVisible();
});
```

### 12.7 Monitoring и Logging

```typescript
// 1. Performance monitoring
class PerformanceMonitor {
  static measure(name: string, fn: () => void) {
    const start = performance.now();
    fn();
    const duration = performance.now() - start;
    
    // Отправить в analytics
    analytics.track('performance', {
      operation: name,
      duration
    });
  }
}

// 2. Error tracking
class ErrorTracker {
  static captureException(error: Error, context?: any) {
    // Отправить в Sentry
    Sentry.captureException(error, {
      extra: context
    });
    
    // Локальное логирование
    console.error('[ErrorTracker]', error, context);
  }
}

// 3. User analytics
class Analytics {
  static track(event: string, properties?: Record<string, any>) {
    // Google Analytics
    gtag('event', event, properties);
    
    // Mixpanel
    mixpanel.track(event, properties);
    
    // Amplitude
    amplitude.track(event, properties);
  }
  
  static page(name: string) {
    gtag('config', 'GA_ID', { page_path: name });
  }
}

// 4. Structured logging
class Logger {
  static info(message: string, meta?: any) {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...meta
    }));
  }
  
  static error(message: string, error: Error, meta?: any) {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      timestamp: new Date().toISOString(),
      ...meta
    }));
  }
}
```

### 12.8 Security best practices

```typescript
// 1. XSS protection
function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty);
}

// 2. CSRF protection
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

fetch('/api/endpoint', {
  method: 'POST',
  headers: {
    'X-CSRF-Token': csrfToken
  }
});

// 3. Content Security Policy
// В HTML:
// <meta http-equiv="Content-Security-Policy" 
//       content="default-src 'self'; script-src 'self' 'unsafe-inline'">

// 4. Безопасное хранение токенов
// ❌ Плохо - localStorage
localStorage.setItem('token', token);

// ✅ Хорошо - HttpOnly cookies
// Сервер устанавливает: Set-Cookie: token=...; HttpOnly; Secure; SameSite=Strict

// 5. Input validation
function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function sanitizeInput(input: string): string {
  return input.replace(/[<>]/g, '');
}
```

---

## Чек-лист для собеседования

### JavaScript:
- ✅ Типы данных и приведение типов
- ✅ Массивы: методы, итерация, трансформация
- ✅ Строки: методы, regex, template literals
- ✅ Map/Set и их применение
- ✅ Замыкания: как работают, примеры использования
- ✅ Контекст (this): правила определения, способы привязки
- ✅ Event Loop: макро/микрозадачи, порядок выполнения
- ✅ Promises: цепочки, методы, обработка ошибок
- ✅ Async/Await: синтаксис, error handling, параллельное выполнение

### TypeScript:
- ✅ Базовые типы и аннотации
- ✅ Generics и constraints
- ✅ Utility types
- ✅ Mapped и Conditional types
- ✅ Type guards и narrowing
- ✅ Interface vs Type
- ✅ Декораторы

### Архитектура:
- ✅ Dependency Injection: принципы, реализация
- ✅ Dependency Inversion: отличие от DI, применение
- ✅ SOLID принципы
- ✅ Паттерны проектирования

### Масштабирование:
- ✅ Code splitting и lazy loading
- ✅ Performance оптимизация
- ✅ State management в больших приложениях
- ✅ Error handling и logging
- ✅ Testing strategies
- ✅ Security best practices

**Удачи на собеседовании! 🚀**async function* fetchPages(url) {
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    const response = await fetch(`${url}?page=${page}`);
    const data = await response.json();
    
    yield data.items;
    
    hasMore = data.hasMore;
    page++;
  }
}

// Использование
for await (const items of fetchPages('/api/items')) {
  console.log('Page items:', items);
}
```

### 7.7 TypeScript и Promises

```typescript
// Типизация Promise
const promise: Promise<string> = new Promise((resolve, reject) => {
  resolve('Success');
});

// Async функции
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// Generic Promise functions
async function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
    }
  }
  throw new Error('All retries failed');
}

// Типизация Promise.all
const [users, posts]: [User[], Post[]] = await Promise.all([
  fetchUsers(),
  fetchPosts()
]);
```

## 8. ES5 vs ES6+ - Ключевые отличия

### 8.1 Переменные

```javascript
// ES5
var x = 10;
var x = 20; // можно переопределить
// function scope

// ES6+
let y = 10;
// let y = 20; // Ошибка! Нельзя переопределить
// block scope

const z = 10;
// z = 20; // Ошибка! Нельзя переприсвоить
// block scope
```

### 8.2 Arrow Functions

```javascript
// ES5
var add = function(a, b) {
  return a + b;
};

// ES6+
const add = (a, b) => a + b;

// Разница в this
// ES5
var obj = {
  name: 'ES5',
  method: function() {
    setTimeout(function() {
      console.log(this.name); // undefined
    }, 100);
  }
};

// ES6+
const obj2 = {
  name: 'ES6',
  method() {
    setTimeout(() => {
      console.log(this.name); // "ES6" - лексический this
    }, 100);
  }
};
```

### 8.3 Classes

```javascript
// ES5 - Constructor functions
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.greet = function() {
  console.log('Hello, ' + this.name);
};

Person.staticMethod = function() {
  console.log('Static method');
};

// Наследование в ES5
function Employee(name, age, job) {
  Person.call(this, name, age);
  this.job = job;
}

Employee.prototype = Object.create(Person.prototype);
Employee.prototype.constructor = Employee;

// ES6+ - Classes
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  greet() {
    console.log(`Hello, ${this.name}`);
  }
  
  static staticMethod() {
    console.log('Static method');
  }
}

// Наследование в ES6+
class Employee extends Person {
  constructor(name, age, job) {
    super(name, age);
    this.job = job;
  }
  
  work() {
    console.log(`${this.name} is working as ${this.job}`);
  }
}
```

### 8.4 Template Literals

```javascript
// ES5
var name = 'John';
var age = 30;
var message = 'Hello, ' + name + '! You are ' + age + ' years old.';

// ES6+
const name = 'John';
const age = 30;
const message = `Hello, ${name}! You are ${age} years old.`;

// Многострочные строки
// ES5
var multiline = 'Line 1\n' +
  'Line 2\n' +
  'Line 3';

// ES6+
const multiline = `
  Line 1
  Line 2
  Line 3
`;
```

### 8.5 Деструктуризация

```javascript
// ES5
var arr = [1, 2, 3];
var a = arr[0];
var b = arr[1];
var c = arr[2];

var obj = { x: 10, y: 20 };
var x = obj.x;
var y = obj.y;

// ES6+
const arr = [1, 2, 3];
const [a, b, c] = arr;

const obj = { x: 10, y: 20 };
const { x, y } = obj;

// Значения по умолчанию
const { x = 0, y = 0 } = {};

// Переименование
const { x: newX, y: newY } = obj;

// Rest
const [first, ...rest] = [1, 2, 3, 4];
const { a, ...others } = { a: 1, b: 2, c: 3 };
```

### 8.6 Spread и Rest

```javascript
// ES5
var arr1 = [1, 2, 3];
var arr2 = [4, 5, 6];
var combined = arr1.concat(arr2);

function sum() {
  var args = Array.prototype.slice.call(arguments);
  return args.reduce(function(a, b) { return a + b; }, 0);
}

// ES6+
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];

const sum = (...numbers) => numbers.reduce((a, b) => a + b, 0);

// Копирование объектов
const obj = { a: 1, b: 2 };
const copy = { ...obj };
const extended = { ...obj, c: 3 };
```

### 8.7 Default Parameters

```javascript
// ES5
function greet(name, greeting) {
  name = name || 'Guest';
  greeting = greeting || 'Hello';
  console.log(greeting + ', ' + name);
}

// ES6+
function greet(name = 'Guest', greeting = 'Hello') {
  console.log(`${greeting}, ${name}`);
}
```

### 8.8 Modules

```javascript
// ES5 - CommonJS (Node.js)
// module.js
module.exports = {
  add: function(a, b) { return a + b; },
  subtract: function(a, b) { return a - b; }
};

// main.js
var math = require('./module');
console.log(math.add(1, 2));

// ES6+ - ES Modules
// module.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

export default class Calculator {
  // ...
}

// main.js
import Calculator, { add, subtract } from './module.js';
console.log(add(1, 2));
```

### 8.9 Promises

```javascript
// ES5 - Callbacks
function fetchData(callback) {
  setTimeout(function() {
    callback(null, 'data');
  }, 1000);
}

fetchData(function(error, data) {
  if (error) {
    console.error(error);
  } else {
    console.log(data);
  }
});

// ES6+ - Promises
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('data');
    }, 1000);
  });
}

fetchData()
  .then(data => console.log(data))
  .catch(error => console.error(error));

// ES2017 - Async/Await
async function getData() {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
```

### 8.10 Другие важные добавления

```javascript
// Object literal enhancements
// ES5
var x = 10, y = 20;
var obj = {
  x: x,
  y: y,
  method: function() {}
};

// ES6+
const obj = {
  x,
  y,
  method() {},
  [dynamicKey]: 'value' // computed property names
};

// for...of
const arr = [1, 2, 3];
for (const item of arr) {
  console.log(item);
}

// Map и Set
const map = new Map();
map.set('key', 'value');

const set = new Set([1, 2, 3, 3]); // {1, 2, 3}

// Symbol
const sym = Symbol('description');

// Generators
function* generator() {
  yield 1;
  yield 2;
  yield 3;
}

// Array methods
[1, 2, 3].find(x => x > 1); // 2
[1, 2, 3].findIndex(x => x > 1); // 1
[1, 2, 3].includes(2); // true
Array.from('hello'); // ['h', 'e', 'l', 'l', 'o']

// String methods
'hello'.startsWith('he'); // true
'hello'.endsWith('lo'); // true
'hello'.includes('ll'); // true
'ab'.repeat(3); // 'ababab'

// Object methods
Object.assign({}, { a: 1 }, { b: 2 }); // { a: 1, b: 2 }
Object.entries({ a: 1, b: 2 }); // [['a', 1], ['b', 2]]
Object.values({ a: 1, b: 2 }); // [1, 2]
Object.keys({ a: 1, b: 2 }); // ['a', 'b']
```

## 9. Dependency Injection (DI)

### 9.1 Что такое Dependency Injection?

**Dependency Injection** - паттерн проектирования, при котором зависимости объекта передаются извне, а не создаются внутри самого объекта.

### 9.2 Проблема без DI

```javascript
// ❌ Плохо - жесткая зависимость
class UserService {
  constructor() {
    this.api = new ApiClient(); // жесткая связь
    this.logger = new Logger(); // жесткая связь
  }
  
  async getUser(id) {
    this.logger.log('Fetching user');
    return this.api.get(`/users/${id}`);
  }
}

// Проблемы:
// 1. Невозможно подменить ApiClient для тестирования
// 2. Нельзя переиспользовать экземпляры
// 3. Сложно изменить реализацию
```

### 9.3 Решение с DI

```javascript
// ✅ Хорошо - зависимости внедряются
class UserService {
  constructor(apiClient, logger) {
    this.api = apiClient;
    this.logger = logger;
  }
  
  async getUser(id) {
    this.logger.log('Fetching user');
    return this.api.get(`/users/${id}`);
  }
}

// Использование
const apiClient = new ApiClient();
const logger = new Logger();
const userService = new UserService(apiClient, logger);

// Для тестирования легко подменить зависимости
const mockApi = new MockApiClient();
const mockLogger = new MockLogger();
const testService = new UserService(mockApi, mockLogger);
```

### 9.4 Типы DI

```javascript
// 1. Constructor Injection (самый распространенный)
class Service {
  constructor(dependency) {
    this.dependency = dependency;
  }
}

// 2. Setter Injection
class Service {
  setDependency(dependency) {
    this.dependency = dependency;
  }
}

// 3. Interface Injection (редко в JS)
class Service {
  injectDependency(dependency) {
    this.dependency = dependency;
  }
}
```

### 9.5 DI Container

```javascript
// Простой DI Container
class Container {
  constructor() {
    this.services = new Map();
  }
  
  register(name, definition) {
    this.services.set(name, definition);
  }
  
  get(name) {
    const service = this.services.get(name);
    
    if (!service) {
      throw new Error(`Service ${name} not found`);
    }
    
    if (typeof service === 'function') {
      return service(this);
    }
    
    return service;
  }
}

// Использование
const container = new Container();

// Регистрация сервисов
container.register('logger', new Logger());
container.register('apiClient', new ApiClient());

container.register('userService', (c) => {
  return new UserService(
    c.get('apiClient'),
    c.get('logger')
  );
});

// Получение сервиса
const userService = container.get('userService');
```

### 9.6 Продвинутый DI Container

```javascript
class AdvancedContainer {
  constructor() {
    this.services = new Map();
    this.singletons = new Map();
  }
  
  // Регистрация singleton
  singleton(name, factory) {
    this.services.set(name, { type: 'singleton', factory });
  }
  
  // Регистрация transient (новый экземпляр каждый раз)
  transient(name, factory) {
    this.services.set(name, { type: 'transient', factory });
  }
  
  get(name) {
    const service = this.services.get(name);
    
    if (!service) {
      throw new Error(`Service ${name} not found`);
    }
    
    if (service.type === 'singleton') {
      if (!this.singletons.has(name)) {
        this.singletons.set(name, service.factory(this));
      }
      return this.singletons.get(name);
    }
    
    return service.factory(this);
  }
}

// Использование
const container = new AdvancedContainer();

container.singleton('logger', () => new Logger());
container.singleton('config', () => new Config());

container.transient('userService', (c) => {
  return new UserService(
    c.get('apiClient'),
    c.get('logger')
  );
});
```

### 9.7 TypeScript и DI

```typescript
// Интерфейсы для зависимостей
interface ILogger {
  log(message: string): void;
}

interface IApiClient {
  get<T>(url: string): Promise<T>;
  post<T>(url: string, data: any): Promise<T>;
}

// Класс с типизированными зависимостями
class UserService {
  constructor(
    private apiClient: IApiClient,
    private logger: ILogger
  ) {}
  
  async getUser(id: number): Promise<User> {
    this.logger.log(`Fetching user ${id}`);
    return this.apiClient.get<User>(`/users/${id}`);
  }
}

// DI Container с типами
class TypedContainer {
  private services = new Map<string, any>();
  
  register<T>(name: string, factory: (c: TypedContainer) => T): void {
    this.services.set(name, factory);
  }
  
  get<T>(name: string): T {
    const factory = this.services.get(name);
    if (!factory) {
      throw new Error(`Service ${name} not found`);
    }
    return factory(this);
  }
}

// InversifyJS - популярная DI библиотека для TypeScript
import { Container, injectable, inject } from 'inversify';

@injectable()
class Logger implements ILogger {
  log(message: string) {
    console.log(message);
  }
}

@injectable()
class UserService {
  constructor(
    @inject('ILogger') private logger: ILogger,
    @inject('IApiClient') private apiClient: IApiClient
  ) {}
}
```

## 10. Dependency Inversion Principle (DIP)

### 10.1 Что такое DIP?

**Dependency Inversion Principle** - один из принципов SOLID. Гласит:
1. Модули высокого уровня не должны зависеть от модулей низкого уровня. Оба должны зависеть от абстракций.
2. Абстракции не должны зависеть от деталей. Детали должны зависеть от абстракций.

### 10.2 Проблема без DIP

```javascript
// ❌ Плохо - прямая зависимость от конкретной реализации
class MySQLDatabase {
  connect() {
    console.log('Connected to MySQL');
  }
  
  query(sql) {
    console.log('Executing MySQL query:', sql);
    return [];
  }
}

class UserRepository {
  constructor() {
    this.db = new MySQLDatabase(); // жесткая зависимость
  }
  
  findById(id) {
    return this.db.query(`SELECT * FROM users WHERE id = ${id}`);
  }
}

// Проблема: если нужно переключиться на PostgreSQL,
// придется менять UserRepository
```

### 10.3 Решение с DIP

```javascript
// ✅ Хорошо - зависимость от абстракции
// Абстракция (интерфейс)
class IDatabase {
  connect() { throw new Error('Not implemented'); }
  query(sql) { throw new Error('Not implemented'); }
}

// Реализации
class MySQLDatabase extends IDatabase {
  connect() {
    console.log('Connected to MySQL');
  }
  
  query(sql) {
    console.log('Executing MySQL query:', sql);
    return [];
  }
}

class PostgreSQLDatabase extends IDatabase {
  connect() {
    console.log('Connected to PostgreSQL');
  }
  
  query(sql) {
    console.log('Executing PostgreSQL query:', sql);
    return [];
  }
}

// Высокоуровневый модуль зависит от абстракции
class UserRepository {
  constructor(database) { // зависимость от IDatabase
    this.db = database;
  }
  
  findById(id) {
    return this.db.query(`SELECT * FROM users WHERE id = ${id}`);
  }
}

// Использование
const mysqlDb = new MySQLDatabase();
const userRepo1 = new UserRepository(mysqlDb);

const postgresDb = new PostgreSQLDatabase();
const userRepo2 = new UserRepository(postgresDb);
```

### 10.4 DIP с TypeScript

```typescript
// Интерфейс (абстракция)
interface IDatabase {
  connect(): Promise<void>;
  query<T>(sql: string): Promise<T[]>;
  disconnect(): Promise<void>;
}

// Реализации
class MySQLDatabase implements IDatabase {
  async connect(): Promise<void> {
    console.log('Connected to MySQL');
  }
  
  async query<T>(sql: string): Promise<T[]> {
    console.log('Executing MySQL query:', sql);
    return [];
  }
  
  async disconnect(): Promise<void> {
    console.log('Disconnected from MySQL');
  }
}

class PostgreSQLDatabase implements IDatabase {
  async connect(): Promise<void> {
    console.log('Connected to PostgreSQL');
  }
  
  async query<T>(sql: string): Promise<T[]> {
    console.log('Executing PostgreSQL query:', sql);
    return [];
  }
  
  async disconnect(): Promise<void> {
    console.log('Disconnected from PostgreSQL');
  }
}

// Репозиторий зависит от абстракции
class UserRepository {
  constructor(private database: IDatabase) {}
  
  async findById(id: number): Promise<User | null> {
    const results = await this.database.query<User>(
      `SELECT * FROM users WHERE id = ${id}`
    );
    return results[0] || null;
  }
  
  async findAll(): Promise<User[]> {
    return this.database.query<User>('SELECT * FROM users');
  }
}

// Использование с DI
const database: IDatabase = new MySQLDatabase();
const userRepository = new UserRepository(database);
```

### 10.5 Практический пример - Слои приложения

```typescript
// Domain Layer - абстракции
interface IUserRepository {
  findById(id: number): Promise<User | null>;
  save(user: User): Promise<User>;
  delete(id: number): Promise<void>;
}

interface IEmailService {
  send(to: string, subject: string, body: string): Promise<void>;
}

// Application Layer - бизнес-логика
class UserService {
  constructor(
    private userRepository: IUserRepository,
    private emailService: IEmailService
  ) {}
  
  async registerUser(data: UserRegistrationData): Promise<User> {
    const user = new User(data);
    await this.userRepository.save(user);
    
    await this.emailService.send(
      user.email,
      'Welcome!',
      'Thank you for registering'
    );
    
    return user;
  }
}

// Infrastructure Layer - реализации
class DatabaseUserRepository implements IUserRepository {
  async findById(id: number): Promise<User | null> {
    // Реальная работа с БД
    return null;
  }
  
  async save(user: User): Promise<User> {
    // Сохранение в БД
    return user;
  }
  
  async delete(id: number): Promise<void> {
    // Удаление из БД
  }
}

class SMTPEmailService implements IEmailService {
  async send(to: string, subject: string, body: string): Promise<void> {
    // Отправка через SMTP
    console.log(`Sending email to ${to}`);
  }
}

// Composition Root - сборка зависимостей
function createUserService(): UserService {
  const userRepository: IUserRepository = new DatabaseUserRepository();
  const emailService: IEmailService = new SMTPEmailService();
  
  return new UserService(userRepository, emailService);
}

// Для тестирования легко подменить реализации
class MockUserRepository implements IUserRepository {
  private users: User[] = [];
  
  async findById(id: number): Promise<User | null> {
    return this.users.find(u => u.id === id) || null;
  }
  
  async save(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }
  
  async delete(id: number): Promise<void> {
    this.users = this.users.filter(u => u.id !== id);
  }
}

class MockEmailService implements IEmailService {
  sentEmails: Array<{ to: string; subject: string; body: string }> = [];
  
  async send(to: string, subject: string, body: string): Promise<void> {
    this.sentEmails.push({ to, subject, body });
  }
}

// Тесты
const mockUserRepo = new MockUserRepository();
const mockEmailService = new MockEmailService();
const testUserService = new UserService(mockUserRepo, mockEmailService);
```

### 10.6 Преимущества DIP

1. **Гибкость** - легко заменить реализацию
2. **Тестируемость** - легко подменить зависимости моками
3. **Переиспользуемость** - высокоуровневые модули не зависят от деталей
4. **Масштабируемость** - легко добавлять новые реализации
5. **Поддерживаемость** - изменения в низкоуровневых модулях не влияют на высокоуровневые

## 11. TypeScript - Ключевые моменты для собеседования

### 11.1 Базовые типы

```typescript
// Примитивные типы
let str: string = 'hello';
let num: number = 42;
let bool: boolean = true;
let nothing: null = null;
let undef: undefined = undefined;
let sym: symbol = Symbol('sym');
let big: bigint = 100n;

// Any - отключает проверку типов
let anything: any = 'string';
anything = 123; // ОК

// Unknown - безопасная версия any
let value: unknown = 'string';
// value.toUpperCase(); // Ошибка!
if (typeof value === 'string') {
  value.toUpperCase(); // ОК
}

// Void - отсутствие типа
function log(): void {
  console.log('hello');
}

// Never - функция никогда не возвращает значение
function throwError(): never {
  throw new Error('Error');
}

function infiniteLoop(): never {
  while (true) {}
}

// Object types
let obj: { name: string; age: number } = {
  name: 'John',
  age: 30
};

// Array types
let arr1: number[] = [1, 2, 3];
let arr2: Array<number> = [1, 2, 3];

// Tuple types
let tuple: [string, number] = ['hello', 42];

// Enum types
enum Color {
  Red,
  Green,
  Blue
}
let color: Color = Color.Red;

// Const enum (оптимизация)
const enum Direction {
  Up,
  Down,
  Left,
  Right
}
```

### 11.2 Union и Intersection Types

```typescript
// Union - или/или
type StringOrNumber = string | number;
let value: StringOrNumber = 'hello';
value = 42; // ОК

// Type guards для union
function processValue(value: string | number) {
  if (typeof value === 'string') {
    return value.toUpperCase();
  } else {
    return value.toFixed(2);
  }
}

// Discriminated Unions
type Success = { status: 'success'; data: string };
type Error = { status: 'error'; message: string };
type Result = Success | Error;

function handleResult(result: Result) {
  if (result.status === 'success') {
    console.log(result.data); // TypeScript знает тип
  } else {
    console.log(result.message);
  }
}

// Intersection - и
type Person = { name: string };
type Employee = { employeeId: number };
type Staff = Person & Employee;

const staff: Staff = {
  name: 'John',
  employeeId: 123
};
```

### 11.3 Type Aliases vs Interfaces

```typescript
// Type Alias
type User = {
  name: string;
  age: number;
};

// Interface
interface User {
  name: string;
  age: number;
}

// Основные отличия:

// 1. Interface можно расширять (extends)
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// 2. Interface можно переопределять (declaration merging)
interface Window {
  title: string;
}

interface Window {
  width: number;
}

// Результат: Window имеет title и width

// 3. Type более гибкий
type ID = string | number;
type Callback = (data: string) => void;
type Tree<T> = { value: T; left?: Tree<T>; right?: Tree<T> };

// Когда использовать что:
// - Interface - для объектов, классов, API контрактов
// - Type - для union, intersection, mapped types, utility types
```

### 11.4 Generics

```typescript
// Базовый generic
function identity<T>(arg: T): T {
  return arg;
}

identity<number>(42);
identity('hello'); // type inference

// Generic constraints
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length > b.length ? a : b;
}

longest('hello', 'world'); // ОК
longest([1, 2], [1, 2, 3]); // ОК
// longest(10, 20); // Ошибка! number не имеет length

// Multiple type parameters
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

// Generic interfaces
interface Box<T> {
  value: T;
}

const numberBox: Box<number> = { value: 42 };
const stringBox: Box<string> = { value: 'hello' };

// Generic classes
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

// Generic type aliases
type Nullable<T> = T | null;
type ArrayOrSingle<T> = T | T[];
```

### 11.5 Utility Types

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Partial - все свойства опциональные
type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; age?: number }

// Required - все свойства обязательные
type RequiredUser = Required<PartialUser>;

// Readonly - все свойства только для чтения
type ReadonlyUser = Readonly<User>;

// Pick - выбрать определенные свойства
type UserPreview = Pick<User, 'id' | 'name'>;
// { id: number; name: string }

// Omit - исключить определенные свойства
type UserWithoutEmail = Omit<User, 'email'>;
// { id: number; name: string; age: number }

// Record - создать тип с заданными ключами
type UserRoles = Record<string, boolean>;
// { [key: string]: boolean }

// Exclude - исключить типы из union
type T1 = Exclude<string | number | boolean, boolean>;
// string | number

// Extract - извлечь типы из union
type T2 = Extract<string | number | boolean, string | boolean>;
// string | boolean

// NonNullable - исключить null и undefined
type T3 = NonNullable<string | null | undefined>;
// string

// ReturnType - получить тип возвращаемого значения# JavaScript & TypeScript - Полная теоретическая база для собеседования

## 1. Массивы - Полный гайд

### 1.1 Основные методы массивов

#### Методы изменяющие массив (Mutating)

```javascript
const arr = [1, 2, 3, 4, 5];

// push() - добавить в конец
arr.push(6); // [1, 2, 3, 4, 5, 6]

// pop() - удалить с конца
const last = arr.pop(); // last = 6, arr = [1, 2, 3, 4, 5]

// unshift() - добавить в начало
arr.unshift(0); // [0, 1, 2, 3, 4, 5]

// shift() - удалить с начала
const first = arr.shift(); // first = 0, arr = [1, 2, 3, 4, 5]

// splice(start, deleteCount, ...items) - универсальный метод
arr.splice(2, 1); // удалить 1 элемент с индекса 2: [1, 2, 4, 5]
arr.splice(2, 0, 3); // вставить 3 на индекс 2: [1, 2, 3, 4, 5]
arr.splice(2, 1, 99); // заменить элемент: [1, 2, 99, 4, 5]

// reverse() - перевернуть массив
arr.reverse(); // [5, 4, 99, 2, 1]

// sort() - сортировать
arr.sort(); // сортировка как строк
arr.sort((a, b) => a - b); // числовая сортировка по возрастанию
arr.sort((a, b) => b - a); // по убыванию

// fill(value, start, end) - заполнить значением
arr.fill(0); // [0, 0, 0, 0, 0]
arr.fill(1, 2, 4); // [0, 0, 1, 1, 0]
```

#### Методы НЕ изменяющие массив (Non-mutating)

```javascript
const arr = [1, 2, 3, 4, 5];

// concat() - объединить массивы
const arr2 = arr.concat([6, 7]); // [1, 2, 3, 4, 5, 6, 7]

// slice(start, end) - получить часть массива
const part = arr.slice(1, 3); // [2, 3]
const copy = arr.slice(); // копия массива

// join(separator) - объединить в строку
const str = arr.join('-'); // "1-2-3-4-5"

// indexOf(element) - найти индекс
const index = arr.indexOf(3); // 2

// lastIndexOf(element) - найти индекс с конца
const lastIndex = [1, 2, 3, 2, 1].lastIndexOf(2); // 3

// includes(element) - проверить наличие
const hasThree = arr.includes(3); // true

// toString() - преобразовать в строку
const str2 = arr.toString(); // "1,2,3,4,5"
```

#### Итерационные методы

```javascript
const arr = [1, 2, 3, 4, 5];

// forEach() - выполнить функцию для каждого элемента
arr.forEach((item, index, array) => {
  console.log(`arr[${index}] = ${item}`);
});

// map() - создать новый массив, применив функцию
const doubled = arr.map(x => x * 2); // [2, 4, 6, 8, 10]

// filter() - отфильтровать элементы
const even = arr.filter(x => x % 2 === 0); // [2, 4]

// reduce() - свести к одному значению
const sum = arr.reduce((acc, x) => acc + x, 0); // 15

// reduceRight() - то же, но справа налево
const result = [1, 2, 3].reduceRight((acc, x) => acc + x, 0); // 6

// find() - найти первый элемент
const found = arr.find(x => x > 3); // 4

// findIndex() - найти индекс первого элемента
const foundIndex = arr.findIndex(x => x > 3); // 3

// findLast() - найти последний элемент (ES2023)
const lastFound = arr.findLast(x => x > 3); // 5

// findLastIndex() - индекс последнего (ES2023)
const lastFoundIndex = arr.findLastIndex(x => x > 3); // 4

// some() - есть ли хотя бы один элемент
const hasEven = arr.some(x => x % 2 === 0); // true

// every() - все ли элементы удовлетворяют условию
const allPositive = arr.every(x => x > 0); // true

// flat() - сделать массив плоским
const nested = [1, [2, 3], [4, [5, 6]]];
const flat1 = nested.flat(); // [1, 2, 3, 4, [5, 6]]
const flat2 = nested.flat(2); // [1, 2, 3, 4, 5, 6]
const flatAll = nested.flat(Infinity); // полностью плоский

// flatMap() - map + flat
const arr2 = [1, 2, 3];
const result = arr2.flatMap(x => [x, x * 2]); // [1, 2, 2, 4, 3, 6]
```

### 1.2 Продвинутые техники с массивами

```javascript
// Удаление дубликатов
const arr = [1, 2, 2, 3, 3, 4];
const unique = [...new Set(arr)]; // [1, 2, 3, 4]

// Поиск пересечения массивов
const arr1 = [1, 2, 3, 4];
const arr2 = [3, 4, 5, 6];
const intersection = arr1.filter(x => arr2.includes(x)); // [3, 4]

// Разница массивов
const difference = arr1.filter(x => !arr2.includes(x)); // [1, 2]

// Объединение массивов (union)
const union = [...new Set([...arr1, ...arr2])]; // [1, 2, 3, 4, 5, 6]

// Группировка элементов
const items = [
  { category: 'fruit', name: 'apple' },
  { category: 'fruit', name: 'banana' },
  { category: 'vegetable', name: 'carrot' }
];

const grouped = items.reduce((acc, item) => {
  if (!acc[item.category]) {
    acc[item.category] = [];
  }
  acc[item.category].push(item);
  return acc;
}, {});
// { fruit: [...], vegetable: [...] }

// Подсчет элементов
const fruits = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
const count = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1;
  return acc;
}, {});
// { apple: 3, banana: 2, orange: 1 }

// Разбиение массива на части (chunk)
function chunk(arr, size) {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
}
chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]

// Перемешивание массива (shuffle)
function shuffle(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Поиск максимального/минимального
const numbers = [5, 2, 8, 1, 9];
const max = Math.max(...numbers); // 9
const min = Math.min(...numbers); // 1

// Создание диапазона чисел
const range = (start, end) => 
  Array.from({ length: end - start + 1 }, (_, i) => start + i);
range(1, 5); // [1, 2, 3, 4, 5]

// Транспонирование матрицы
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];
const transposed = matrix[0].map((_, i) => matrix.map(row => row[i]));
// [[1, 4, 7], [2, 5, 8], [3, 6, 9]]
```

### 1.3 TypeScript и массивы

```typescript
// Типизация массивов
const numbers: number[] = [1, 2, 3];
const strings: Array<string> = ['a', 'b', 'c'];

// Readonly массивы
const readonlyArr: readonly number[] = [1, 2, 3];
// readonlyArr.push(4); // Ошибка!

// Кортежи (Tuples)
const tuple: [string, number] = ['age', 30];
const tuple2: [string, number, boolean?] = ['name', 25]; // опциональный элемент

// Typed array methods
interface User {
  id: number;
  name: string;
}

const users: User[] = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' }
];

const names: string[] = users.map(u => u.name);
const john: User | undefined = users.find(u => u.name === 'John');

// Utility types для массивов
type ArrayElement<T> = T extends (infer U)[] ? U : never;
type UserType = ArrayElement<typeof users>; // User

// Generic функции с массивами
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}
```

## 2. Строки - Полный гайд

### 2.1 Основные методы строк

```javascript
const str = "Hello World";

// Длина строки
console.log(str.length); // 11

// Доступ к символам
console.log(str[0]); // "H"
console.log(str.charAt(0)); // "H"
console.log(str.charCodeAt(0)); // 72 (код символа)

// Поиск подстроки
console.log(str.indexOf('World')); // 6
console.log(str.lastIndexOf('o')); // 7
console.log(str.includes('World')); // true
console.log(str.startsWith('Hello')); // true
console.log(str.endsWith('World')); // true

// Извлечение подстроки
console.log(str.slice(0, 5)); // "Hello"
console.log(str.slice(-5)); // "World"
console.log(str.substring(0, 5)); // "Hello"
console.log(str.substr(6, 5)); // "World" (deprecated)

// Изменение регистра
console.log(str.toLowerCase()); // "hello world"
console.log(str.toUpperCase()); // "HELLO WORLD"

// Замена
console.log(str.replace('World', 'JavaScript')); // "Hello JavaScript"
console.log(str.replaceAll('o', '0')); // "Hell0 W0rld"

// Разделение и объединение
console.log(str.split(' ')); // ["Hello", "World"]
console.log(['Hello', 'World'].join(' ')); // "Hello World"

// Удаление пробелов
const str2 = "  Hello World  ";
console.log(str2.trim()); // "Hello World"
console.log(str2.trimStart()); // "Hello World  "
console.log(str2.trimEnd()); // "  Hello World"

// Дополнение строки
console.log('5'.padStart(3, '0')); // "005"
console.log('5'.padEnd(3, '0')); // "500"

// Повторение
console.log('abc'.repeat(3)); // "abcabcabc"

// Сравнение
console.log('a'.localeCompare('b')); // -1 (a < b)
console.log('b'.localeCompare('a')); // 1 (b > a)
console.log('a'.localeCompare('a')); // 0 (равны)
```

### 2.2 Шаблонные литералы (Template Literals)

```javascript
const name = 'John';
const age = 30;

// Базовое использование
const greeting = `Hello, ${name}!`;

// Многострочные строки
const multiline = `
  Line 1
  Line 2
  Line 3
`;

// Вложенные выражения
const message = `${name} is ${age >= 18 ? 'adult' : 'minor'}`;

// Tagged templates
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    return `${result}${str}<strong>${values[i] || ''}</strong>`;
  }, '');
}

const text = highlight`Name: ${name}, Age: ${age}`;
// "Name: <strong>John</strong>, Age: <strong>30</strong>"
```

### 2.3 Регулярные выражения

```javascript
// Создание регулярного выражения
const regex1 = /pattern/flags;
const regex2 = new RegExp('pattern', 'flags');

// Флаги:
// g - global (все совпадения)
// i - case insensitive (без учета регистра)
// m - multiline (многострочный режим)
// s - dotall (. включает \n)
// u - unicode
// y - sticky (поиск с конкретной позиции)

// Методы RegExp
const str = "Hello World";
const pattern = /o/g;

console.log(pattern.test(str)); // true (есть совпадение)
console.log(pattern.exec(str)); // ["o", index: 4, ...]

// Методы String с regex
console.log(str.match(/o/g)); // ["o", "o"]
console.log(str.search(/World/)); // 6
console.log(str.replace(/o/g, '0')); // "Hell0 W0rld"
console.log(str.split(/\s/)); // ["Hello", "World"]

// Группы захвата
const dateStr = "2024-01-15";
const datePattern = /(\d{4})-(\d{2})-(\d{2})/;
const [, year, month, day] = dateStr.match(datePattern);
// year = "2024", month = "01", day = "15"

// Именованные группы
const datePattern2 = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const { groups: { year, month, day } } = dateStr.match(datePattern2);

// Lookahead и lookbehind
const text = "price: $100";
console.log(text.match(/\$(?=\d+)/)); // ["$"] - за $ следует число
console.log(text.match(/(?<=\$)\d+/)); // ["100"] - число после $

// Часто используемые паттерны
const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^https?:\/\/.+/,
  phone: /^\+?[\d\s-()]+$/,
  hexColor: /^#[0-9A-Fa-f]{6}$/,
  ipAddress: /^(\d{1,3}\.){3}\d{1,3}$/,
  creditCard: /^\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}$/
};
```

### 2.4 Продвинутые техники со строками

```javascript
// Reverse строки
function reverseString(str) {
  return str.split('').reverse().join('');
  // или
  return [...str].reverse().join('');
}

// Проверка на палиндром
function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}

// Capitalize first letter
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Title case
function titleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

// Camel case to snake case
function camelToSnake(str) {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

// Snake case to camel case
function snakeToCamel(str) {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

// Truncate строки
function truncate(str, maxLength, suffix = '...') {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

// Подсчет слов
function wordCount(str) {
  return str.trim().split(/\s+/).length;
}

// Escape HTML
function escapeHtml(str) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return str.replace(/[&<>"']/g, m => map[m]);
}

// Levenshtein distance (расстояние между строками)
function levenshtein(a, b) {
  const matrix = [];
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}
```

### 2.5 TypeScript и строки

```typescript
// String literal types
type Direction = 'left' | 'right' | 'up' | 'down';
const dir: Direction = 'left';

// Template literal types
type Greeting = `Hello ${string}`;
const greeting: Greeting = 'Hello World';

type EventName = `on${Capitalize<string>}`;
const event: EventName = 'onClick';

// String manipulation types
type Uppercase<S extends string> = intrinsic;
type Lowercase<S extends string> = intrinsic;
type Capitalize<S extends string> = intrinsic;
type Uncapitalize<S extends string> = intrinsic;

type Name = 'john';
type UpperName = Uppercase<Name>; // 'JOHN'
type CapitalName = Capitalize<Name>; // 'John'

// Typed string methods
function processString(str: string): string {
  return str.trim().toLowerCase();
}

// Брендированные строки
type Email = string & { readonly __brand: 'Email' };
type URL = string & { readonly __brand: 'URL' };

function createEmail(str: string): Email {
  if (!str.includes('@')) throw new Error('Invalid email');
  return str as Email;
}
```

## 3. Map и Set

### 3.1 Map - Словарь ключ-значение

```javascript
// Создание Map
const map = new Map();

// Добавление элементов
map.set('name', 'John');
map.set('age', 30);
map.set(1, 'number key');
map.set({ id: 1 }, 'object key');

// Получение значений
console.log(map.get('name')); // "John"
console.log(map.get('unknown')); // undefined

// Проверка наличия ключа
console.log(map.has('name')); // true

// Удаление элемента
map.delete('age');

// Размер Map
console.log(map.size); // 2

// Очистка Map
map.clear();

// Инициализация с данными
const map2 = new Map([
  ['key1', 'value1'],
  ['key2', 'value2']
]);

// Итерация
const map3 = new Map([
  ['name', 'John'],
  ['age', 30]
]);

// Перебор ключей
for (const key of map3.keys()) {
  console.log(key);
}

// Перебор значений
for (const value of map3.values()) {
  console.log(value);
}

// Перебор пар ключ-значение
for (const [key, value] of map3.entries()) {
  console.log(`${key}: ${value}`);
}

// forEach
map3.forEach((value, key) => {
  console.log(`${key}: ${value}`);
});

// Преобразование
const obj = Object.fromEntries(map3); // в объект
const arr = Array.from(map3); // в массив
```

### 3.2 WeakMap - Слабые ссылки

```javascript
// WeakMap - ключи только объекты, автоматическая сборка мусора
const weakMap = new WeakMap();

let obj = { id: 1 };
weakMap.set(obj, 'some data');

console.log(weakMap.get(obj)); // "some data"

// Когда obj будет удален, запись в WeakMap тоже удалится
obj = null; // теперь объект может быть удален сборщиком мусора

// Методы WeakMap
weakMap.set(key, value);
weakMap.get(key);
weakMap.has(key);
weakMap.delete(key);

// Применение: приватные данные
const privateData = new WeakMap();

class Person {
  constructor(name) {
    privateData.set(this, { name });
  }
  
  getName() {
    return privateData.get(this).name;
  }
}
```

### 3.3 Set - Множество уникальных значений

```javascript
// Создание Set
const set = new Set();

// Добавление элементов
set.add(1);
set.add(2);
set.add(2); // дубликат игнорируется
set.add('hello');
set.add({ id: 1 });

// Размер Set
console.log(set.size); // 4

// Проверка наличия
console.log(set.has(1)); // true

// Удаление элемента
set.delete(1);

// Очистка Set
set.clear();

// Инициализация с данными
const set2 = new Set([1, 2, 3, 3, 4]); // [1, 2, 3, 4]

// Итерация
for (const value of set2) {
  console.log(value);
}

set2.forEach(value => {
  console.log(value);
});

// Преобразование
const arr = Array.from(set2); // в массив
const arr2 = [...set2]; // или через spread

// Удаление дубликатов из массива
const numbers = [1, 2, 2, 3, 3, 4];
const unique = [...new Set(numbers)]; // [1, 2, 3, 4]
```

### 3.4 WeakSet - Слабые ссылки

```javascript
// WeakSet - только объекты, автоматическая сборка мусора
const weakSet = new WeakSet();

let obj1 = { id: 1 };
let obj2 = { id: 2 };

weakSet.add(obj1);
weakSet.add(obj2);

console.log(weakSet.has(obj1)); // true

weakSet.delete(obj1);

// Применение: отслеживание посещенных объектов
const visited = new WeakSet();

function process(obj) {
  if (visited.has(obj)) {
    return; // уже обработан
  }
  
  visited.add(obj);
  // обработка...
}
```

### 3.5 Продвинутые техники

```javascript
// Операции над множествами

// Объединение (Union)
const setA = new Set([1, 2, 3]);
const setB = new Set([3, 4, 5]);
const union = new Set([...setA, ...setB]); // {1, 2, 3, 4, 5}

// Пересечение (Intersection)
const intersection = new Set([...setA].filter(x => setB.has(x))); // {3}

// Разность (Difference)
const difference = new Set([...setA].filter(x => !setB.has(x))); // {1, 2}

// Симметрическая разность
const symDiff = new Set([
  ...[...setA].filter(x => !setB.has(x)),
  ...[...setB].filter(x => !setA.has(x))
]); // {1, 2, 4, 5}

// Подмножество
const isSubset = (subset, set) => {
  return [...subset].every(item => set.has(item));
};

// Map как кеш
class Cache {
  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }
  
  get(key) {
    if (!this.cache.has(key)) return undefined;
    
    // LRU: переместить в конец
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    
    return value;
  }
  
  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    
    this.cache.set(key, value);
    
    // Удалить самый старый элемент, если превышен размер
    if (this.cache.size > this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }
}

// Группировка с Map
const items = [
  { category: 'fruit', name: 'apple' },
  { category: 'fruit', name: 'banana' },
  { category: 'vegetable', name: 'carrot' }
];

const grouped = items.reduce((map, item) => {
  const group = map.get(item.category) || [];
  group.push(item);
  map.set(item.category, group);
  return map;
}, new Map());
```

### 3.6 TypeScript и Map/Set

```typescript
// Типизация Map
const map1: Map<string, number> = new Map();
map1.set('age', 30);

// Generic Map
interface User {
  id: number;
  name: string;
}

const userMap: Map<number, User> = new Map();
userMap.set(1, { id: 1, name: 'John' });

// Типизация Set
const set1: Set<number> = new Set([1, 2, 3]);
const set2: Set<string> = new Set(['a', 'b', 'c']);

// Record vs Map
// Record - для статических ключей
type UserRecord = Record<string, User>;
const users: UserRecord = {
  '1': { id: 1, name: 'John' }
};

// Map - для динамических ключей
const userMap2 = new Map<number, User>();
```

## 4. Замыкания (Closures)

### 4.3 Практические примеры замыканий

```javascript
// 1. Приватные переменные (Module Pattern)
const calculator = (function() {
  let result = 0; // приватная переменная
  
  return {
    add(n) {
      result += n;
      return this;
    },
    subtract(n) {
      result -= n;
      return this;
    },
    getResult() {
      return result;
    }
  };
})();

calculator.add(5).subtract(2).getResult(); // 3
console.log(calculator.result); // undefined - приватная переменная

// 2. Фабрика функций
function createMultiplier(multiplier) {
  return function(number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15

// 3. Каррирование
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function(...nextArgs) {
      return curried.apply(this, args.concat(nextArgs));
    };
  };
}

function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6

// 4. Мемоизация
function memoize(fn) {
  const cache = {};
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (cache[key]) {
      console.log('From cache');
      return cache[key];
    }
    
    const result = fn.apply(this, args);
    cache[key] = result;
    return result;
  };
}

const fibonacci = memoize(function(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

// 5. Event handlers с замыканиями
function setupButtons() {
  for (let i = 0; i < 5; i++) {
    const button = document.createElement('button');
    button.textContent = `Button ${i}`;
    
    // Замыкание сохраняет правильное значение i
    button.addEventListener('click', function() {
      console.log(`Clicked button ${i}`);
    });
    
    document.body.appendChild(button);
  }
}

// 6. Debounce
function debounce(func, delay) {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

const debouncedSearch = debounce(function(query) {
  console.log('Searching for:', query);
}, 500);

// 7. Throttle
function throttle(func, limit) {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// 8. Once - выполнить функцию один раз
function once(fn) {
  let called = false;
  let result;
  
  return function(...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}

const initialize = once(() => {
  console.log('Initializing...');
  return 'initialized';
});

initialize(); // "Initializing..." -> "initialized"
initialize(); // -> "initialized" (без лога)
```

### 4.4 Распространенные ошибки с замыканиями

```javascript
// ❌ ОШИБКА: var в цикле
for (var i = 0; i < 5; i++) {
  setTimeout(function() {
    console.log(i); // выведет 5, 5, 5, 5, 5
  }, 100);
}

// ✅ РЕШЕНИЕ 1: let вместо var
for (let i = 0; i < 5; i++) {
  setTimeout(function() {
    console.log(i); // выведет 0, 1, 2, 3, 4
  }, 100);
}

// ✅ РЕШЕНИЕ 2: IIFE
for (var i = 0; i < 5; i++) {
  (function(j) {
    setTimeout(function() {
      console.log(j); // выведет 0, 1, 2, 3, 4
    }, 100);
  })(i);
}

// ❌ ОШИБКА: утечка памяти
function createHeavyObject() {
  const heavyData = new Array(1000000).fill('data');
  
  return function() {
    // Даже если не используем heavyData,
    // он остается в памяти из-за замыкания
    console.log('Function called');
  };
}

// ✅ РЕШЕНИЕ: явно освобождать ресурсы
function createHeavyObject() {
  let heavyData = new Array(1000000).fill('data');
  
  return {
    doSomething() {
      console.log('Function called');
    },
    cleanup() {
      heavyData = null; // освободить память
    }
  };
}
```

### 4.5 Замыкания и this

```javascript
const obj = {
  name: 'Object',
  
  // Стрелочная функция - this из внешнего контекста
  arrowMethod: () => {
    console.log(this.name); // undefined (this = window/global)
  },
  
  // Обычная функция - this = obj
  normalMethod: function() {
    console.log(this.name); // "Object"
    
    // Вложенная функция теряет контекст
    function inner() {
      console.log(this.name); // undefined
    }
    inner();
    
    // Стрелочная функция сохраняет контекст
    const arrowInner = () => {
      console.log(this.name); // "Object"
    };
    arrowInner();
  }
};
```

## 5. Контекст (this)

### 5.1 Что такое this?

`this` - это ключевое слово, которое ссылается на объект, в контексте которого выполняется функция.

**Значение this зависит от способа вызова функции:**

### 5.2 Способы определения this

```javascript
// 1. Global context
console.log(this); // window (в браузере) или global (в Node.js)

function globalFunction() {
  console.log(this); // window в обычном режиме, undefined в strict mode
}

// 2. Object method
const obj = {
  name: 'Object',
  method() {
    console.log(this.name); // "Object"
  }
};
obj.method(); // this = obj

// 3. Constructor function
function Person(name) {
  this.name = name; // this = новый объект
}
const person = new Person('John');

// 4. Явное связывание: call, apply, bind
function greet(greeting) {
  console.log(`${greeting}, ${this.name}`);
}

const user = { name: 'John' };

greet.call(user, 'Hello'); // "Hello, John"
greet.apply(user, ['Hello']); // "Hello, John"

const boundGreet = greet.bind(user, 'Hello');
boundGreet(); // "Hello, John"

// 5. Arrow functions - this из внешнего контекста
const obj2 = {
  name: 'Object',
  
  regularMethod: function() {
    console.log(this.name); // "Object"
  },
  
  arrowMethod: () => {
    console.log(this.name); // undefined (this из глобального контекста)
  },
  
  methodWithArrow: function() {
    const arrow = () => {
      console.log(this.name); // "Object" (this из methodWithArrow)
    };
    arrow();
  }
};

// 6. Event handlers
document.getElementById('button').addEventListener('click', function() {
  console.log(this); // <button> элемент
});

document.getElementById('button').addEventListener('click', () => {
  console.log(this); // window (стрелочная функция)
});

// 7. Class methods
class MyClass {
  constructor(name) {
    this.name = name;
  }
  
  method() {
    console.log(this.name);
  }
  
  arrowMethod = () => {
    console.log(this.name); // всегда экземпляр класса
  }
}

const instance = new MyClass('Instance');
instance.method(); // "Instance"

const detached = instance.method;
detached(); // undefined (потерян контекст)

const detachedArrow = instance.arrowMethod;
detachedArrow(); // "Instance" (контекст сохранен)
```

### 5.3 Правила определения this (по приоритету)

1. **new binding** - при вызове с `new`, this = новый объект
2. **Explicit binding** - call, apply, bind
3. **Implicit binding** - вызов как метод объекта
4. **Default binding** - глобальный объект (или undefined в strict mode)
5. **Arrow functions** - лексический this (из внешней функции)

```javascript
// Примеры приоритета
function foo() {
  console.log(this.name);
}

const obj1 = { name: 'obj1', foo };
const obj2 = { name: 'obj2' };

// Implicit binding
obj1.foo(); // "obj1"

// Explicit binding побеждает implicit
obj1.foo.call(obj2); // "obj2"

// new побеждает explicit
const boundFoo = foo.bind(obj1);
const instance = new boundFoo(); // this = новый объект (не obj1)
```

### 5.4 Распространенные проблемы с this

```javascript
// Проблема 1: Потеря контекста при передаче метода
const obj = {
  name: 'Object',
  greet() {
    console.log(`Hello, ${this.name}`);
  }
};

obj.greet(); // "Hello, Object"

const greet = obj.greet;
greet(); // "Hello, undefined" - потерян контекст

// Решение 1: bind
const boundGreet = obj.greet.bind(obj);
boundGreet(); // "Hello, Object"

// Решение 2: стрелочная функция
const obj2 = {
  name: 'Object',
  greet: () => {
    console.log(`Hello, ${this.name}`); // НЕ РАБОТАЕТ!
  }
};

// Решение 3: wrapper function
setTimeout(() => obj.greet(), 1000);

// Проблема 2: this в коллбэках
class Counter {
  constructor() {
    this.count = 0;
  }
  
  increment() {
    this.count++;
  }
  
  startIncrementing() {
    // ❌ Потеря контекста
    setInterval(this.increment, 1000);
    
    // ✅ Решение 1: стрелочная функция
    setInterval(() => this.increment(), 1000);
    
    // ✅ Решение 2: bind
    setInterval(this.increment.bind(this), 1000);
  }
}

// Проблема 3: this в nested functions
const obj3 = {
  name: 'Object',
  
  method() {
    console.log(this.name); // "Object"
    
    function nested() {
      console.log(this.name); // undefined - потерян контекст
    }
    nested();
    
    // Решение: стрелочная функция
    const nestedArrow = () => {
      console.log(this.name); // "Object"
    };
    nestedArrow();
  }
};
```

### 5.5 this в TypeScript

```typescript
// Типизация this
interface User {
  name: string;
  greet(this: User): void;
}

const user: User = {
  name: 'John',
  greet() {
    console.log(this.name); // TypeScript знает, что this - User
  }
};

// ThisType helper
interface Methods {
  greet(): void;
}

interface State {
  name: string;
}

const obj: Methods & ThisType<State & Methods> = {
  greet() {
    console.log(this.name); // this имеет тип State & Methods
  }
};
```

## 6. Event Loop - Цикл событий

### 6.1 Что такое Event Loop?

**Event Loop** - механизм, который позволяет JavaScript выполнять неблокирующие операции, несмотря на то, что JavaScript однопоточный.

### 6.2 Компоненты Event Loop

```
┌───────────────────────────┐
│      Call Stack           │ Стек вызовов (синхронный код)
└───────────────────────────┘
            ↓
┌───────────────────────────┐
│      Web APIs             │ setTimeout, fetch, DOM events
└───────────────────────────┘
            ↓
┌───────────────────────────┐
│   Callback Queue          │ Макрозадачи (tasks)
│   (Task Queue)            │
└───────────────────────────┘
            ↓
┌───────────────────────────┐
│   Microtask Queue         │ Микрозадачи (Promises, queueMicrotask)
└───────────────────────────┘
            ↓
┌───────────────────────────┐
│      Event Loop           │ Координатор
└───────────────────────────┘
```

### 6.3 Как работает Event Loop?

```javascript
// Пример работы Event Loop
console.log('1'); // Call Stack

setTimeout(() => {
  console.log('2'); // Callback Queue (макрозадача)
}, 0);

Promise.resolve().then(() => {
  console.log('3'); // Microtask Queue
});

console.log('4'); // Call Stack

// Вывод: 1, 4, 3, 2
```

**Порядок выполнения:**
1. Выполняется весь синхронный код в Call Stack
2. Выполняются ВСЕ микрозадачи (Promises)
3. Выполняется ОДНА макрозадача (setTimeout, setInterval)
4. Повторяется с шага 2

### 6.4 Макрозадачи vs Микрозадачи

```javascript
// Макрозадачи (Task Queue):
setTimeout(() => {}, 0);
setInterval(() => {}, 0);
setImmediate(() => {}); // Node.js
// I/O операции
// UI rendering

// Микрозадачи (Microtask Queue):
Promise.resolve().then(() => {});
queueMicrotask(() => {});
process.nextTick(() => {}); // Node.js (приоритетнее Promise)
// MutationObserver

// Пример разницы
console.log('Start');

setTimeout(() => {
  console.log('setTimeout 1');
  
  Promise.resolve().then(() => {
    console.log('Promise in setTimeout');
  });
}, 0);

Promise.resolve().then(() => {
  console.log('Promise 1');
  
  setTimeout(() => {
    console.log('setTimeout in Promise');
  }, 0);
});

setTimeout(() => {
  console.log('setTimeout 2');
}, 0);

Promise.resolve().then(() => {
  console.log('Promise 2');
});

console.log('End');

// Вывод:
// Start
// End
// Promise 1
// Promise 2
// setTimeout 1
// Promise in setTimeout
// setTimeout 2
// setTimeout in Promise
```

### 6.5 Подробный пример

```javascript
console.log('Script start'); // 1

setTimeout(() => {
  console.log('setTimeout'); // 7
}, 0);

Promise.resolve()
  .then(() => {
    console.log('Promise 1'); // 4
  })
  .then(() => {
    console.log('Promise 2'); // 5
  });

async function async1() {
  console.log('async1 start'); // 2
  await async2();
  console.log('async1 end'); // 6 (await = Promise.then)
}

async function async2() {
  console.log('async2'); // 3
}

async1();

console.log('Script end'); // 4

// Порядок выполнения:
// 1. Script start (синхронный)
// 2. async1 start (синхронный)
// 3. async2 (синхронный)
// 4. Script end (синхронный)
// --- Стек пуст, выполняем микрозадачи ---
// 5. Promise 1 (микрозадача)
// 6. Promise 2 (микрозадача)
// 7. async1 end (микрозадача от await)
// --- Все микрозадачи выполнены, берем макрозадачу ---
// 8. setTimeout (макрозадача)
```

### 6.6 Блокирующий vs Неблокирующий код

```javascript
// ❌ Блокирующий код (синхронный)
function blockingOperation() {
  const start = Date.now();
  while (Date.now() - start < 3000) {
    // Блокирует Event Loop на 3 секунды
  }
  console.log('Done');
}

blockingOperation(); // UI замерзнет!

// ✅ Неблокирующий код (асинхронный)
function nonBlockingOperation() {
  setTimeout(() => {
    console.log('Done');
  }, 3000);
}

nonBlockingOperation(); // UI работает нормально
```

### 6.7 Визуализация Event Loop

```javascript
// Шаг за шагом
console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve()
  .then(() => console.log('3'))
  .then(() => console.log('4'));

console.log('5');

// Выполнение:

// === Call Stack ===
// console.log('1') -> выполнено
// setTimeout -> отправлено в Web API
// Promise.resolve().then -> отправлено в Microtask Queue
// console.log('5') -> выполнено

// === Call Stack пуст ===
// Event Loop проверяет Microtask Queue

// === Microtask Queue ===
// then(() => console.log('3')) -> выполнено
// then(() => console.log('4')) -> выполнено

// === Microtask Queue пуст ===
// Event Loop берет задачу из Task Queue

// === Task Queue ===
// setTimeout callback -> выполнено

// Результат: 1, 5, 3, 4, 2
```

### 6.8 requestAnimationFrame и Event Loop

```javascript
// requestAnimationFrame выполняется ПОСЛЕ микрозадач, но ДО следующей макрозадачи

console.log('Start');

setTimeout(() => {
  console.log('setTimeout');
}, 0);

Promise.resolve().then(() => {
  console.log('Promise');
});

requestAnimationFrame(() => {
  console.log('rAF');
});

console.log('End');

// Вывод: Start, End, Promise, rAF, setTimeout
```

### 6.9 Node.js Event Loop

Node.js имеет более сложный Event Loop с несколькими фазами:

```javascript
// Фазы Node.js Event Loop:
// 1. timers (setTimeout, setInterval)
// 2. pending callbacks (I/O callbacks)
// 3. idle, prepare (внутренние)
// 4. poll (новые I/O события)
// 5. check (setImmediate)
// 6. close callbacks (socket.on('close'))

// process.nextTick имеет НАИВЫСШИЙ приоритет
process.nextTick(() => {
  console.log('nextTick'); // 1
});

Promise.resolve().then(() => {
  console.log('Promise'); // 2
});

setTimeout(() => {
  console.log('setTimeout'); // 4
}, 0);

setImmediate(() => {
  console.log('setImmediate'); // 3
});

// В Node.js: nextTick, Promise, setImmediate, setTimeout
```

## 7. Async/Await и Promises

### 7.1 Promises - Основы

**Promise** - объект, представляющий результат асинхронной операции.

```javascript
// Создание Promise
const promise = new Promise((resolve, reject) => {
  // Асинхронная операция
  const success = true;
  
  if (success) {
    resolve('Success!'); // выполнено успешно
  } else {
    reject('Error!'); // ошибка
  }
});

// Состояния Promise:
// 1. pending - начальное состояние
// 2. fulfilled - операция выполнена успешно
// 3. rejected - операция завершилась с ошибкой

// Использование Promise
promise
  .then(result => {
    console.log(result); // "Success!"
    return 'Next value';
  })
  .then(result => {
    console.log(result); // "Next value"
  })
  .catch(error => {
    console.error(error);
  })
  .finally(() => {
    console.log('Always executed');
  });
```

### 7.2 Promise методы

```javascript
// Promise.resolve() - создать fulfilled Promise
const resolved = Promise.resolve('value');

// Promise.reject() - создать rejected Promise
const rejected = Promise.reject('error');

// Promise.all() - ждать выполнения всех Promise
const promises = [
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
];

Promise.all(promises)
  .then(results => {
    console.log(results); // [1, 2, 3]
  })
  .catch(error => {
    // Если хотя бы один Promise rejected
    console.error(error);
  });

// Promise.allSettled() - ждать завершения всех Promise
Promise.allSettled([
  Promise.resolve(1),
  Promise.reject('error'),
  Promise.resolve(3)
]).then(results => {
  console.log(results);
  // [
  //   { status: 'fulfilled', value: 1 },
  //   { status: 'rejected', reason: 'error' },
  //   { status: 'fulfilled', value: 3 }
  // ]
});

// Promise.race() - первый выполненный Promise
Promise.race([
  new Promise(resolve => setTimeout(() => resolve(1), 1000)),
  new Promise(resolve => setTimeout(() => resolve(2), 500))
]).then(result => {
  console.log(result); // 2 (первый завершился)
});

// Promise.any() - первый успешный Promise
Promise.any([
  Promise.reject('error 1'),
  Promise.resolve(2),
  Promise.resolve(3)
]).then(result => {
  console.log(result); // 2
}).catch(error => {
  // AggregateError если все rejected
  console.error(error);
});
```

### 7.3 Promise Chaining

```javascript
// Цепочка Promise
fetch('/api/user')
  .then(response => response.json())
  .then(user => {
    console.log(user);
    return fetch(`/api/posts?userId=${user.id}`);
  })
  .then(response => response.json())
  .then(posts => {
    console.log(posts);
  })
  .catch(error => {
    console.error('Error:', error);
  });

// Возврат Promise из then()
function getUserPosts(userId) {
  return fetch(`/api/users/${userId}`)
    .then(response => response.json())
    .then(user => {
      return fetch(`/api/posts?userId=${user.id}`);
    })
    .then(response => response.json());
}

getUserPosts(1).then(posts => console.log(posts));
```

### 7.4 Async/Await

**async/await** - синтаксический сахар над Promises.

```javascript
// Функция с async всегда возвращает Promise
async function fetchData() {
  return 'data'; // автоматически обернется в Promise.resolve('data')
}

fetchData().then(data => console.log(data)); // "data"

// await приостанавливает выполнение функции
async function getData() {
  const response = await fetch('/api/data');
  const data = await response.json();
  return data;
}

// Обработка ошибок с try-catch
async function getUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error; // пробросить ошибку дальше
  }
}

// Параллельное выполнение
async function getMultipleData() {
  // ❌ Последовательно (медленно)
  const user = await fetch('/api/user').then(r => r.json());
  const posts = await fetch('/api/posts').then(r => r.json());
  
  // ✅ Параллельно (быстро)
  const [user, posts] = await Promise.all([
    fetch('/api/user').then(r => r.json()),
    fetch('/api/posts').then(r => r.json())
  ]);
  
  return { user, posts };
}
```

### 7.5 Продвинутые техники

```javascript
// Retry с экспоненциальной задержкой
async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      if (i === retries - 1) throw error;
      
      // Экспоненциальная задержка
      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Timeout для Promise
function timeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), ms)
    )
  ]);
}

// Использование
timeout(fetch('/api/data'), 5000)
  .then(response => response.json())
  .catch(error => console.error(error));

// Sequential execution
async function sequential(tasks) {
  const results = [];
  
  for (const task of tasks) {
    const result = await task();
    results.push(result);
  }
  
  return results;
}

// Parallel execution с ограничением
async function parallelLimit(tasks, limit) {
  const results = [];
  const executing = [];
  
  for (const task of tasks) {
    const promise = task().then(result => {
      executing.splice(executing.indexOf(promise), 1);
      return result;
    });
    
    results.push(promise);
    executing.push(promise);
    
    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }
  
  return Promise.all(results);
}

// Promise pool
class PromisePool {
  constructor(limit) {
    this.limit = limit;
    this.running = 0;
    this.queue = [];
  }
  
  async add(fn) {
    while (this.running >= this.limit) {
      await Promise.race(this.queue);
    }
    
    this.running++;
    
    const promise = fn().finally(() => {
      this.running--;
      const index = this.queue.indexOf(promise);
      if (index !== -1) {
        this.queue.splice(index, 1);
      }
    });
    
    this.queue.push(promise);
    
    return promise;
  }
}

// Использование
const pool = new PromisePool(3); // максимум 3 одновременных запроса

const tasks = urls.map(url =>
  () => fetch(url).then(r => r.json())
);

const results = await Promise.all(
  tasks.map(task => pool.add(task))
);
```

### 7.6 Async итераторы

```javascript
// Async итератор
const asyncIterable = {
  [Symbol.asyncIterator]() {
    let i = 0;
    
    return {
      async next() {
        if (i < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return { value: i++, done: false };
        }
        
        return { done: true };
      }
    };
  }
};

// Использование
for await (const value of asyncIterable) {
  console.log(value); // 0, 1, 2 (с задержкой)
}

// Async generator
async function* asyncGenerator() {
  let i = 0;
  
  while (i < 3) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    yield i++;
  }
}

for await (const value of asyncGenerator()) {
  console.log(value); // 0, 1, 2 (с задержкой)
}

// Практический пример: пагинация
async function* fetchPages(url) {
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    const response = await fetch(`${url}?page=${page}`);
    const data = await response..1 Что такое замыкание?

**Замыкание** - это функция, которая имеет доступ к переменным из внешней функции даже после того, как внешняя функция завершила выполнение.

```javascript
function createCounter() {
  let count = 0; // приватная переменная
  
  return function() {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
```

### 4.2 Как работают замыкания?

```javascript
function outer() {
  const outerVar = 'I am outer';
  
  function inner() {
    console.log(outerVar); // доступ к outerVar
  }
  
  return inner;
}

const innerFunc = outer();
innerFunc(); // "I am outer"
// outer() уже завершилась, но inner() сохранил доступ к outerVar
```

**Механизм:**
1. Когда создается функция, она сохраняет ссылку на свою лексическую область видимости
2. При вызове функции используется сохраненная область видимости, а не текущая
3. Переменные из внешней функции живут, пока существует ссылка на внутреннюю функцию

### 4   