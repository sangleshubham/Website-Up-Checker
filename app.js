import express from 'express'
import router from'./router/router.js'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()
const PORT = process.env.PORT ||  4000
const app = express()
app.use(cors({
    origin : '*'
  }))

app.use(express.json())

app.use('/uptime' , router)

app.get('/', (req,res)=> {
  res.send("Working1...").status(200)
})

app.listen(PORT, ()=> {
    console.log(`server started on port ${PORT}`)
})