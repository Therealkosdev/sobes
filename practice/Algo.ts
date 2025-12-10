function isSimilar(a: number[], b: number[]): boolean {
    if (a.length !== b.length) return false;

    const freq = new Map<number, number>();

    // Считаем частоты из массива a
    for (const n of a) {
        freq.set(n, (freq.get(n) ?? 0) + 1);
    }

    // Уменьшаем частоты по массиву b
    for (const n of b) {
        const count = freq.get(n);
        if (!count) return false; // нет элемента или частота ушла в минус
        freq.set(n, count - 1);
    }

    // Доп. проверка: все значения должны быть 0
    for (const value of freq.values()) {
        if (value !== 0) return false;
    }

    return true;
}

console.log(isSimilar([1, 2, 3], [3, 1, 2])); // true
console.log(isSimilar([1, 2, 2], [2, 1, 1])); // false
console.log(isSimilar([1, 2, 3], [1, 2, 4])); // false


