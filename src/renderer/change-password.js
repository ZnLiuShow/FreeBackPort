// Welcome to qq group: 1030115250
document.getElementById('changeForm').addEventListener('submit', async(e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const newpassword = document.getElementById('newPassword').value;
    const safepassword = document.getElementById('securityCode').value;
    try {
        // 调用主进程的登录函数
        const isLoggedIn = await window.electronAPI.changepassword(username,  newpassword, safepassword);
        if (isLoggedIn) {
            alert('修改密码成功,请重新登录');
            window.electronAPI.navigateTo('login.html');
        } else {
            console.error('修改密码失败');
            alert('修改密码失败');
        }
    } catch (error) {       
        console.error('修改密码出错:', error);
        alert(`${error.message}`);
    }
});