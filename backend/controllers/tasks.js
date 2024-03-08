import { db } from '../connect.js'
import validator from 'email-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { query } from 'express'

export const addPost = (req, res) => {
  const token = req.cookies.accessToken

  if (!token) return res.status(401).json('Nie jesteś zalogowany')

  jwt.verify(token, 'sekretnyklucz', (err, userInfo) => {
    if (err) return res.status(401).json(err)

    const date = new Date(req.body.taskDate)

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    const formattedDate = `${day}.${month}.${year}`

    function addDays(date, days) {
      const result = new Date(date)
      result.setDate(result.getDate() + days)
      return result
    }

    let currentDate = new Date(req.body.taskDate)

    let tablica = []

    const formattedDateArrayItem = (currentDate) => {
      let day = ('0' + currentDate.getDate()).slice(-2)
      let month = ('0' + (currentDate.getMonth() + 1)).slice(-2)
      let year = currentDate.getFullYear()
      let formattedDate = day + '.' + month + '.' + year
      return formattedDate
    }

    const getNextDayOfWeek = (date, dayOfWeek) => {
      const currentDay = date.getDay()
      let difference = dayOfWeek - currentDay

      if (difference <= 0) {
        difference += 7
      }

      let nextDay
      if (dayOfWeek === 6 || dayOfWeek === 0) {
        // Jeśli wybrany dzień to sobota lub niedziela
        nextDay = new Date(
          date.getTime() +
            (7 - currentDay + (dayOfWeek === 0 ? 1 : 0)) * 24 * 60 * 60 * 1000,
        )
      } else {
        nextDay = new Date(date.getTime() + difference * 24 * 60 * 60 * 1000)
      }

      return nextDay
    }

    const repeatDays = {
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
      Sun: 0,
    }

    if (Boolean(req.body.repeat) && req.body.repeatTime === 'daily') {
      while (currentDate.getFullYear() === 2024) {
        currentDate = addDays(currentDate, 1)
        const dateArrayToPush = formattedDateArrayItem(currentDate)
        tablica.push(dateArrayToPush)
      }
    } else if (Boolean(req.body.repeat) && req.body.repeatTime === 'weekly') {
      while (currentDate.getFullYear() === 2024) {
        currentDate = addDays(currentDate, 7)
        const dateArrayToPush = formattedDateArrayItem(currentDate)
        tablica.push(dateArrayToPush)
      }
    } else if (Boolean(req.body.repeat) && req.body.repeatTime === 'monthly') {
      while (currentDate.getFullYear() === 2024) {
        currentDate = addDays(currentDate, 30)
        const dateArrayToPush = formattedDateArrayItem(currentDate)
        tablica.push(dateArrayToPush)
      }
    } else if (
      Boolean(req.body.repeat) &&
      repeatDays.hasOwnProperty(
        req.body.repeatDay.split(' ')[0] || req.body.repeatDay.split(' ')[1],
      )
    ) {
      const repeatDaysArray = req.body.repeatDay.split(' ')
      console.log(repeatDaysArray)
      repeatDaysArray.forEach((day) => {
        if (repeatDays.hasOwnProperty(day)) {
          const dayOfWeek = repeatDays[day]
          while (currentDate.getFullYear() === 2024) {
            currentDate = getNextDayOfWeek(currentDate, dayOfWeek)
            const dateArrayToPush = formattedDateArrayItem(currentDate)
            tablica.push(dateArrayToPush)
          }
        }
      })
    } else {
      tablica.push(formattedDate)
    }

    const values = [
      req.body.taskName,
      req.body.taskDescription,
      req.body.taskColor,
      req.body.repeat,
      req.body.repeatTime,
      req.body.repeatDay,
      req.body.taskTag,
      JSON.stringify(tablica),
      req.body.userId,
      req.body.emoji,
      req.body.tasks,
      req.body.done,
      req.body.addedUsers,
    ]

    const requiredValues = [
      req.body.taskName,
      req.body.taskDescription,
      req.body.taskColor,
      req.body.taskDate,
      req.body.taskTag,
    ]

    if (requiredValues.includes('')) {
      return res.status(201).json('Wypełnij obowiązkowe pola.')
    }

    const q =
      'INSERT INTO tasks(`taskName`, `taskDescription`,`taskColor`,`repeat`,`repeatTime`,`repeatDay`,`taskTag`,`taskDate`,`userId`,`emoji`,`tasks`,`done`, `addedUsers`) values(?)'

    db.query(q, [values], (err, data) => {
      if (err)
        return res.status(401).json('Wystąpił błąd podczas dodawania zadania.')

      return res.status(200).json('Pomyślnie dodano dane.')
    })
  })
}

export const getTasks = (req, res) => {
  const token = req.cookies.accessToken

  if (!token) return res.status(401).json('Nie jesteś zalogowany')

  jwt.verify(token, 'sekretnyklucz', (err, userInfo) => {
    if (err) return res.status(401).json(err)

    const q =
      'SELECT * FROM tasks WHERE userId = ? AND taskDate LIKE ? OR addedUsers LIKE ?  AND taskDate LIKE ?'

    db.query(
      q,
      [
        req.query.userId,
        `%${req.query.taskDate}%`,
        `%${req.query.userId}%`,
        `%${req.query.taskDate}%`,
      ],
      (err, data) => {
        if (err) return res.status(401).json(err)

        return res.status(200).json(data)
      },
    )
  })
}

