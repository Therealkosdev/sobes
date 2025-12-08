## 1. Flexbox - Гибкая раскладка

`Container` свойства (применяются к родителю)
display: flex - включает flexbox

```css
.container {
  display: flex; /* или inline-flex */
}
```


`flex-direction` - направление главной оси


```css
flex-direction: row;         /* → по умолчанию, слева направо */
flex-direction: row-reverse; /* ← справа налево */
flex-direction: column;      /* ↓ сверху вниз */
flex-direction: column-reverse; /* ↑ снизу вверх */
```

`justify-content` - выравнивание по главной оси (горизонталь при row)

```css
justify-content: flex-start;    /* элементы в начале */
justify-content: flex-end;      /* элементы в конце */
justify-content: center;        /* элементы по центру */
justify-content: space-between; /* равное расстояние МЕЖДУ элементами */
justify-content: space-around;  /* равное расстояние ВОКРУГ элементов */
justify-content: space-evenly;  /* одинаковое расстояние везде */
```


`align-items` - выравнивание по поперечной оси (вертикаль при row)

```css
align-items: stretch;     /* растянуть на всю высоту (по умолчанию) */
align-items: flex-start;  /* прижать к верху */
align-items: flex-end;    /* прижать к низу */
align-items: center;      /* по центру */
align-items: baseline;    /* по базовой линии текста */```

`flex-wrap` - перенос элементов на новую строку

```css
flex-wrap: nowrap;       /* не переносить (по умолчанию) */
flex-wrap: wrap;         /* переносить на новую строку */
flex-wrap: wrap-reverse; /* переносить в обратном порядке */
```

`align-content` - выравнивание строк (работает только с wrap)

```css
align-content: flex-start;
align-content: center;
align-content: space-between;
/* и другие значения как у justify-content */
```

`gap` - расстояние между элементами

```css
gap: 20px;           /* одинаковое по всем направлениям */
gap: 20px 10px;      /* row-gap column-gap */
row-gap: 20px;       /* только между строками */
column-gap: 10px;    /* только между колонками */
```

Item свойства (применяются к детям)
`flex-grow` - коэффициент роста (как элемент растет)

```css
flex-grow: 0; /* не растет (по умолчанию) */
flex-grow: 1; /* занимает доступное пространство */
flex-grow: 2; /* растет в 2 раза быстрее чем элементы с flex-grow: 1 */
```
`
flex-shrink `- коэффициент сжатия (как элемент сжимается)
```css
flex-shrink: 1; /* сжимается (по умолчанию) */
flex-shrink: 0; /* не сжимается */
```


`flex-basis` - базовый размер элемента

```css
flex-basis: auto;  /* размер по контенту (по умолчанию) */
flex-basis: 200px; /* фиксированный размер */
flex-basis: 50%;   /* процент от родителя */
```

`flex` - короткая запись (grow shrink basis)

```css
flex: 1;           /* flex: 1 1 0 (растет и сжимается) */
flex: 0 0 auto;    /* не растет, не сжимается */
flex: 0 0 200px;   /* фиксированная ширина 200px */
```


`align-self` - выравнивание конкретного элемента

```css
align-self: auto;       /* как у родителя (по умолчанию) */
align-self: flex-start; /* прижать к верху */
align-self: center;     /* по центру */
```


`order` - порядок элемента

```css
order: 0;  /* по умолчанию */
order: -1; /* переместить в начало */
order: 1;  /* переместить в конец */
```


## 2. CSS Grid - Сеточная раскладка

Container свойства
`display: grid` - включает grid

```css
.container {
  display: grid; /* или inline-grid */
}
```

`grid-template-columns` - колонки

```css
grid-template-columns: 200px 200px 200px;    /* 3 колонки по 200px */
grid-template-columns: 1fr 1fr 1fr;          /* 3 равные колонки */
grid-template-columns: 1fr 2fr 1fr;          /* средняя в 2 раза шире */
grid-template-columns: 200px 1fr;            /* фикс + резиновая */
grid-template-columns: repeat(3, 1fr);       /* повторить 3 раза */
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* адаптив */
grid-template-columns: repeat(auto-fill, 200px); /* заполнить */
```


`grid-template-rows` - строки (синтаксис как у columns)

```css
grid-template-rows: 100px auto 100px; /* 3 строки */
grid-template-rows: repeat(3, 100px);
```


`justify-items` - выравнивание элементов по горизонтали внутри ячейки

