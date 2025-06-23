const themeToggle = {
    
    applySavedTheme: () => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-bs-theme', savedTheme);
        
        const toggleIcon = document.getElementById('theme-toggle-icon');
        if (toggleIcon) {
            toggleIcon.className = savedTheme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
        }
    },

    
    toggle: () => {
        const currentTheme = document.documentElement.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        document.getElementById('theme-toggle-icon').className = newTheme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
    }
};


document.addEventListener('DOMContentLoaded', themeToggle.applySavedTheme);