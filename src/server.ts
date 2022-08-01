require('dotenv').config()
import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'

import autenRoutes from '@routes/autenticacao'

const morgan = require('morgan')

const app = express()
const http = require('http').createServer(app)

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('🤖 Banco de Dados conectado...'))
  .catch(err =>
    console.log('⛔️ Erro na conexão com o Banco de Dados: ', err, '...')
  )

app.use(express.json({ limit: '4mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(morgan('dev'))

app.use('/api', autenRoutes)

const port = process.env.PORT || 8000

http.listen(port, () => console.log('🚀 Servidor rodando na porta 8000...'))
