const express = require("express")
const app = express()
const cors = require('cors')
const mainRouter = require("./routes/index")
const port = 5000

app.use(express.json())
app.use(cors())
app.use('/api/v1', mainRouter)






app.listen({port}, console.log(`listening on port ${port}`))