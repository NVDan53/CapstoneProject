# Protected route
1. create a protected page and restrict only to logged in user with valid token
2. to verify if token is valid, you need to send request to backend
3. (browser will include cookie token in headers automatically)
4. if you get successful response then you can show the protected page to the user