const fs = require("fs");
const path = require("path");

/**
 * Recursively gets all file paths in a directory.
 * @param {string} dir The directory to search.
 * @param {string[]} fileList The list of files found so far (used for recursion).
 * @returns {string[]} An array of file paths.
 */
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Finds potentially unused Vue components by checking if their filenames are referenced.
 * @param {string} srcDir The root directory of your source code.
 * @returns {Promise<string[]>} A promise that resolves with an array of potentially unused .vue file paths.
 */
async function findUnusedVueComponents(srcDir) {
  const allFiles = getAllFiles(srcDir);
  const vueFiles = allFiles.filter((file) => file.endsWith(".vue"));
  const sourceFiles = allFiles.filter((file) => !file.startsWith(".") && !file.includes("node_modules")); // Exclude hidden files and node_modules

  const sourceContents = sourceFiles.map((file) => fs.readFileSync(file, "utf-8"));

  const potentiallyUnusedComponents = [];

  for (const vueFile of vueFiles) {
    const componentName = path.basename(vueFile, ".vue");
    let found = false;

    // Check if the component name exists in any other source file
    for (const content of sourceContents) {
      if (content.includes(componentName)) {
        console.log(componentName);
        found = true;
        break; // Found a reference, move to the next component
      }
    }

    if (!found) {
      potentiallyUnusedComponents.push(vueFile);
    }
  }

  return potentiallyUnusedComponents;
}

// --- How to use ---

const sourceDirectory = "./client/src"; // Replace with the path to your source code directory
function cb(c) {
  console.log(c);
}
findUnusedVueComponents(sourceDirectory)
  .then((unusedComponents) => {
    console.log("Potentially unused Vbue components:");
    if (unusedComponents.length === 0) {
      console.log("No potentially unused components found based on filename reference.");
    } else {
      unusedComponents.forEach((component) => fs.rename(component, `${component}.unused`, cb));
    }
  })
  .catch((err) => {
    console.error("An error occurred:", err);
  });
