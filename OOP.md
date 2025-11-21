# ООП в TypeScript - Полная методичка для собеседования
Класс — это фундаментальное понятие объектно-ориентированного программирования (ООП). Класс можно представить как "чертеж" или "шаблон" для создания объектов. Он определяет структуру, свойства (атрибуты) и поведение (методы) объектов, которые создаются на его основе. Классы позволяют организовывать код в модульные, переиспользуемые блоки, делая программы более читаемыми и поддерживаемыми.
Основные характеристики класса:

+ Атрибуты (поля или переменные): Данные, которые хранятся в объекте. Например, в классе "Автомобиль" атрибутами могут быть "марка", "цвет" и "скорость".

+ Методы (функции): Действия, которые может выполнять объект. Например, метод "завести двигатель" или "разогнаться".

+ Конструктор: Специальный метод, который вызывается при создании объекта для инициализации атрибутов.
```typescript
class User {
    name: string;
    age: number;
    email: string;

    constructor(name: string, age: number, email: string) {
        this.name = name;
        this.age = age;
        this.email = email;
    }

    greet(): string {
        return `Привет, меня зовут ${this.name}`;
    }
}

// Создание экземпляра класса
const user1 = new User("Лёха", 21, "lex@example.com");
console.log(user1.greet()); // "Привет, меня зовут Лёха"
```
### Свойства класса (Properties):
```typescript
name: string;
age: number;
email: string;
```
Это поля класса - данные, которые будет хранить каждый объект. В TypeScript мы обязаны указать типы для каждого свойства.
### Конструктор (Constructor)
```typescript
constructor(name: string, age: number, email: string) {
    this.name = name;
    this.age = age;
    this.email = email;
}
```
Что такое конструктор?
Конструктор - это специальный метод, который автоматически вызывается при создании нового объекта через new User(...). Он нужен для инициализации объекта - установки начальных значений.
Важные моменты:

Название всегда constructor - это зарезервированное слово, другое название использовать нельзя

В классе может быть только один конструктор - в отличие от некоторых языков, в TypeScript нельзя делать перегрузку конструкторов

`this` - ключевое слово, которое ссылается на текущий создаваемый объект:
```typescript
this.name = name;
   // ↑           ↑
   // свойство    параметр
   // объекта     конструктора
```
Что обязательно писать в конструкторе?

Инициализацию всех свойств, которые объявлены в классе
Если свойство не инициализировано, TypeScript выдаст ошибку
Либо нужно пометить свойство как опциональное (name?: string) или дать дефолтное значение

Конструктор не возвращает значение - он неявно возвращает созданный объект

### Методы класса
Это обычные функции, принадлежащие классу. Они имеют доступ к свойствам объекта через `this`.
```typescript
greet(): string {
    return `Привет, меня зовут ${this.name}`;
}
```
Это обычные функции, принадлежащие классу. Они имеют доступ к свойствам объекта через `this`.

## Модификаторы доступа
```typescript
class BankAccount {
    public accountNumber: string;      // доступен везде
    private balance: number;           // доступен только внутри класса
    protected owner: string;           // доступен в классе и наследниках

    constructor(accountNumber: string, initialBalance: number, owner: string) {
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
        this.owner = owner;
    }

    // Публичный метод для получения баланса
    public getBalance(): number {
        return this.balance;
    }

    // Приватный метод для внутренней логики
    private calculateInterest(): number {
        return this.balance * 0.05;
    }

    // Публичный метод, использующий приватный
    public addInterest(): void {
        const interest = this.calculateInterest();
        this.balance += interest;
    }
}

const account = new BankAccount("123456", 1000, "Лёха");
console.log(account.accountNumber); // ✅ работает
console.log(account.getBalance());  // ✅ работает
// console.log(account.balance);    // ❌ ошибка: balance приватный
```

+ private защищает данные от случайного изменения извне

+ protected позволяет наследникам использовать поля родителя

+ public (по умолчанию) - стандартный доступ

<strong>Сокращенный вид конструктора</strong>
```typescript
class Product {
    // Не нужно объявлять свойства отдельно!
    constructor(
        public name: string,
        public price: number,
        private stock: number
    ) {
        // Не нужно писать this.name = name и т.д.
        // TypeScript сделает это автоматически!
    }

    getStock(): number {
        return this.stock;
    }
}

const product = new Product("MacBook M4", 150000, 5);
console.log(product.name);  // "MacBook M4"
console.log(product.price); // 150000
```
## 2. Основы ООП - Четыре столпа

### 2.1.1 Наследование (Inheritance)

**Наследование** - механизм создания нового класса на основе существующего.
```typescript
// Базовый (родительский) класс
class Animal {
    constructor(
        public name: string,
        public age: number
    ) {}

    makeSound(): string {
        return "Какой-то звук";
    }

    move(): string {
        return `${this.name} движется`;
    }
}

// Дочерний класс наследуется от Animal
class Dog extends Animal {
    constructor(
        name: string,
        age: number,
        public breed: string  // Добавили новое свойство
    ) {
        super(name, age);  // ОБЯЗАТЕЛЬНО вызываем конструктор родителя!
    }

    // Переопределяем метод родителя
    makeSound(): string {
        return "Гав-гав!";
    }

    // Добавляем новый метод
    fetch(): string {
        return `${this.name} приносит мячик`;
    }
}

const dog = new Dog("Рекс", 3, "Немецкая овчарка");
console.log(dog.makeSound());  // "Гав-гав!" (переопределенный метод)
console.log(dog.move());       // "Рекс движется" (унаследованный метод)
console.log(dog.fetch());      // "Рекс приносит мячик" (новый метод)
console.log(dog.breed);        // "Немецкая овчарка" (новое свойство)
```
Ключевое слово `super` - ОЧЕНЬ ВАЖНО!
`super` используется в двух случаях:
### 2.1.1.1 Вызов конструктора родителя
```typescript
class Dog extends Animal {
    constructor(
        name: string,
        age: number,
        public breed: string
    ) {
        // super ОБЯЗАТЕЛЬНО должен быть вызван ПЕРВЫМ в конструкторе!
        super(name, age);
        
        // До вызова super нельзя использовать this
        // this.breed = "test"; // ❌ Ошибка!
        
        // После super можно делать что угодно
        console.log("Создана собака");
    }
}
```
Правила работы с super() в конструкторе:

+ ОБЯЗАТЕЛЬНО вызывать, если класс наследуется от другого класса

+ ОБЯЗАТЕЛЬНО вызывать ПЕРВЫМ в конструкторе (до любого использования this)

+ Передаем все параметры, которые ожидает конструктор родителя

+ Если родительский конструктор не вызван, TypeScript выдаст ошибку

### 2.1.1.2 Вызов методов родителя
```typescript
class Cat extends Animal {
    constructor(name: string, age: number) {
        super(name, age);
    }

    makeSound(): string {
        // Вызываем метод родителя
        const parentSound = super.makeSound();
        return `${parentSound} + Мяу-мяу!`;
    }

    move(): string {
        // Можем дополнять логику родителя
        const parentMove = super.move();
        return `${parentMove} очень грациозно`;
    }
}

const cat = new Cat("Мурка", 2);
console.log(cat.makeSound());  // "Какой-то звук + Мяу-мяу!"
console.log(cat.move());       // "Мурка движется очень грациозно"
```
Тут и работает модификатор `protected`, если есть свойство или метод `protected` у родителя, для инициализации его у child нужен конструктор
 
### 1.2 Переопределение методов (Method Overriding)
В дочернем классе, можем переопределять метод родителя и писать собственную реализацию
```typescript
class Shape {
    constructor(public color: string) {}

    getArea(): number {
        return 0;  // Базовая реализация
    }

    describe(): string {
        return `Фигура цвета ${this.color}`;
    }
}

class Rectangle extends Shape {
    constructor(
        color: string,
        public width: number,
        public height: number
    ) {
        super(color);
    }

    // Полностью переопределяем метод
    getArea(): number {
        return this.width * this.height;
    }

    // Расширяем метод родителя
    describe(): string {
        const baseDescription = super.describe();
        return `${baseDescription}, площадь: ${this.getArea()}`;
    }
}

class Circle extends Shape {
    constructor(
        color: string,
        public radius: number
    ) {
        super(color);
    }

    getArea(): number {
        return Math.PI * this.radius ** 2;
    }

    describe(): string {
        return `${super.describe()}, радиус: ${this.radius}`;
    }
}

const rect = new Rectangle("красный", 10, 5);
const circle = new Circle("синий", 7);

console.log(rect.getArea());      // 50
console.log(circle.getArea());    // 153.93...
console.log(rect.describe());     // "Фигура цвета красный, площадь: 50"
```
### 2.1.1.3 Проверка типов с наследованием
```typescript
const dog = new Dog("Рекс", "Лабрадор");
const animal = new Animal("Неизвестное животное", 5);

// instanceof проверяет, является ли объект экземпляром класса
console.log(dog instanceof Dog);      // true
console.log(dog instanceof Animal);   // true (Dog наследуется от Animal)
console.log(animal instanceof Dog);   // false

// Можем безопасно приводить типы
const animals: Animal[] = [
    new Dog("Рекс", 3, "Лабрадор"),
    new Cat("Мурка", 2),
    new Animal("Хомяк", 1)
];

animals.forEach(animal => {
    console.log(animal.makeSound());
    
    // Проверяем конкретный тип
    if (animal instanceof Dog) {
        console.log(animal.fetch());  // Метод доступен только у Dog
    }
});
```

**Mixins (альтернатива множественному наследованию):**

