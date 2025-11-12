# CSS - Полная методичка для собеседования

## 1. Box Model - Блочная модель

### 1.1 Что такое Box Model?

**Box Model** - это способ представления элементов HTML в виде прямоугольных блоков.

```css
┌─────────────────────────────────────┐
│           MARGIN (прозрачный)       │
│  ┌──────────────────────────────┐  │
│  │     BORDER                   │  │
│  │  ┌───────────────────────┐  │  │
│  │  │   PADDING             │  │  │
│  │  │  ┌─────────────────┐ │  │  │
│  │  │  │   CONTENT       │ │  │  │
│  │  │  │   width/height  │ │  │  │
│  │  │  └─────────────────┘ │  │  │
│  │  └───────────────────────┘  │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

### 1.2 box-sizing

```css
/* content-box (по умолчанию) */
.box {
  width: 300px;
  padding: 20px;
  border: 5px solid black;
  /* Реальная ширина = 300 + 20*2 + 5*2 = 350px */
}

/* border-box (более интуитивно) */
.box {
  box-sizing: border-box;
  width: 300px;
  padding: 20px;
  border: 5px solid black;
  /* Реальная ширина = 300px (включая padding и border) */
}

/* Глобальный reset (best practice) */
* {
  box-sizing: border-box;
}
```

### 1.3 Margin Collapsing

**Margin Collapsing** - схлопывание вертикальных margins между соседними элементами.

```css
/* Пример схлопывания */
.block1 {
  margin-bottom: 30px;
}

.block2 {
  margin-top: 20px;
}
/* Расстояние между блоками = 30px, а не 50px! */

/* Схлопывание НЕ происходит:
   - с горизонтальными margins
   - если у родителя есть border/padding
   - если элемент float/absolute
   - с flex/grid элементами
*/

/* Предотвращение схлопывания */
.parent {
  padding: 1px; /* или border */
}

/* Или использовать padding вместо margin */
.block {
  padding-top: 20px;
  padding-bottom: 20px;
}
```

## 2. Display - Свойство отображения

### 2.1 Основные значения

```css
/* block - занимает всю ширину, начинается с новой строки */
.block {
  display: block;
  /* По умолчанию: div, p, h1-h6, section, article */
}

/* inline - занимает только необходимую ширину, в строке с другими */
.inline {
  display: inline;
  /* По умолчанию: span, a, strong, em */
  /* НЕ работают width, height, margin-top/bottom */
}

/* inline-block - комбинация inline и block */
.inline-block {
  display: inline-block;
  /* Можно задать width, height, но элемент в строке */
}

/* none - элемент полностью удаляется из потока */
.hidden {
  display: none;
  /* Не занимает место, не виден */
}

/* flex - создает flex контейнер */
.flex-container {
  display: flex;
}

/* grid - создает grid контейнер */
.grid-container {
  display: grid;
}

/* inline-flex и inline-grid */
.inline-flex {
  display: inline-flex; /* flex контейнер, но ведет себя как inline */
}
```

### 2.2 Разница между display: none и visibility: hidden

```css
/* display: none */
.display-none {
  display: none;
  /* - Элемент удаляется из потока документа
     - Не занимает место
     - Не доступен для screen readers
     - Не вызывает reflow при изменении */
}

/* visibility: hidden */
.visibility-hidden {
  visibility: hidden;
  /* - Элемент остается в потоке
     - Занимает место (невидимый)
     - Может быть доступен для screen readers
     - Вызывает reflow */
}

/* opacity: 0 */
.opacity-zero {
  opacity: 0;
  /* - Элемент остается в потоке
     - Занимает место
     - Может взаимодействовать (клики работают)
     - Анимируется */
}
```

## 3. Position - Позиционирование

### 3.1 Типы позиционирования

```css
/* static (по умолчанию) */
.static {
  position: static;
  /* Нормальный поток документа
     top, right, bottom, left НЕ работают */
}

/* relative - относительное */
.relative {
  position: relative;
  top: 10px;
  left: 20px;
  /* Смещается относительно своего нормального положения
     Оставляет "дырку" на старом месте
     Создает контекст для absolute детей */
}

/* absolute - абсолютное */
.absolute {
  position: absolute;
  top: 0;
  right: 0;
  /* Относительно ближайшего positioned родителя (не static)
     Удаляется из потока документа
     Не влияет на расположение других элементов */
}

