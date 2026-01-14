// SPA Animation: Reveal sections on scroll
window.addEventListener('DOMContentLoaded', () => {
    const fadeEls = document.querySelectorAll('.fade-in');
    const reveal = () => {
        fadeEls.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 40) {
                el.style.opacity = 1;
            }
        });
    };
    reveal();
    window.addEventListener('scroll', reveal);
});
