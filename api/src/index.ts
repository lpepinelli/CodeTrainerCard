import cors from 'cors'
import express from 'express'
import serverless from 'serverless-http'

import routes from './routes'
import site from './routes/site'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', site)
app.use('/api', routes)

if (require.main === module) {
  const url = `http://localhost:${process.env.PORT || '3333'}`
  app.listen(process.env.PORT || '3333', () => {
    console.log(`server listening on ${url} ☕`)
    console.log(`preview: ${url}/preview`)
    console.log(`card:    ${url}/api/card/lpepinelli?role=Front-end&pixelate`)
  })
}

module.exports.handler = serverless(app);
