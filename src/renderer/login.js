document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // 这里可以添加验证逻辑
    window.electronAPI.navigateTo('main.html');
});

document.getElementById('changePasswordLink').addEventListener('click', (e) => {
    e.preventDefault();
    console.log('点击事件触发'); // 添加调试输出
    window.electronAPI.navigateTo('change-password.html');
});



