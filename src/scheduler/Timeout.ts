import { TaskScheduler } from "./TaskScheduler";
import { TIMEOUTS } from "./Scheduled";

export class Timeout extends TaskScheduler {
    /**
     * Executes the configured task in x milliseconds..
     *
     * @param delay The amount of time to wait.
     * @param args The arguments to pass.
     */
    start(delay: number, ...args: any[]): Timeout {
        if (this.ref) {
            return this;
        }

        this.ref = setTimeout(() => this._execute(args), delay);
        return this;
    }

    /**
     * Disposes of this Timeout.
     */
    stop(): void {
        if (this.ref) {
            clearTimeout(this.ref);
            TIMEOUTS.delete(this.ref);
        }
    }

    private _execute(args: any[]) {
        this._task(...args);
        this.stop();
    }
}
