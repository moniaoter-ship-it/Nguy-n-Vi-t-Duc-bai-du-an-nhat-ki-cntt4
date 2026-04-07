document.addEventListener("DOMContentLoaded", function () {

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = "login.html"; 
        return; 
    }
    const currentRole = (currentUser.role) ? currentUser.role.toString().toLowerCase().trim() : 'guest';

    const dropdownUserName = document.getElementById('dropdownUserName');
    if (dropdownUserName) dropdownUserName.innerText = `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim();

    let allPosts = JSON.parse(localStorage.getItem('listPosts')) || [];
    let filteredPosts = [...allPosts]; 
    let currentPage = 1;
    const postsPerPage = 6;
    let currentCategory = "All";

    function renderPosts() {
        const articleRow = document.getElementById('articleRow');
        if (!articleRow) return;

        articleRow.innerHTML = ''; 

        if (filteredPosts.length === 0) {
            articleRow.innerHTML = '<div style="text-align:center; width:100%; padding:40px;"><h3>Không có bài viết nào.</h3></div>';
            updatePagination(0);
            return;
        }

        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const postsToShow = filteredPosts.slice(startIndex, endIndex);

        postsToShow.forEach(post => {
            const postImg = post.image || "../assets/Image.png";
            const postHTML = `
                <div class="card" onclick="goToDetail(${post.id})" style="cursor: pointer;">
                    <div class="imager">
                        <img src="${postImg}" alt="Blog Image" />
                    </div>
                    <div class="card-body">
                        <p class="text-date">
                            <i class="fa-regular fa-calendar"></i> ${post.date} 
                            <span style="margin-left:8px">${post.mood || ""}</span>
                            <b style="margin-left:8px">by ${post.author}</b>
                        </p>
                        <div class="heading"><h3>${post.title}</h3></div>
                        <p class="text-content">
                            ${post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content}
                        </p>
                        <div class="categories">
                            <span class="badge">${post.topic}</span>
                            ${currentRole === 'admin' ? 
                                `<button class="btn-edit" onclick="event.stopPropagation(); editPost(${post.id})">Edit</button>` : ''}
                        </div>
                    </div>
                </div>`;
            articleRow.innerHTML += postHTML;
        });

        updatePagination(filteredPosts.length);
    }

    function updatePagination(total) {
        const paginationContainer = document.querySelector('.pagination');
        if (!paginationContainer) return;

        const totalPages = Math.ceil(total / postsPerPage) || 1;
        
        paginationContainer.innerHTML = `
            <button id="prevBtn" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
            <p>Page <strong>${currentPage}</strong> / ${totalPages}</p>
            <button id="nextBtn" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
        `;

        document.getElementById('prevBtn').onclick = () => { currentPage--; renderPosts(); window.scrollTo(0, 500); };
        document.getElementById('nextBtn').onclick = () => { currentPage++; renderPosts(); window.scrollTo(0, 500); };
    }

    function handleFilter() {
        const searchTerm = document.querySelector('.search-bar input').value.toLowerCase().trim();
        
        filteredPosts = allPosts.filter(post => {
            const matchCategory = (currentCategory === "All" || post.topic === currentCategory);
            const matchSearch = post.title.toLowerCase().includes(searchTerm);
            return matchCategory && matchSearch;
        });

        currentPage = 1; 
        renderPosts();
    }

    const categoryButtons = document.querySelectorAll('.filter-topics button');
    categoryButtons.forEach(btn => {
        btn.onclick = function() {
            categoryButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            currentCategory = this.innerText.trim();
            handleFilter();
        };
    });

    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) searchInput.oninput = handleFilter;

    const avatarBtn = document.getElementById('avatar');
    const dropdownMenu = document.querySelector('.dropdow');
    if (avatarBtn) {
        avatarBtn.onclick = (e) => { e.stopPropagation(); dropdownMenu.classList.toggle('show'); };
    }
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.onclick = () => {
            localStorage.removeItem('currentUser');
            window.location.href = "login.html";
        };
    }

    renderPosts();
});

function goToDetail(id) {
    localStorage.setItem('viewingPostId', id);
    window.location.href = "articledetail.html";
}

function editPost(id) {
    localStorage.setItem('editingPostId', id);
    window.location.href = "articledetail.html";
}