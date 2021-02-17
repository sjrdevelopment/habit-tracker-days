import React from 'react'
import './habitItem.css'

import { connect } from 'react-redux'

const getLast2Weeks = () => {
  const dateRange = Array(14)
    .fill()
    .map((item, index) => {
      const date = new Date()
      date.setDate(date.getDate() - index - 1)
      return (
        <th key={index}>{`${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`}</th>
      )
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
            {getLast2Weeks()}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {trackerData.combinedItems &&
            trackerData.combinedItems.map((item, index) => {
              return (
                <tr key={index}>
                  <th>{item.name}</th>
                  {item.history.map((historyItem, index) => {
                    if (historyItem.completed) {
                      return <td key={index} className="l1"></td>
                    }

                    return <td key={index} className="l0"></td>
                  })}
                  <td key="final">
                    <input type="checkbox" />
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>
    </div>
  )
}

const mapStateToProps = (state) => ({
  ...state,
})

export default connect(mapStateToProps)(HabitItem)
