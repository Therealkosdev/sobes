// // * reduce

const arr: number[] = [1, 2, 3, 4, 5, 6, 7];
const multiply = (arr: number[]): number => {
  return arr.reduce((acc, num) => acc * num, 1);
};

const sum = (arr: number[]): number => {
  return arr.reduce((sum, num) => {
    if (num % 2 !== 0) {
      return sum + num;
    }
    return sum;
  }, 0);
}

console.log(multiply(arr)); 
console.log(sum([1, 2, 3, 4, 5])); 



function arrToObj(arr: string[]): Map<string,number> {
  let res:Map<string, number> = new Map<string,number>();
  
  res = arr.reduce <Map<string,number>>((acc, word)=> {
  return  acc.set(word, (acc.get(word) || 0) + 1)
  }, res)

  return res;
}

console.log(arrToObj( ["apple", "banana", "apple", "orange", "banana"]));



// 1. sum 

function returnSumOfArr(arr: number[]): number {
  return arr.reduce((sum, numb)=> {
    return sum+numb;
  },0)
}

// 2. max number

function maxNumber (arr: number[]): number {
  let res = -Infinity;
  return res = arr.reduce((max, numb)=> {
    if (max<numb) {
      max = numb;
    }
    return max;
  }, res)
}

// console.log(maxNumber([3, 7, 1, 9, 4, 12, 6]));

// 3. count elements 

function countElements (arr: string[]): Map<string, number> {
  let res:Map<string, number> = new Map<string, number>();
  return res = arr.reduce<Map<string, number>>((acc, word) => {
    return acc.set(word, (acc.get(word)||0)+1);
  }, res)
}

// 4. groupByAge

interface People {
  name: string
  age: number
}

interface Group {
  age: number
  peoples: string[]
}

function groupByAge(ppl: People[]): Map<number, string[]> {
  return ppl.reduce((map, { name, age }) => {
    const names = map.get(age) ?? [];
    names.push(name);
    map.set(age, names);
    return map;
  }, new Map<number, string[]>());
}


// getFruits

const items = [
  { name: "Яблоко", category: "fruit" },
  { name: "Морковь", category: "vegetable" },
  { name: "Банан", category: "fruit" },
  { name: "Картофель", category: "vegetable" },
  { name: "Груша", category: "fruit" },
];

interface Fruits {
  name: string
  category: string
}

function sotrtFruits (arr: Fruits[]): Map<string, number> {
  return arr.reduce((map, item) => {
      const currentCount = map.get(item.category) ?? 0;
      map.set(item.category, currentCount + 1);
      return map;
    }, new Map<string, number>());
}


// sumGroup

interface Order {
  userId: number
  amount: number
}

const orders = [
  { userId: 1, amount: 100 },
  { userId: 2, amount: 250 },
  { userId: 1, amount: 50 },
  { userId: 3, amount: 300 },
  { userId: 2, amount: 75 },
];


function sumGroup (arr: Order[]) {
  return arr.reduce((map, order)=> {
    const sumOfUsr = map.get(order.amount);
    const currentSum = map.get(order.userId) ?? 0;
    map.set(order.userId, currentSum + order.amount);
    return map;
  }, new Map<number,number>)
}


console.log(sumGroup(orders));


// role counter 

interface User {
  name: string;
  role: "admin" | "user" | "guest";
}

const users: User[] = [
  { name: "Alex", role: "admin" },
  { name: "Bob", role: "user" },
  { name: "Kate", role: "user" },
  { name: "Max", role: "guest" },
  { name: "Ann", role: "admin" },
];


function roleCounter (arr: User[]) {
  return arr.reduce((map, usr) => {
    const amoutOfRole = map.get(usr.role) ?? 0;
    map.set(usr.role, amoutOfRole+1);
    return map;
  }, new Map<string,number>)
}

console.log(roleCounter(users));



/// Examm kind of 


// 1.
interface Transaction {
  id: number;
  typeTr: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
}


const transactions: Transaction[] = [
  { id: 1, typeTr: 'income', category: 'salary', amount: 5000, date: '2024-01-15' },
  { id: 2, typeTr: 'expense', category: 'food', amount: 200, date: '2024-01-16' },
  { id: 3, typeTr: 'expense', category: 'transport', amount: 50, date: '2024-01-17' },
  { id: 4, typeTr: 'income', category: 'freelance', amount: 1000, date: '2024-01-18' },
  { id: 5, typeTr: 'expense', category: 'food', amount: 150, date: '2024-01-19' },
  { id: 6, typeTr: 'expense', category: 'entertainment', amount: 300, date: '2024-01-20' },
];



function statTransaction (arr: Transaction[]) {

  const balance = arr.reduce((acc, trans) => {
    if (trans.typeTr === 'income') {
      acc += trans.amount
    } else {
      acc -=trans.amount
    }
    return acc;
  }, 0)

  const byCategory = arr.reduce<Record<string, number>>((acc, trans) => {
    acc[trans.category] = (acc[trans.category] ?? 0) + trans.amount;
    return acc;
  }, {});



 const maxTransaction = arr.reduce<Transaction | null>((max, trans) => {
    if (!max || trans.amount > max.amount) {
      return trans;
    }
    return max;
  }, null);
  return {
    "balance": balance,
    "byCategory": byCategory,
    maxTransaction: maxTransaction
  }
}

