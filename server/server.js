import path from 'path'
import Express from 'express'
import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'

import 'regenerator-runtime/runtime.js'

const { DynamoDBClient, ScanCommand } = require('@aws-sdk/client-dynamodb')

const REGION = 'us-east-1'

const params = {
  TableName: 'Habits',
}

const dbclient = new DynamoDBClient({ region: REGION })

async function getHabits() {
  try {
    const data = await dbclient.send(new ScanCommand(params))

    const myDat = data.Items.map((element, index, array) => {
      return {
        name: element.name.S,
        id: element.id.N,
      }
    })

    return myDat
  } catch (err) {
    console.log('Error', err)
  }
}

import Main from '../src/components/main.js'
import rootReducer from '../src/reducers/rootReducer.js'

const app = Express()
const port = 3000

/*
FilterExpression: 'id = :id',
    ExpressionAttributeValues: {
      ':id': {
        N: '1',
      },
    },
    */
async function getLast2Weeks() {
  const historyParams = {
    TableName: 'History', //todo: retrieve data for last 2 weeks and for given ID
  }

  try {
    const historyData = await dbclient.send(new ScanCommand(historyParams))

    return historyData.Items.map((element, index, array) => {
      return {
        date: element.date.S,
        id: element.id.N,
        completed: true,
      }
    })
  } catch (err) {
    console.log('Error', err)
  }
}

const getCombined = (items, histories) => {
  const dateRange = Array(14)
    .fill()
    .map((item, index) => {
      const date = new Date()
      date.setDate(date.getDate() - index - 1)

      return {
        date: date,
        completed: false,
      }
    })

  const drRev = dateRange.reverse()

  return items.map((item) => {
    return {
      name: item.name,
      history: drRev.map((date) => {
        if (
          histories.some(
            (e) =>
              `${new Date(e.date).getMonth()}-${new Date(e.date).getDate()}` ===
                `${date.date.getMonth()}-${date.date.getDate()}` &&
              e.id === item.id
          )
        ) {
          return {
            date: date.date,
            completed: true,
          }
        }

        return {
          date: date.date,
          completed: false,
        }
      }),
    }
  })
}

const handleRender = (req, res) => {
  console.log('handling request...')
  const store = createStore(rootReducer)

  const html = renderToString(
    <Provider store={store}>
      <Main />
    </Provider>
  )

  const habits = getHabits().then((data) => {
    getLast2Weeks().then((moreData) => {
      const preloadedState = {
        ...store.getState(),
        trackerData: {
          items: data,
          histories: moreData, //todo: list key by id?
          combinedItems: getCombined(data, moreData),
        },
      }

      res.send(renderFullPage(html, preloadedState))
    })
  })
}

const renderFullPage = (html, preloadedState) => {
  return `
    <!doctype html>
    <html>
      <head>
        <link rel="stylesheet" type="text/css" href="/main.css"></link>
        <title>Node Redux SSR template</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(
            /</g,
            '\\u003c'
          )}
        </script>
        <script src="/client-bundle.js"></script>
      </body>
    </html>
  `
}

console.log(`Starting server in ... ${path.join(__dirname)}`)

app.use(Express.static(path.join(__dirname)))
app.use(handleRender)
app.listen(port)

console.log(`Listening on port ${port}`)
