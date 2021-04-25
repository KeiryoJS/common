/*
 * NeoCord
 * Copyright 2021 melike2d
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { TaskScheduler } from "./TaskScheduler";
import { Scheduled } from "./Scheduled";

export class Interval extends TaskScheduler {
  /**
   * Starts executing the configured task every `delay` milliseconds
   *
   * @param delay The delay between each execution.
   * @param args The arguments to pass.
   */
  start(delay: number, ...args: any[]): Interval {
    if (this.ref) {
      return this;
    }

    this.ref = setInterval(this._task, delay, ...args);
    return this;
  }

  /**
   * Disposes of this interval.
   */
  dispose(): void {
    if (this.ref) {
      clearInterval(this.ref);
      Scheduled.INTERVALS.delete(this.ref);
    }
  }
}