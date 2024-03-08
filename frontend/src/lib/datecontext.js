import { useContext, createContext, useState } from 'react'
import { GetTasks } from './Posts'

const CalendarContext = createContext()

export function useCalendarContext() {
  return useContext(CalendarContext)
}

export function convDateFunc(inputData) {
  let day = inputData.getDate()
  let month = inputData.getMonth() + 1
  let year = inputData.getFullYear()

  if (day < 10) {
    day = '0' + day
  }

  if (month < 10) {
    month = '0' + month
  }

  return day + '.' + month + '.' + year
}

export function CalendarProvider({ children }) {
  const [calendarDate, setCalendarDate] = useState(new Date())

  return (
    <CalendarContext.Provider value={{ calendarDate, setCalendarDate }}>
      {children}
    </CalendarContext.Provider>
  )
}
