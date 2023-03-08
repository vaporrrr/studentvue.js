import asyncPool from 'tiny-async-pool';

/**
 * Use concurrency limits to fulfill promises
 * @param poolLimit The concurrency limit
 * @param array An array of Promises
 * @param iteratorFn A map function
 * @returns Returns the results of each promise.
 */
export async function asyncPoolAll<IN, OUT>(
  poolLimit: number,
  array: readonly IN[],
  iteratorFn: (generator: IN) => Promise<OUT>
) {
  const results: Awaited<OUT>[] = [];
  for await (const result of asyncPool(poolLimit, array, iteratorFn)) {
    results.push(result);
  }
  return results;
}

/**
 * A short and simplified version of the single-line if-else statement.
 * @param xmlArr The input is a value parsed from the XML parser library. It will be an array
 * @returns Returns undefined or the value of the XML
 */
export function optional<T>(xmlArr?: T[]): T | undefined {
  return xmlArr ? xmlArr[0] : undefined;
}

/**
 * Parsing a string to a Date
 * @param dateString The input is a date string
 * @returns Returns Date object
 */
export function parseDateString(dateString: string) {
  const m = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  return m
    ? new Date(parseInt(m[3]), parseInt(m[1]) - 1, parseInt(m[2]))
    : new Date(dateString);
}
