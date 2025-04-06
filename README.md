# FreeBackPort

**Clone and run for a quick way to see Electron in action.**

A basic Electron application needs just these files:

- `package.json` - Points to the app's main file and lists its details and dependencies.
- `main.js` - Starts the app and creates a browser window to render HTML. This is the app's **main process**.
- `xxx.html` - A web page to render. This is the app's **renderer process**.
- `preload.js` - A content script that runs before the renderer process loads.

You can learn more about each of these components in depth within the [Tutorial](https://electronjs.org/docs/latest/tutorial/tutorial-prerequisites).

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/electron/FreeBackPort
# Go into the repository
cd FreeBackPort
# Install dependencies
npm install
# Run the app
npm start
```

Note: If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.

## Resources for Learning Electron

- [electronjs.org/docs](https://electronjs.org/docs) - all of Electron's documentation
- [Electron Fiddle](https://electronjs.org/fiddle) - Electron Fiddle, an app to test small Electron experiments

## License

[CC0 1.0 (Public Domain)](LICENSE.md)
"# FreeBackPort" 

### 1.0.0

This is a free back-end management system for you to customize the secondary development of your own back-end management system."# FreeBackPort" 


your-project/
├── src/
│   ├── login.html                 # 登录主界面
│   ├── change-password.html       # 修改密码界面
│   ├── main.html                  # 主管理界面
│   ├── styles/
│   │   ├── change-password.css    # 更改密码样式
│   │   ├── login.css              # 登录界面样式
│   │   ├── main.css               # 主界面样式
│   ├── renderer/
│   │   ├── change-password.js     # 更改密码逻辑
│   │   ├── login.js               # 登录界面逻辑
│   │   ├── main.js                # 主界面逻辑
├── main.js                        # Electron主进程
├── preload.js