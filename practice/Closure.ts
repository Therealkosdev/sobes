// Closure

function createStepper(initial: number, incr: number): () => number {
    let step = initial;
    return function stepper() {  
        step += incr;
        return step;
    };
}

const stepper = createStepper(5, 2);
// console.log(stepper()); // 7
// console.log(stepper()); // 9
// console.log(stepper()); // 11



function once<F> (func: ()=> F): () => F {
    let seen = false;
    let res: F;

    return () => {
        if (!seen) {
            seen = true;
            res = func();
        }
        return res;
    }
}

function sayHello() {
  console.log("Привет!");
  return "Готово";
}

const runOnce = once(sayHello);

// console.log(runOnce()); // выводит "Привет!", возвращает "Готово"
// console.log(runOnce()); // ничего не выводит, возвращает "Готово"
// console.log(runOnce()); // ничего не выводит, возвращает "Готово"


function createAttemptLimiter(maxAttempts: number): (callback: () => void) => void {
    let counter = 0;
    return function (callback: ()=> void) {
        counter++;
        while(counter<=maxAttempts) {
            return callback();
        }
        console.log('exeeded limit');
    }

}
// Пример использования (не меняй):
// const limited = createAttemptLimiter(3);
// limited(() => console.log("Попытка 1")); // Попытка 1
// limited(() => console.log("Попытка 2")); // Попытка 2
// limited(() => console.log("Попытка 3")); // Попытка 3
// limited(() => console.log("Попытка 4")); // Лимит попыток исчерпан!



function createFilter(predicate: (value: any) => boolean) {

  return function (arr: any[]) {
    const res = [];

    for (let num of arr) {
        if (predicate(num)) {
            res.push(num)
        }
    }

    return res;
  };
}

// 🔹 Примеры для проверки:
const isEven = (num: number) => num % 2 === 0;
const filterEven = createFilter(isEven);

// console.log(filterEven([1, 2, 3, 4, 5, 6])); // ожидаем [2, 4, 6]


function createMultiplier(num: number) {
    let putted = num;

    return function (multiple: number) {
        let res: number = 0;
        return res = multiple * putted;
    }
}


const double = createMultiplier(2);
const triple = createMultiplier(3);

// console.log('doubled',double(5)); // 👉 10
// console.log('troppled',triple(5)); // 👉 15

function createHistory() {
    let action: string[] = [];

    return {
        add(userAction: string) {
            action.push(userAction);
        },
        getHistory() {
            return action;
        }
    }
}


const historyy = createHistory();

historyy.add("Вход в систему");
historyy.add("Открыт профиль");
historyy.add("Выход из системы");

// console.log(historyy.getHistory());
// 👉 ["Вход в систему", "Открыт профиль", "Выход из системы"]


function createTimer() {
    let counter = 0;
    let intervall: any;

    return {
        start() {
            intervall = setInterval(()=> {
                counter++;
            },1000)
        },
        stop() {
            clearInterval(intervall);
        },
        getTime () {
            return counter;
        }
    }
}


// const timer = createTimer();

// timer.start();
// setTimeout(() => {
//   timer.stop();
//   console.log("Прошло секунд:", timer.getTime());
// }, 5000);


//Debounce 



function debounce(fn: () => void, delay: number) {
    let timer: any = null; // Это наш "охранник"

    return function () {
        // Если уже есть таймер — УБИВАЕМ его!
        if (timer) {
            clearTimeout(timer);
        }

        // Запускаем НОВЫЙ таймер
        timer = setTimeout(() => {
            fn();        // Вызываем функцию
            timer = null; // Сбрасываем охранника
        }, delay);
    };
}
const introduce = ()=> {
    console.log('hello');
}

// const debouncedIntroduce = debounce(introduce, 1000);

// // Симулируем 5 быстрых кликов
// debouncedIntroduce();
// debouncedIntroduce();
// debouncedIntroduce();
// debouncedIntroduce();
// debouncedIntroduce();



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
