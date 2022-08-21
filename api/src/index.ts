import express from 'express'
import cors from 'cors'
import routes from './routes'

const app = express()

// const corsOptions = {
//   origin: 'http://localhost:3000',
//   optionsSuccessStatus: 200
// }
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res, next) => {
  res.send({ Warning: 'API endpoint is /api' })
})

app.use('/api', routes)

export default app