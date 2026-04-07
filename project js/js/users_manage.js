document.addEventListener("DOMContentLoaded", function () {
  const tableBody = document.getElementById("userTableBody");
  const searchInput = document.querySelector(".search-box");
  const userCountEl = document.querySelector(".user-count");
  const pageNumbersContainer = document.querySelector(".page-numbers");
  const btnPrev = document.querySelectorAll(".prev-next")[0];
  const btnNext = document.querySelectorAll(".prev-next")[1];

  let currentPage = 1;
  const rowsPerPage = 5; // Số user hiển thị trên mỗi trang
  let filteredUsers = [];

  function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
  }

  // Hàm hiển thị dữ liệu theo trang
  function renderUsers() {
    const users = getUsers();
    const filterValue = searchInput ? searchInput.value.toLowerCase().trim() : "";
    
    // Lọc dữ liệu
    filteredUsers = users.filter(user => 
      user.firstName.toLowerCase().includes(filterValue) || 
      user.email.toLowerCase().includes(filterValue)
    );

    if (userCountEl) userCountEl.innerText = `${filteredUsers.length} users`;

    // Tính toán phân trang
    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
    if (currentPage > totalPages) currentPage = totalPages || 1;

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedItems = filteredUsers.slice(start, end);

    tableBody.innerHTML = ""; 

    paginatedItems.forEach((user) => {
      const tr = document.createElement("tr");
      const status = user.status || "hoạt động";
      const statusClass = status === "bị khóa" ? "status-locked" : "status-active";

      tr.innerHTML = `
        <td>
          <div class="user-info">
            <img src="../assets/Image (5).png" class="avatar" alt="User">
            <div>
              <div class="name">${user.firstName} ${user.lastName || ''}</div>
              <div class="username">@${user.firstName.toLowerCase()}</div>
            </div>
          </div>
        </td>
        <td><span class="status ${statusClass}">${status}</span></td>
        <td><a href="#" class="email">${user.email}</a></td>
        <td class="actions">
          <button class="btn btn-block" onclick="toggleBlock('${user.email}', 'block')">block</button>
          <button class="btn btn-unblock" onclick="toggleBlock('${user.email}', 'unblock')">unblock</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    renderPagination(totalPages);
  }

  // Hàm vẽ các nút số trang
  function renderPagination(totalPages) {
    if (!pageNumbersContainer) return;
    pageNumbersContainer.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.innerText = i;
      if (i === currentPage) btn.classList.add("active");
      
      btn.addEventListener("click", () => {
        currentPage = i;
        renderUsers();
      });
      pageNumbersContainer.appendChild(btn);
    }

    // Hiệu ứng ẩn/hiện nút Prev/Next
    btnPrev.disabled = currentPage === 1;
    btnNext.disabled = currentPage === totalPages || totalPages === 0;
  }

  // Sự kiện nút Previous
  btnPrev.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderUsers();
    }
  });

  // Sự kiện nút Next
  btnNext.addEventListener("click", () => {
    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderUsers();
    }
  });

  window.toggleBlock = function(email, action) {
    let users = getUsers();
    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex !== -1) {
      users[userIndex].status = (action === 'block') ? "bị khóa" : "hoạt động";
      localStorage.setItem("users", JSON.stringify(users));
      Swal.fire("Thành công!", `Đã cập nhật trạng thái cho ${email}.`, "success");
      renderUsers();
    }
  };

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      currentPage = 1; // Reset về trang 1 khi tìm kiếm
      renderUsers();
    });
  }

  renderUsers();
});