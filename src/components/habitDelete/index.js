import React from 'react'
import './habitDelete.css'
import { connect } from 'react-redux'

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

const handleClick = ({ id, name }, url) => {
  const deleteUrl = `${url}/deleteHabit`

  // post data to api for delete habit
  postData(deleteUrl, { id: id, name: name }, 'DELETE')
}

const HabitDelete = ({ item, config }) => {
  return (
    <button
      className="delete-button"
      onClick={() => handleClick(item, config.host)}
    >
      Delete
    </button>
  )
}

const mapStateToProps = (state) => ({
  ...state,
})

export default connect(mapStateToProps)(HabitDelete)
