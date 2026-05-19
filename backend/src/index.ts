import express from "express";
import cors from "cors";
import dotenv from 'dotenv';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json())

// Heath check
app.get("/", (req, res) => {
  res.json({status: 'ok', timestamp: new Date().toISOString() });
})

//Routes


//404
app.use((err, req, res, next) => {
 res.status(404).json({sucess: false, error: 'Rota não encontrada'});
})

//Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({sucess: false, error: 'Erro interno no servidor.'})
})

app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`)
})