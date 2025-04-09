// Modules to control application life and create native browser window
// Welcome to qq group: 1030115250
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('node:path')
const fs = require('fs');
const ini = require('ini');
const crc64 = require('crc64-ecma');

// 引入各个模块
const { sendEncryptRequest, login } = require('./admin/login.js');
const { changepassword } = require('./admin/change.js');
const { genKeyCards } = require('./admin/generate.js');
const { manageUsers,queryUsers } = require('./admin/manage.js');
const { queryGenKeyCards, queryActivateKeyCards } = require('./admin/query.js');

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true, 
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the login.html of the app.
  mainWindow.loadFile('src/login.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // 添加监听器
  ipcMain.on('navigate-to', (event, path) => {
    const fullPath = `src/${path}`;
    console.log('加载路径:', fullPath); // 添加路径输出
    mainWindow.loadFile(`src/${path}`)
  })

  // 监听读取 app.ini 文件的请求
  ipcMain.handle('read-app-ini', async () => {
    try {
        const iniPath = getIniPath();
        const iniContent = fs.readFileSync(iniPath, 'utf-8');
        return ini.parse(iniContent);
    } catch (error) {
        console.error('读取 app.ini 文件出错:', error);
        return {};
    }
  });

  // 监听写入 app.ini 文件的请求
  ipcMain.handle('write-app-ini', async (event, config) => {
    try {
        const iniPath = getIniPath();
        const iniContent = ini.stringify(config);
        fs.writeFileSync(iniPath, iniContent);
        return true;
    } catch (error) {
        console.error('写入 app.ini 文件出错:', error);
        return false;
    }
  });

  // 监听清空 app.ini 文件的请求
  ipcMain.handle('clear-app-ini', async () => {
    try {
        const iniPath = getIniPath();
        fs.writeFileSync(iniPath, '');
        return true;
    } catch (error) {
        console.error('清空 app.ini 文件出错:', error);
        return false;
    }
  });

  ipcMain.handle('save-file', async (event, content) => {
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      filters: [
        { name: 'Text Files', extensions: ['txt'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    })

    if (!canceled) {
      try {
        await fs.promises.writeFile(filePath, content)
        return true
      } catch (error) {
        console.error('保存文件失败:', error)
        return false
      }
    }
    return false
  })

  // 处理 CRC64 计算请求
  ipcMain.handle('calculate-crc64', (event, input) => {
    return BigInt(crc64.crc64(input));
  });

  // 监听渲染进程的消息
  ipcMain.handle('sendEncryptRequest', sendEncryptRequest);
  ipcMain.handle('login', async (event, username, password) => {
      return await login(username, password);
  });
  ipcMain.handle('changepassword', async (event, username, newpassword, safepassword) => {
      return await changepassword(username, newpassword, safepassword);
  });
  ipcMain.handle('genKeyCards', async (event, num, type) => {
      return await genKeyCards(num, type);
  });
  ipcMain.handle('manageUsers', async (event, operations) => {
      return await manageUsers(operations);
  });
  ipcMain.handle('queryGenKeyCards', async (event, begin, end) => {
      return await queryGenKeyCards(begin, end);
  });
  ipcMain.handle('queryActivateKeyCards', async (event, begin, end) => {
      return await queryActivateKeyCards(begin, end);
  });
  ipcMain.handle('queryUsers', async (event, mode) => {
      return await queryUsers(mode);
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const getIniPath = () => {
  if (app.isPackaged) {
    // 生产环境路径
    const exeDir = path.dirname(app.getPath('exe')); // 获取可执行文件所在目录

    // 针对 macOS 特殊处理
    if (process.platform === 'darwin') {
      // 回退到 .app 包的父目录（如 /Applications）
      const appRoot = path.dirname(path.dirname(path.dirname(exeDir)));
      return path.join(appRoot, 'app.ini');
    }

    // Windows/Linux：直接使用可执行文件所在目录
    return path.join(exeDir, 'app.ini');
  } else {
    // 开发环境路径
    return path.join(__dirname, 'app.ini');
  }
};