import express from 'express'
import cors from 'cors'
import routes from './routes'
import path from 'path'
import livereload from "livereload";
import connectLivereload from "connect-livereload";

const app = express()

// const corsOptions = {
//   origin: 'http://localhost:3000',
//   optionsSuccessStatus: 200
// }
app.use(cors())

// Live reload setup
const livereloadServer = livereload.createServer();
livereloadServer.watch(__dirname);
app.use(connectLivereload());

app.get("/preview", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res, next) => {
  res.send({ Warning: 'API endpoint is /api' })
})

app.use('/api', routes)

app.listen(process.env.PORT || '3333', ()=> {
  console.log(`Listening on ${process.env.PORT || '3333'} ☕`)
  console.log(`server listening on http://localhost:${process.env.PORT || '3333'}`)
})

export default app