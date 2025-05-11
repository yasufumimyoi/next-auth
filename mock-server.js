const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// テスト用のユーザーデータ
const testUser = {
  email: 'test@example.com',
  password: '123aaa'
};

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (email === testUser.email && password === testUser.password) {
    res.json({
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
      expired: Math.floor(Date.now() / 1000) + 3600 // 1時間後
    });
  } else {
    res.status(401).json({
      error: 'AuthenticationError',
      message: '認証に失敗しました',
      statusCode: 401
    });
  }
});

app.post('/auth/refresh', (req, res) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    res.json({
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
      expired: Math.floor(Date.now() / 1000) + 3600 // 1時間後
    });
  } else {
    res.status(401).json({
      error: 'InvalidTokenError',
      message: 'トークンが無効です',
      statusCode: 401
    });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Mock server is running on http://localhost:${PORT}`);
}); 