```typescript
// Mixin type
type Constructor<T = {}> = new (...args: any[]) => T;

// Mixin функция
function Flyable<T extends Constructor>(Base: T) {
  return class extends Base {
    altitude: number = 0;
    
    fly() {
      this.altitude = 100;
      console.log('Flying at altitude:', this.altitude);
    }
  };
}

function Swimmable<T extends Constructor>(Base: T) {
  return class extends Base {
    depth: number = 0;
    
    swim() {
      this.depth = 10;
      console.log('Swimming at depth:', this.depth);
    }
  };
}

// Базовый класс
class Animal {
  constructor(public name: string) {}
}

// Применение mixins
const FlyingSwimmingAnimal = Swimmable(Flyable(Animal));

const duck = new FlyingSwimmingAnimal('Duck');
duck.fly();  // "Flying at altitude: 100"
duck.swim(); // "Swimming at depth: 10"
```

## 2.2 Абстракция
### 2.2.1 Абстрактные классы (Abstract Classes)
Абстрактный класс - это класс, который нельзя инстанциировать (создать экземпляр) напрямую. Он служит шаблоном для других классов.
Важные правила абстрактных классов:

+ Объявляются с ключевым словом abstract

+ Нельзя создавать экземпляры напрямую

+ Могут содержать как обычные методы с реализацией, так и абстрактные без реализации

+ Абстрактные методы обязательно должны быть реализованы в дочерних классах

+ Могут иметь конструктор (для инициализации общих полей)

+ Могут иметь поля (свойства)

```typescript
abstract class Vehicle {
    constructor(
        public brand: string,
        public model: string
    ) {}

    // Обычный метод с реализацией
    getInfo(): string {
        return `${this.brand} ${this.model}`;
    }

    // Абстрактный метод - БЕЗ реализации!
    abstract start(): void;
    abstract stop(): void;
    abstract getMaxSpeed(): number;
}

// ❌ Ошибка! Нельзя создать экземпляр абстрактного класса
// const vehicle = new Vehicle("Toyota", "Camry");

// ✅ Правильно - наследуемся и реализуем абстрактные методы
class Car extends Vehicle {
    constructor(
        brand: string,
        model: string,
        private engineType: string
    ) {
        super(brand, model);
    }

    // ОБЯЗАТЕЛЬНО реализуем все абстрактные методы
    start(): void {
        console.log(`${this.getInfo()}: Запуск двигателя (${this.engineType})`);
    }

    stop(): void {
        console.log(`${this.getInfo()}: Остановка двигателя`);
    }

    getMaxSpeed(): number {
        return 220;
    }
}

class Motorcycle extends Vehicle {
    constructor(brand: string, model: string) {
        super(brand, model);
    }

    start(): void {
        console.log(`${this.getInfo()}: Мотоцикл заведён`);
    }

    stop(): void {
        console.log(`${this.getInfo()}: Мотоцикл заглушен`);
    }

    getMaxSpeed(): number {
        return 180;
    }
}

const car = new Car("BMW", "M5", "V8");
const moto = new Motorcycle("Yamaha", "R1");

car.start();                    // "BMW M5: Запуск двигателя (V8)"
console.log(car.getMaxSpeed()); // 220
```

<strong>Применение</strong>
```typescript
abstract class DatabaseConnection {
    constructor(protected connectionString: string) {}

    // Общая логика для всех типов БД
    log(message: string): void {
        console.log(`[DB] ${message}`);
    }

    // Каждая БД реализует это по-своему
    abstract connect(): Promise<void>;
    abstract disconnect(): Promise<void>;
    abstract executeQuery(query: string): Promise<any>;
}

class PostgresConnection extends DatabaseConnection {
    async connect(): Promise<void> {
        this.log(`Подключение к PostgreSQL: ${this.connectionString}`);
        // Логика подключения к PostgreSQL
    }

    async disconnect(): Promise<void> {
        this.log("Отключение от PostgreSQL");
    }

    async executeQuery(query: string): Promise<any> {
        this.log(`Выполнение PostgreSQL запроса: ${query}`);
        // Выполнение запроса
        return [];
    }
}

class MongoConnection extends DatabaseConnection {
    async connect(): Promise<void> {
        this.log(`Подключение к MongoDB: ${this.connectionString}`);
        // Логика подключения к MongoDB
    }

    async disconnect(): Promise<void> {
        this.log("Отключение от MongoDB");
    }

    async executeQuery(query: string): Promise<any> {
        this.log(`Выполнение MongoDB запроса: ${query}`);
        // Выполнение запроса
        return [];
    }
}

// Полиморфизм - можем работать с любой БД через общий тип
async function runDatabase(db: DatabaseConnection) {
    await db.connect();
    await db.executeQuery("SELECT * FROM users");
    await db.disconnect();
}

runDatabase(new PostgresConnection("postgres://localhost"));
runDatabase(new MongoConnection("mongodb://localhost"));
```

## 2.2.2 Интерфейсы (Interfaces)
Интерфейс - это чисто TypeScript конструкция, которая определяет контракт (набор свойств и методов), которые должен иметь объект. Интерфейсы полностью исчезают после компиляции в JavaScript.

```typescript
interface User {
    id: number;
    name: string;
    email: string;
    age?: number;  // опциональное свойство
    
    greet(): string;
    updateEmail(newEmail: string): void;
}

// Класс реализует интерфейс
class RegularUser implements User {
    constructor(
        public id: number,
        public name: string,
        public email: string,
        public age?: number
    ) {}

    greet(): string {
        return `Привет, я ${this.name}`;
    }

    updateEmail(newEmail: string): void {
        this.email = newEmail;
    }
}

class AdminUser implements User {
    constructor(
        public id: number,
        public name: string,
        public email: string,
        public permissions: string[],  // Дополнительное свойство
        public age?: number
    ) {}

    greet(): string {
        return `Привет, я админ ${this.name}`;
    }

    updateEmail(newEmail: string): void {
        console.log("Админ обновляет email");
        this.email = newEmail;
    }

    // Дополнительный метод, которого нет в интерфейсе
    grantPermission(permission: string): void {
        this.permissions.push(permission);
    }
}

const user: User = new RegularUser(1, "Лёха", "lex@example.com", 21);
const admin: User = new AdminUser(2, "Админ", "admin@example.com", ["read", "write"]);
```

### Множественная имплементация интерфейсов
Класс может реализовывать несколько интерфейсов одновременно! (В отличие от наследования, где можно наследоваться только от одного класса)
```typescript
interface Flyable {
    fly(): void;
    altitude: number;
}

interface Swimmable {
    swim(): void;
    depth: number;
}

interface Walkable {
    walk(): void;
}

// Класс может реализовать несколько интерфейсов
class Duck implements Flyable, Swimmable, Walkable {
    altitude: number = 0;
    depth: number = 0;

    fly(): void {
        this.altitude = 100;
        console.log("Утка летит на высоте", this.altitude);
    }

    swim(): void {
        this.depth = 2;
        console.log("Утка плавает на глубине", this.depth);
    }

    walk(): void {
        console.log("Утка ходит");
    }
}

class Penguin implements Swimmable, Walkable {
    depth: number = 0;

    // Пингвин не летает, поэтому не реализует Flyable
    
    swim(): void {
        this.depth = 50;
        console.log("Пингвин ныряет на глубину", this.depth);
    }

    walk(): void {
        console.log("Пингвин ходит вразвалку");
    }
}

const duck = new Duck();
duck.fly();
duck.swim();
duck.walk();
```

### Наследование интерфейсов
Интерфейсы могут наследоваться друг от друга:

```typescript
interface Entity {
    id: number;
    createdAt: Date;
}

interface User extends Entity {
    name: string;
    email: string;
}

interface AdminUser extends User {
    permissions: string[];
    role: string;
}

// Можно наследовать от нескольких интерфейсов
interface SuperAdmin extends AdminUser, Flyable {
    superPowers: string[];
}

class Admin implements AdminUser {
    // Нужно реализовать все поля из Entity, User и AdminUser
    id: number;
    createdAt: Date;
    name: string;
    email: string;
    permissions: string[];
    role: string;

    constructor(id: number, name: string, email: string) {
        this.id = id;
        this.createdAt = new Date();
        this.name = name;
        this.email = email;
        this.permissions = [];
        this.role = "admin";
    }
}
```
### Интерфейсы для функций

```typescript
interface SearchFunction {
    (query: string, limit: number): string[];
}

const searchUsers: SearchFunction = (query, limit) => {
    console.log(`Поиск: ${query}, лимит: ${limit}`);
    return ["user1", "user2"];
};

const result = searchUsers("Лёха", 10);
```

| Характеристика               | Абстрактный класс           | Интерфейс                       |
|------------------------------|------------------------------|----------------------------------|
| Ключевое слово               | abstract class               | interface                        |
| Инстанциирование             | ❌ Нельзя создать экземпляр   | ❌ Нельзя создать экземпляр       |
| Наследование / реализация    | extends (только один)        | implements (множественная)       |
| Реализация методов           | ✅ Может содержать реализацию | ❌ Только сигнатуры методов       |
| Конструктор                  | ✅ Может иметь конструктор    | ❌ Не может иметь конструктор     |
| Поля со значениями           | ✅ Может иметь значения       | ❌ Только объявления типов        |
| Модификаторы доступа         | ✅ public/private/protected   | ❌ Всё публично                   |
| Компиляция в JS              | ✅ Компилируется в JS         | ❌ Полностью исчезает             |
| Множественное наследование   | ❌ Только одно                | ✅ Можно несколько реализовать    |
| Использование для типизации  | ✅ Можно использовать         | ✅ Можно использовать             |



