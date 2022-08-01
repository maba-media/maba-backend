import mongoose from 'mongoose'
const { Schema } = mongoose

const usuarioSchema = new Schema(
  {
    nome: {
      type: String,
      trim: true,
      required: true
    },
    sobrenome: {
      type: String,
      trim: true,
      required: true
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    senha: {
      type: String,
      required: true,
      min: 6,
      max: 64
    },
    regra: {
      type: String,
      default: 'Administrador'
    },
    imagem: {
      public_id: '',
      url: ''
    },
    codigoReset: ''
  },
  { timestamps: true }
)

export default mongoose.model('Usuario', usuarioSchema)
