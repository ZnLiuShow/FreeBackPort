// Welcome to qq group: 1030115250
document.getElementById('changeForm').addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('更改密码事件触发'); // 添加调试输出
    // 这里可以添加更改密码的逻辑
    window.electronAPI.navigateTo('login.html');
});