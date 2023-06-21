const express = require("express");
const {
  getStudentData,
  postStudentData,
  updateStudentData,
  deleteStudent,
  getStudentDataById,
} = require("../Funtions/functions");
const routes = express.Router();
// routes.use(logger);

routes.route("/").get(getStudentData).post(postStudentData);
routes
  .route("/:id")
  .patch(updateStudentData)
  .delete(deleteStudent)
  .get(getStudentDataById);

// function logger(req, res, next) {
//   const id = req.params.id;
//   console.log(id);
//   next();
// }

module.exports = routes;
