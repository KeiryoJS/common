import "./prototypes";
import test from "ava";

test("Array#isEmpty returns true if the array is empty.", t => {
    const array: Array<void> = [];
    t.is(array.isEmpty, true);
});

test("Array#removeFirst removes the first matching element and returns it.", t => {
    const array: Array<number> = [ 1, 2, 3, 4, 5 ];
    t.is(array.removeFirst(3), 3);
    t.deepEqual(array, [ 1, 2, 4, 5 ]);
});

test("Array#take returns the first X elements.", t => {
    const array: Array<number> = [ 1, 2, 3, 4, 5 ];
    t.deepEqual(array.take(2), [ 1, 2 ]);
});

test("Array#takeLast returns the last X elements.", t => {
    const array: Array<number> = [ 1, 2, 3, 4, 5 ];
    t.deepEqual(array.takeLast(2), [ 4, 5 ]);
});

test("Array#drop removes the first X elements and returns them.", t => {
    const array: Array<number> = [ 1, 2, 3, 4, 5 ];
    t.deepEqual(array.drop(2), [ 1, 2 ]);
    t.deepEqual(array, [ 3, 4, 5 ]);
});

test("Array#dropLast removes the last X elements and returns them.", t => {
    const array: Array<number> = [ 1, 2, 3, 4, 5 ];
    t.deepEqual(array.dropLast(2), [ 4, 5 ]);
    t.deepEqual(array, [ 1, 2, 3 ]);
});
