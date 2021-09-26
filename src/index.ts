import "./prototypes";

export * from "./scheduler";
export * from "./functions";

export * from "./Mutex";
export * from "./Extender";
export * from "./Snowflake";
export * from "./Collection";
export * from "./AsyncLimiter";

export * from "./types";

declare global {
    interface Array<T> {
        /**
         * Whether this array is empty, uses {@link Array#size} to determine the returned value.
         */
        isEmpty: boolean;

        /**
         * Removes the first element that matches {@param value}
         *
         * @param value The value to remove.
         *
         * @returns T or undefined
         */
        removeFirst(value: T): T | undefined;

        /**
         * @param amount
         */
        take(amount: number): Array<T>;

        /**
         * @param amount
         */
        takeLast(amount: number): Array<T>;

        /**
         * @param amount
         */
        drop(amount: number): Array<T>;

        /**
         * @param amount
         */
        dropLast(amount: number): Array<T>;
    }
}

