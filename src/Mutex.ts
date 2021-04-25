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

import { createTimeout } from "./scheduler";

export class Mutex {
  #_queue: Entry[] = [];
  #_current?: Release;

  get locked(): boolean {
    return this.#_queue.length > 0;
  }

  /**
   * Blocks the event loop for an x amount of milliseconds.
   *
   * @param duration How long to block the event loop.
   */
  static async wait(duration: number): Promise<void> {
    return new Promise(resolve => createTimeout(duration, resolve));
  }

  async take(): Promise<Release> {
    const locked = this.locked,
      prom = new Promise<Release>((resolve, reject) => {
        this.#_queue.push({
          resolve,
          reject
        });
      });

    if (!locked) {
      this.release();
    }

    return prom;
  }

  cancel() {
    while (this.#_queue) {
      const entry = this.#_queue.shift();
      if (!entry) {
        break;
      }

      entry.reject();
    }
  }

  private release() {
    const next = this.#_queue.shift();
    if (!next) {
      return;
    }

    let released = false;
    this.#_current = () => {
      if (released) {
        return;
      }

      released = true;
      this.release();
    };

    next.resolve(this.#_current);
  }
}


type Release = () => void;
type Entry = {
  reject(): void;
  resolve(release: Release): void;
}
