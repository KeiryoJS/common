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

export abstract class TaskScheduler {
  /**
   * The NodeJS timeout ref.
   */
  ref?: NodeJS.Timeout;

  /**
   * The provided task to execute.
   * @protected
   */
  protected _task!: Task;

  /**
   * @param task The provided task.
   */
  public constructor(task: Task) {
    Reflect.defineProperty(this, "_task", { value: task });
  }

  /**
   * Start's this scheduled task.
   *
   * @param delay The delay in which to execute this task.
   * @param args The arguments to pass.
   */
  abstract start(delay: number, ...args: any[]): TaskScheduler;

  /**
   * Cancels this Scheduled task.
   */
  abstract dispose(): void;
}

export type Task = (...args: any[]) => void;
