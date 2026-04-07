document.addEventListener("DOMContentLoaded", () => {

    const categoryInput = document.getElementById("category-name");
    const addBtn = document.querySelector(".add-btn");
    const tableBody = document.querySelector("table tbody");

    const getCategories = () => JSON.parse(localStorage.getItem("categories")) || [];

    const renderCategories = () => {
        const categories = getCategories();
        tableBody.innerHTML = ""; 

        categories.forEach((item, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td><span class="category-text">${item.name}</span></td>
                <td class="actions">
                    <button class="edit-btn" onclick="editCategory(${item.id})">
                        <i class="fa-solid fa-pen"></i> Edit
                    </button>
                    <button class="delete-btn" onclick="deleteCategory(${item.id})">
                        <i class="fa-solid fa-trash"></i> Delete
                    </button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    };
    addBtn.addEventListener("click", () => {
        const name = categoryInput.value.trim();
        if (!name) {
            Swal.fire("Lỗi!", "Tên danh mục không được để trống", "error");
            return;
        }

        const categories = getCategories();
        categories.push({ id: Date.now(), name: name });
        localStorage.setItem("categories", JSON.stringify(categories));
        
        categoryInput.value = "";
        renderCategories();
        Swal.fire("Thành công!", "Đã thêm danh mục", "success");
    });

    window.editCategory = (id) => {
        const categories = getCategories();
        const categoryToEdit = categories.find(c => c.id === id);

        Swal.fire({
            title: 'Chỉnh sửa danh mục',
            input: 'text',
            inputValue: categoryToEdit.name,
            showCancelButton: true,
            confirmButtonText: 'Lưu thay đổi',
            cancelButtonText: 'Hủy',
            inputValidator: (value) => {
                if (!value) {
                    return 'Bạn phải nhập tên danh mục!';
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {

                categoryToEdit.name = result.value;
                localStorage.setItem("categories", JSON.stringify(categories));
                
                renderCategories(); 
                Swal.fire('Đã cập nhật!', '', 'success');
            }
        });
    };

    window.deleteCategory = (id) => {
        Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: "Dữ liệu này sẽ bị xóa vĩnh viễn!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Xóa ngay',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                let categories = getCategories();
                categories = categories.filter(c => c.id !== id);
                localStorage.setItem("categories", JSON.stringify(categories));
                renderCategories();
                Swal.fire('Đã xóa!', '', 'success');
            }
        });
    };

    renderCategories();
});
