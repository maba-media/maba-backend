import express from 'express'
const router = express.Router()

const {
  cadastrarUsuario,
  logarUsuario,
  esqueceuSenha,
  resetarSenha
} = require('@controllers/autenticacao')

router.get('/', (req, res) => {
  return res.json({
    data: 'Olá Mundo!'
  })
})

router.post('/cadastrar-usuario', cadastrarUsuario)
router.post('/admin', logarUsuario)
router.post('/esqueceu-senha', esqueceuSenha)
router.post('/resetar-senha', resetarSenha)

export default router
