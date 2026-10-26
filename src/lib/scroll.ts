export function isNearBottom(
  element: {
    scrollHeight: number;
    scrollTop: number;
    clientHeight: number;
  },
  threshold = 80,
) {
  return (
    element.scrollHeight - element.scrollTop - element.clientHeight <=
    threshold
  );
}
