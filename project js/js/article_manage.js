document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser || currentUser.role !== 'admin') {
        window.location.replace("../pages/login.html");
        return;
    }

    // ================== 2. GLOBAL ==================
    const articleTableBody = document.querySelector('table tbody');
    const pageNumbersContainer = document.querySelector(".page-numbers");
    const btnPrev = document.querySelectorAll(".btn-page-nav")[0];
    const btnNext = document.querySelectorAll(".btn-page-nav")[1];

    let currentPage = 1;
    const rowsPerPage = 5;
    let allPosts = [];

    // ================== 3. MENU AVATAR ==================
    const headerRight = document.querySelector(".header-right");
    const menuList = document.querySelector(".menu-list");
    let timeoutId;

    if (headerRight && menuList) {
        const showMenu = () => {
            clearTimeout(timeoutId);
            menuList.classList.add("active");
        };

        const hideMenu = () => {
            timeoutId = setTimeout(() => {
                menuList.classList.remove("active");
            }, 400);
        };

        headerRight.addEventListener("mouseenter", showMenu);
        headerRight.addEventListener("mouseleave", hideMenu);
        menuList.addEventListener("mouseenter", () => clearTimeout(timeoutId));
        menuList.addEventListener("mouseleave", hideMenu);
    }

    // ================== 4. LOGOUT ==================
    const logoutBtns = document.querySelectorAll('#btnLogout, .nav-item.logout');

    logoutBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            Swal.fire({
                title: 'Đăng xuất?',
                text: "Bạn sẽ quay lại màn hình đăng nhập!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#5c67f2',
                confirmButtonText: 'Đồng ý',
                cancelButtonText: 'Hủy'
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem('currentUser');
                    window.location.replace("../pages/login.html");
                }
            });
        });
    });

    // ================== 5. RENDER ==================
    function renderAdminPosts() {
        allPosts = JSON.parse(localStorage.getItem('listPosts')) || [];

        const totalPages = Math.ceil(allPosts.length / rowsPerPage);
        if (currentPage > totalPages) currentPage = totalPages || 1;

        const start = (currentPage - 1) * rowsPerPage;
        const paginatedPosts = allPosts.slice(start, start + rowsPerPage);

        articleTableBody.innerHTML = '';

        if (paginatedPosts.length === 0) {
            articleTableBody.innerHTML =
                `<tr><td colspan="7" style="text-align:center; padding:20px;">Chưa có bài viết.</td></tr>`;
        }

        paginatedPosts.forEach(post => {
            const shortContent = post.content?.length > 40
                ? post.content.substring(0, 40) + "..."
                : (post.content || "Chưa có nội dung");

            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td><img src="${post.image}" class="row-thumb"></td>
                <td class="bold">${post.title}</td>
                <td><span class="status-tag public">${post.topic}</span></td>
                <td class="text-muted">${shortContent}</td>
                <td>
                    <span class="status-tag ${post.status === 'Private' ? 'private' : 'public'}">
                        ${post.status || 'Public'}
                    </span>
                </td>
                <td>
                    <select class="status-dropdown" onchange="updatePostStatus('${post.id}', this.value)">
                        <option value="Public" ${post.status === 'Public' ? 'selected' : ''}>Public</option>
                        <option value="Private" ${post.status === 'Private' ? 'selected' : ''}>Private</option>
                    </select>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" onclick="openEditModal('${post.id}')">Sửa</button>
                        <button class="btn-delete" data-id="${post.id}">Xóa</button>
                    </div>
                </td>
            `;

            articleTableBody.appendChild(tr);
        });

        renderPagination(totalPages);
        addDeleteEvents();
    }

    // ================== 6. PAGINATION ==================
    function renderPagination(totalPages) {
        pageNumbersContainer.innerHTML = "";

        for (let i = 1; i <= totalPages; i++) {
            const span = document.createElement("span");
            span.className = i === currentPage ? "num active" : "num";
            span.innerText = i;
            span.onclick = () => {
                currentPage = i;
                renderAdminPosts();
            };
            pageNumbersContainer.appendChild(span);
        }

        btnPrev.style.opacity = currentPage === 1 ? "0.5" : "1";
        btnNext.style.opacity = currentPage === totalPages ? "0.5" : "1";
    }

    btnPrev.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            renderAdminPosts();
        }
    };

    btnNext.onclick = () => {
        const totalPages = Math.ceil(allPosts.length / rowsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderAdminPosts();
        }
    };

    // ================== 7. UPDATE STATUS ==================
    window.updatePostStatus = function (postId, newStatus) {
        let listPosts = JSON.parse(localStorage.getItem('listPosts')) || [];
        const idx = listPosts.findIndex(p => p.id == postId);

        if (idx !== -1) {
            listPosts[idx].status = newStatus;
            localStorage.setItem('listPosts', JSON.stringify(listPosts));
            renderAdminPosts();
        }
    };

    // ================== 8. EDIT (UPGRADED UI - DÙNG LINK ONLINE) ==================
window.openEditModal = function (postId) {
    let listPosts = JSON.parse(localStorage.getItem('listPosts')) || [];
    const post = listPosts.find(p => p.id == postId);
    if (!post) return;

    const categories = JSON.parse(localStorage.getItem("categories")) || [];
    let options = categories.map(cat =>
        `<option value="${cat.name}" ${post.topic === cat.name ? 'selected' : ''}>${cat.name}</option>`
    ).join('');

    Swal.fire({
        title: 'Chỉnh sửa bài viết',
        width: 600,
        html: `
            <div class="edit-modal-content">
                <div class="image-upload-wrapper">
                    <img id="edit-img-preview" src="${post.image}" style="max-height: 200px; width: 100%; object-fit: cover; border-radius: 8px;">
                </div>

                <div class="edit-field-group">
                    <label>Link ảnh Online (URL)</label>
                    <input id="edit-img-url" class="custom-swal-input" 
                           placeholder="Dán link ảnh từ web vào đây..." 
                           value="${post.image}">
                </div>

                <div class="edit-field-group">
                    <label>Tiêu đề</label>
                    <input id="edit-title" class="custom-swal-input" value="${post.title}">
                </div>

                <div class="edit-field-group">
                    <label>Chủ đề</label>
                    <select id="edit-topic" class="custom-swal-select">${options}</select>
                </div>

                <div class="edit-field-group">
                    <label>Nội dung</label>
                    <textarea id="edit-content" class="custom-swal-textarea">${post.content || ''}</textarea>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Lưu thay đổi',
        cancelButtonText: 'Hủy',
        confirmButtonColor: '#5c67f2',

        didOpen: () => {
            const urlInput = document.getElementById('edit-img-url');
            const preview = document.getElementById('edit-img-preview');

            urlInput.addEventListener('input', (e) => {
                preview.src = e.target.value || "https://via.placeholder.com/400x200?text=No+Image";
            });
        },

        preConfirm: () => {
            const title = document.getElementById('edit-title').value.trim();
            const content = document.getElementById('edit-content').value.trim();
            const imageUrl = document.getElementById('edit-img-url').value.trim();

            if (!title || !content || !imageUrl) {
                return Swal.showValidationMessage('Vui lòng nhập đủ thông tin và Link ảnh!');
            }

            return {
                title,
                content,
                topic: document.getElementById('edit-topic').value,
                image: imageUrl 
            };
        }
    }).then(result => {
        if (result.isConfirmed) {
            const idx = listPosts.findIndex(p => p.id == postId);
            listPosts[idx] = { ...listPosts[idx], ...result.value };
            localStorage.setItem('listPosts', JSON.stringify(listPosts));
            renderAdminPosts();
            Swal.fire('Thành công!', 'Đã cập nhật bằng link online', 'success');
        }
    });
};
    // ================== 9. DELETE ==================
    function addDeleteEvents() {
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.onclick = function () {
                const postId = this.getAttribute('data-id');

                Swal.fire({
                    title: 'Xóa bài?',
                    text: "Không thể khôi phục!",
                    icon: 'error',
                    showCancelButton: true,
                    confirmButtonText: 'Xóa',
                    cancelButtonText: 'Hủy'
                }).then(result => {
                    if (result.isConfirmed) {
                        let listPosts = JSON.parse(localStorage.getItem('listPosts')) || [];
                        listPosts = listPosts.filter(p => p.id != postId);

                        localStorage.setItem('listPosts', JSON.stringify(listPosts));
                        renderAdminPosts();

                        Swal.fire('Đã xóa!', '', 'success');
                    }
                });
            };
        });
    }

    // ================== INIT ==================
    renderAdminPosts();
});