| Когда использовать | Интерфейс | Абстрактный класс |
|--------------------|-----------|--------------------|
| Нужен только контракт (без реализации) | ✅ Да | ❌ Нет |
| Нужна множественная имплементация | ✅ Да | ❌ Нет |
| Типизация объектов или параметров функций | ✅ Да | ✅ Да |
| Нужна общая реализация (shared code) | ❌ Нет | ✅ Да |
| Нужны protected/private поля | ❌ Нет | ✅ Да |
| Нужен конструктор с логикой | ❌ Нет | ✅ Да |

```typescript
// ✅ Используй АБСТРАКТНЫЙ КЛАСС когда:
abstract class PaymentProcessor {
    constructor(protected apiKey: string) {}

    // Общая логика для всех процессоров
    protected log(message: string): void {
        console.log(`[Payment] ${message}`);
    }

    // Обязательная реализация в наследниках
    abstract processPayment(amount: number): Promise<boolean>;
}

// ✅ Используй ИНТЕРФЕЙС когда:
interface Logger {
    log(message: string): void;
    error(message: string): void;
}

interface Cacheable {
    getCacheKey(): string;
    getCacheTTL(): number;
}

// Класс может реализовать оба интерфейса
class UserService implements Logger, Cacheable {
    log(message: string): void {
        console.log(message);
    }

    error(message: string): void {
        console.error(message);
    }

    getCacheKey(): string {
        return "users";
    }

    getCacheTTL(): number {
        return 3600;
    }
}
```
### 2.2 Инкапсуляция (Encapsulation)

**Инкапсуляция** - сокрытие внутренней реализации и предоставление публичного интерфейса для взаимодействия.

```typescript
// Пример инкапсуляции
class BankAccount {
  private balance: number = 0; // приватное поле
  private readonly accountNumber: string; // только для чтения
  
  constructor(accountNumber: string, initialBalance: number = 0) {
    this.accountNumber = accountNumber;
    this.balance = initialBalance;
  }
  
  // Публичные методы для доступа к приватным данным
  public deposit(amount: number): void {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }
    this.balance += amount;
  }
  
  public withdraw(amount: number): boolean {
    if (amount > this.balance) {
      return false;
    }
    this.balance -= amount;
    return true;
  }
  
  public getBalance(): number {
    return this.balance;
  }
  
  // Приватный метод (внутренняя реализация)
  private calculateInterest(): number {
    return this.balance * 0.05;
  }
}

const account = new BankAccount('123456', 1000);
account.deposit(500);
console.log(account.getBalance()); // 1500

// account.balance = 10000; // Ошибка! balance - приватное поле
// account.calculateInterest(); // Ошибка! метод приватный
```
**Геттеры и сеттеры:**

```typescript
class User {
  private _age: number = 0;
  
  // Геттер
  get age(): number {
    return this._age;
  }
  
  // Сеттер с валидацией
  set age(value: number) {
    if (value < 0 || value > 150) {
      throw new Error('Invalid age');
    }
    this._age = value;
  }
  
  // Computed property (только геттер)
  get isAdult(): boolean {
    return this._age >= 18;
  }
}

const user = new User();
user.age = 25; // вызывает setter
console.log(user.age); // вызывает getter - 25
console.log(user.isAdult); // true
```

### 1.3 Полиморфизм (Polymorphism)

**Полиморфизм** - способность объектов разных классов реагировать на одни и те же методы по-разному.

```typescript
// 1. Полиморфизм через наследование
class Shape {
  getArea(): number {
    return 0;
  }
  
  draw(): void {
    console.log('Drawing a shape');
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }
  
  getArea(): number {
    return Math.PI * this.radius ** 2;
  }
  
  draw(): void {
    console.log('Drawing a circle');
  }
}

class Rectangle extends Shape {
  constructor(private width: number, private height: number) {
    super();
  }
  
  getArea(): number {
    return this.width * this.height;
  }
  
  draw(): void {
    console.log('Drawing a rectangle');
  }
}

class Triangle extends Shape {
  constructor(private base: number, private height: number) {
    super();
  }
  
  getArea(): number {
    return (this.base * this.height) / 2;
  }
  
  draw(): void {
    console.log('Drawing a triangle');
  }
}

// Полиморфное использование
function printShapeInfo(shape: Shape): void {
  shape.draw();
  console.log('Area:', shape.getArea());
}

const shapes: Shape[] = [
  new Circle(5),
  new Rectangle(4, 6),
  new Triangle(3, 4)
];

shapes.forEach(shape => {
  printShapeInfo(shape);
  // Каждый shape вызывает свою реализацию методов
});

// 2. Полиморфизм через интерфейсы
interface PaymentMethod {
  processPayment(amount: number): void;
}

class CreditCard implements PaymentMethod {
  constructor(private cardNumber: string) {}
  
  processPayment(amount: number): void {
    console.log(`Processing $${amount} via Credit Card ${this.cardNumber}`);
  }
}

class PayPal implements PaymentMethod {
  constructor(private email: string) {}
  
  processPayment(amount: number): void {
    console.log(`Processing $${amount} via PayPal ${this.email}`);
  }
}

class Cryptocurrency implements PaymentMethod {
  constructor(private walletAddress: string) {}
  
  processPayment(amount: number): void {
    console.log(`Processing $${amount} via Crypto ${this.walletAddress}`);
  }
}

// Полиморфное использование
class PaymentProcessor {
  process(method: PaymentMethod, amount: number): void {
    method.processPayment(amount);
  }
}

const processor = new PaymentProcessor();
processor.process(new CreditCard('1234-5678'), 100);
processor.process(new PayPal('user@example.com'), 50);
processor.process(new Cryptocurrency('0x123...'), 200);
```

**Method Overloading (перегрузка методов):**

```typescript
class Calculator {
  // Сигнатуры перегрузки
  add(a: number, b: number): number;
  add(a: string, b: string): string;
  add(a: number[], b: number[]): number[];
  
  // Реализация
  add(a: any, b: any): any {
    if (typeof a === 'number' && typeof b === 'number') {
      return a + b;
    }
    if (typeof a === 'string' && typeof b === 'string') {
      return a + b;
    }
    if (Array.isArray(a) && Array.isArray(b)) {
      return [...a, ...b];
    }
    throw new Error('Invalid types');
  }
}

const calc = new Calculator();
console.log(calc.add(1, 2));        // 3
console.log(calc.add('Hello', ' World')); // "Hello World"
console.log(calc.add([1, 2], [3, 4]));    // [1, 2, 3, 4]
```

### 1.4 Абстракция (Abstraction)

**Абстракция** - выделение главных, наиболее значимых характеристик объекта и игнорирование второстепенных.

```typescript
// Абстрактный класс
abstract class Vehicle {
  protected brand: string;
  protected model: string;
  
  constructor(brand: string, model: string) {
    this.brand = brand;
    this.model = model;
  }
  
  // Абстрактные методы (должны быть реализованы в потомках)
  abstract start(): void;
  abstract stop(): void;
  abstract getMaxSpeed(): number;
  
  // Конкретный метод (общая реализация)
  public getInfo(): string {
    return `${this.brand} ${this.model}`;
  }
  
  // Конкретный метод с использованием абстрактных
  public displaySpecs(): void {
    console.log(`Vehicle: ${this.getInfo()}`);
    console.log(`Max Speed: ${this.getMaxSpeed()} km/h`);
  }
}

class Car extends Vehicle {
  constructor(brand: string, model: string, private horsepower: number) {
    super(brand, model);
  }
  
  start(): void {
    console.log(`${this.getInfo()} engine started`);
  }
  
  stop(): void {
    console.log(`${this.getInfo()} engine stopped`);
  }
  
  getMaxSpeed(): number {
    return this.horsepower * 2; // упрощенная формула
  }
}

class Motorcycle extends Vehicle {
  constructor(brand: string, model: string, private engineCC: number) {
    super(brand, model);
  }
  
  start(): void {
    console.log(`${this.getInfo()} bike started`);
  }
  
  stop(): void {
    console.log(`${this.getInfo()} bike stopped`);
  }
  
  getMaxSpeed(): number {
    return this.engineCC / 10;
  }
}

// const vehicle = new Vehicle('Brand', 'Model'); // Ошибка! Нельзя создать экземпляр абстрактного класса

const car = new Car('Toyota', 'Camry', 200);
car.start();
car.displaySpecs();

const bike = new Motorcycle('Yamaha', 'R1', 1000);
bike.start();
bike.displaySpecs();
```

**Интерфейсы для абстракции:**

```typescript
// Интерфейс определяет контракт
interface Database {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  query<T>(sql: string, params?: any[]): Promise<T[]>;
  execute(sql: string, params?: any[]): Promise<void>;
}

// Разные реализации одного интерфейса
class MySQLDatabase implements Database {
  async connect(): Promise<void> {
    console.log('Connected to MySQL');
  }
  
  async disconnect(): Promise<void> {
    console.log('Disconnected from MySQL');
  }
  
  async query<T>(sql: string, params?: any[]): Promise<T[]> {
    console.log('Executing MySQL query:', sql);
    return [];
  }
  
  async execute(sql: string, params?: any[]): Promise<void> {
    console.log('Executing MySQL command:', sql);
  }
}

class PostgreSQLDatabase implements Database {
  async connect(): Promise<void> {
    console.log('Connected to PostgreSQL');
  }
  
  async disconnect(): Promise<void> {
    console.log('Disconnected from PostgreSQL');
  }
  
  async query<T>(sql: string, params?: any[]): Promise<T[]> {
    console.log('Executing PostgreSQL query:', sql);
    return [];
  }
  
  async execute(sql: string, params?: any[]): Promise<void> {
    console.log('Executing PostgreSQL command:', sql);
  }
}

// Использование через интерфейс (абстракцию)
class UserRepository {
  constructor(private db: Database) {}
  
  async findById(id: number): Promise<User | null> {
    const results = await this.db.query<User>(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return results[0] || null;
  }
  
  async save(user: User): Promise<void> {
    await this.db.execute(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [user.name, user.email]
    );
  }
}

// Можем легко переключаться между реализациями
const mysqlRepo = new UserRepository(new MySQLDatabase());
const postgresRepo = new UserRepository(new PostgreSQLDatabase());
```

