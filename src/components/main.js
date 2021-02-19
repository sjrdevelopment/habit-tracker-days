import React from 'react'
import './main.css'

import HabitItem from './habitItem'

import 'regenerator-runtime/runtime.js'

export default () => (
  <div>
    <h1 className="main">Habit Tracker - Days</h1>
    <HabitItem />
  </div>
)