/* fixed - фиксированное */
.fixed {
  position: fixed;
  top: 0;
  left: 0;
  /* Относительно viewport
     Остается на месте при скролле
     Удаляется из потока документа */
}

/* sticky - липкое */
.sticky {
  position: sticky;
  top: 0;
  /* Гибрид relative и fixed
     Ведет себя как relative до достижения порога
     Затем "прилипает" как fixed
     Остается в потоке документа */
}
```

### 3.2 Stacking Context и z-index

```css
/* z-index работает только с positioned элементами */
.layer1 {
  position: relative;
  z-index: 1;
}

.layer2 {
  position: relative;
  z-index: 2; /* Будет выше layer1 */
}

/* Stacking Context создается:
   - position: absolute/relative/fixed/sticky с z-index != auto
   - flex/grid элементы с z-index != auto
   - opacity < 1
   - transform, filter, perspective != none
   - will-change
*/

/* Пример проблемы со Stacking Context */
.parent {
  position: relative;
  z-index: 1;
}

.child {
  position: absolute;
  z-index: 999; /* Не может быть выше элемента вне .parent с z-index: 2 */
}
```

### 3.3 Центрирование элементов

```css
/* Горизонтальное центрирование block элемента */
.center-block {
  width: 300px;
  margin: 0 auto;
}

