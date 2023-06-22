const express = require("express")
const routes = require("./Routes/routes")
const errorHandleMiddleware = require("./middlewares/error-handler")
const cors = require("cors")
const server = express()
server.use(cors())
server.use(express.json())
const PORT = process.env.PORT || 5000

server.use("/api/v1/student", routes)
server.use(errorHandleMiddleware)
server.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`)
})
