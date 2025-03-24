1.配置launch.json
 "version": "0.2.0",
    "configurations": [ 
        {
            "name": "chrome调试",
            "type": "chrome",
            "request": "launch",
            "file": "${workspaceRoot}/bin/index.html",
            "runtimeArgs": [
                "--allow-file-access-from-files",
                "--disable-web-security"
            ],
            "sourceMaps": true,
            "webRoot": "${workspaceRoot}",
            "userDataDir": "${workspaceRoot}/.laya/chrome",
            "sourceMapPathOverrides": {
                "src/*": "${workspaceRoot}/src/*"
            }        
        }
    ]
2.开启调试
修改 .laya/compile.js
找到sourceMap: false 修改为 sourcemap: true
修改 src/tsconfig.json
将"sourceMap": false 修改为 "sourceMap": true