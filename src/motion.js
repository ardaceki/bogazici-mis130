// Short, interruptible transitions; controls stay usable during every animation.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const running = new Set();
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) for (const animation of running) animation.cancel();
});

export function reveal(elements, { stagger = 0, distance = 4 } = {}) {
  if (reducedMotion.matches) return;
  Array.from(elements)
    .filter(Boolean)
    .forEach((element, index) => {
      element.getAnimations().forEach((animation) => animation.cancel());
      const animation = element.animate(
        [
          { opacity: 0, transform: `translateY(${distance}px)` },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        {
          duration: 190,
          delay: index * stagger,
          easing: 'cubic-bezier(.2,.7,.3,1)',
          fill: 'backwards',
        },
      );
      running.add(animation);
      animation.finished.catch(() => {}).finally(() => running.delete(animation));
    });
}
