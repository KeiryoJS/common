import { isObject } from "./functions";
import { Type } from "./Type";

import type { Dictionary, Tuple } from "./types";

export class Collection<K, V> extends Map<K, V> {
    ["constructor"]: typeof Collection;

    /**
     *
     * Creates a collection from an array of tuples or object.
     *
     * @param {Tuple[] | Dictionary} tupleArrayOrObject The tuple array or dictionary.
     * @returns {Collection}
     */
    static from<K, V>(tupleArrayOrObject: Dictionary<V> | Tuple<K, V>[]): Collection<K, V>;

    /**
     * Creates a collection from an array of values and the keys are the indexes.
     *
     * @param {Array} values The array of values.
     * @returns {Collection}
     */
    static from<V>(values: V[]): Collection<number, V>;

    /**
     * Creates a collection from the provided value.
     *
     * @param {Dictionary | Tuple[] | Array} value The value to create the collection from.
     * @returns {Collection}
     */
    static from<K, V>(
        value: Tuple[] | V[] | Dictionary,
    ): Collection<K, V> {
        const col = new Collection<any, any>();
        if (Array.isArray(value) && value.length) {
            if (Array.isArray(value[0])) {
                for (const [ k, v ] of value as Tuple[]) {
                    col.set(k, v);
                }

                return col;
            }

            let i = 0;
            for (const v of value as V[]) {
                col.set(i, v);
                i++;
            }

            return col;
        } else if (isObject(value)) {
            return new Collection<any, any>(Object.entries(value));
        }

        throw new Error(
            `Collection#from: Expected an object or array, got "${typeof value}"`,
        );
    }

    /**
     * Returns the first entry in this collection.
     *
     * @returns {?any}
     */
    first(): Tuple<K, V> | null;

    /**
     * Returns an array of entries at the start of this collection.
     *
     * @param {number} amount The amount of values.
     * @returns {any[]}
     */
    first(amount: number): Tuple<K, V>[];

    /**
     * The first entries in this collection.
     *
     * @returns {any}
     */
    first(amount?: number): Tuple<K, V> | Tuple<K, V>[] | null {
        const it = this.entries();
        if (amount) {
            return amount < 0
                ? this.last(amount * -1)
                : Array.from(
                    { length: Math.min(amount, this.size) },
                    () => it.next().value,
                );
        }

        return it.next().value ?? null;
    }

    /**
     * Returns the last entry in this collection.
     *
     * @returns {?any}
     */
    last(): Tuple<K, V> | null;

    /**
     *
     * Returns an array of entries at the end of this collection.
     * @param {number} amount The amount of entries.
     * @returns {any[]}
     */
    last(amount: number): Tuple<K, V>[];

    /**
     * The last entries in this collection.
     *
     * @returns {any | any[]}
     */
    last(amount?: number): Tuple<K, V> | Tuple<K, V>[] | null {
        const arr = Array.from(this.entries());
        if (amount) {
            return amount < 0 ? this.first(amount * -1) : arr.slice(-amount).reverse();
        }

        return arr[arr.length - 1] ?? null;
    }

    /**
     * Get an array of all values in this collection.
     * @returns {any[]}
     */
    array(): V[] {
        return Array.from(this.values());
    }

