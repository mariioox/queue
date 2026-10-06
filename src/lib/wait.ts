export const DEFAULT_WAIT_MINUTES = 15;

/** Estimated wait for a queue of `queueLength` people at `minutesPerCustomer` each. */
export function estimateWaitMinutes(
  queueLength: number,
  minutesPerCustomer: number = DEFAULT_WAIT_MINUTES,
): number {
  if (queueLength <= 0) return 0;
  return queueLength * minutesPerCustomer;
}
