import React from 'react'
import { connect } from 'react-redux'

import AddNewHabit from '../addNewHabit'
import TodayStatus from '../todayStatus'
import HabitDelete from '../habitDelete'
import './habitItem.css'

const getLast2WeeksTableHeaders = () => {
  const dateRange = Array(13)
    .fill()
    .map((item, index) => {
      const date = new Date()
      date.setDate(date.getDate() - index - 1)

      const dayOfWeek = date.getDay()

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return (
          <th className="weekend" key={index}>{`${date.getDate()}/${
            date.getMonth() + 1
          }`}</th>
        )
      }

      return <th key={index}>{`${date.getDate()}/${date.getMonth() + 1}`}</th>
    })

  return dateRange.reverse()
}

const HabitItem = ({ trackerData }) => {
  return (
    <div className="habit-item">
      <table>
        <thead>
          <tr>
            <th></th>
            {getLast2WeeksTableHeaders()}
            <th>Today</th>
          </tr>
        </thead>
        <tbody>
          {trackerData.combinedItems &&
            trackerData.combinedItems.map((item, index) => {
              const finalDay = item.history.slice(-1)[0]

              return (
                <tr key={index}>
                  <td>
                    {item.name} <HabitDelete item={item} />
                  </td>
                  {item.history.slice(0, 13).map((historyItem, index) => {
                    if (historyItem.completed) {
                      return (
                        <td key={index} className="l1">
                          <span className="circle"></span>
                        </td>
                      )
                    }

                    return (
                      <td key={index} className="l0">
                        <span className="circle"></span>
                      </td>
                    )
                  })}
                  <TodayStatus item={item} finalDay={finalDay} />
                </tr>
              )
            })}
        </tbody>
      </table>
      <AddNewHabit />
    </div>
  )
}

const mapStateToProps = (state) => ({
  ...state,
})

export default connect(mapStateToProps)(HabitItem)
