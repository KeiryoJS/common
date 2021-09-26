const EPOCH = 1420070400000n;
let INCREMENT = 0n;

export class Snowflake {
    /**
     * Deconstructs a Discord Snowflake.
     *
     * @param snowflake The snowflake to deconstruct.
     * @param epoch The epoch to use when deconstructing.
     */
    static deconstruct(snowflake: snowflake, epoch = EPOCH): DeconstructedSnowflake {
        const id = BigInt(snowflake);
        return {
            timestamp: (id >> 22n) + epoch,
            workerId: (id & 0x3e0000n) >> 17n,
            processId: (id & 0x1f000n) >> 12n,
            increment: id & 0xfffn,
            id: snowflake
        };
    }

    /**
     * Generates a new snowflake.
     *
     * @param options The options to use when generating a snowflake.
     */
    static generate(options: GenerateSnowflakeOptions = {}): snowflake {
        if (INCREMENT >= 4095n) {
            INCREMENT = 0n;
        }

        options.epoch = options.epoch ? BigInt(options.epoch) : EPOCH;
        options.timestamp = BigInt(options.timestamp ?? Date.now());
        options.processId = options.processId ? BigInt(options.processId) : 0n;
        options.workerId = options.workerId ? BigInt(options.workerId) : 0n;
        options.sequence = options.sequence ? BigInt(options.sequence) : INCREMENT++;

        const timestamp = ((options.timestamp - options.epoch) % 4398046511104n) << 22n
            , worker = (options.processId & (-1n ^ (-1n << 5n))) << 17n
            , process = (options.workerId & (-1n ^ (-1n << 5n))) << 12n
            , sequence = (options.sequence & (-1n ^ (-1n << 12n))) << 0n;

        return String(timestamp | worker | process | sequence);
    }
}

/**
 * A Twitter snowflake, except the default epoch is 2015-01-01T00:00:00.000Z
 *
 * ```
 * If we have a snowflake '266241948824764416' we can represent it as binary:
 *
 * 64                                          22     17     12          0
 *  000000111011000111100001101001000101000000  00001  00000  000000000000
 *           number of ms since epoch           worker  pid    increment
 * ```
 */
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
