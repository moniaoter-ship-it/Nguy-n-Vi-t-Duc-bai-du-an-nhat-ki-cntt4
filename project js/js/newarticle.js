document.addEventListener("DOMContentLoaded", function () {

    // 1. LẤY ROLE & USER
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const currentRole = (currentUser && currentUser.role) 
                        ? currentUser.role.toString().toLowerCase().trim() 
                        : 'guest';

    // 2. MOOD PICKER LOGIC (Giữ nguyên)
    let currentMood = "😊";
    const btnMoodToggle = document.getElementById('btnMoodToggle');
    const moodPicker = document.getElementById('moodPicker');
    if (btnMoodToggle) {
        btnMoodToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            moodPicker.classList.toggle('show');
        });
        document.querySelectorAll('.mood-item').forEach(item => {
            item.addEventListener('click', (e) => {
                currentMood = item.getAttribute('data-mood');
                document.getElementById('selectedMoodIcon').innerText = currentMood;
                document.getElementById('selectedMoodText').innerText = item.getAttribute('data-name');
                moodPicker.classList.remove('show');
            });
        });
    }

    // 3. XỬ LÝ DÁN LINK ẢNH & PREVIEW
    const imageUrlInput = document.getElementById('imageUrl');
    const preview = document.getElementById('imagePreview');
    const container = document.getElementById('imagePreviewContainer');

    if (imageUrlInput) {
        imageUrlInput.addEventListener('input', function () {
            const url = this.value.trim();
            if (url) {
                preview.src = url;
                container.classList.remove('hidden');
                // Nếu link hỏng, hiện ảnh lỗi mặc định
                preview.onerror = () => {
                    preview.src = "https://images.unsplash.com/photo-1594322436404-5a0526db4d13?q=80&w=1000&auto=format&fit=crop";
                };
            } else {
                container.classList.add('hidden');
            }
        });
    }

    // Hàm xóa ảnh (gắn vào window để gọi từ HTML)
    window.removeImage = function() {
        imageUrlInput.value = "";
        container.classList.add('hidden');
    };

    // 4. NÚT ĐĂNG BÀI
    const btnAddPost = document.getElementById('btnAddPost');
    if (btnAddPost) {
        btnAddPost.addEventListener('click', function () {
            const title = document.getElementById('postTitle').value.trim();
            const topic = document.getElementById('postTopic').value.trim();
            const content = document.getElementById('postContent').value.trim();
            const imageUrl = document.getElementById('imageUrl').value.trim();
            const status = document.querySelector('input[name="status"]:checked').value;

            if (!title || !content || !topic) {
                Swal.fire('Lỗi', 'Điền đủ thông tin mới đăng được nhé!', 'error');
                return;
            }

            const authorName = currentUser 
                ? `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() 
                : "Ẩn danh";

            const newPost = {
                id: Date.now(),
                title,
                topic,
                mood: currentMood,
                content,
                author: authorName,
                status,
                date: new Date().toLocaleDateString('vi-VN'),
                // Nếu không dán link, dùng ảnh mặc định online
                image: imageUrl || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000&auto=format&fit=crop"
            };

            const listPosts = JSON.parse(localStorage.getItem('listPosts')) || [];
            listPosts.unshift(newPost);
            localStorage.setItem('listPosts', JSON.stringify(listPosts));

            Swal.fire({
                icon: 'success',
                title: 'Đã đăng bài!',
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                window.location.href = (currentRole === 'admin') 
                    ? "../pages/article_manage.html" 
                    : "../pages/homepage.html";
            });
        });
    }

    // 5. NÚT BACK
    const btnBack = document.getElementById('btnBack');
    if (btnBack) {
        btnBack.addEventListener('click', () => {
            window.location.href = (currentRole === 'admin') ? "article_manage.html" : "homepage.html";
        });
    }
});