```css
justify-items: stretch; /* на всю ширину (по умолчанию) */
justify-items: start;   /* к левому краю */
justify-items: end;     /* к правому краю */
justify-items: center;  /* по центру */
```

`align-items` - выравнивание элементов по вертикали внутри ячейки

```css
align-items: stretch; /* на всю высоту (по умолчанию) */
align-items: start;
align-items: end;
align-items: center;
```

`justify-content` - выравнивание всей сетки по горизонтали

```css
justify-content: start;
justify-content: center;
justify-content: space-between;
```


`align-content` - выравнивание всей сетки по вертикали

```css
align-content: start;
align-content: center;
align-content: space-between;
```


`grid-auto-flow` - как размещать автоматические элементы

```css
grid-auto-flow: row;    /* по строкам (по умолчанию) */
grid-auto-flow: column; /* по колонкам */
grid-auto-flow: dense;  /* плотная упаковка */
```

`justify-self` - выравнивание конкретного элемента по горизонтали

```css
justify-self: start;
justify-self: center;
justify-self: end;
justify-self: stretch;
```

`align-self` - выравнивание конкретного элемента по вертикали

```css
align-self: start;
align-self: center;
align-self: end;
align-self: stretch;
```


## 3. Position - Позиционирование

`position` - тип позиционирования

```css
position: static;   /* обычный поток (по умолчанию) */
position: relative; /* относительно своего места */
position: absolute; /* относительно ближайшего positioned родителя */
position: fixed;    /* относительно viewport (окна браузера) */
position: sticky;   /* гибрид relative и fixed */
```

`top, right, bottom, left` - смещение

```css
top: 0;
right: 20px;
bottom: 10%;
left: auto;
```

`z-index` - порядок наложения по оси Z

```css
z-index: 1;     /* выше элементов с меньшим z-index */
z-index: -1;    /* ниже */
z-index: 9999;  /* очень высоко */
/* работает только с position != static */
```

Примеры использования:

`Relative`:
```css
.box {
  position: relative;
  top: 10px;    /* сдвинется вниз на 10px от своего места */
  left: 20px;   /* сдвинется вправо на 20px */
}
```
`Absolute`:
```css
.parent {
  position: relative; /* создаем контекст */
}
.child {
  position: absolute;
  top: 0;
  right: 0; /* прижмется к правому верхнему углу родителя */
}
```
`Fixed`:
```css
css.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  /* всегда вверху экрана при прокрутке */
}
```
`Sticky`:
```css
css.navbar {
  position: sticky;
  top: 0; /* прилипнет к верху при прокрутке */
}
```

## 4. Media Queries - Адаптивность

Базовый синтаксис:

```css
@media (условие) {
  /* стили */
}
```

* Ширина экрана:

```css
@media (max-width: 768px) {
  /* для экранов ≤ 768px (mobile) */
}

@media (min-width: 769px) {
  /* для экранов ≥ 769px (desktop) */
}

@media (min-width: 768px) and (max-width: 1024px) {
  /* для экранов от 768 до 1024px (tablet) */
}
```


* Высота:

```css
@media (max-height: 600px) {
  /* для низких экранов */
}
```

* Ориентация:
```css
@media (orientation: portrait) {
  /* вертикальная ориентация */
}

@media (orientation: landscape) {
  /* горизонтальная ориентация */
}
```

* Pixel ratio (retina):

```css
@media (-webkit-min-device-pixel-ratio: 2),
       (min-resolution: 192dpi) {
  /* retina дисплеи */
}
```

* Темная тема:

```css
@media (prefers-color-scheme: dark) {
  /* темная тема системы */
}
```

## 5. Единицы измерения

Абсолютные:

```px    /* пиксели */
pt    /* пункты (для печати) */
cm, mm, in /* сантиметры, миллиметры, дюймы */
```

Относительные (к шрифту):

em    /* относительно font-size родителя */
rem   /* относительно font-size корневого элемента (html) */

```css
/* Пример: */
html { font-size: 16px; }
.box {
  width: 2rem;     /* 32px (16 * 2) */
  padding: 1.5em;  /* зависит от font-size .box */
}
```


Относительные (к viewport):

```scss
vw    /* 1% ширины viewport */
vh    /* 1% высоты viewport */
vmin  /* меньшее из vw или vh */
vmax  /* большее из vw или vh */

/* Пример: */
.hero {
  height: 100vh;  /* на всю высоту экрана */
  width: 50vw;    /* половина ширины экрана */
}
```

Проценты:

```css
.child {
  width: 50%;  /* 50% от ширины родителя */
}
```


