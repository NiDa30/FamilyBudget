import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import admin from "firebase-admin";
import { readFileSync } from "fs";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 Khởi tạo Firebase Admin
const serviceAccount = JSON.parse(
  readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT)
);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.firestore();

// 🧩 API thử nghiệm
app.get("/", (req, res) => {
  res.json({ message: "FamilyBudget API Server is running 🚀" });
});

app.get("/users", async (req, res) => {
  const snapshot = await db.collection("users").get();
  const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.json(users);
});

app.listen(process.env.PORT, () => {
  console.log(`✅ API Server running at http://localhost:${process.env.PORT}`);
});