    /**
     * Tests whether at-least one entry in this collection tests true against provided predicate.
     *
     * @param {function} predicate A predicate that tests all entries.
     * @param {any} [thisArg] An optional binding for the predicate function.
     * @returns true, if at-least one entry in this collection tests true
     */
    some(
        predicate: (value: V, key: K, col: this) => boolean,
        thisArg?: unknown,
    ): boolean {
        if (thisArg) {
            predicate = predicate.bind(thisArg);
        }

        for (const [ k, v ] of this) {
            if (predicate(v, k, this)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Tests whether each entry in this collection tests true against the provided predicate.
     * @param predicate A predicate that tests all entries.
     * @param thisArg An optional binding for the provided predicate.
     * @returns true, if all entries tests true.
     */
    all(
        predicate: (value: V, key: K, col: this) => boolean,
        thisArg?: unknown
    ): boolean {
        if (thisArg) {
            predicate = predicate.bind(thisArg);
        }

        for (const [ k, v ] of this) {
            if (!predicate(v, k, this)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Creates a new collection with the items within the provided range.
     *
     * @param {number} [from] Where to stop.
     * @param {number} [end] Where to end.
     * @returns {Collection}
     */
    slice(from?: number, end?: number): Collection<K, V> {
        const col = new Collection<K, V>(),
            entries = Array.from(this.entries());

        for (const [ k, v ] of entries.slice(from, end)) {
            col.set(k, v);
        }

        return col;
    }

    /**
     * Collection#forEach but it returns the collection instead of nothing.
     *
     * @param {function} fn The function to be ran on all entries.
     * @param {any} [thisArg] An optional binding for the fn parameter.
     * @returns {Collection}
     */
    each(
        fn: (value: V, key: K, col: this) => unknown,
        thisArg?: unknown,
    ): this {
        if (thisArg) {
            fn = fn.bind(thisArg);
        }

        for (const [ k, v ] of this) {
            fn(v, k, this);
        }

        return this;
    }

    /**
     * Computes a value if it's absent in this collection.
     * @param {any} key The key.
     * @param {any} value The value to use if nothing is found.
     * @returns {any}
     */
    ensure(key: K, value: ((key: K) => V) | V): V {
        let v = this.get(key);
        if (!v) {
            v = typeof value === "function" ? (value as any)(key) : value;

            this.set(key, v as V);
        }

        return v as V;
    }

    /**
     * Get a random value from this collection.
     *
     * @returns {any}
     */
    random(): V {
        const values = Array.from(this.values());
        return values[Math.floor(Math.random() * values.length)];
    }

    /**
     * Get a random key from this collection.
     *
     * @returns {any}
     */
    randomKey(): K {
        const keys = Array.from(this.keys());
        return keys[Math.floor(Math.random() * keys.length)];
    }

    /**
     * Get random entry from this collection.
     *
     * @returns {Tuple}
     */
    randomEntry(): Tuple<K, V> {
        const entries = Array.from(this.entries());
        return entries[Math.floor(Math.random() * entries.length)];
    }

    /**
     * Sweeps entries from the collection.
     *
     * @param {function} fn The predicate.
     * @param {any} [thisArg] Optional binding for the predicate.
     * @returns {number}
     */
    sweep(
        fn: (value: V, key: K, col: this) => boolean,
        thisArg?: unknown,
    ): number {
        if (thisArg) {
            fn = fn.bind(thisArg);
        }

        const oldSize = this.size;
        for (const [ k, v ] of this) {
            if (fn(v, k, this)) {
                this.delete(k);
            }
        }

        return oldSize - this.size;
    }

    /**
     * Finds a value using a predicate from this collection
     *
     * @param {function} fn Function used to find the value.
     * @param {any} [thisArg] Optional binding to use.
     * @returns {?any}
     */
    find(
        fn: (value: V, key: K, col: this) => boolean,
        thisArg?: unknown,
    ): V | null {
        if (thisArg) {
            fn = fn.bind(this);
        }

        for (const [ k, v ] of this) {
            if (fn(v, k, this)) {
                return v;
            }
        }

        return null;
    }

    /**
     * Reduces this collection down into a single value.
     *
     * @param {function} fn The function used to reduce this collection.
     * @param {any} acc The accumulator.
     * @param {any} [thisArg] Optional binding for the reducer function.
     * @returns {any}
     */
    reduce<A>(
        fn: (acc: A, value: V, key: K, col: this) => A,
        acc: A,
        thisArg?: unknown,
    ): A {
        if (thisArg) {
            fn = fn.bind(thisArg);
        }

        for (const [ k, v ] of this) {
            acc = fn(acc, v, k, this);
        }

        return acc;
    }

    /**
     * Partition this collection. First collection are the entries that returned true, second collection are the entries that returned false.
     *
     * @param {function} predicate The predicate function.
     * @param {any} [thisArg] Optional binding for the predicate.
     * @returns {[Collection, Collection]}
     */
    partition(
        predicate: (value: V, key: K, col: this) => boolean,
        thisArg?: unknown,
    ): Tuple<Collection<K, V>, Collection<K, V>> {
        if (thisArg) {
            predicate = predicate.bind(thisArg);
        }

        const [ p1, p2 ] = [ new Collection<K, V>(), new Collection<K, V>() ];
        for (const [ k, v ] of this) {
            const partition = predicate(v, k, this) ? p1 : p2;

            partition.set(k, v);
        }

        return [ p1, p2 ];
    }

    /**
     * Returns a filtered collection based on the provided predicate.
     *
     * @param {function} fn The predicate used to determine whether or not an entry can be passed to the new collection.
     * @param {any} [thisArg] Optional binding for the predicate.
     * @returns {Collection}
     */
    filter(
        fn: (value: V, key: K, col: this) => boolean,
        thisArg?: unknown,
    ): Collection<K, V> {
        if (thisArg) {
            fn = fn.bind(thisArg);
        }

        const col = new this.constructor[Symbol.species]();
        for (const [ k, v ] of this) {
            if (fn(v, k, this)) {
                col.set(k, v);
            }
        }

        return col as Collection<K, V>;
    }

    /**
     * Maps this collection into an array. Array#map equivalent.
     *
     * @param {function} fn Function used to map values to an array.
     * @param {any} [thisArg] Optional binding for the map function.
     * @returns {any[]}
     */
    map<T>(
        fn: (value: V, key: K, col: this) => T,
        thisArg?: unknown,
    ): T[] {
        if (thisArg) {
            fn = fn.bind(thisArg);
        }

        const arr = [];
        for (const [ k, v ] of this) {
            const value = fn(v, k, this);
            arr.push(value);
        }

        return arr;
    }

    /**
     * Sorts the entries in-place in this collection.
     *
     * @param {function} compareFunction Function to determine how this collection should be sorted.
     * @returns {Collection}
     */
    sort(
        compareFunction: (
            firstValue: V,
            secondValue: V,
            firstKey?: K,
            secondKey?: K,
        ) => number = (first, second): number =>
            +(first > second) || +(first === second) - 1,
    ): this {
        const entries = Array.from(this.entries()).sort((a, b) =>
            compareFunction(a[1], b[1], a[0], b[0]),
        );

        this.clear();
        for (const [ key, value ] of entries) {
            this.set(key, value);
        }

        return this;
    }

    /**
     * Sorts entries in a new collection
     *
     * @param {function} compareFunction Function to determine how the resulting collection should be sorted
     * @returns {Collection}
     */
    sorted(
        compareFunction: (
            firstValue: V,
            secondValue: V,
            firstKey?: K,
            secondKey?: K,
        ) => number = (first, second): number =>
            +(first > second) || +(first === second) - 1,
    ): Collection<K, V> {
        const entries = Array.from(this.entries()).sort((a, b) =>
            compareFunction(a[1], b[1], a[0], b[0]),
        );

        return new this.constructor(entries);
    }

    /**
     * Returns a clone of this collection.
     *
     * @returns {Collection}
     */
    clone(): Collection<K, V> {
        return new this.constructor[Symbol.species](this.entries()) as Collection<K, V>;
    }

    /**
     * Get the string representation of this collection.
     *
     * @returns {string}
     */
    toString(): string {
        if (this.size) {
            const [ k, v ] = this.first() as Tuple<K, V>;
            return `${this.constructor.name}<${new Type(k)}, ${new Type(v)}>`;
        }

        return "${this.constructor.name}<any, any>";
    }
}
