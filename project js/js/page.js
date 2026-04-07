document.addEventListener("DOMContentLoaded", function() {
    const btn = document.getElementById('btnDropdown');
    const menu = document.getElementById('dropdownMenu');

    btn.addEventListener('click', function(e) {
        e.stopPropagation(); 
        menu.classList.toggle('active');
    });

    document.addEventListener('click', function() {
        menu.classList.remove('active');
    });
});