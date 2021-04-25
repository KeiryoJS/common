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

/**
 * Merges objects into one.
 *
 * @param {Dictionary} objects The objects to merge.
 */
export function mergeObject<O extends Record<PropertyKey, any> = Record<PropertyKey, any>>(...objects: Partial<O>[]): O {
  const o: Record<PropertyKey, any> = {};
  for (const object of objects) {
    for (const key of Reflect.ownKeys(object)) {
      const def = Reflect.get(object, key);
      if (!Reflect.has(o, key)) {
        Reflect.set(o, key, def);
      } else {
        let cur = Reflect.get(o, key);
        if (typeof cur === "object") {
          cur = mergeObject(cur, def);
        } else if (cur instanceof Map) {
          for (const [ k, v ] of def) {
            if (!cur.has(k)) {
              cur.set(k, v);
            }
          }
        } else if (cur instanceof Set) {
          const _new = new Set([ ...cur, ...def ]);
          cur = _new;
        } else if (Array.isArray(cur)) {
          cur = cur.concat(def);
        }

        Reflect.set(o, key, cur);
      }
    }
  }

  return o as O;
}