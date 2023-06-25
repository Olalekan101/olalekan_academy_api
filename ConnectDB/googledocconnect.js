const { google } = require("googleapis")

require("dotenv").config()

const client = new google.auth.JWT(
  process.env.CLIENT_EMAIL,
  null,
  process.env.PRIVATE_KEY,
  [
    "https://www.googleapis.com/auth/documents",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/drive.file"
  ]
)

const docFunction = async () => {
  const docs = google.docs({ version: "v1", auth: client })
  const createDoc = await docs.documents.create({
    requestBody: {
      title: "My New Document",
      documentId: "1234"
    }
  })
  return createDoc
}

module.exports = docFunction

// const documentId = documents.