/* Центрирование с absolute */
.center-absolute {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Центрирование с flexbox (самый простой) */
.flex-center {
  display: flex;
  justify-content: center; /* горизонтально */
  align-items: center; /* вертикально */
}

/* Центрирование с grid */
.grid-center {
  display: grid;
  place-items: center; /* justify + align */
}

/* Вертикальное центрирование inline элемента */
.parent {
  line-height: 100px;
  height: 100px;
}

.child {
  display: inline-block;
  vertical-align: middle;
  line-height: normal;
}
```

## 4. Flexbox - Гибкая блочная модель

### 4.1 Flex Container свойства

```css
.container {
  display: flex; /* или inline-flex */
  
  /* flex-direction - направление главной оси */
  flex-direction: row; /* по умолчанию, слева направо */
  flex-direction: row-reverse; /* справа налево */
  flex-direction: column; /* сверху вниз */
  flex-direction: column-reverse; /* снизу вверх */
  
  /* flex-wrap - перенос элементов */
  flex-wrap: nowrap; /* по умолчанию, без переноса */
  flex-wrap: wrap; /* перенос на новую строку */
  flex-wrap: wrap-reverse; /* перенос в обратном порядке */
  
  /* flex-flow - сокращение для direction + wrap */
  flex-flow: row wrap;
  
  /* justify-content - выравнивание по главной оси */
  justify-content: flex-start; /* по умолчанию */
  justify-content: flex-end;
  justify-content: center;
  justify-content: space-between; /* равное пространство между */
  justify-content: space-around; /* равное пространство вокруг */
  justify-content: space-evenly; /* равное пространство везде */
  
  /* align-items - выравнивание по поперечной оси */
  align-items: stretch; /* по умолчанию, растягивает */
  align-items: flex-start;
  align-items: flex-end;
  align-items: center;
  align-items: baseline; /* по базовой линии текста */
  
  /* align-content - выравнивание строк (для многострочного) */
  align-content: stretch;
  align-content: flex-start;
  align-content: flex-end;
  align-content: center;
  align-content: space-between;
  align-content: space-around;
  
  /* gap - промежутки между элементами */
  gap: 20px; /* row-gap и column-gap */
  row-gap: 10px;
  column-gap: 20px;
}
```

### 4.2 Flex Item свойства

```css
.item {
  /* order - порядок элемента */
  order: 0; /* по умолчанию */
  order: 1; /* будет после элементов с order: 0 */
  order: -1; /* будет перед элементами с order: 0 */
  
  /* flex-grow - коэффициент роста */
  flex-grow: 0; /* по умолчанию, не растет */
  flex-grow: 1; /* растет пропорционально */
  flex-grow: 2; /* растет в 2 раза быстрее чем с flex-grow: 1 */
  
  /* flex-shrink - коэффициент сжатия */
  flex-shrink: 1; /* по умолчанию, сжимается */
  flex-shrink: 0; /* не сжимается */
  
  /* flex-basis - базовый размер */
  flex-basis: auto; /* по умолчанию */
  flex-basis: 200px; /* начальный размер */
  flex-basis: 0; /* игнорирует контент */
  
  /* flex - сокращение для grow shrink basis */
  flex: 1; /* = flex: 1 1 0% */
  flex: 0 0 auto; /* = не растет, не сжимается */
  flex: 2; /* = flex: 2 1 0% */
  
  /* align-self - индивидуальное выравнивание */
  align-self: auto; /* наследует от align-items */
  align-self: flex-start;
  align-self: flex-end;
  align-self: center;
  align-self: stretch;
}
```

### 4.3 Практические примеры Flexbox

```css
/* Навигация с равными промежутками */
.nav {
  display: flex;
  justify-content: space-between;
}

/* Карточки в ряд */
.cards {
  display: flex;
  gap: 20px;
}

.card {
  flex: 1; /* равная ширина */
  min-width: 250px; /* минимальная ширина */
}

/* Центрирование */
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

/* Sticky footer */
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header { /* фиксированная высота */ }
.main { flex: 1; } /* занимает всё доступное пространство */
.footer { /* фиксированная высота */ }

/* Holy Grail Layout */
.container {
  display: flex;
  min-height: 100vh;
}

.sidebar-left {
  flex: 0 0 200px;
}

.main {
  flex: 1;
}

.sidebar-right {
  flex: 0 0 200px;
}
```

## 5. Grid - Сеточная модель

### 5.1 Grid Container свойства

```css
.container {
  display: grid; /* или inline-grid */
  
  /* Определение колонок */
  grid-template-columns: 100px 200px 100px; /* 3 колонки фиксированной ширины */
  grid-template-columns: 1fr 2fr 1fr; /* пропорциональные колонки */
  grid-template-columns: repeat(3, 1fr); /* 3 равные колонки */
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* адаптивные */
  
  /* Определение строк */
  grid-template-rows: 100px 200px;
  grid-template-rows: repeat(3, 100px);
  grid-template-rows: auto 1fr auto; /* header, content, footer */
  
  /* Промежутки */
  gap: 20px; /* row-gap и column-gap */
  row-gap: 20px;
  column-gap: 30px;
  
  /* Выравнивание всех элементов */
  justify-items: start | end | center | stretch; /* по горизонтали */
  align-items: start | end | center | stretch; /* по вертикали */
  place-items: center; /* justify-items + align-items */
  
  /* Выравнивание грида в контейнере */
  justify-content: start | end | center | space-between | space-around | space-evenly;
  align-content: start | end | center | space-between | space-around | space-evenly;
  place-content: center; /* justify-content + align-content */
  
  /* Автоматические треки */
  grid-auto-rows: 100px; /* высота автоматически созданных строк */
  grid-auto-columns: 100px; /* ширина автоматически созданных колонок */
  grid-auto-flow: row | column | dense; /* направление автоматического размещения */
}
```

### 5.2 Grid Item свойства

```css
.item {
  /* Размещение по линиям */
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 2;
  
  /* Сокращенная запись */
  grid-column: 1 / 3; /* с 1 по 3 линию */
  grid-row: 1 / 2;
  
  /* Span - занять N ячеек */
  grid-column: span 2; /* занять 2 колонки */
  grid-row: span 3; /* занять 3 строки */
  
  /* Еще более короткая запись */
  grid-area: 1 / 1 / 2 / 3; /* row-start / col-start / row-end / col-end */
  
  /* Индивидуальное выравнивание */
  justify-self: start | end | center | stretch;
  align-self: start | end | center | stretch;
  place-self: center; /* justify-self + align-self */
}
```

### 5.3 Grid Template Areas

```css
/* Именованные области */
.container {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
  grid-template-columns: 200px 1fr 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 20px;
}

.header {
  grid-area: header;
}

.sidebar {
  grid-area: sidebar;
}

.main {
  grid-area: main;
}

.footer {
  grid-area: footer;
}

/* Пустые ячейки с точкой */
.container {
  grid-template-areas:
    "header header header"
    ". main sidebar"
    "footer footer footer";
}
```

### 5.4 Практические примеры Grid

```css
/* Простая сетка карточек */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

/* Сложный layout */
.layout {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header header"
    "nav content aside"
    "footer footer footer";
  min-height: 100vh;
  gap: 20px;
}

/* 12-колоночная сетка */
.container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 20px;
}

.col-6 {
  grid-column: span 6; /* половина ширины */
}

.col-4 {
  grid-column: span 4; /* треть ширины */
}

/* Masonry-подобная сетка */
.masonry {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-rows: 10px;
  gap: 10px;
}

