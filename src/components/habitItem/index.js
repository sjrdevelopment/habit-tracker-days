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

const HabitItem = ({ trackerData, handleClick }) => {
  /*
     TODO:
        1. dispatch action on checkbox click
        2. Get today's date and row ID
        3. Send data to Node server
        4. Add object to Dynamo DB
        5. Implement security headers (helmet?)
            - so only works with client/secret?
    */

  return (
    <div className="habit-item">
      <table>
        <thead>
          <tr>
            <th></th>
            {getLast2Weeks()}
            <th>Today</th>
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
                    <input type="checkbox" onClick={handleClick} />
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

const trackClick = (event) => {
  return {
    type: 'TEST_ACTION',
    data: event,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // explicitly forwarding arguments
    handleClick: (event) => dispatch(trackClick(event)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HabitItem)
