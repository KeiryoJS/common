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

import { Collection } from "./Collection";

import type { Class, Dictionary } from "./types";

export class Extender<M extends Dictionary<Class>> {
  readonly structures = new Map<keyof M, Class>();

  /**
   * @param map The structure map.
   */
  constructor(map: M) {
    this.structures = Collection.from(map);
  }

  /**
   * Returns a structure that's assigned to the provided key.
   *
   * @param key Structure's key.
   */
  get<K extends keyof M>(key: K): M[K] {
    const struct = this.structures.get(key);
    if (!struct) {
      throw new Error(`Unknown structure "${key}"`);
    }

    return struct as M[K];
  }

  /**
   * Used to extend an existing structure.
   *
   * @param key Key of the structure to extend.
   * @param extender The extender
   */
  extend<K extends keyof M, E extends M[K]>(key: K, extender: (base: M[K]) => E): Extender<M> {
    const base = this.structures.get(key);
    if (!base) {
      throw new Error(`Unknown structure "${key}"`);
    }

    const extended = extender(base as M[K]);
    if (!(extended instanceof base)) {
      throw new TypeError("Returned class does not inherit base class.");
    }

    this.structures.set(key, extended);
    return this;
  }
}
