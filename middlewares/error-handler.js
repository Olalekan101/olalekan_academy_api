const errorHandleMiddleware = (err, req, res, next) => {
  return res.status(500).json({ msg: "Something want wrong try again later" })
}

module.exports = errorHandleMiddleware
