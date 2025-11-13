// Closure

function createStepper(initial: number, incr: number): () => number {
    let step = initial;
    return function stepper() {  
        step += incr;
        return step;
    };
}

const stepper = createStepper(5, 2);
console.log(stepper()); // 7
console.log(stepper()); // 9
console.log(stepper()); // 11



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
const limited = createAttemptLimiter(3);
limited(() => console.log("Попытка 1")); // Попытка 1
limited(() => console.log("Попытка 2")); // Попытка 2
limited(() => console.log("Попытка 3")); // Попытка 3
limited(() => console.log("Попытка 4")); // Лимит попыток исчерпан!

