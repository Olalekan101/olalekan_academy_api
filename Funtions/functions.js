const express = require("express");
const { SHEET_ID, client, sheets } = require("../ConnectDB/googlesheetconnect");
const z = require("zod");

const getStudentData = async (req, res) => {
  const sheetData = await sheets.spreadsheets.values.get({
    auth: client,
    range: "Students_Records",
    spreadsheetId: SHEET_ID,
  });
  res.status(200).send(sheetData.data);
};

const getStudentDataById = async (req, res) => {
  const { id } = req.params;
  const sheetData = await sheets.spreadsheets.values.get({
    auth: client,
    range: "Students_Records",
    spreadsheetId: SHEET_ID,
  });
  const data = sheetData.data;
  const headers = data.values[0];
  const idColumnIndex = headers.indexOf("Id");
  const filteredArrays = data.values.filter(
    (record) => record[idColumnIndex] === `${id}`
  );
  res.send(filteredArrays);
};

const postStudentData = async (req, res) => {
  const postData = req.body;
  const tImeStamp = Date.now();
  const data = { tImeStamp, ...postData };
  const dataArr = Object.values(data);
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: "Students_Records!A2:H",
    insertDataOption: "INSERT_ROWS",
    valueInputOption: "RAW",
    requestBody: {
      values: [dataArr],
    },
  });
  res.send("Uploaded Successfully");
};

const updateStudentData = async (req, res) => {
  const params = req.params.id;
  const dataArr = Object.values(req.body);
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `Students_Records!B${params}:H${params}`,
    valueInputOption: "RAW",
    requestBody: {
      values: [dataArr],
    },
  });
  res.send("Updated Sucessfully");
};

const deleteStudent = async (req, res) => {
  const params = req.params.id;
  try {
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SHEET_ID,
      range: `Students_Records!A${params}:H${params}`,
    });
    res.send("Remove Sucessfully");
  } catch (error) {
    res.send("Bad Request");
  }
};

module.exports = {
  getStudentData,
  postStudentData,
  updateStudentData,
  deleteStudent,
  getStudentDataById,
};
