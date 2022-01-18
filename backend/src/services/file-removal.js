const fs = require('fs')

function deleteFile (imageUrl) {
  if (!imageUrl) return
  const filename = imageUrl.split('/uploads/')[1]
  fs.unlink(`uploads/${filename}`, () => {})
}

module.exports = {
  deleteFile
}