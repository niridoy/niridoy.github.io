// Minimal JavaScript for professional CV
// Focus: Content accessibility and basic enhancements

document.addEventListener('DOMContentLoaded', () => {
    console.log('CV loaded successfully');

    // Add smooth scrolling for any anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Print optimization
    window.addEventListener('beforeprint', () => {
        console.log('Preparing document for print...');
    });

    window.addEventListener('afterprint', () => {
        console.log('Print completed');
    });
});
