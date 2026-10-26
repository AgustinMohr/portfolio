type RevealCallback = () => void;

let observer: IntersectionObserver | null = null;
const callbacks = new WeakMap<Element, RevealCallback>();

function getObserver() {
  if (observer) return observer;

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        const callback = callbacks.get(entry.target);
        if (!callback) continue;

        callbacks.delete(entry.target);
        observer?.unobserve(entry.target);
        callback();
      }
    },
    { threshold: 0, rootMargin: "0px 0px 200px 0px" },
  );

  return observer;
}

export function observeReveal(
  element: Element,
  onReveal: RevealCallback,
) {
  callbacks.set(element, onReveal);
  getObserver().observe(element);

  return () => {
    callbacks.delete(element);
    observer?.unobserve(element);
  };
}
