import React from 'react'
import './habitItem.css'

import { connect } from 'react-redux'

const getLast2Weeks = () => {
  const dateRange = Array(13)
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

async function postData(url = '', data = {}, method = 'POST') {
  // Default options are marked with *
  const response = await fetch(url, {
    method: method, // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  })

  return ''

  // try {
  //   return response.json()
  // } catch {
  //   return ''
  // }
}

const handleClick = (itemId, checked, guid = '') => {
  if (checked) {
    const date = new Date()

    const paddedMonth = '0' + (date.getMonth() + 1)
    const month = paddedMonth.slice(-2)

    const paddedDay = '0' + date.getDate()
    const day = paddedDay.slice(-2)

    // post request to node server
    postData('http://localhost:3000/completeDay', {
      id: itemId,
      date: `${date.getFullYear()}-${month}-${day}`,
      guid: guid,
    }).then((data) => {
      console.log('posted data: ')
      console.log(data) // JSON data parsed by `data.json()` call
    })
  } else {
    console.log('deleting ' + guid)
    // remove item from dynamoDB
    postData(
      'http://localhost:3000/undoCompleteDay',
      {
        guid: guid,
      },
      'DELETE'
    ).then((data) => {
      console.log('deleted data: ')
      console.log(data) // JSON data parsed by `data.json()` call
    })
  }
}

const HabitItem = ({ trackerData }) => {
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
              const finalDay = item.history.pop() //todo: don't pop, slice

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
                    <input
                      type="checkbox"
                      defaultChecked={finalDay.completed ? 'checked' : ''}
                      onChange={(event) => {
                        handleClick(
                          item.id,
                          event.currentTarget.checked,
                          finalDay.guid
                        )
                      }}
                    />
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
