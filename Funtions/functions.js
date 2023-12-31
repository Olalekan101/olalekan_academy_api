const { SHEET_ID, client, sheets } = require("../ConnectDB/googlesheetconnect")
const { z } = require("zod")
const asyncWrapper = require("../middlewares/asyncWarpper")

// creating a scheme for the Post Validation

const ITEMS_PER_PAGE = 10

const studentFormScheme = z.object({
  Name: z.string().min(1, { message: "Name is too short" }),
  Course: z.string(),
  Duration: z.string()
})

const getStudentData = asyncWrapper(async (req, res) => {
  const data = await getDataRequest()
  const filterEmptyData = data.filter(
    (x) => x.Name && x.Course && x.Duration !== ""
  )
  res.status(200).send(filterEmptyData)
})
const getStudentDataPaginate = asyncWrapper(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const perPage = parseInt(req.query.perPage) || ITEMS_PER_PAGE
  const searchQuery = req.query.q || ""
  const data = await getDataRequest()
  const filterEmptyData = data.filter(
    (x) => x.Name && x.Course && x.Duration !== ""
  )
  let filteredData = filterEmptyData
  if (searchQuery) {
    // Perform search based on the query
    filteredData = filterEmptyData.filter((item) =>
      item.Name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }
  const startIndex = (page - 1) * perPage
  const endIndex = startIndex + perPage
  const paginatedData = filteredData.slice(startIndex, endIndex)

  res.status(200).json({
    page,
    perPage,
    totalItems: filteredData.length,
    totalPages: Math.ceil(filteredData.length / perPage),
    data: paginatedData
  })
})

const getStudentDataById = asyncWrapper(async (req, res) => {
  const { id } = req.params
  const data = await getDataRequest()

  // filtering the  array of arrays to get one array that match the id
  const filterData = data.filter((x) => x.Id === id)
  if (filterData.length === 0) {
    return res.status(404).json({ msg: "No Record Found" })
  }

  res.status(200).send(filterData)
})

const postStudentData = asyncWrapper(async (req, res) => {
  const postData = req.body
  const tImeStamp = Date.now()
  const data = { tImeStamp, ...postData }
  const dataArr = Object.values(data)
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: "Students_Records!A2:H",
    insertDataOption: "INSERT_ROWS",
    valueInputOption: "RAW",
    requestBody: {
      values: [dataArr]
    }
  })
  res.status(201).send("Uploaded Successfully")
})

const updateStudentData = asyncWrapper(async (req, res) => {
  const params = req.params.id
  const dataArr = Object.values(req.body)
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `Students_Records!B${params}:H${params}`,
    valueInputOption: "RAW",
    requestBody: {
      values: [dataArr]
    }
  })
  res.send("Updated Sucessfully")
})

const deleteStudent = asyncWrapper(async (req, res) => {
  const params = req.params.id
  await sheets.spreadsheets.values.clear({
    spreadsheetId: SHEET_ID,
    range: `Students_Records!B${params}:H${params}`
  })
  res.send("Remove Sucessfully")
})

// This is the function for geting the data in other to aviod duplication of code

async function getDataRequest() {
  const sheetValues = await sheets.spreadsheets.values
    .get({
      auth: client,
      range: "Students_Records",
      spreadsheetId: SHEET_ID
    })
    .then((response) => response.data.values)
  // converting the response from array of arrays to array object where it can be easly consume
  // Extract the headers from the first array
  const headers = sheetValues[0]
  // Convert the remaining arrays into objects
  const convertedData = sheetValues.slice(1).map((record) => {
    const obj = {}
    headers.forEach((header, index) => {
      obj[header] = record[index]
    })
    return obj
  })

  return convertedData
}

module.exports = {
  getStudentData,
  postStudentData,
  updateStudentData,
  deleteStudent,
  getStudentDataById,
  getStudentDataPaginate
}