## 2. Классы в TypeScript - Подробно

### 2.1 Базовый синтаксис

```typescript
class Person {
  // Поля класса
  name: string;
  age: number;
  private ssn: string;
  protected address: string;
  readonly birthDate: Date;
  static species: string = 'Homo sapiens';
  
  // Конструктор
  constructor(name: string, age: number, ssn: string, birthDate: Date) {
    this.name = name;
    this.age = age;
    this.ssn = ssn;
    this.birthDate = birthDate;
    this.address = '';
  }
  
  // Методы экземпляра
  greet(): void {
    console.log(`Hello, I'm ${this.name}`);
  }
  
  // Статические методы
  static createAdult(name: string, ssn: string): Person {
    return new Person(name, 18, ssn, new Date());
  }
  
  // Геттер
  get info(): string {
    return `${this.name}, ${this.age} years old`;
  }
  
  // Сеттер
  set location(address: string) {
    this.address = address;
  }
}

// Использование
const person = new Person('John', 30, '123-45-6789', new Date('1994-01-01'));
person.greet();
console.log(person.info);
person.location = 'New York';

// Статический метод
const adult = Person.createAdult('Jane', '987-65-4321');
console.log(Person.species);
```

### 2.2 Сокращенный синтаксис конструктора

```typescript
// Длинная форма
class User {
  name: string;
  email: string;
  
  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}

// Короткая форма (Parameter Properties)
class User {
  constructor(
    public name: string,
    public email: string,
    private password: string,
    protected role: string = 'user'
  ) {}
}

// Эквивалентно длинной форме
const user = new User('John', 'john@example.com', 'secret123');
console.log(user.name); // "John"
// console.log(user.password); // Ошибка! приватное поле
```

### 2.3 Статические члены

```typescript
class MathUtils {
  // Статические поля
  static PI: number = 3.14159;
  static E: number = 2.71828;
  
  // Статические методы
  static add(a: number, b: number): number {
    return a + b;
  }
  
  static multiply(a: number, b: number): number {
    return a * b;
  }
  
  // Статический блок инициализации (ES2022)
  static {
    console.log('MathUtils class initialized');
    this.PI = Math.PI; // можно использовать точное значение
  }
}

// Использование без создания экземпляра
console.log(MathUtils.PI);
console.log(MathUtils.add(2, 3));

// Статические члены в наследовании
class AdvancedMath extends MathUtils {
  static power(base: number, exponent: number): number {
    return Math.pow(base, exponent);
  }
}

console.log(AdvancedMath.PI); // наследуется
console.log(AdvancedMath.power(2, 3));
```

### 2.4 Абстрактные классы и методы

```typescript
abstract class Shape {
  constructor(protected color: string) {}
  
  // Абстрактные методы
  abstract getArea(): number;
  abstract getPerimeter(): number;
  
  // Конкретные методы
  describe(): string {
    return `A ${this.color} shape with area ${this.getArea()}`;
  }
  
  // Абстрактный геттер
  abstract get type(): string;
}

class Circle extends Shape {
  constructor(color: string, private radius: number) {
    super(color);
  }
  
  getArea(): number {
    return Math.PI * this.radius ** 2;
  }
  
  getPerimeter(): number {
    return 2 * Math.PI * this.radius;
  }
  
  get type(): string {
    return 'Circle';
  }
}

class Rectangle extends Shape {
  constructor(
    color: string,
    private width: number,
    private height: number
  ) {
    super(color);
  }
  
  getArea(): number {
    return this.width * this.height;
  }
  
  getPerimeter(): number {
    return 2 * (this.width + this.height);
  }
  
  get type(): string {
    return 'Rectangle';
  }
}

const circle = new Circle('red', 5);
console.log(circle.describe());
console.log(circle.type);
```

### 2.5 Generics в классах

```typescript
// Generic класс
class Box<T> {
  private content: T;
  
  constructor(content: T) {
    this.content = content;
  }
  
  getContent(): T {
    return this.content;
  }
  
  setContent(content: T): void {
    this.content = content;
  }
}

const numberBox = new Box<number>(42);
console.log(numberBox.getContent()); // 42

const stringBox = new Box<string>('Hello');
console.log(stringBox.getContent()); // "Hello"

// Generic с constraints
class Repository<T extends { id: number }> {
  private items: T[] = [];
  
  add(item: T): void {
    this.items.push(item);
  }
  
  findById(id: number): T | undefined {
    return this.items.find(item => item.id === id);
  }
  
  getAll(): T[] {
    return [...this.items];
  }
  
  remove(id: number): boolean {
    const index = this.items.findIndex(item => item.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }
}

interface User {
  id: number;
  name: string;
  email: string;
}

const userRepo = new Repository<User>();
userRepo.add({ id: 1, name: 'John', email: 'john@example.com' });
const user = userRepo.findById(1);

// Multiple type parameters
class Pair<K, V> {
  constructor(public key: K, public value: V) {}
  
  getKey(): K {
    return this.key;
  }
  
  getValue(): V {
    return this.value;
  }
}

const pair = new Pair<string, number>('age', 30);
console.log(pair.getKey(), pair.getValue());
```

## 3. Интерфейсы в TypeScript

### 3.1 Базовые интерфейсы

```typescript
// Простой интерфейс
interface User {
  id: number;
  name: string;
  email: string;
  age?: number; // опциональное свойство
  readonly createdAt: Date; // только для чтения
}

// Использование
const user: User = {
  id: 1,
  name: 'John',
  email: 'john@example.com',
  createdAt: new Date()
};

// user.createdAt = new Date(); // Ошибка! readonly

// Интерфейс с методами
interface Calculator {
  add(a: number, b: number): number;
  subtract(a: number, b: number): number;
}

// Реализация интерфейса
class BasicCalculator implements Calculator {
  add(a: number, b: number): number {
    return a + b;
  }
  
  subtract(a: number, b: number): number {
    return a - b;
  }
}
```

### 3.2 Расширение интерфейсов

```typescript
interface Animal {
  name: string;
  age: number;
}

interface Dog extends Animal {
  breed: string;
  bark(): void;
}

interface ServiceDog extends Dog {
  serviceType: string;
  assist(): void;
}

const serviceDog: ServiceDog = {
  name: 'Buddy',
  age: 3,
  breed: 'Golden Retriever',
  serviceType: 'Guide',
  bark() {
    console.log('Woof!');
  },
  assist() {
    console.log('Assisting owner');
  }
};

// Множественное наследование интерфейсов
interface Flyable {
  fly(): void;
  maxAltitude: number;
}

interface Swimmable {
  swim(): void;
  maxDepth: number;
}

interface Duck extends Animal, Flyable, Swimmable {
  quack(): void;
}
```

### 3.3 Интерфейсы функций

```typescript
// Интерфейс функции
interface SearchFunc {
  (source: string, subString: string): boolean;
}

const mySearch: SearchFunc = (src, sub) => {
  return src.includes(sub);
};

// Интерфейс с callable signature и свойствами
interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}

function getCounter(): Counter {
  const counter = function(start: number) {
    return `Count: ${start}`;
  } as Counter;
  
  counter.interval = 123;
  counter.reset = function() {
    console.log('Reset');
  };
  
  return counter;
}

const c = getCounter();
console.log(c(10));
console.log(c.interval);
c.reset();
```

### 3.4 Индексные сигнатуры

```typescript
// String index signature
interface StringDictionary {
  [key: string]: string;
}

const dict: StringDictionary = {
  name: 'John',
  email: 'john@example.com'
};

// Number index signature
interface NumberArray {
  [index: number]: number;
}

const arr: NumberArray = [1, 2, 3, 4];

// Комбинированный интерфейс
interface Dictionary<T> {
  [key: string]: T;
  length: number; // конкретное свойство
  clear(): void;  // метод
}

// Generic интерфейс с index signature
interface ReadonlyStringArray {
  readonly [index: number]: string;
}

const myArray: ReadonlyStringArray = ['Alice', 'Bob'];
// myArray[0] = 'Charlie'; // Ошибка! readonly
```

### 3.5 Hybrid Types

```typescript
// Интерфейс, который одновременно является функцией и объектом
interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}

function getCounter(): Counter {
  let counter = function(start: number) {
    return `Started at ${start}`;
  } as Counter;
  
  counter.interval = 123;
  counter.reset = function() {
    console.log('Counter reset');
  };
  
  return counter;
}

let c = getCounter();
console.log(c(10));
c.reset();
console.log(c.interval);
```

## 4. SOLID Принципы в TypeScript

### 4.1 Single Responsibility Principle (SRP)

**Принцип единственной ответственности**: класс должен иметь только одну причину для изменения.

```typescript
// ❌ Плохо - класс имеет множество ответственностей
class User {
  constructor(
    public name: string,
    public email: string
  ) {}
  
