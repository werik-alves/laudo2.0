import "dotenv/config";
import express from "express";
import cors from "cors";
import equipamentosRouter from "./routes/equipamentos";
import modelosRouter from "./routes/modelos";
import authRouter from "./routes/auth";
import lojasRouter from "./routes/lojas";
// import laudosRouter from "./routes/laudos";
import setoresRouter from "./routes/setor";
const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.options(
  "*",
  cors({ origin: true, methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"] })
);

// Substitui handlers inline por routers
app.use("/auth", authRouter);
// app.use("/lojas", lojasRouter);
app.use("/lojas", lojasRouter);
app.use("/setores", setoresRouter);
app.use("/equipamentos", equipamentosRouter);
app.use("/modelos", modelosRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
