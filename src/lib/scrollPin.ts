/** How close to the bottom (in pixels) still counts as "at the bottom". */
export const NEAR_BOTTOM_PX = 48;

/**
 * True when a scroll container is at, or within a small distance of,
 * the bottom. Used to decide whether new content should keep the view
 * pinned to the latest message.
 */
export function isNearBottom(
  scrollTop: number,
  clientHeight: number,
  scrollHeight: number,
  threshold: number = NEAR_BOTTOM_PX
): boolean {
  return scrollHeight - scrollTop - clientHeight <= threshold;
}
