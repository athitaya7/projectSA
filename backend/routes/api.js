app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  // สมมติ check กับ DB
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  // ส่ง role กลับไป
  res.json({ token: "some-jwt-token", role: user.role }); // user.role = 'hr' หรือ 'employee'
});