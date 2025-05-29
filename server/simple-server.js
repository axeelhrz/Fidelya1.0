const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("./generated/prisma");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", email);
    
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    res.json({ message: "Login successful", user: { email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Simple server running on port ${PORT}`);
});
