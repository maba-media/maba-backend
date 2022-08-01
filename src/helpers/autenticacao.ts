import bcrypt from 'bcrypt'

export const hashSenha = senha => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        reject(err)
      }

      bcrypt.hash(senha, salt, (err, hash) => {
        if (err) {
          reject(err)
        }
        resolve(hash)
      })
    })
  })
}

export const compararSenha = (senha, hashed) => {
  return bcrypt.compare(senha, hashed)
}
