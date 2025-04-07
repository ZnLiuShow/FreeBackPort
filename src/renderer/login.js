// Welcome to qq group: 1030115250
window.addEventListener('DOMContentLoaded', async (e) => {
    e.preventDefault();
    try {
        const config = await window.electronAPI.readAppIni();
        if (config.login) {
            document.getElementById('username').value = config.login.username;
            document.getElementById('password').value = config.login.password;
        }
    } catch (error) {
        console.error('读取 app.ini 文件出错:', error);
    }
});

document.getElementById('loginForm').addEventListener('submit',  async(e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username === '' || password === '' ) {
        alert('请填写所有字段');
        return;
    }
    try {
        // 调用主进程的登录函数
        const isLoggedIn = await window.electronAPI.login(username, password);
        if (isLoggedIn) {
            const config = {
                login: {
                    username: username,
                    password: password
                }
            };
            await window.electronAPI.writeAppIni(config);
            window.electronAPI.navigateTo('main.html');
        } else {
            await window.electronAPI.clearAppIni();
            console.error('登录失败，请检查用户名和密码');
            alert('登录失败，请检查用户名和密码');
        }
    } catch (error) {       
        await window.electronAPI.clearAppIni();
        console.error('登录出错:', error);
        alert(`n${error.message}`);
    }
});

document.getElementById('changePasswordLink').addEventListener('click', (e) => {
    e.preventDefault();
    console.log('点击事件触发'); // 添加调试输出
    window.electronAPI.navigateTo('change-password.html');
});