  // Валидация
  validateEmail(): boolean {
    return /\S+@\S+\.\S+/.test(this.email);
  }
  
  // Сохранение в БД
  save(): void {
    // database logic
    console.log('Saving to database');
  }
  
  // Отправка email
  sendEmail(message: string): void {
    // email logic
    console.log('Sending email');
  }
  
  // Логирование
  log(): void {
    console.log(`User: ${this.name}`);
  }
}

// ✅ Хорошо - разделение ответственностей
class User {
  constructor(
    public name: string,
    public email: string
  ) {}
}

class UserValidator {
  validateEmail(email: string): boolean {
    return /\S+@\S+\.\S+/.test(email);
  }
  
  validateName(name: string): boolean {
    return name.length >= 2;
  }
}

class UserRepository {
  save(user: User): void {
    console.log('Saving to database', user);
  }
  
  findById(id: number): User | null {
    // database logic
    return null;
  }
}

class EmailService {
  send(to: string, message: string): void {
    console.log(`Sending email to ${to}`);
  }
}

class Logger {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }
}

// Использование
const user = new User('John', 'john@example.com');
const validator = new UserValidator();
const repository = new UserRepository();
const emailService = new EmailService();
const logger = new Logger();

if (validator.validateEmail(user.email)) {
  repository.save(user);
  emailService.send(user.email, 'Welcome!');
  logger.log(`User ${user.name} created`);
}
```
### 4.2 Open/Closed Principle (OCP)

**Принцип открытости/закрытости**: программные сущности должны быть открыты для расширения, но закрыты для модификации.

```typescript
// ❌ Плохо - нужно модифицировать класс для добавления новых фигур
class AreaCalculator {
  calculateArea(shapes: any[]): number {
    let total = 0;
    
    for (const shape of shapes) {
      if (shape.type === 'circle') {
        total += Math.PI * shape.radius ** 2;
      } else if (shape.type === 'rectangle') {
        total += shape.width * shape.height;
      } else if (shape.type === 'triangle') {
        total += (shape.base * shape.height) / 2;
      }
      // Для добавления новой фигуры нужно модифицировать этот метод
    }
    
    return total;
  }
}

// ✅ Хорошо - открыто для расширения, закрыто для модификации
interface Shape {
  getArea(): number;
}

class Circle implements Shape {
  constructor(private radius: number) {}
  
  getArea(): number {
    return Math.PI * this.radius ** 2;
  }
}

class Rectangle implements Shape {
  constructor(private width: number, private height: number) {}
  
  getArea(): number {
    return this.width * this.height;
  }
}

class Triangle implements Shape {
  constructor(private base: number, private height: number) {}
  
  getArea(): number {
    return (this.base * this.height) / 2;
  }
}

// Новая фигура - просто добавляем класс, не меняя существующий код
class Pentagon implements Shape {
  constructor(private side: number) {}
  
  getArea(): number {
    return (5 * this.side ** 2) / (4 * Math.tan(Math.PI / 5));
  }
}

class AreaCalculator {
  calculateArea(shapes: Shape[]): number {
    return shapes.reduce((total, shape) => total + shape.getArea(), 0);
  }
}

// Использование
const shapes: Shape[] = [
  new Circle(5),
  new Rectangle(4, 6),
  new Triangle(3, 4),
  new Pentagon(5)
];

const calculator = new AreaCalculator();
console.log(calculator.calculateArea(shapes));
```

**Другой пример - система уведомлений:**

```typescript
// ❌ Плохо
class NotificationService {
  send(type: string, message: string, recipient: string): void {
    if (type === 'email') {
      // email logic
    } else if (type === 'sms') {
      // sms logic
    } else if (type === 'push') {
      // push logic
    }
  }
}

// ✅ Хорошо
interface Notification {
  send(message: string, recipient: string): void;
}

class EmailNotification implements Notification {
  send(message: string, recipient: string): void {
    console.log(`Sending email to ${recipient}: ${message}`);
  }
}

class SMSNotification implements Notification {
  send(message: string, recipient: string): void {
    console.log(`Sending SMS to ${recipient}: ${message}`);
  }
}

class PushNotification implements Notification {
  send(message: string, recipient: string): void {
    console.log(`Sending push to ${recipient}: ${message}`);
  }
}

// Легко добавить новый тип
class SlackNotification implements Notification {
  send(message: string, recipient: string): void {
    console.log(`Sending Slack message to ${recipient}: ${message}`);
  }
}

class NotificationService {
  constructor(private notifications: Notification[]) {}
  
  notifyAll(message: string, recipient: string): void {
    this.notifications.forEach(notification => {
      notification.send(message, recipient);
    });
  }
}
```

### 4.3 Liskov Substitution Principle (LSP)

**Принцип подстановки Барбары Лисков**: объекты в программе должны быть заменяемыми на экземпляры их подтипов без изменения правильности выполнения программы.

```typescript
// ❌ Плохо - нарушение LSP
class Bird {
  fly(): void {
    console.log('Flying');
  }
}

class Penguin extends Bird {
  fly(): void {
    throw new Error('Penguins cannot fly!'); // нарушает контракт родителя
  }
}

function makeBirdFly(bird: Bird): void {
  bird.fly(); // может выбросить ошибку для Penguin
}

// ✅ Хорошо - следование LSP
interface Bird {
  move(): void;
}

interface FlyingBird extends Bird {
  fly(): void;
}

class Sparrow implements FlyingBird {
  move(): void {
    this.fly();
  }
  
  fly(): void {
    console.log('Sparrow is flying');
  }
}

class Penguin implements Bird {
  move(): void {
    this.swim();
  }
  
  swim(): void {
    console.log('Penguin is swimming');
  }
}

function moveBird(bird: Bird): void {
  bird.move(); // работает для всех Bird
}

function makeFly(bird: FlyingBird): void {
  bird.fly(); // работает только для летающих птиц
}

// Использование
const sparrow = new Sparrow();
const penguin = new Penguin();

moveBird(sparrow); // ОК
moveBird(penguin); // ОК
makeFly(sparrow);  // ОК
// makeFly(penguin); // Ошибка компиляции - правильно!
```

**Другой пример - прямоугольники:**

```typescript
// ❌ Плохо - классический пример нарушения LSP
class Rectangle {
  constructor(
    protected width: number,
    protected height: number
  ) {}
  
  setWidth(width: number): void {
    this.width = width;
  }
  
  setHeight(height: number): void {
    this.height = height;
  }
  
  getArea(): number {
    return this.width * this.height;
  }
}

class Square extends Rectangle {
  setWidth(width: number): void {
    this.width = width;
    this.height = width; // нарушает ожидания от Rectangle
  }
  
  setHeight(height: number): void {
    this.width = height;
    this.height = height; // нарушает ожидания от Rectangle
  }
}

function testRectangle(rect: Rectangle): void {
  rect.setWidth(5);
  rect.setHeight(4);
  console.log(rect.getArea()); // Ожидается 20, но для Square будет 16
}

// ✅ Хорошо - правильная иерархия
interface Shape {
  getArea(): number;
}

class Rectangle implements Shape {
  constructor(
    private width: number,
    private height: number
  ) {}
  
  getArea(): number {
    return this.width * this.height;
  }
}

class Square implements Shape {
  constructor(private side: number) {}
  
  getArea(): number {
    return this.side ** 2;
  }
}
```

### 4.4 Interface Segregation Principle (ISP)

**Принцип разделения интерфейса**: клиенты не должны зависеть от интерфейсов, которые они не используют.

```typescript
// ❌ Плохо - "жирный" интерфейс
interface Worker {
  work(): void;
  eat(): void;
  sleep(): void;
}

class HumanWorker implements Worker {
  work(): void {
    console.log('Human working');
  }
  
  eat(): void {
    console.log('Human eating');
  }
  
  sleep(): void {
    console.log('Human sleeping');
  }
}

class RobotWorker implements Worker {
  work(): void {
    console.log('Robot working');
  }
  
  eat(): void {
    // Роботы не едят, но вынуждены реализовать метод
    throw new Error('Robots do not eat');
  }
  
  sleep(): void {
    // Роботы не спят, но вынуждены реализовать метод
    throw new Error('Robots do not sleep');
  }
}

// ✅ Хорошо - разделенные интерфейсы
interface Workable {
  work(): void;
}

interface Eatable {
  eat(): void;
}

interface Sleepable {
  sleep(): void;
}

class HumanWorker implements Workable, Eatable, Sleepable {
  work(): void {
    console.log('Human working');
  }
  
  eat(): void {
    console.log('Human eating');
  }
  
  sleep(): void {
    console.log('Human sleeping');
  }
}

class RobotWorker implements Workable {
  work(): void {
    console.log('Robot working');
  }
  // Не нужно реализовывать eat() и sleep()
}

// Функции работают с конкретными интерфейсами
function makeWork(worker: Workable): void {
  worker.work();
}

function provideLunch(worker: Eatable): void {
  worker.eat();
}

const human = new HumanWorker();
const robot = new RobotWorker();

makeWork(human);    // ОК
makeWork(robot);    // ОК
provideLunch(human); // ОК
// provideLunch(robot); // Ошибка компиляции - правильно!
```

**Другой пример - принтеры:**

```typescript
// ❌ Плохо
interface Printer {
  print(): void;
  scan(): void;
  fax(): void;
}

class SimplePrinter implements Printer {
  print(): void {
    console.log('Printing');
  }
  
  scan(): void {
    throw new Error('Not supported');
  }
  
