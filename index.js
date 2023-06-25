const express = require("express")
const routes = require("./Routes/routes")
const errorHandleMiddleware = require("./middlewares/error-handler")
const docFunction = require("./ConnectDB/googledocconnect")
const cors = require("cors")
const server = express()
const { google } = require("googleapis")

require("dotenv").config()
server.use(cors())
server.use(express.json())
const PORT = process.env.PORT || 5000
// docFunction().then((r) => r.data)

server.get("/create-doc", async (req, res) => {
  try {
    // Authenticate with Google Docs API using JWT

    const client = new google.auth.JWT(
      process.env.DRIVE_CLIENT_EMAIL,
      null,
      process.env.DRIVE_PRIVATE_KEY,
      [
        "https://www.googleapis.com/auth/documents",
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file"
      ]
    )

    // Create a new Google Docs document with text in the body
    const docs = google.docs({ version: "v1", auth: client })
    const document = await docs.documents.create({
      requestBody: {
        title: "Esanola",
        body: {
          content: [
            {
              paragraph: {
                elements: [{ textRun: { content: "Hey Text run" } }]
              },
              startIndex: 1
            }
          ]
        }
      }
    })
    // Retrieve the document ID
    const documentId = document.data.documentId

    // Update the document content
    // docs.documents.batchUpdate({
    //   documentId: documentId,
    //   requestBody: {
    //     requests: [
    //       {
    //         insertText: {
    //           location: {
    //             index: 1
    //           },
    //           text: "Hello, World!"
    //         }
    //       }
    //     ]
    //   }
    // })

    // Move the document to a specific folder in Google Drive
    const drive = google.drive({ version: "v3", auth: client })
    const folderId = "1-e7AEhl82dNgxhiIQ7ik7-lF3440WGG8" // Replace with the desired folder ID
    drive.files.update({
      fileId: documentId,
      addParents: folderId,
      removeParents: "root"
    })

    // Retrieve the document ID
    const documentIdx = document.data.body.content

    // Output the created document ID
    res.send(`Created document ID: ${documentId}`)
  } catch (error) {
    console.error("Error creating document:", error)
    res.status(500).send("Error creating document")
  }
})

server.use("/api/v1/student", routes)
server.use(errorHandleMiddleware)
server.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`)
})
