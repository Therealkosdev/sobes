interface Authors {
    userId: number,
    id: number,
    title: string,
    body: string
}

interface TopAuthor {
    userId: number,
    postCount: number
}

interface Todos {
    userId: number,
    id: number,
    title: string,
    completed: boolean
}

interface TodoSelf {
    userId: number,
    completed: number,
    uncompleted: number,
    copasity: string
}


async function getAuthors (): Promise<Authors[] | null>{
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');

    if (!response) {
        console.log("error");
        return null;
    }

    const data = await response.json();
    return data;
}

async function getTopAuthors (): Promise<TopAuthor[] | null> {
    const posts  = await getAuthors();
    if (!posts || posts.length === 0) {
        console.log('nothing')
        return null;
    }

    const popularityMap  = new Map<number, number>();

    posts.forEach(post=> {
        popularityMap.set(post.userId, (popularityMap.get(post.userId) || 0) + 1);
    })

    const topAuthors: TopAuthor[] = Array.from(popularityMap.entries())
                                    .map(([userId, postCount])=> ({userId, postCount}))
                                    .sort((a,b)=> b.postCount - a.postCount)
                                    .slice(0,3);

    console.log(topAuthors);
    return topAuthors;
}

// getTopAuthors();



interface Todo {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
}

interface UserStat {
    userId: number;
    completed: number;
    uncompleted: number;
    capacity: string; // "75%" или "0%"
}

async function getUserStat(id: number): Promise<UserStat | null> {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos');

        if (!response.ok) {
            console.error('Не удалось загрузить задачи:', response.status);
            return null;
        }

        const data: Todo[] = await response.json();
        const userTasks = data.filter(task => task.userId === id);

        if (userTasks.length === 0) {
            console.log(`Пользователь с userId ${id} не найден`);
            return null;
        }

        const counterCompleted = userTasks.filter(t => t.completed).length;
        const counterUncompleted = userTasks.length - counterCompleted;

        let capacityPercentage = '0%';
        if (counterUncompleted > 0) {
            capacityPercentage = (counterCompleted/(counterCompleted + counterUncompleted)).toFixed(1) + '%';
        } else if (counterCompleted > 0) {
            capacityPercentage = '100%'; 
        }
        const userStat: UserStat = {
            userId: id,
            completed: counterCompleted,
            uncompleted: counterUncompleted,
            capacity: capacityPercentage
        };
        return userStat;
    } catch (error) {
        console.error('Ошибка при загрузке:', error);
        return null;
    }
}

getUserStat(1).then(stat => {
    if (stat) {
        console.log(stat);
    } else {
        console.log("Не удалось получить статистику");
    }
});



interface Todo {
    "userId": number,
    "id": number,
    "title": string,
    "completed": boolean
}

interface Stat {
    id: number,
    completed: number,
    uncompleted: number,
    copacity: number
}


async function getCompletedTodosByUser(userId: number): Promise<any> {
    const resultPromise = new Promise<any>(async(res, rej) => {
        const response  = await fetch("https://jsonplaceholder.typicode.com/todos");
        if (!response) {
            rej("Failed to fetch")
            throw new Error ("Failed to fetch");
        }
        const data:Todo[] = await response.json();
        const userCompletedTask = data.filter(task => task.userId===userId && task.completed === true);

        if (userCompletedTask.length > 0 ) {
            res (userCompletedTask);
        } else {
            rej("nothig found");
        }
    })
    return resultPromise;
}

getCompletedTodosByUser(3)
                        .then(res => console.log(res))
                        .catch(error => console.log(error));


async function getUsersStatistics(): Promise<Record<number, { total: number; completed: number; pending: number }>> {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos");
  
  if (!response.ok) {
    throw new Error("Failed to fetch todos");
  }

  const todos = await response.json();

  const stats: Record<number, { total: number; completed: number; pending: number }> = {};

  for (const todo of todos) {
    const userId = todo.userId;

    if (!stats[userId]) {
      stats[userId] = { total: 0, completed: 0, pending: 0 };
    }

    stats[userId].total++;
    if (todo.completed) {
      stats[userId].completed++;
    } else {
      stats[userId].pending++;
    }
  }
  return stats;
}

getUsersStatistics().then(res=>console.log(res)).catch(error => console.log(error));


//own promise all

type Fn<T> = () => Promise<T>
type AsyncFunc = () => Promise<any>;

function promiseAll<T>(functions: AsyncFunc[]): Promise<any[]> {
  return new Promise((resolve,reject)=> {
    if (functions.length === 0) {
        resolve([]);
        return;
    }

    const result: any[] = new Array(functions.length);
    let completed: number = 0;

    functions.forEach((funcItem, funcIndex)=> {
        Promise.resolve(funcItem())
                .then((functionRes)=> {
                    result[funcIndex] = functionRes;
                    completed++;

                    if(completed === functions.length) {
                        resolve(result);
                    }
                })
                .catch((error)=> {
                    reject(error)
                })
    })
  })
}

/**
 * const promise = promiseAll([() => new Promise(res => res(42))])
 * promise.then(console.log); // [42]
 */