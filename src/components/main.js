import React from 'react'
import './main.css'

import HabitItem from './habitItem'

import 'regenerator-runtime/runtime.js'

export default () => (
  <div className="main">
    <h1 className="heading">Habit Tracker - Days</h1>
    <HabitItem />
  </div>
)