.item {
  grid-row: span var(--row-span); /* высота в зависимости от контента */
}
```

## 6. Responsive Design - Адаптивный дизайн

### 6.1 Media Queries

```css
/* Базовые медиа-запросы */

/* Mobile First подход (рекомендуется) */
/* По умолчанию стили для мобильных */
.container {
  padding: 10px;
}

/* Планшеты */
@media (min-width: 768px) {
  .container {
    padding: 20px;
  }
}

/* Десктопы */
@media (min-width: 1024px) {
  .container {
    padding: 30px;
  }
}

/* Большие экраны */
@media (min-width: 1440px) {
  .container {
    padding: 40px;
  }
}

/* Desktop First подход */
/* По умолчанию стили для десктопа */
.container {
  padding: 40px;
}

@media (max-width: 1439px) {
  .container {
    padding: 30px;
  }
}

@media (max-width: 1023px) {
  .container {
    padding: 20px;
  }
}

@media (max-width: 767px) {
  .container {
    padding: 10px;
  }
}

/* Комбинированные условия */
@media (min-width: 768px) and (max-width: 1024px) {
  /* Только для планшетов */
}

@media (min-width: 768px) and (orientation: landscape) {
  /* Планшеты в альбомной ориентации */
}

/* Другие типы медиа-запросов */
@media (orientation: portrait) {
  /* Портретная ориентация */
}

@media (orientation: landscape) {
  /* Альбомная ориентация */
}

@media (prefers-color-scheme: dark) {
  /* Темная тема системы */
  body {
    background: #000;
    color: #fff;
  }
}

@media (prefers-reduced-motion: reduce) {
  /* Пользователь отключил анимации */
  * {
    animation: none !important;
    transition: none !important;
  }
}

@media (hover: hover) {
  /* Устройство поддерживает hover (не тач) */
  .button:hover {
    background: blue;
  }
}

@media print {
  /* Стили для печати */
  .no-print {
    display: none;
  }
}
```

### 6.2 Responsive Units

```css
/* Относительные единицы */

/* em - относительно font-size родителя */
.parent {
  font-size: 16px;
}

.child {
  font-size: 2em; /* = 32px */
  padding: 1em; /* = 32px */
}

/* rem - относительно font-size корневого элемента (html) */
html {
  font-size: 16px;
}

.element {
  font-size: 1.5rem; /* = 24px */
  margin: 2rem; /* = 32px */
}

/* % - процент от родителя */
.parent {
  width: 1000px;
}

.child {
  width: 50%; /* = 500px */
}

/* vw/vh - процент от viewport */
.full-screen {
  width: 100vw; /* 100% ширины viewport */
  height: 100vh; /* 100% высоты viewport */
}

.half-screen {
  width: 50vw;
  height: 50vh;
}

/* vmin/vmax - минимальное/максимальное из vw/vh */
.square {
  width: 50vmin; /* 50% от меньшей стороны viewport */
  height: 50vmin;
}

/* ch - ширина символа "0" в текущем шрифте */
.mono-text {
  width: 80ch; /* оптимально для чтения */
}

/* Практические примеры */
html {
  font-size: 16px; /* базовый размер */
}

@media (min-width: 768px) {
  html {
    font-size: 18px;
  }
}

@media (min-width: 1024px) {
  html {
    font-size: 20px;
  }
}

/* Теперь все rem масштабируются автоматически */
h1 {
  font-size: 2rem; /* 32px на мобильных, 40px на десктопе */
}

.container {
  max-width: 1200px;
  width: 90%; /* адаптивная ширина */
  margin: 0 auto;
}
```

### 6.3 Clamp, Min, Max functions

```css
/* clamp(min, preferred, max) */
.element {
  /* Размер шрифта от 16px до 32px, предпочтительно 5% viewport */
  font-size: clamp(16px, 5vw, 32px);
  
  /* Адаптивная ширина */
  width: clamp(300px, 50%, 800px);
  
  /* Адаптивный padding */
  padding: clamp(1rem, 5%, 3rem);
}

/* min() - минимальное из значений */
.element {
  width: min(100%, 1200px); /* не больше 1200px */
  padding: min(5%, 50px); /* не больше 50px */
}

/* max() - максимальное из значений */
.element {
  width: max(300px, 50%); /* не меньше 300px */
  font-size: max(16px, 1rem); /* не меньше 16px */
}

/* Комбинирование */
.container {
  width: min(90%, 1200px);
  padding: clamp(1rem, 3vw, 3rem);
  margin: 0 auto;
}

