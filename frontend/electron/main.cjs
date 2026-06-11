const { app, BrowserWindow } = require("electron");
const path = require("path");
const { fork } = require("child_process");

let mainWindow;
let backendProcess;

function startBackend() {
  const backendPath = path.join(__dirname, "../../backend/src/app.js");
  backendProcess = fork(backendPath, [], {
    env: { ...process.env, PORT: 5000 },
    silent: true,
  });
  
  backendProcess.stdout.on("data", (data) => {
    console.log(`Backend: ${data}`);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    title: "Comment Analyzer",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const isDev = !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

app.whenReady().then(() => {
  startBackend();
  // Wait 2 seconds for backend to start, then open window
  setTimeout(createWindow, 2000);
});

app.on("window-all-closed", () => {
  if (backendProcess) backendProcess.kill();
  app.quit();
});