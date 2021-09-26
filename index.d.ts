import { TypedEmitter } from "tiny-typed-emitter";

declare global {
    interface Array<T> {
        isEmpty: boolean;
        removeFirst(value: T): T | undefined;
        take(amount: number): Array<T>;
        takeLast(amount: number): Array<T>;
        drop(amount: number): Array<T>;
        dropLast(amount: number): Array<T>;
    }
}

export class Mutex {
    get locked(): boolean;
    static wait(duration: number): Promise<void>;
    take(): Promise<Release>;
    cancel(): void;
}
type Release = () => void;

export class Extender<M extends Dictionary<Class>> {
    readonly structures: Map<keyof M, Class>;
    constructor(map: M);
    get<K extends keyof M>(key: K): M[K];
    extend<K extends keyof M, E extends M[K]>(key: K, extender: (base: M[K]) => E): Extender<M>;
}

export class Snowflake {
    static deconstruct(snowflake: snowflake, epoch?: bigint): DeconstructedSnowflake;
    static generate(options?: GenerateSnowflakeOptions): snowflake;
}
export type snowflake = string;
export interface GenerateSnowflakeOptions {
    timestamp?: number | bigint;
    epoch?: number | bigint;
    workerId?: number | bigint;
    processId?: number | bigint;
    sequence?: number | bigint;
}
export interface DeconstructedSnowflake {
    id: snowflake;
    timestamp: bigint;
    workerId: bigint;
    processId: bigint;
    increment: bigint;
}

export class Collection<K, V> extends Map<K, V> {
    ["constructor"]: typeof Collection;
    static from<K, V>(tupleArrayOrObject: Dictionary<V> | Tuple<K, V>[]): Collection<K, V>;
    static from<V>(values: V[]): Collection<number, V>;
    first(): Tuple<K, V> | null;
    first(amount: number): Tuple<K, V>[];
    last(): Tuple<K, V> | null;
    last(amount: number): Tuple<K, V>[];
    array(): V[];
    some(predicate: (value: V, key: K, col: this) => boolean, thisArg?: unknown): boolean;
    all(predicate: (value: V, key: K, col: this) => boolean, thisArg?: unknown): boolean;
    slice(from?: number, end?: number): Collection<K, V>;
    each(fn: (value: V, key: K, col: this) => unknown, thisArg?: unknown): this;
    ensure(key: K, value: ((key: K) => V) | V): V;
    random(): V;
    randomKey(): K;
    randomEntry(): Tuple<K, V>;
    sweep(fn: (value: V, key: K, col: this) => boolean, thisArg?: unknown): number;
    find(fn: (value: V, key: K, col: this) => boolean, thisArg?: unknown): V | null;
    reduce<A>(fn: (acc: A, value: V, key: K, col: this) => A, acc: A, thisArg?: unknown): A;
    partition(predicate: (value: V, key: K, col: this) => boolean, thisArg?: unknown): Tuple<Collection<K, V>, Collection<K, V>>;
    filter(fn: (value: V, key: K, col: this) => boolean, thisArg?: unknown): Collection<K, V>;
    map<T>(fn: (value: V, key: K, col: this) => T, thisArg?: unknown): T[];
    sort(compareFunction?: (firstValue: V, secondValue: V, firstKey?: K, secondKey?: K) => number): this;
    sorted(compareFunction?: (firstValue: V, secondValue: V, firstKey?: K, secondKey?: K) => number): Collection<K, V>;
    clone(): Collection<K, V>;
    toString(): string;
}

type Callback = () => void | Promise<void>;
export class AsyncLimiter extends TypedEmitter<{
    limited: (wait: number) => void;
}> {
    readonly defaultTokens: number;
    readonly waitTime: number;
    readonly wait: boolean;
    constructor(defaultTokens: number, waitTime: number, wait: boolean);
    consume(callback: Callback, important?: boolean): Promise<void>;
    lock(wait?: number): Promise<void>;
    unlock(): Promise<void>;
}
export {};

export type Tuple<A = any, B = any> = [A, B];
export type Dictionary<V = any, K extends PropertyKey = string> = Record<K, V>;
export type Class<T = any> = {
    new (...args: any[]): T;
};
export interface EventEmitterLike {
    emit(event: string, ...args: any[]): boolean | void;
    addListener(event: string, listener: (...args: any[]) => void): EventEmitterLike | any;
    removeListener(event: string, listener: (...args: any[]) => void): EventEmitterLike | any;
}

export const INTERVALS: Set<NodeJS.Timeout>;
export const TIMEOUTS: Set<NodeJS.Timeout>;
export function clearIntervals(): number;
export function clearTimeouts(): number;
export function clearScheduled(): [timeouts: number, intervals: number];
export function createInterval(delay: number, block: Task, ...args: any[]): Interval;
export function createTimeout(delay: number, block: Task, ...args: any[]): Timeout;

export class Interval extends TaskScheduler {
    start(delay: number, ...args: any[]): Interval;
    stop(): void;
}

export class Timeout extends TaskScheduler {
    start(delay: number, ...args: any[]): Timeout;
    stop(): void;
}

export function isObject(input: unknown): input is Dictionary;

export function mergeObject<O extends Record<PropertyKey, any> = Record<PropertyKey, any>>(...objects: Partial<O>[]): O;

export function safeRequire<T>(name: string): T | undefined;

export abstract class TaskScheduler {
    ref?: NodeJS.Timeout;
    protected _task: Task;
    constructor(task: Task);
    abstract start(delay: number, ...args: any[]): TaskScheduler;
    abstract stop(): void;
}
export type Task = (...args: any[]) => void;