console.log(statTransaction(transactions));

// output:
// {
//   balance: 5300,
//   byCategory: {
//     salary: 5000,
//     food: 350,
//     transport: 50,
//     freelance: 1000,
//     entertainment: 300
//   },
//   maxTransaction: { id: 1, type: 'income', category: 'salary', amount: 5000, date: '2024-01-15' }
// }



// 2.

interface Visit {
  userId: number;
  page: string;
  duration: number; // секунды
}

const visits: Visit[] = [
  { userId: 1, page: "/home", duration: 30 },
  { userId: 1, page: "/products", duration: 120 },
  { userId: 2, page: "/home", duration: 45 },
  { userId: 2, page: "/products", duration: 60 },
  { userId: 1, page: "/home", duration: 20 },
  { userId: 3, page: "/home", duration: 15 },
];

function visitStats(visits: Visit[]) {
  const uniqueUsrs = visits.reduce((acc, usr)=> {
    if (!acc.has(usr)) {
      acc.add(usr);
    }
    return acc;
  }, new Set())

  const totalTimeByPage = visits.reduce<Record<string, number>>((acc, page) => {
    acc[page.page] = (acc[page.duration]) + page.duration;
    return acc;
  }, {})

  const byPage = visits.reduce<Visit | null> ((most, visit)=> {
   if (!most || visit.duration>most.duration) {
    return visit
   }
   return most
  }, null);

  const totalAndCountByUser = visits.reduce<
  Record<number, { total: number; count: number }>
  >((acc, visit) => {
    const user = acc[visit.userId] ?? { total: 0, count: 0 };

    user.total += visit.duration;
    user.count += 1;

    acc[visit.userId] = user;
    return acc;
  }, {});

  return {
    uniqueUsrs: uniqueUsrs,
    totalTimeByPage: totalTimeByPage,
    totalAndCountByUser: totalAndCountByUser,
    byPage: byPage
  }
}

console.log(visitStats(visits));

// output 
// {
//   uniqueUsers: number;                  // сколько уникальных userId
//   totalTimeByPage: Record<string, number>;
//   averageTimeByUser: Record<number, number>;
//   mostVisitedPage: string | null;
// }


interface ActionEvent {
  id: number;
  userId: number;
  action: "login" | "logout" | "click";
  timestamp: number; 
}

const events: ActionEvent[] = [
  { id: 1, userId: 1, action: "login",  timestamp: 100 },
  { id: 2, userId: 1, action: "click",  timestamp: 120 },
  { id: 3, userId: 2, action: "login",  timestamp: 130 },
  { id: 4, userId: 1, action: "logout", timestamp: 160 },
  { id: 5, userId: 2, action: "click",  timestamp: 180 },
  { id: 6, userId: 2, action: "logout", timestamp: 200 },
];


function getEventStat(arr: ActionEvent[]) {
  // 1. Группировка всех событий по пользователям: { userId: ActionEvent[] }
  const byUser = arr.reduce<Record<number, ActionEvent[]>>((obj, ev) => {
    if (!obj[ev.userId]) {
      obj[ev.userId] = [];
    }
    obj[ev.userId].push(ev);
    return obj;
  }, {});

  // 2. Первое действие каждого пользователя
  const firstActionByUser = arr.reduce<Record<number, ActionEvent>>((obj, ev) => {
    if (!obj[ev.userId]) {
      obj[ev.userId] = ev;
    }
    return obj;
  }, {});

  // 3. Последнее действие каждого пользователя
  const lastActionByUser = arr.reduce<Record<number, ActionEvent>>((obj, ev) => {
    obj[ev.userId] = ev; // перезаписываем — последнее wins
    return obj;
  }, {});

  // 4. Активные пользователи сейчас (залогинились, но не вышли)
  const activeUsers = new Set<number>();
  const loginCount = new Map<number, number>();

  for (const ev of arr) {
    if (ev.action === "login") {
      loginCount.set(ev.userId, (loginCount.get(ev.userId) || 0) + 1);
    } else if (ev.action === "logout") {
      const count = loginCount.get(ev.userId) || 0;
      if (count > 0) {
        loginCount.set(ev.userId, count - 1);
      }
    }
  }

  // Если количество login > logout — пользователь активен
  for (const [userId, count] of loginCount) {
    if (count > 0) {
      activeUsers.add(userId);
    }
  }

  // Альтернатива: просто проверить, что последнее действие — не logout
  // (проще и чаще используется)
  const activeUsersSimple: number[] = [];
  for (const [userId, events] of Object.entries(byUser)) {
    const last = events[events.length - 1];
    if (last.action !== "logout") {
      activeUsersSimple.push(Number(userId));
    }
  }

  return {
    byUser,
    firstActionByUser,
    lastActionByUser,
    activeUsers: activeUsersSimple.sort((a, b) => a - b), // или Array.from(activeUsers)
  };
}