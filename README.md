# 個人記帳本

![image](https://github.com/Kate-Chu/Expense_Tracker/blob/main/public/img/login.png)
![image](https://github.com/Kate-Chu/Expense_Tracker/blob/main/public/img/example.png)

## Heroku - 雲端部署版本

<b>Heroku Link</b>: https://vast-mesa-59472.herokuapp.com/users/login

## Features - 產品功能

1. 使用者可以註冊帳號或者透過 Facebook Login 直接登入
2. 使用者的密碼將會使用 bcrypt 處理以提高安全性
3. 登入後使用者可以個人化新增、瀏覽、修改及刪除個人支出資料
4. 使用者可以分類查詢不同類別的支出資料

## Installing - 專案安裝流程

1. 確認本地端已安裝 node.js 與 npm

2. 使用終端機 (Terminal) 複製此專案至本機電腦

```
git clone https://github.com/Kate-Chu/Expense_Tracker.git
```

3. 開啟終端機，進入存放此專案的資料夾

```
cd Expense_Tracker
```

4. 根據 .env.example 設定 .env

5. 設定完畢後，建立初始化 Dataset(請確認本機已安裝 MongoDB，並已啟動 DB 及建立 Dataset "expense_tracker")

```
npm run seed
```

6. 啟動伺服器，執行 app.js 檔案

```
nodemon app.js
```

7. 當終端機出現以下字樣，表示伺服器與資料庫已啟動並成功連結

```
Express is listening on localhost:3000
```

8. 開啟任一瀏覽器，輸入 [http://localhost:3000](http://localhost:3000) ，或 (MacOS 系統) 在終端機中按住 Command 鍵點選 [http://localhost:3000]，即可開始使用記帳網頁

9. 可使用種子資料登入查看

```
user1:
email: mary@example.com
password: 123
```

```
user2:
email: marc@example.com
password: 123
```

10. 在終端機按下 control + C 即可結束程式

## Development Tools - 開發者工具

1. bcryptjs v2.4.3
2. body-parser v1.19.2
3. connect-flash v0.1.1
4. dotenv v16.0.0
5. express v4.16.4
6. express-handlebars v6.0.3
7. express-session v1.17.2
8. method-override v3.0.0
9. mongoose v6.2.4
10. passport v0.5.2
11. passport-facebook v3.0.0
12. passport-local v1.0.0
13. serve v13.0.2
14. moment v2.29.2
