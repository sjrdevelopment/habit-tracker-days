import React from 'react'

import './todayStatus.css'

const serverUrl = 'http://localhost:3000'

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

  try {
    return response
  } catch {
    return ''
  }
}

const handleClick = (itemId, checked, guid = '') => {
  if (checked) {
    const date = new Date()

    const paddedMonth = '0' + (date.getMonth() + 1)
    const month = paddedMonth.slice(-2)

    const paddedDay = '0' + date.getDate()
    const day = paddedDay.slice(-2)

    // post request to node server
    postData(`${serverUrl}/completeDay`, {
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
      `${serverUrl}/undoCompleteDay`,
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

const TodayStatus = ({ finalDay, item }) => {
  return (
    <td key="final">
      <input
        type="checkbox"
        defaultChecked={finalDay.completed ? 'checked' : ''}
        onChange={(event) => {
          handleClick(item.id, event.currentTarget.checked, finalDay.guid)
        }}
      />
    </td>
  )
}

export default TodayStatus
