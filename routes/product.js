const express = require("express")
const router = express.Router()
const protect = require("../middleWare/authMiddleware")
const {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/product")
const { upload } = require("../utils/fileUpload")

router.route('/')
  .get(protect, getProducts)
  .post(protect, upload.single("image"), createProduct)

router.route('/:id')
  .get(protect, getProduct)
  .delete(protect, deleteProduct)
  .patch(protect, upload.single("image"), updateProduct)

module.exports = router
