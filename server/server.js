import path from 'path'
import Express from 'express'
import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'
import 'regenerator-runtime/runtime.js'

import { secret } from '../secret'

const basicAuth = require('express-basic-auth')

const {
  DynamoDBClient,
  ScanCommand,
  PutItemCommand,
  DeleteItemCommand,
} = require('@aws-sdk/client-dynamodb')

var bodyParser = require('body-parser')

import Main from '../src/components/main.js'
import rootReducer from '../src/reducers/rootReducer.js'

const REGION = 'us-east-1'
const dbclient = new DynamoDBClient({ region: REGION })

const app = Express()
const port = 3000

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const updateHistory = ({ id, date, guid }) => {
  const params = {
    TableName: 'History',
    Item: {
      guid: {
        S: guid === '' ? uuidv4() : guid,
      },
      date: {
        S: date,
      },
      id: {
        S: id,
      },
    },
  }

  const run = async () => {
    try {
      const data = await dbclient.send(new PutItemCommand(params))
      console.log(data)
    } catch (err) {
      console.error(err)
    }
  }
  run()
}

const createHabit = ({ name }) => {
  const params = {
    TableName: 'Habits',
    Item: {
      name: {
        S: name,
      },
      id: {
        S: uuidv4(),
      },
    },
  }

  const run = async () => {
    try {
      const data = await dbclient.send(new PutItemCommand(params))
      console.log(data)
    } catch (err) {
      console.error(err)
    }
  }
  run()
}

async function getHabits() {
  const params = {
    TableName: 'Habits',
  }

  try {
    const data = await dbclient.send(new ScanCommand(params))

    const myDat = data.Items.map((element, index, array) => {
      return {
        name: element.name.S,
        id: element.id.S,
      }
    })

    return myDat
  } catch (err) {
    console.log('Error', err)
  }
}

async function getLast2Weeks() {
  const historyParams = {
    TableName: 'History', //todo: retrieve data for last 2 weeks
  }

  try {
    const historyData = await dbclient.send(new ScanCommand(historyParams))

    return historyData.Items.map((element, index, array) => {
      return {
        guid: element.guid.S,
        date: element.date.S,
        id: element.id.S,
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
      date.setDate(date.getDate() - index)

      return {
        date: date,
        completed: false,
      }
    })

  const drRev = dateRange.reverse()

  return items.map((item) => {
    return {
      name: item.name,
      id: item.id,
      history: drRev.map((date) => {
        let evtGuid
        if (
          histories.some((e) => {
            if (
              `${new Date(e.date).getMonth()}-${new Date(e.date).getDate()}` ===
                `${date.date.getMonth()}-${date.date.getDate()}` &&
              e.id === item.id
            ) {
              evtGuid = e.guid
              return true
            }
          })
        ) {
          return {
            guid: evtGuid,
            date: date.date,
            completed: true,
          }
        }

        return {
          guid: uuidv4(), //todo: if today only, no other guids needed
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
        config: {
          host: process.env.host || 'localhost:3000',
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

app.use(
  basicAuth({
    users: secret,
    challenge: true,
    realm: 'Imb4T3st4pp',
  })
)

app.use(bodyParser.json())

app.post('/completeDay', (req, res) => {
  console.log('received complete day post: ')
  console.log(req.body)
  updateHistory(req.body)
  res.send('')
})

app.post('/createHabit', (req, res) => {
  console.log('received habit create: ')
  console.log(req.body)
  createHabit(req.body)
  res.send('')
})

app.delete('/undoCompleteDay', (req, res) => {
  console.log('deleting item...')
  console.log(req.body.guid)

  var params = {
    TableName: 'History',
    Key: {
      guid: { S: req.body.guid },
    },
  }

  const run = async () => {
    try {
      const data = await dbclient.send(new DeleteItemCommand(params))

      console.log('Success, item deleted', data)
    } catch (err) {
      if (err && err.code === 'ResourceNotFoundException') {
        console.log('Error: Table not found')
      } else if (err && err.code === 'ResourceInUseException') {
        console.log('Error: Table in use')
      }
    }
  }
  run()

  res.send()
})

app.use(Express.static(path.join(__dirname)))
app.use(handleRender)

app.listen(port)

console.log(`Listening on port ${port}`)