  fax(): void {
    throw new Error('Not supported');
  }
}

// ✅ Хорошо
interface Printable {
  print(): void;
}

interface Scannable {
  scan(): void;
}

interface Faxable {
  fax(): void;
}

class SimplePrinter implements Printable {
  print(): void {
    console.log('Printing');
  }
}

class MultiFunctionPrinter implements Printable, Scannable, Faxable {
  print(): void {
    console.log('Printing');
  }
  
  scan(): void {
    console.log('Scanning');
  }
  
  fax(): void {
    console.log('Faxing');
  }
}
```

### 4.5 Dependency Inversion Principle (DIP)

**Принцип инверсии зависимостей**: модули верхнего уровня не должны зависеть от модулей нижнего уровня. Оба должны зависеть от абстракций.

```typescript
// ❌ Плохо - зависимость от конкретной реализации
class MySQLDatabase {
  save(data: string): void {
    console.log('Saving to MySQL:', data);
  }
}

class UserService {
  private database: MySQLDatabase;
  
  constructor() {
    this.database = new MySQLDatabase(); // жесткая зависимость
  }
  
  saveUser(user: string): void {
    this.database.save(user);
  }
}

// ✅ Хорошо - зависимость от абстракции
interface Database {
  save(data: string): void;
  find(id: string): string | null;
}

class MySQLDatabase implements Database {
  save(data: string): void {
    console.log('Saving to MySQL:', data);
  }
  
  find(id: string): string | null {
    console.log('Finding in MySQL:', id);
    return null;
  }
}

class PostgreSQLDatabase implements Database {
  save(data: string): void {
    console.log('Saving to PostgreSQL:', data);
  }
  
  find(id: string): string | null {
    console.log('Finding in PostgreSQL:', id);
    return null;
  }
}

class MongoDBDatabase implements Database {
  save(data: string): void {
    console.log('Saving to MongoDB:', data);
  }
  
  find(id: string): string | null {
    console.log('Finding in MongoDB:', id);
    return null;
  }
}

class UserService {
  constructor(private database: Database) {} // зависимость от абстракции
  
  saveUser(user: string): void {
    this.database.save(user);
  }
  
  findUser(id: string): string | null {
    return this.database.find(id);
  }
}

// Использование - легко переключаться между реализациями
const mysqlService = new UserService(new MySQLDatabase());
const postgresService = new UserService(new PostgreSQLDatabase());
const mongoService = new UserService(new MongoDBDatabase());

mysqlService.saveUser('John');
postgresService.saveUser('Jane');
```

**Полный пример с DIP:**

```typescript
// Абстракции
interface Logger {
  log(message: string): void;
}

interface EmailService {
  send(to: string, subject: string, body: string): void;
}

interface UserRepository {
  save(user: User): void;
  findById(id: number): User | null;
}

// Реализации
class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }
}

class FileLogger implements Logger {
  log(message: string): void {
    console.log(`[FILE LOG] ${message}`);
  }
}

class SMTPEmailService implements EmailService {
  send(to: string, subject: string, body: string): void {
    console.log(`Sending email to ${to}`);
  }
}

class DatabaseUserRepository implements UserRepository {
  save(user: User): void {
    console.log('Saving user to database');
  }
  
  findById(id: number): User | null {
    return null;
  }
}

// Высокоуровневый модуль зависит только от абстракций
class UserRegistrationService {
  constructor(
    private repository: UserRepository,
    private emailService: EmailService,
    private logger: Logger
  ) {}
  
  registerUser(user: User): void {
    this.logger.log(`Registering user: ${user.email}`);
    
    this.repository.save(user);
    
    this.emailService.send(
      user.email,
      'Welcome',
      'Thank you for registering'
    );
    
    this.logger.log(`User registered: ${user.email}`);
  }
}

// Dependency Injection - собираем зависимости
const logger = new ConsoleLogger();
const emailService = new SMTPEmailService();
const repository = new DatabaseUserRepository();

const registrationService = new UserRegistrationService(
  repository,
  emailService,
  logger
);

// Для тестирования легко подменить реализации
class MockRepository implements UserRepository {
  users: User[] = [];
  
  save(user: User): void {
    this.users.push(user);
  }
  
  findById(id: number): User | null {
    return this.users.find(u => u.id === id) || null;
  }
}

const testService = new UserRegistrationService(
  new MockRepository(),
  new SMTPEmailService(),
  new ConsoleLogger()
);
```

## 5. Паттерны проектирования в TypeScript

### 5.1 Creational Patterns - Порождающие паттерны

#### Singleton

```typescript
class Singleton {
  private static instance: Singleton;
  private constructor() {
    // Приватный конструктор предотвращает создание экземпляров извне
  }
  
  public static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }
  
  public someMethod(): void {
    console.log('Singleton method');
  }
}

// Использование
const instance1 = Singleton.getInstance();
const instance2 = Singleton.getInstance();

console.log(instance1 === instance2); // true

// Практический пример - Database Connection
class DatabaseConnection {
  private static instance: DatabaseConnection;
  private connection: any;
  
  private constructor() {
    // Инициализация подключения
    this.connection = this.createConnection();
  }
  
  private createConnection(): any {
    console.log('Creating database connection');
    return { connected: true };
  }
  
  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }
  
  public query(sql: string): void {
    console.log('Executing query:', sql);
  }
}

const db1 = DatabaseConnection.getInstance();
const db2 = DatabaseConnection.getInstance();
console.log(db1 === db2); // true
```

#### Factory Method

```typescript
// Интерфейс продукта
interface Animal {
  speak(): void;
  move(): void;
}

// Конкретные продукты
class Dog implements Animal {
  speak(): void {
    console.log('Woof!');
  }
  
  move(): void {
    console.log('Dog is running');
  }
}

class Cat implements Animal {
  speak(): void {
    console.log('Meow!');
  }
  
  move(): void {
    console.log('Cat is walking');
  }
}

// Абстрактный создатель
abstract class AnimalFactory {
  abstract createAnimal(): Animal;
  
  public makeAnimalSpeak(): void {
    const animal = this.createAnimal();
    animal.speak();
  }
}

// Конкретные создатели
class DogFactory extends AnimalFactory {
  createAnimal(): Animal {
    return new Dog();
  }
}

class CatFactory extends AnimalFactory {
  createAnimal(): Animal {
    return new Cat();
  }
}

// Использование
function clientCode(factory: AnimalFactory): void {
  factory.makeAnimalSpeak();
}

clientCode(new DogFactory()); // "Woof!"
clientCode(new CatFactory());  // "Meow!"
```

#### Abstract Factory

```typescript
// Абстрактные продукты
interface Button {
  render(): void;
  onClick(): void;
}

interface Checkbox {
  render(): void;
  toggle(): void;
}

// Конкретные продукты для Windows
class WindowsButton implements Button {
  render(): void {
    console.log('Rendering Windows button');
  }
  
  onClick(): void {
    console.log('Windows button clicked');
  }
}

class WindowsCheckbox implements Checkbox {
  render(): void {
    console.log('Rendering Windows checkbox');
  }
  
  toggle(): void {
    console.log('Windows checkbox toggled');
  }
}

// Конкретные продукты для MacOS
class MacOSButton implements Button {
  render(): void {
    console.log('Rendering MacOS button');
  }
  
  onClick(): void {
    console.log('MacOS button clicked');
  }
}

class MacOSCheckbox implements Checkbox {
  render(): void {
    console.log('Rendering MacOS checkbox');
  }
  
  toggle(): void {
    console.log('MacOS checkbox toggled');
  }
}

// Абстрактная фабрика
interface GUIFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
}

// Конкретные фабрики
class WindowsFactory implements GUIFactory {
  createButton(): Button {
    return new WindowsButton();
  }
  
  createCheckbox(): Checkbox {
    return new WindowsCheckbox();
  }
}

class MacOSFactory implements GUIFactory {
  createButton(): Button {
    return new MacOSButton();
  }
  
  createCheckbox(): Checkbox {
    return new MacOSCheckbox();
  }
}

// Клиентский код
class Application {
  private button: Button;
  private checkbox: Checkbox;
  
  constructor(factory: GUIFactory) {
    this.button = factory.createButton();
    this.checkbox = factory.createCheckbox();
  }
  
  render(): void {
    this.button.render();
    this.checkbox.render();
  }
}

// Использование
const os = 'Windows'; // или 'MacOS'
let factory: GUIFactory;

if (os === 'Windows') {
  factory = new WindowsFactory();
} else {
  factory = new MacOSFactory();
}

const app = new Application(factory);
app.render();
```

#### Builder

```typescript
// Продукт
class House {
  public walls?: string;
  public doors?: number;
  public windows?: number;
  public roof?: string;
  public garage?: boolean;
  public garden?: boolean;
  
  public toString(): string {
    return `House with ${this.walls} walls, ${this.doors} doors, 
            ${this.windows} windows, ${this.roof} roof, 
            ${this.garage ? 'with' : 'without'} garage, 
            ${this.garden ? 'with' : 'without'} garden`;
  }
}

// Builder interface
interface HouseBuilder {
  reset(): void;
  setWalls(walls: string): this;
  setDoors(doors: number): this;
  setWindows(windows: number): this;
  setRoof(roof: string): this;
  setGarage(garage: boolean): this;
  setGarden(garden: boolean): this;
  getResult(): House;
}

// Concrete Builder
class ConcreteHouseBuilder implements HouseBuilder {
  private house: House;
  
  constructor() {
    this.house = new House();
  }
  
  reset(): void {
    this.house = new House();
  }
  
