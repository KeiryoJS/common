import { TypedEmitter } from "tiny-typed-emitter";
import { Mutex } from "./Mutex";

type Callback = () => void | Promise<void>;

// TODO: improve tsdoc

export class AsyncLimiter extends TypedEmitter<{ limited: (wait: number) => void; }> {
    private queue: Callback[] = [];
    private tokens: number;
    private executing = false;
    private locked = false;
    private last = 0;

    constructor(readonly defaultTokens: number, readonly waitTime: number, readonly wait: boolean) {
        super();
        this.tokens = +defaultTokens;
    }

    /**
     * Schedules a token to be consumed.
     *
     * @param callback The callback to run
     * @param important Whether this callback is important.
     */
    async consume(callback: Callback, important = false): Promise<void> {
        this.queue[important ? "unshift" : "push"](callback);
        await this._check();
    }

    /**
     * Locks any more tokens from being consumed.
     *
     * @param wait How long to wait.
     */
    async lock(wait = 0): Promise<void> {
        this.locked = true;
        if (wait) {
            await Mutex.wait(wait);
            await this.unlock();
        }
    }

    /**
     * Unlocks this limiter.
     */
    async unlock(): Promise<void> {
        this.locked = false;
        this._reset();
        await this._check();
    }

    private _reset(): void {
        this.tokens = this.defaultTokens;
    }

    private async _check(): Promise<void> {
        if (this.locked || this.executing || !this.queue.length) {
            return;
        }

        if (this.tokens <= 0) {
            const waitTime = Math.max(this.waitTime - (Date.now() - this.last), 0);
            this.emit("limited", waitTime);
            return this.lock(waitTime);
        }

        const token = this.queue.shift();
        if (token) {
            /* make sure to reset our tokens after the specified wait time. */
            if (this.tokens === this.defaultTokens) {
                setTimeout(this._reset.bind(this), this.waitTime).ref();
            }

            this.tokens--;
            this.last = Date.now();

            /* execute the token */
            try {
                this.executing = true;
                if (this.wait) {
                    await token();
                } else {
                    token();
                }
            } finally {
                this.executing = false;
                this._check();
            }
        }
    }
}
