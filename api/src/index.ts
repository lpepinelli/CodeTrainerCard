import cors from 'cors'
import express from 'express'
import path from 'path'
import serverless from 'serverless-http'
import routes from './routes'

const app = express()

// const corsOptions = {
//   origin: 'http://localhost:3000',
//   optionsSuccessStatus: 200
// }
app.use(cors())

app.get("/preview", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res, next) => {
  res.send({ Warning: 'API endpoint is /api' })
})

app.use('/api', routes)

if (require.main === module) {
  app.listen(process.env.PORT || '3333', () => {
    console.log(`Listening on ${process.env.PORT || '3333'} ☕`)
    console.log(`server listening on http://localhost:${process.env.PORT || '3333'}`)
  })
}

module.exports.handler = serverless(app);