  setWalls(walls: string): this {
    this.house.walls = walls;
    return this;
  }
  
  setDoors(doors: number): this {
    this.house.doors = doors;
    return this;
  }
  
  setWindows(windows: number): this {
    this.house.windows = windows;
    return this;
  }
  
  setRoof(roof: string): this {
    this.house.roof = roof;
    return this;
  }
  
  setGarage(garage: boolean): this {
    this.house.garage = garage;
    return this;
  }
  
  setGarden(garden: boolean): this {
    this.house.garden = garden;
    return this;
  }
  
  getResult(): House {
    const result = this.house;
    this.reset();
    return result;
  }
}

// Director (опционально)
class HouseDirector {
  private builder: HouseBuilder;
  
  constructor(builder: HouseBuilder) {
    this.builder = builder;
  }
  
  buildMinimalHouse(): House {
    return this.builder
      .setWalls('brick')
      .setDoors(1)
      .setWindows(2)
      .setRoof('flat')
      .getResult();
  }
  
  buildLuxuryHouse(): House {
    return this.builder
      .setWalls('marble')
      .setDoors(4)
      .setWindows(10)
      .setRoof('dome')
      .setGarage(true)
      .setGarden(true)
      .getResult();
  }
}

// Использование
const builder = new ConcreteHouseBuilder();

// Без директора
const house1 = builder
  .setWalls('brick')
  .setDoors(2)
  .setWindows(4)
  .setRoof('flat')
  .getResult();

console.log(house1.toString());

// С директором
const director = new HouseDirector(builder);
const minimalHouse = director.buildMinimalHouse();
const luxuryHouse = director.buildLuxuryHouse();

console.log(minimalHouse.toString());
console.log(luxuryHouse.toString());
```

#### Prototype

```typescript
// Prototype interface
interface Prototype {
  clone(): this;
}

// Concrete Prototype
class Person implements Prototype {
  constructor(
    public name: string,
    public age: number,
    public address: Address
  ) {}
  
  clone(): this {
    // Глубокое клонирование
    const clonedAddress = new Address(
      this.address.street,
      this.address.city,
      this.address.country
    );
    
    return new Person(
      this.name,
      this.age,
      clonedAddress
    ) as this;
  }
}

class Address {
  constructor(
    public street: string,
    public city: string,
    public country: string
  ) {}
}

// Использование
const original = new Person(
  'John',
  30,
  new Address('Main St', 'New York', 'USA')
);

const clone = original.clone();
clone.name = 'Jane';
clone.address.city = 'Los Angeles';

console.log(original.name); // "John"
console.log(original.address.city); // "New York" (не изменился)
console.log(clone.name); // "Jane"
console.log(clone.address.city); // "Los Angeles"
```

### 5.2 Structural Patterns - Структурные паттерны

#### Adapter

```typescript
// Существующий интерфейс
interface MediaPlayer {
  play(filename: string): void;
}

// Новый несовместимый интерфейс
class AdvancedMediaPlayer {
  playMp4(filename: string): void {
    console.log(`Playing mp4: ${filename}`);
  }
  
  playVlc(filename: string): void {
    console.log(`Playing vlc: ${filename}`);
  }
}

// Adapter
class MediaAdapter implements MediaPlayer {
  private advancedPlayer: AdvancedMediaPlayer;
  
  constructor(private audioType: string) {
    this.advancedPlayer = new AdvancedMediaPlayer();
  }
  
  play(filename: string): void {
    if (this.audioType === 'mp4') {
      this.advancedPlayer.playMp4(filename);
    } else if (this.audioType === 'vlc') {
      this.advancedPlayer.playVlc(filename);
    }
  }
}

// Основной класс
class AudioPlayer implements MediaPlayer {
  play(filename: string): void {
    const extension = filename.split('.').pop();
    
    if (extension === 'mp3') {
      console.log(`Playing mp3: ${filename}`);
    } else if (extension === 'mp4' || extension === 'vlc') {
      const adapter = new MediaAdapter(extension);
      adapter.play(filename);
    } else {
      console.log(`Invalid format: ${extension}`);
    }
  }
}

// Использование
const player = new AudioPlayer();
player.play('song.mp3');
player.play('video.mp4');
player.play('movie.vlc');
```

#### Decorator

```typescript
// Component interface
interface Coffee {
  cost(): number;
  description(): string;
}

// Concrete Component
class SimpleCoffee implements Coffee {
  cost(): number {
    return 10;
  }
  
  description(): string {
    return 'Simple coffee';
  }
}

// Base Decorator
abstract class CoffeeDecorator implements Coffee {
  constructor(protected coffee: Coffee) {}
  
  abstract cost(): number;
  abstract description(): string;
}

// Concrete Decorators
class MilkDecorator extends CoffeeDecorator {
  cost(): number {
    return this.coffee.cost() + 2;
  }
  
  description(): string {
    return `${this.coffee.description()}, milk`;
  }
}

class SugarDecorator extends CoffeeDecorator {
  cost(): number {
    return this.coffee.cost() + 1;
  }
  
  description(): string {
    return `${this.coffee.description()}, sugar`;
  }
}

class WhipCreamDecorator extends CoffeeDecorator {
  cost(): number {
    return this.coffee.cost() + 3;
  }
  
  description(): string {
    return `${this.coffee.description()}, whip cream`;
  }
}

// Использование
let coffee: Coffee = new SimpleCoffee();
console.log(`${coffee.description()} - ${coffee.cost()}`);

coffee = new MilkDecorator(coffee);
console.log(`${coffee.description()} - ${coffee.cost()}`);

coffee = new SugarDecorator(coffee);
console.log(`${coffee.description()} - ${coffee.cost()}`);

coffee = new WhipCreamDecorator(coffee);
console.log(`${coffee.description()} - ${coffee.cost()}`);
// "Simple coffee, milk, sugar, whip cream - $16"
```

#### Facade

```typescript
// Сложная подсистема
class CPU {
  freeze(): void {
    console.log('CPU: Freezing');
  }
  
  jump(position: number): void {
    console.log(`CPU: Jumping to ${position}`);
  }
  
  execute(): void {
    console.log('CPU: Executing');
  }
}

class Memory {
  load(position: number, data: string): void {
    console.log(`Memory: Loading ${data} at ${position}`);
  }
}

class HardDrive {
  read(sector: number, size: number): string {
    console.log(`HardDrive: Reading sector ${sector}, size ${size}`);
    return 'boot data';
  }
}

// Facade
class ComputerFacade {
  private cpu: CPU;
  private memory: Memory;
  private hardDrive: HardDrive;
  
  constructor() {
    this.cpu = new CPU();
    this.memory = new Memory();
    this.hardDrive = new HardDrive();
  }
  
  start(): void {
    console.log('Computer: Starting...');
    this.cpu.freeze();
    const bootData = this.hardDrive.read(0, 1024);
    this.memory.load(0, bootData);
    this.cpu.jump(0);
    this.cpu.execute();
    console.log('Computer: Started');
  }
}

// Использование
const computer = new ComputerFacade();
computer.start(); //# ООП в TypeScript - Полная методичка для собеседования

## 6. Продвинутые концепции ООП

### 6.1 Композиция vs Наследование
````typescript
// ❌ Проблема с наследованием - жесткая иерархия
class Animal {
  eat() { console.log('Eating'); }
}

class FlyingAnimal extends Animal {
  fly() { console.log('Flying'); }
}

class SwimmingAnimal extends Animal {
  swim() { console.log('Swimming'); }
}

// Утка летает И плавает - как реализовать?
// Множественное наследование невозможно

// ✅ Решение - композиция
interface Eater {
  eat(): void;
}

interface Flyer {
  fly(): void;
}

interface Swimmer {
  swim(): void;
}

class EatingBehavior implements Eater {
  eat() {
    console.log('Eating');
  }
}

class FlyingBehavior implements Flyer {
  fly() {
    console.log('Flying');
  }
}

class SwimmingBehavior implements Swimmer {
  swim() {
    console.log('Swimming');
  }
}

class Duck {
  private eater: Eater;
  private flyer: Flyer;
  private swimmer: Swimmer;
  
  constructor() {
    this.eater = new EatingBehavior();
    this.flyer = new FlyingBehavior();
    this.swimmer = new SwimmingBehavior();
  }
  
  eat() { this.eater.eat(); }
  fly() { this.flyer.fly(); }
  swim() { this.swimmer.swim(); }
}

const duck = new Duck();
duck.eat();
duck.fly();
duck.swim();
````

**Принцип: "Prefer composition over inheritance"**
````typescript
// Композиция с Dependency Injection
class Logger {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }
}

class Database {
  save(data: any): void {
    console.log('Saving to database');
  }
}

class EmailService {
  send(to: string, message: string): void {
    console.log(`Sending email to ${to}`);
  }
}

// Композиция через конструктор
class UserService {
  constructor(
    private logger: Logger,
    private database: Database,
    private emailService: EmailService
  ) {}
  
  createUser(user: any): void {
    this.logger.log('Creating user');
    this.database.save(user);
    this.emailService.send(user.email, 'Welcome!');
  }
}

const userService = new UserService(
  new Logger(),
  new Database(),
  new EmailService()
);
````

### 6.2 Тип-безопасность и Type Guards
````typescript
// Discriminated Unions
type Shape = Circle | Rectangle | Triangle;

interface Circle {
  kind: 'circle';
  radius: number;
}

interface Rectangle {
  kind: 'rectangle';
  width: number;
  height: number;
}

