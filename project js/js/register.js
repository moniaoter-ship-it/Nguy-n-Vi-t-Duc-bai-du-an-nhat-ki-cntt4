document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Reset các thông báo lỗi cũ
    const errorMsgs = document.querySelectorAll('.error-message');
    errorMsgs.forEach(msg => msg.innerText = "");
    
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => input.classList.remove('error-border'));

    // Lấy dữ liệu
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('pass').value;
    const confirmPassword = document.getElementById('confirm').value;

    let isValid = true;

    // Kiểm tra Họ tên
    if (firstName === "" || lastName === "") {
        document.getElementById('firstNameError').innerText = "Họ và tên không được để trống";
        isValid = false;
    }

    // Kiểm tra Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "") {
        document.getElementById('emailError').innerText = "Email không được để trống";
        isValid = false;
    } else if (!emailRegex.test(email)) {
        document.getElementById('emailError').innerText = "Email phải đúng định dạng";
        isValid = false;
    }

    // Kiểm tra Mật khẩu
    if (password === "") {
        document.getElementById('passError').innerText = "Mật khẩu không được để trống";
        isValid = false;
    } else if (password.length < 6) {
        document.getElementById('passError').innerText = "Mật khẩu tối thiểu 6 ký tự";
        isValid = false;
    }

    // Kiểm tra Xác nhận mật khẩu
    if (confirmPassword === "") {
        document.getElementById('confirmError').innerText = "Mật khẩu xác nhận không được để trống";
        isValid = false;
    } else if (password !== confirmPassword) {
        document.getElementById('confirmError').innerText = "Mật khẩu phải trùng khớp";
        isValid = false;
    }

    // Nếu không có lỗi thì mới xử lý tiếp
    if (isValid) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.find(user => user.email === email)) {
            document.getElementById('emailError').innerText = "Email này đã được đăng ký!";
            return;
        }

        users.push({ firstName, lastName, email, password });
        localStorage.setItem('users', JSON.stringify(users));

        alert("Đăng ký thành công!");
        window.location.href = "login.html";
    }
});