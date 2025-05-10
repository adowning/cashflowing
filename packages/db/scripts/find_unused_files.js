const fs = require('fs')
const path = require('path')

const publicDir = path.join(__dirname, 'public')
const srcDir = path.join(__dirname, 'src')
const unusedDir = path.join(__dirname, '../unused')

// Create unused directory if it doesn't exist
if (!fs.existsSync(unusedDir)) {
  fs.mkdirSync(unusedDir, { recursive: true })
}

// Get all files in public directory recursively
function getFiles(dir) {
  const files = []
  const items = fs.readdirSync(dir, { withFileTypes: true })

  for (const item of items) {
    const fullPath = path.join(dir, item.name)
    if (item.isDirectory()) {
      files.push(...getFiles(fullPath))
    } else {
      files.push(fullPath)
    }
  }
  return files
}

// Search for filename in src files
function isFileUsed(filename) {
  const searchTerm = path.basename(filename)
  const command = `grep -r "${searchTerm}" ${srcDir} || true`
  try {
    const result = require('child_process').execSync(command).toString()
    return result.trim().length > 0
  } catch (err) {
    return false
  }
}

// Main function
function moveUnusedFiles() {
  const publicFiles = getFiles(publicDir)
  let movedCount = 0

  for (const file of publicFiles) {
    const relativePath = path.relative(publicDir, file)
    const destPath = path.join(unusedDir, relativePath)
    const destDir = path.dirname(destPath)

    if (!isFileUsed(file)) {
      // Create destination directory if needed
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true })
      }

      // Move file
      fs.renameSync(file, destPath)
      movedCount++
      console.log(`Moved: ${relativePath}`)
    }
  }

  console.log(`Done. Moved ${movedCount} unused files.`)
}

moveUnusedFiles()
