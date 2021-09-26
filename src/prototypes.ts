Reflect.defineProperty(Array.prototype, "isEmpty", {
    get(this: Array<unknown>) {
        return this.length === 0;
    },
});

Reflect.defineProperty(Array.prototype, "removeFirst", {
    value<T>(this: Array<T>, value: T): T | undefined {
        const idx = this.indexOf(value);
        if (idx === -1) {
            return;
        }

        return this.splice(idx, 1)[0];
    },
});

Reflect.defineProperty(Array.prototype, "take", {
    value<T>(this: Array<T>, amount: number): Array<T> {
        return this.slice(0, amount);
    },
});

Reflect.defineProperty(Array.prototype, "takeLast", {
    value<T>(this: Array<T>, amount: number): Array<T> {
        return this.slice(-amount);
    },
});

Reflect.defineProperty(Array.prototype, "drop", {
    value<T>(this: Array<T>, amount: number): Array<T> {
        return this.splice(0, amount);
    },
});

Reflect.defineProperty(Array.prototype, "dropLast", {
    value<T>(this: Array<T>, amount: number): Array<T> {
        return this.splice(-amount, amount);
    },
});