.fluid-text {
  font-size: clamp(1rem, 2vw + 1rem, 3rem);
  line-height: 1.5;
}
```

## 7. Селекторы CSS

### 7.1 Базовые селекторы

```css
/* Селектор тега */
div { }
p { }

/* Селектор класса */
.classname { }
.class-name { }

/* Селектор ID */
#id-name { }

/* Универсальный селектор */
* {
  box-sizing: border-box;
}

/* Группировка селекторов */
h1, h2, h3 {
  font-family: Arial;
}
```

### 7.2 Комбинаторы

```css
/* Потомок (descendant) - через пробел */
.parent .child {
  /* любой .child внутри .parent */
}

/* Прямой потомок (child) - через > */
.parent > .child {
  /* только прямой .child */
}

/* Соседний элемент (adjacent sibling) - через + */
h1 + p {
  /* первый p сразу после h1 */
}

/* Все следующие соседи (general sibling) - через ~ */
h1 ~ p {
  /* все p после h1 на том же уровне */
}

/* Примеры */
nav ul li {
  /* все li внутри ul внутри nav */
}

.sidebar > .widget {
  /* только прямые .widget дети .sidebar */
}

.alert + .message {
  /* .message сразу после .alert */
}

h2 ~ p {
  /* все p-параграфы после h2 */
}
```

### 7.3 Псевдоклассы

```css
/* Состояния ссылок */
a:link { } /* непосещенная ссылка */
a:visited { } /* посещенная ссылка */
a:hover { } /* при наведении */
a:active { } /* при клике */
a:focus { } /* при фокусе */

/* ВАЖНО: порядок имеет значение! LVHA (LoVe HAte) */
a:link { color: blue; }
a:visited { color: purple; }
a:hover { color: red; }
a:active { color: orange; }

/* Структурные псевдоклассы */
li:first-child { } /* первый потомок */
li:last-child { } /* последний потомок */
li:nth-child(2) { } /* второй потомок */
li:nth-child(odd) { } /* нечетные: 1, 3, 5... */
li:nth-child(even) { } /* четные: 2, 4, 6... */
li:nth-child(3n) { } /* каждый 3-й: 3, 6, 9... */
li:nth-child(3n+1) { } /* 1, 4, 7, 10... */

li:first-of-type { } /* первый такого типа */
li:last-of-type { } /* последний такого типа */
li:nth-of-type(2) { } /* второй такого типа */

li:only-child { } /* единственный потомок */
li:only-of-type { } /* единственный такого типа */

:empty { } /* элемент без детей */
:not(.class) { } /* НЕ имеет класс */

/* Состояния форм */
input:focus { } /* в фокусе */
input:disabled { } /* отключен */
input:enabled { } /* включен */
input:checked { } /* отмечен (checkbox/radio) */
input:required { } /* обязательное поле */
input:optional { } /* необязательное поле */
input:valid { } /* валидное значение */
input:invalid { } /* невалидное значение */
input:in-range { } /* значение в допустимом диапазоне */
input:out-of-range { } /* значение вне диапазона */

/* Другие полезные */
:root { } /* корневой элемент (html) */
:target { } /* элемент, на который указывает якорь в URL */
:lang(en) { } /* элемент с указанным языком */
```

### 7.4 Псевдоэлементы

```css
/* ::before и ::after */
.element::before {
  content: "★ ";
  color: gold;
}

.element::after {
  content: " ★";
  color: gold;
}

/* ::first-line и ::first-letter */
p::first-line {
  font-weight: bold;
}

p::first-letter {
  font-size: 2em;
  float: left;
}

/* ::selection */
::selection {
  background: yellow;
  color: black;
}

/* ::placeholder */
input::placeholder {
  color: #999;
  font-style: italic;
}

/* ::marker */
li::marker {
  color: red;
  font-size: 1.5em;
}

/* Практические примеры */

/* Clearfix */
.clearfix::after {
  content: "";
  display: table;
  clear: both;
}

## 13. Performance оптимизация CSS

### 13.1 CSS Performance Tips

