import React from 'react'
import { connect } from 'react-redux'

import AddNewHabit from '../addNewHabit'
import TodayStatus from '../todayStatus'
import HabitDelete from '../habitDelete'
import './habitItem.css'

const lettersOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

const getLast2WeeksTableHeaders = () => {
  const dateRange = Array(14)
    .fill()
    .map((item, index) => {
      const date = new Date()
      date.setDate(date.getDate() - index)

      const dayOfWeek = date.getDay()

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return (
          <th className="weekend" key={index}>
            {lettersOfWeek[dayOfWeek]}
          </th>
        )
      }

      return <th key={index}>{lettersOfWeek[dayOfWeek]}</th>
    })

  return dateRange.reverse()
}

const HabitItem = ({ trackerData }) => {
  return (
    <div className="habit-item">
      <table>
        <thead>
          <tr>{getLast2WeeksTableHeaders()}</tr>
        </thead>
        <tbody>
          {trackerData.combinedItems &&
            trackerData.combinedItems.map((item, index) => {
              const finalDay = item.history.slice(-1)[0]

              return (
                <>
                  <tr className="header-row">
                    <td colspan="14">
                      {item.name}
                      <HabitDelete item={item} />
                    </td>
                  </tr>
                  <tr className="data-row" key={index}>
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
                </>
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
