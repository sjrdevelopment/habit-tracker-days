import React, { useState } from 'react'
import './addNewHabit.css'
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

const AddNewHabit = ({ addHabit, config }) => {
  const [showHabitDialog, updateShowDialog] = useState(false)
  const [habitTitle, updateTitle] = useState()

  const toggleHabitDialog = (event) => {
    updateShowDialog(true)
  }

  const saveHabit = (event) => {
    console.log('save habit')
    console.log(habitTitle)

    postData(`${config.host}/createHabit`, { name: habitTitle })
      .then((resp) => {
        return resp.json()
      })
      .then(function (data) {
        addHabit(data)
      })
  }

  const onTitleChange = (event) => {
    updateTitle(event.currentTarget.value)
  }

  return (
    <div>
      <button className="addNewButton" onClick={toggleHabitDialog}>
        Add new habit
      </button>

      {showHabitDialog && (
        <div className="habit-dialog">
          <label htmlFor="habit-name">Habit title</label>
          <input onChange={onTitleChange} name="habit-name" type="text" />
          <button onClick={saveHabit}>Create</button>
        </div>
      )}
    </div>
  )
}

const mapStateToProps = (state) => ({
  ...state,
})

const mapDispatchToProps = (dispatch) => {
  return {
    addHabit: (data) => dispatch({ type: 'HABIT_ADD', payload: data }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddNewHabit)