```css
/* ❌ Плохо - медленные селекторы */
* { }
[type="text"] { }
.parent * { }
div > div > div > p { }

/* ✅ Хорошо - быстрые селекторы */
.text { }
#header { }
.nav-item { }

/* ❌ Плохо - дорогие свойства */
.element {
  box-shadow: 0 0 50px rgba(0,0,0,0.5);
  filter: blur(10px);
  opacity: 0.5;
}

/* ✅ Хорошо - оптимизация */
.element {
  /* Используйте will-change для анимируемых свойств */
  will-change: transform, opacity;
  
  /* Используйте transform вместо left/top */
  transform: translateX(100px); /* GPU ускорение */
  /* вместо left: 100px; */
  
  /* Используйте opacity вместо visibility */
  opacity: 0; /* GPU ускорение */
}

/* ❌ Плохо - перерисовка layout (reflow) */
.element {
  width: 100px;
  height: 100px;
  position: absolute;
  top: 100px;
  left: 100px;
}

/* ✅ Хорошо - только repaint */
.element {
  transform: translate(100px, 100px);
  /* Не вызывает reflow */
}
```

### 13.2 Critical CSS

```html
<!-- Встроенный критический CSS -->
<head>
  <style>
    /* Только стили для above-the-fold контента */
    body {
      margin: 0;
      font-family: Arial, sans-serif;
    }
    
    .header {
      background: #333;
      color: white;
      padding: 20px;
    }
    
    .hero {
      min-height: 100vh;
      background: #007bff;
    }
  </style>
  
  <!-- Остальные стили асинхронно -->
  <link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
</head>
```

### 13.3 CSS Containment

```css
/* Изоляция рендеринга */
.widget {
  contain: layout; /* изолирует layout */
  contain: paint; /* изолирует paint */
  contain: size; /* изолирует размер */
  contain: style; /* изолирует стили */
  
  /* Комбинация */
  contain: layout paint;
  
  /* Строгая изоляция */
  contain: strict; /* = size layout paint style */
  
  /* Изоляция контента */
  contain: content; /* = layout paint style */
}

/* Практическое применение */
.card {
  contain: layout style paint;
  /* Изменения внутри карточки не влияют на внешний layout */
}
```

### 13.4 Content-visibility

```css
/* Ленивый рендеринг */
.section {
  content-visibility: auto;
  /* Браузер не рендерит невидимый контент */
  
  contain-intrinsic-size: 1000px;
  /* Резервирует место для контента */
}

/* Варианты */
.element {
  content-visibility: visible; /* по умолчанию */
  content-visibility: hidden; /* скрыт и не рендерится */
  content-visibility: auto; /* рендерится при необходимости */
}
```

## 14. Accessibility (A11y)

### 14.1 Фокус и навигация

```css
/* Видимый фокус */
a:focus,
button:focus,
input:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

/* ❌ Плохо - удаление outline */
button {
  outline: none; /* убирает индикатор фокуса */
}

/* ✅ Хорошо - кастомный фокус */
button {
  outline: none;
}

button:focus-visible {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

/* Skip link для клавиатурной навигации */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

### 14.2 Цветовой контраст

```css
/* WCAG AAA требует контраст 7:1 для обычного текста */
/* WCAG AA требует контраст 4.5:1 */

/* ✅ Хорошо - достаточный контраст */
.text {
  color: #333; /* на белом фоне */
  background: #fff;
}

/* ❌ Плохо - низкий контраст */
.text-low-contrast {
  color: #ccc; /* на белом фоне */
  background: #fff;
}

/* Проверка контраста */
/* Используйте инструменты: Chrome DevTools, WAVE, axe */
```

### 14.3 Адаптация для пользователей

```css
/* Уменьшение движения */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Темная тема */
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #000;
    --text: #fff;
  }
}

/* Высокий контраст */
@media (prefers-contrast: high) {
  .button {
    border: 2px solid currentColor;
  }
}

/* Прозрачность */
@media (prefers-reduced-transparency: reduce) {
  .glass {
    backdrop-filter: none;
    background: solid;
  }
}
```

### 14.4 Скрытие контента

```css
/* Визуально скрыто, но доступно для screen readers */
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Полностью скрыто */
.hidden {
  display: none;
}

/* aria-hidden для декоративных элементов */
.icon[aria-hidden="true"] {
  /* Иконка игнорируется screen readers */
}
```

## 15. Кросс-браузерная совместимость

### 15.1 Vendor Prefixes

```css
/* Автоматически добавляются PostCSS/Autoprefixer */
.element {
  /* Без префиксов */
  display: flex;
  transform: rotate(45deg);
  transition: all 0.3s;
}

/* Компилируется в: */
.element {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
  
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
}

