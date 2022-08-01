import { compararSenha, hashSenha } from '@helpers/autenticacao'
import Usuario from '@models/usuario'
import jwt from 'jsonwebtoken'
const nanoid = 'nanoid'

require('dotenv').config()
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const cadastrarUsuario = async (req, res) => {
  try {
    const { nome, email, senha } = req.body

    if (!nome) {
      return res.json({
        error: 'Nome não informado'
      })
    }

    if (!email) {
      return res.json({
        error: 'Email não informado'
      })
    }

    if (!senha || senha.lenght < 6) {
      return res.json({
        error: 'Senha é necessária e deve ter no mínimo 6 caracteres'
      })
    }

    const existe = await Usuario.findOne({ email })

    if (existe) {
      return res.json({
        error: 'Email já cadastrado'
      })
    }

    const hashedSenha = await hashSenha(senha)

    try {
      const usuario = await new Usuario({
        nome,
        email,
        senha: hashedSenha
      }).save()

      const token = jwt.sign({ _id: usuario.id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
      })

      const { senha, ...rest } = usuario._doc
      return res.json({
        token,
        usuario: rest
      })
    } catch (err) {
      console.log(err)
    }
  } catch (err) {
    console.log(err)
  }
}

export const logarUsuario = async (req, res) => {
  try {
    const { email, senha } = req.body
    const usuario = await Usuario.findOne({ email })

    if (!usuario) {
      return res.json({
        error: 'Usuário não encontrado'
      })
    }

    const comparar = await compararSenha(senha, usuario.senha)

    if (!comparar) {
      return res.json({
        error: 'Senha incorreta'
      })
    }

    const token = jwt.sign({ _id: usuario.id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    })

    usuario.senha = undefined
    usuario.secret = undefined
    res.json({
      token,
      usuario
    })
  } catch (err) {
    console.log(err)
    return res.status(400).json('Erro. Tente novamente.')
  }
}

export const esqueceuSenha = async (req, res) => {
  const { email } = req.body
  const usuario = await Usuario.findOne({ email })

  console.log('USUARIO ===> ', usuario)

  if (!usuario) {
    return res.json({ error: 'Usuário não encontrado' })
  }

  const codigoReset = nanoid(5).toUpperCase()

  usuario.codigoReset = codigoReset
  usuario.save()

  const emailData = {
    from: process.env.EMAIL_FROM,
    to: usuario.email,
    subject: 'Recuperação de senha',
    html: '<h1>Seu código de redefinição de senha é: {codigoReset}</h1>'
  }

  try {
    const data = await sgMail.send(emailData)
    console.log(data)
    res.json({ ok: true })
  } catch (err) {
    console.log(err)
    res.json({ ok: false })
  }
}

export const resetarSenha = async (req, res) => {
  try {
    const { email, senha, codigoReset } = req.body
    const usuario = await Usuario.findOne({ email, codigoReset })

    if (!usuario) {
      return res.json({ error: 'Email ou código de redefinição é inválido' })
    }

    if (!senha || senha.length < 6) {
      return res.json({
        error: 'Senha é necessária e deve ter no mínimo 6 caracteres'
      })
    }

    const hashedSenha = await hashSenha(senha)

    usuario.senha = hashedSenha
    usuario.codigoReset = ''
    usuario.save()

    res.json({ ok: true })
  } catch (err) {
    console.log(err)
  }
}
