// Welcome to qq group: 1030115250
document.getElementById('loginForm').addEventListener('submit',  async(e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    try {
        // 调用主进程的登录函数
        const isLoggedIn = await window.electronAPI.login(username, password);
        if (isLoggedIn) {
            window.electronAPI.navigateTo('main.html');
        } else {
            console.error('登录失败，请检查用户名和密码');
            alert('登录失败，请检查用户名和密码');
        }
    } catch (error) {       
        console.error('登录出错:', error);
        alert(`n${error.message}`);
    }
});

document.getElementById('changePasswordLink').addEventListener('click', (e) => {
    e.preventDefault();
    console.log('点击事件触发'); // 添加调试输出
    window.electronAPI.navigateTo('change-password.html');
});