/* Ручное добавление (если нужно) */
.element {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
```

### 15.2 Feature Detection

```css
/* @supports */
@supports (display: grid) {
  .container {
    display: grid;
  }
}

@supports not (display: grid) {
  .container {
    display: flex;
  }
}

/* Проверка на несколько свойств */
@supports (display: grid) and (gap: 20px) {
  .container {
    display: grid;
    gap: 20px;
  }
}

/* Проверка альтернатив */
@supports (backdrop-filter: blur(10px)) or (-webkit-backdrop-filter: blur(10px)) {
  .glass {
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
}
```

### 15.3 Fallbacks

```css
/* Цвета с fallback */
.element {
  background: #007bff; /* Fallback */
  background: rgba(0, 123, 255, 0.5); /* Если поддерживается */
}

/* Modern и legacy свойства */
.container {
  display: block; /* Fallback */
  display: grid; /* Если поддерживается */
}

/* Градиенты */
.element {
  background: #007bff; /* Fallback */
  background: linear-gradient(to right, #007bff, #00d4ff);
}

/* CSS Custom Properties */
.element {
  color: #007bff; /* Fallback */
  color: var(--primary-color, #007bff);
}
```

## 16. CSS Architecture - Архитектура

### 16.1 Организация файлов

```
styles/
  ├── base/
  │   ├── _reset.scss
  │   ├── _typography.scss
  │   └── _utilities.scss
  ├── components/
  │   ├── _buttons.scss
  │   ├── _cards.scss
  │   └── _forms.scss
  ├── layout/
  │   ├── _header.scss
  │   ├── _footer.scss
  │   └── _grid.scss
  ├── pages/
  │   ├── _home.scss
  │   └── _about.scss
  ├── themes/
  │   ├── _light.scss
  │   └── _dark.scss
  ├── utilities/
  │   ├── _variables.scss
  │   ├── _mixins.scss
  │   └── _functions.scss
  └── main.scss
```

### 16.2 Naming Conventions

```css
/* BEM */
.block { }
.block__element { }
.block--modifier { }

/* SMACSS */
.l-header { } /* Layout */
.m-card { } /* Module */
.is-active { } /* State */
.t-dark { } /* Theme */

/* OOCSS */
.media { } /* Structure */
.media-body { }
.skin-light { } /* Skin */

/* Atomic CSS */
.mt-20 { margin-top: 20px; }
.flex { display: flex; }
.text-center { text-align: center; }
```

### 16.3 CSS Reset / Normalize

```css
/* Простой reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Современный reset */
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
}

input,
button,
textarea,
select {
  font: inherit;
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
}
```

## 17. Debugging CSS

### 17.1 Визуальная отладка

```css
/* Показать границы всех элементов */
* {
  outline: 1px solid red;
}

/* Альтернатива */
* {
  background: rgba(255, 0, 0, 0.1);
}

/* Отладка конкретных элементов */
.debug {
  outline: 2px solid red;
  outline-offset: -2px;
}

/* Отладка flex/grid */
.flex-container {
  background: rgba(255, 0, 0, 0.1);
}

.flex-container > * {
  outline: 1px solid blue;
}
```

### 17.2 Частые проблемы и решения

```css
/* Проблема: Margin Collapse */
/* Решение 1: padding вместо margin */
.parent {
  padding: 20px 0;
}

/* Решение 2: overflow */
.parent {
  overflow: auto;
}

/* Проблема: 100vh на мобильных (адресная строка) */
/* Решение: используйте dvh */
.fullscreen {
  height: 100dvh; /* Dynamic Viewport Height */
}

/* Проблема: Переполнение текста */
.text {
  /* Решение: обрезка */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  /* Или многострочная обрезка */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Проблема: Пробелы между inline-block элементами */
/* Решение 1: font-size: 0 на родителе */
.parent {
  font-size: 0;
}

.child {
  font-size: 16px;
  display: inline-block;
}

/* Решение 2: используйте flexbox */
.parent {
  display: flex;
  gap: 10px;
}

/* Проблема: Выход содержимого за границы */
.container {
  overflow: auto; /* или hidden */
  max-width: 100%;
}

/* Проблема: Изображения не адаптивные */
img {
  max-width: 100%;
  height: auto;
  display: block;
}
```

## 18. Продвинутые техники

### 18.1 CSS Shapes

```css
/* Обтекание текстом по форме */
.circle {
  width: 200px;
  height: 200px;
  float: left;
  shape-outside: circle(50%);
  clip-path: circle(50%);
}

/* Полигон */
.shape {
  float: left;
  width: 200px;
  height: 200px;
  shape-outside: polygon(0 0, 100% 0, 100% 100%);
  clip-path: polygon(0 0, 100% 0, 100% 100%);
}

/* Изображение как маска */
.image-shape {
  float: left;
  shape-outside: url('shape.png');
  shape-margin: 20px;
}
```

### 18.2 Clip Path

```css
/* Геометрические фигуры */
.circle {
  clip-path: circle(50%);
}

.ellipse {
  clip-path: ellipse(50% 30%);
}

.triangle {
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

.hexagon {
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}

/* Анимация clip-path */
.shape {
  clip-path: circle(0%);
  transition: clip-path 0.5s;
}

.shape:hover {
  clip-path: circle(50%);
}

/* Сложные формы */
.custom {
  clip-path: polygon(
    0% 15%, 15% 15%, 15% 0%, 85% 0%,
    85% 15%, 100% 15%, 100% 85%,
    85% 85%, 85% 100%, 15% 100%,
    15% 85%, 0% 85%
  );
}
```

### 18.3 Blend Modes

```css
/* Mix blend mode */
.overlay {
  background: red;
  mix-blend-mode: multiply;
}

/* Варианты */
.element {
  mix-blend-mode: normal; /* по умолчанию */
  mix-blend-mode: multiply;
  mix-blend-mode: screen;
  mix-blend-mode: overlay;
  mix-blend-mode: darken;
  mix-blend-mode: lighten;
  mix-blend-mode: color-dodge;
  mix-blend-mode: color-burn;
  mix-blend-mode: difference;
  mix-blend-mode: exclusion;
  mix-blend-mode: hue;
  mix-blend-mode: saturation;
  mix-blend-mode: color;
  mix-blend-mode: luminosity;
}

/* Background blend mode */
.element {
  background-image: url('image.jpg'), linear-gradient(red, blue);
  background-blend-mode: multiply;
}

/* Практический пример - текст с градиентом */
.gradient-text {
  background: linear-gradient(45deg, #ff0000, #0000ff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
```

### 18.4 CSS Grid Advanced

```css
/* Subgrid */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.nested-grid {
  display: grid;
  grid-column: span 2;
  grid-template-columns: subgrid; /* наследует сетку родителя */
}

/* Автоматическое размещение с dense */
.masonry {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-auto-flow: dense; /* заполняет пустоты */
}

.item-large {
  grid-column: span 2;
  grid-row: span 2;
}

/* Именованные линии */
.grid {
  display: grid;
  grid-template-columns: [start] 1fr [middle] 2fr [end];
  grid-template-rows: [header-start] auto [header-end content-start] 1fr [content-end];
}

.header {
  grid-column: start / end;
  grid-row: header-start / header-end;
}
```

## Чек-лист для собеседования

### Базовые концепции:
- ✅ Box Model (content-box vs border-box)
- ✅ Display (block, inline, inline-block, flex, grid)
- ✅ Position (static, relative, absolute, fixed, sticky)
- ✅ Селекторы и специфичность
- ✅ Каскад и наследование
- ✅ Единицы измерения (px, em, rem, %, vw/vh)

### Layout:
- ✅ Flexbox (все свойства container и items)
- ✅ Grid (все свойства container и items)
- ✅ Центрирование элементов (5+ способов)
- ✅ Sticky footer
- ✅ Holy Grail layout

### Responsive:
- ✅ Media Queries
- ✅ Mobile First vs Desktop First
- ✅ Breakpoints
- ✅ Адаптивные единицы
- ✅ Clamp, min, max функции

### Animations:
- ✅ Transitions
- ✅ Animations (@keyframes)
- ✅ Transform (2D и 3D)
- ✅ Timing functions

### Современные возможности:
- ✅ CSS Variables
- ✅ Container Queries
- ✅ Aspect Ratio
- ✅ CSS Filters
- ✅ Backdrop Filter
- ✅ Scroll Snap

### Performance:
- ✅ Critical CSS
- ✅ Will-change
- ✅ Contain
- ✅ Content-visibility
- ✅ Transform vs position

### Accessibility:
- ✅ Focus states
- ✅ Цветовой контраст
- ✅ prefers-reduced-motion
- ✅ Visually hidden

### Методологии:
- ✅ BEM
- ✅ SMACSS
- ✅ OOCSS
- ✅ Atomic CSS

### Кросс-браузерность:
- ✅ Vendor prefixes
- ✅ @supports
- ✅ Fallbacks