interface Triangle {
  kind: 'triangle';
  base: number;
  height: number;
}

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'rectangle':
      return shape.width * shape.height;
    case 'triangle':
      return (shape.base * shape.height) / 2;
  }
}

// Type Predicates
function isCircle(shape: Shape): shape is Circle {
  return shape.kind === 'circle';
}

function isRectangle(shape: Shape): shape is Rectangle {
  return shape.kind === 'rectangle';
}

// Использование
const shape: Shape = { kind: 'circle', radius: 5 };

if (isCircle(shape)) {
  console.log(shape.radius); // TypeScript знает, что это Circle
}
````

### 6.3 Иммутабельность в ООП
````typescript
// Иммутабельный класс
class ImmutablePoint {
  constructor(
    public readonly x: number,
    public readonly y: number
  ) {}
  
  // Методы возвращают новые экземпляры
  move(dx: number, dy: number): ImmutablePoint {
    return new ImmutablePoint(this.x + dx, this.y + dy);
  }
  
  scale(factor: number): ImmutablePoint {
    return new ImmutablePoint(this.x * factor, this.y * factor);
  }
}

const p1 = new ImmutablePoint(10, 20);
const p2 = p1.move(5, 5);

console.log(p1); // { x: 10, y: 20 } - не изменился
console.log(p2); // { x: 15, y: 25 } - новый объект

// Иммутабельный класс с приватными полями
class ImmutableUser {
  private readonly _name: string;
  private readonly _email: string;
  private readonly _age: number;
  
  constructor(name: string, email: string, age: number) {
    this._name = name;
    this._email = email;
    this._age = age;
  }
  
  get name(): string { return this._name; }
  get email(): string { return this._email; }
  get age(): number { return this._age; }
  
  withName(name: string): ImmutableUser {
    return new ImmutableUser(name, this._email, this._age);
  }
  
  withEmail(email: string): ImmutableUser {
    return new ImmutableUser(this._name, email, this._age);
  }
  
  withAge(age: number): ImmutableUser {
    return new ImmutableUser(this._name, this._email, age);
  }
}
````

### 6.4 Ковариантность и контравариантность
````typescript
// Ковариантность (covariance)
class Animal {
  name: string = 'Animal';
}

class Dog extends Animal {
  breed: string = 'Labrador';
}

class Cat extends Animal {
  meow() { console.log('Meow'); }
}

// Ковариантность в возвращаемых типах
interface AnimalFactory {
  create(): Animal;
}

class DogFactory implements AnimalFactory {
  create(): Dog { // Dog более специфичен чем Animal - ОК
    return new Dog();
  }
}

// Контравариантность в параметрах функций
type AnimalHandler = (animal: Animal) => void;
type DogHandler = (dog: Dog) => void;

const handleAnimal: AnimalHandler = (animal) => {
  console.log(animal.name);
};

const handleDog: DogHandler = handleAnimal; // ОК - контравариантность

// Generic с constraints
class Box<T extends Animal> {
  constructor(private content: T) {}
  
  getContent(): T {
    return this.content;
  }
}

const dogBox = new Box(new Dog());
const catBox = new Box(new Cat());

// Биварiantность (избегать)
interface Comparer<T> {
  compare(a: T, b: T): number;
}

class AnimalComparer implements Comparer<Animal> {
  compare(a: Animal, b: Animal): number {
    return a.name.localeCompare(b.name);
  }
}

// В strictFunctionTypes: false это работает (биварiantность)
// В strictFunctionTypes: true - ошибка (контравариантность)
const dogComparer: Comparer<Dog> = new AnimalComparer();
````

## 7. Практические примеры и задачи

### 7.1 Система управления пользователями
````typescript
// Entities
class User {
  constructor(
    public readonly id: number,
    public name: string,
    public email: string,
    private password: string
  ) {}
  
  verifyPassword(password: string): boolean {
    return this.password === password; // упрощенно
  }
  
  changePassword(oldPassword: string, newPassword: string): boolean {
    if (this.verifyPassword(oldPassword)) {
      this.password = newPassword;
      return true;
    }
    return false;
  }
}

// Repository interface
interface IUserRepository {
  save(user: User): Promise<void>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  delete(id: number): Promise<void>;
}

// Repository implementation
class UserRepository implements IUserRepository {
  private users: Map<number, User> = new Map();
  
  async save(user: User): Promise<void> {
    this.users.set(user.id, user);
  }
  
  async findById(id: number): Promise<User | null> {
    return this.users.get(id) || null;
  }
  
  async findByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }
  
  async delete(id: number): Promise<void> {
    this.users.delete(id);
  }
}

// Service
class UserService {
  constructor(
    private repository: IUserRepository,
    private emailService: IEmailService,
    private logger: ILogger
  ) {}
  
  async registerUser(
    name: string,
    email: string,
    password: string
  ): Promise<User> {
    this.logger.log(`Registering user: ${email}`);
    
    // Проверка на существование
    const existing = await this.repository.findByEmail(email);
    if (existing) {
      throw new Error('User already exists');
    }
    
    // Создание пользователя
    const user = new User(Date.now(), name, email, password);
    await this.repository.save(user);
    
    // Отправка приветственного письма
    await this.emailService.send(
      email,
      'Welcome!',
      `Hello ${name}, welcome to our service!`
    );
    
    this.logger.log(`User registered: ${email}`);
    return user;
  }
  
  async loginUser(email: string, password: string): Promise<User> {
    const user = await this.repository.findByEmail(email);
    
    if (!user || !user.verifyPassword(password)) {
      throw new Error('Invalid credentials');
    }
    
    this.logger.log(`User logged in: ${email}`);
    return user;
  }
}

// Interfaces for dependencies
interface IEmailService {
  send(to: string, subject: string, body: string): Promise<void>;
}

interface ILogger {
  log(message: string): void;
}
````

### 7.2 E-commerce система
````typescript
// Value Objects
class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: string = 'USD'
  ) {
    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }
  }
  
  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add different currencies');
    }
    return new Money(this.amount + other.amount, this.currency);
  }
  
  multiply(factor: number): Money {
    return new Money(this.amount * factor, this.currency);
  }
  
  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }
}

// Entities
class Product {
  constructor(
    public readonly id: number,
    public name: string,
    public price: Money,
    public stock: number
  ) {}
  
  decreaseStock(quantity: number): void {
    if (quantity > this.stock) {
      throw new Error('Insufficient stock');
    }
    this.stock -= quantity;
  }
  
  increaseStock(quantity: number): void {
    this.stock += quantity;
  }
}

class CartItem {
  constructor(
    public readonly product: Product,
    public quantity: number
  ) {}
  
  getTotalPrice(): Money {
    return this.product.price.multiply(this.quantity);
  }
}

class ShoppingCart {
  private items: CartItem[] = [];
  
  addItem(product: Product, quantity: number): void {
    const existing = this.items.find(item => item.product.id === product.id);
    
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push(new CartItem(product, quantity));
    }
  }
  
  removeItem(productId: number): void {
    this.items = this.items.filter(item => item.product.id !== productId);
  }
  
  getTotal(): Money {
    return this.items.reduce(
      (total, item) => total.add(item.getTotalPrice()),
      new Money(0)
    );
  }
  
  getItems(): CartItem[] {
    return [...this.items];
  }
  
  clear(): void {
    this.items = [];
  }
}

class Order {
  constructor(
    public readonly id: number,
    public readonly items: CartItem[],
    public readonly total: Money,
    public status: OrderStatus = 'pending'
  ) {}
  
  confirm(): void {
    if (this.status !== 'pending') {
      throw new Error('Order can only be confirmed when pending');
    }
    this.status = 'confirmed';
  }
  
  ship(): void {
    if (this.status !== 'confirmed') {
      throw new Error('Order must be confirmed before shipping');
    }
    this.status = 'shipped';
  }
  
  deliver(): void {
    if (this.status !== 'shipped') {
      throw new Error('Order must be shipped before delivery');
    }
    this.status = 'delivered';
  }
  
  cancel(): void {
    if (this.status === 'delivered') {
      throw new Error('Cannot cancel delivered order');
    }
    this.status = 'cancelled';
  }
}

type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

// Service
class OrderService {
  constructor(
    private orderRepository: IOrderRepository,
    private productRepository: IProductRepository,
    private paymentService: IPaymentService
  ) {}
  
  async createOrder(cart: ShoppingCart): Promise<Order> {
    // Проверить наличие товаров
    for (const item of cart.getItems()) {
      const product = await this.productRepository.findById(item.product.id);
      if (!product || product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${item.product.name}`);
      }
    }
    
    // Создать заказ
    const order = new Order(
      Date.now(),
      cart.getItems(),
      cart.getTotal()
    );
    
    // Обработать платеж
    const paymentSuccess = await this.paymentService.processPayment(
      order.total
    );
    
    if (!paymentSuccess) {
      throw new Error('Payment failed');
    }
    
    // Уменьшить количество товаров
    for (const item of cart.getItems()) {
      const product = await this.productRepository.findById(item.product.id);
      product!.decreaseStock(item.quantity);
      await this.productRepository.save(product!);
    }
    
    // Подтвердить заказ
    order.confirm();
    await this.orderRepository.save(order);
    
    // Очистить корзину
    cart.clear();
    
    return order;
  }
}

// Interfaces
interface IOrderRepository {
  save(order: Order): Promise<void>;
  findById(id: number): Promise<Order | null>;
}

interface IProductRepository {
  save(product: Product): Promise<void>;
  findById(id: number): Promise<Product | null>;
}

interface IPaymentService {
  processPayment(amount: Money): Promise<boolean>;
}
```