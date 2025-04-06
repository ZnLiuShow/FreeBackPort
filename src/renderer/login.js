document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // 验证逻辑...
    window.electronAPI.navigateTo('main.html');
  });