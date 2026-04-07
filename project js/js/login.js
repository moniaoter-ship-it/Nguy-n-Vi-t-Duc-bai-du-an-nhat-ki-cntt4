document.addEventListener("DOMContentLoaded", () => {
    const btnLogin = document.getElementById("btnLogin");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    btnLogin.addEventListener("click", (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        emailError.innerText = "";
        passwordError.innerText = "";
        let isValid = true;

        if (!email) {
            emailError.innerText = "Email không được để trống";
            isValid = false;
        }
        if (!password) {
            passwordError.innerText = "Mật khẩu không được để trống";
            isValid = false;
        }

        if (!isValid) return;

        if (email === "admin@gmail.com" && password === "admin123") {
            const adminUser = { firstName: "Admin", email: "admin@gmail.com", role: "admin" };
            localStorage.setItem('currentUser', JSON.stringify(adminUser));

            Swal.fire({
                icon: 'success',
                title: 'Admin Đăng nhập',
                text: 'Chào sếp! Đang chuyển hướng đến trang quản trị...',
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                window.location.href = "../pages/article_manage.html";
            });
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: `Chào mừng ${user.firstName} quay trở lại!`,
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                window.location.href = "../pages/homepage.html";
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Thất bại',
                text: 'Email hoặc mật khẩu không chính xác!',
                confirmButtonColor: '#dc3545',
                confirmButtonText: 'Thử lại'
            });
            emailError.innerText = "Thông tin không chính xác";
        }
    });
});