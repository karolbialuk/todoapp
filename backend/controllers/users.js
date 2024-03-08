import { db } from '../connect.js'
import jwt from 'jsonwebtoken'

export const getUser = (req, res) => {
  const token = req.cookies.accessToken

  if (!token) return res.status(401).json('Nie jesteś zalogowany')

  jwt.verify(token, 'sekretnyklucz', (err, userInfo) => {
    if (err) return res.status(401).json(err)

    const q = 'SELECT username, id FROM users WHERE username LIKE ? AND id != ?'

    db.query(q, [`%${req.query.query}%`, userInfo.id], (err, data) => {
      if (err) return res.status(401).json(err)

      return res.status(200).json(data)
    })
  })
}

export const getUserById = (req, res) => {
  const token = req.cookies.accessToken

  if (!token) return res.status(401).json('Nie jesteś zalogowany')

  jwt.verify(token, 'sekretnyklucz', (err, userInfo) => {
    if (err) return res.status(401).json(err)

    const userIdArray = JSON.parse(req.query.userId)

    const q = 'SELECT username, id FROM users WHERE id IN (?)'

    db.query(q, [userIdArray], (err, data) => {
      if (err) return res.status(401).json(err)

      return res.status(200).json(data)
    })
  })
}
