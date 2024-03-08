import { db } from '../connect.js'
import validator from 'email-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = (req, res) => {
  const q = 'SELECT * FROM users WHERE email = ? OR username = ?'

  db.query(q, [req.body.email, req.body.username], (err, data) => {
    if (err) return res.status(401).json(err)

    if (data.length)
      return res
        .status(201)
        .json('Użytkownik o podanym adresie email lub nazwie już istnieje.')

    const q = 'INSERT INTO users(`username`,`email`,`password`) values(?)'

    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(req.body.password, salt)

    const values = [req.body.username, req.body.email, hashedPassword]

    if (values.includes(''))
      return res.status(201).json('Wypełnij wszystkie pola.')

    if (!validator.validate(req.body.email)) {
      return res.status(201).json('Podany adres email jest nieprawidłowy.')
    }

    db.query(q, [values], (err, data) => {
      if (err) return res.status(401).json(err)

      return res.status(200).json('Pomyślnie utworzono konto.')
    })
  })
}

export const login = (req, res) => {
  const q = 'SELECT * FROM users WHERE email = ?'

  db.query(q, [req.body.email], (err, data) => {
    if (err) return res.status(400).json(err)

    const values = [req.body.email, req.body.password]

    if (values.includes(''))
      return res.status(201).json('Wypełnij wszystkie pola.')

    if (!validator.validate(req.body.email)) {
      return res.status(201).json('Podany adres email jest nieprawidłowy.')
    }

    if (data.length === 0)
      return res.status(201).json('Nie znaleziono takiego użytkownika.')

    const checkedPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password,
    )

    if (!checkedPassword)
      return res.status(201).json('Podane hasło jest nieprawidłowe.')

    const token = jwt.sign({ id: data[0].id }, 'sekretnyklucz')

    const { password, ...others } = data[0]

    res
      .cookie('accessToken', token, { httpOnly: true })
      .status(200)
      .json(others)
  })
}