export const deleteTask = (req, res) => {
  const token = req.cookies.accessToken

  if (!token) return res.status(401).json('Nie jesteś zalogowany')

  jwt.verify(token, 'sekretnyklucz', (err, userInfo) => {
    if (err) return res.status(401).json(err)

    const q = 'DELETE FROM tasks WHERE id = ?'

    db.query(q, [req.query.taskId], (err, data) => {
      if (err) return res.status(401).json(err)

      return res.status(200).json(data)
    })
  })
}

export const updateTask = (req, res) => {
  const token = req.cookies.accessToken

  if (!token) return res.status(401).json('Nie jesteś zalogowany')

  jwt.verify(token, 'sekretnyklucz', (err, userInfo) => {
    if (err) return res.status(401).json(err)

    const q =
      'UPDATE tasks SET done = ?, taskName = ?, taskDescription = ?, tasks = ? WHERE id = ?'

    db.query(
      q,
      [
        req.body[0].done,
        req.body[0].taskName,
        req.body[0].taskDescription,
        req.body[0].tasks,
        req.query.taskId,
      ],
      (err, data) => {
        if (err) return res.status(401).json(req)

        return res.status(200).json(data)
      },
    )
  })
}

export const getSingleTask = (req, res) => {
  const token = req.cookies.accessToken

  if (!token) return res.status(401).json('Nie jesteś zalogowany')

  jwt.verify(token, 'sekretnyklucz', (err, userInfo) => {
    if (err) return res.status(401).json(err)

    const q = !req.query.userId
      ? 'SELECT * FROM tasks WHERE id = ?'
      : 'SELECT * FROM tasks WHERE userId = ? AND id = ?'

    const values = !req.query.userId
      ? [req.query.taskId]
      : [req.query.userId, req.query.taskId]

    db.query(q, [values], (err, data) => {
      if (err) return res.status(401).json(req)

      return res.status(200).json(data)
    })
  })
}

export const getSingleNewTask = (req, res) => {
  const token = req.cookies.accessToken

  if (!token) return res.status(401).json('Nie jesteś zalogowany')

  jwt.verify(token, 'sekretnyklucz', (err, userInfo) => {
    if (err) return res.status(401).json(err)

    const q =
      'SELECT * FROM tasks WHERE userId = ? AND id = ? OR addedUsers LIKE ? AND id = ?'

    db.query(
      q,
      [
        req.query.userId,
        req.query.taskId,
        `%${req.query.userId}%`,
        req.query.taskId,
      ],
      (err, data) => {
        if (err) return res.status(401).json(err)

        return res.status(200).json(data)
      },
    )
  })
}

export const editTask = (req, res) => {
  const token = req.cookies.accessToken

  if (!token) return res.status(401).json('Nie jesteś zalogowany')

  jwt.verify(token, 'sekretnyklucz', (err, userInfo) => {
    if (err) return res.status(401).json(err)

    const date = new Date(req.body.taskDate)

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    const formattedDate = `${day}.${month}.${year}`

    const q =
      'UPDATE tasks SET `taskName` = ?, `taskDescription` = ?, `taskColor` = ?, `repeat` = ?, `repeatTime` = ?, `repeatDay` = ?, `taskTag` = ?, `taskDate` = ?, `emoji` = ?, `tasks` = ?, `done` = ? AND id = ?'

    db.query(
      q,
      [
        req.body.taskName,
        req.body.taskDescription,
        req.body.taskColor,
        req.body.repeat,
        req.body.repeatTime,
        req.body.repeatDay,
        req.body.taskTag,
        formattedDate,
        req.body.emoji,
        req.body.tasks,
        req.body.done,
        req.query.userId,
        req.query.taskId,
      ],
      (err, result) => {
        if (err) return res.status(500).json(err)

        return res.status(200).json(result)
      },
    )
  })
}

export const getTodayTasks = (req, res) => {
  const token = req.cookies.accessToken

  if (!token) return res.status(401).json('Nie jesteś zalogowany')

  jwt.verify(token, 'sekretnyklucz', (err, userInfo) => {
    if (err) return res.status(401).json(err)

    const date = new Date()

    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()

    if (day < 10) {
      day = '0' + day
    }

    if (month < 10) {
      month = '0' + month
    }

    const convDate = day + '.' + month + '.' + year

    const q = 'SELECT * FROM tasks WHERE userId = ? AND taskDate = ?'

    db.query(q, [req.query.userId, convDate], (err, data) => {
      if (err) return res.status(500).json(err)

      return res.status(200).json(data)
    })
  })
}

export const getAllUserTasks = (req, res) => {
  const token = req.cookies.accessToken

  if (!token) return res.status(401).json('Nie jesteś zalogowany')

  jwt.verify(token, 'sekretnyklucz', (err, userInfo) => {
    if (err) return res.status(401).json(err)

    const q = 'SELECT * FROM tasks WHERE userId = ?'

    db.query(q, [req.query.userId], (err, data) => {
      if (err) return res.status(500).json(err)

      return res.status(200).json(data)
    })
  })
}

export const updateUsersTask = (req, res) => {
  const token = req.cookies.accessToken

  if (!token) return res.status(401).json('Nie jesteś zalogowany')

  jwt.verify(token, 'sekretnyklucz', (err, userInfo) => {
    if (err) return res.status(401).json(err)

    const q = 'UPDATE tasks SET addedUsers = ? WHERE id = ?'

    db.query(q, [req.body.addedUsers, req.query.taskId], (err, data) => {
      if (err) return res.status(500).json(err)

      return res.status(200).json(data)
    })
  })
}
