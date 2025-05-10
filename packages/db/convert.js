const fs = require("fs");
const yaml = require("js-yaml");

const yamlFilePath = "./src/openapi.yaml";
const jsonFilePath = "./src/openapi.json";

try {
  // Read YAML file
  const yamlFileContents = fs.readFileSync(yamlFilePath, "utf8");

  // Parse YAML to JavaScript object
  const jsObject = yaml.load(yamlFileContents);

  // Convert JavaScript object to JSON string (pretty-printed with 2 spaces)
  const jsonString = JSON.stringify(jsObject, null, 2);

  // Write JSON string to file
  fs.writeFileSync(jsonFilePath, jsonString, "utf8");

  console.log(`Successfully converted '${yamlFilePath}' to '${jsonFilePath}'`);
} catch (e) {
  console.error(`Error during conversion:`);
  if (e.name === "YAMLException") {
    console.error(`  YAML Parsing Error: ${e.message}`);
    if (e.mark) {
      console.error(
        `  At line ${e.mark.line + 1}, column ${e.mark.column + 1}`
      );
    }
  } else if (e.code === "ENOENT") {
    console.error(`  File not found: ${yamlFilePath}`);
  } else {
    console.error(`  ${e.message}`);
  }
}
