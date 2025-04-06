document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // 这里可以添加验证逻辑
    window.electronAPI.navigateTo('main.html');
});

document.getElementById('changeForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // 这里可以添加更改密码的逻辑
    window.electronAPI.navigateTo('login.html');
});