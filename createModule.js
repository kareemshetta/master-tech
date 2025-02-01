const fs = require('fs').promises;
const path = require('path');

const moduleName = process.argv[2];

if (!moduleName) {
  console.error("Please provide a module name.");
  process.exit(1);
}

const basePath = "./src/modules";
const modulePath = path.join(basePath, moduleName);

async function createDirectory(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

async function createFile(filePath, content = '') {
  try {
    await fs.writeFile(filePath, content, { flag: 'wx' });
    console.log(`Created file: ${filePath}`);
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

async function createModuleStructure() {
  try {
    // Create main module directory
    await createDirectory(modulePath);

    // Create v1 directory
    const v1Path = path.join(modulePath, "v1");
    await createDirectory(v1Path);

    // Define folders and files structure
    const folders = ["dashboard", "website"];
    const commonFiles = [
      `${moduleName}.controller.ts`,
      `${moduleName}.routes.ts`,
      `${moduleName}.service.ts`,
      `${moduleName}.view.ts`,
    ];

    const rootFiles = [
      // `${moduleName}.model.ts`,
      `${moduleName}.portals.ts`,
      `${moduleName}.repository.ts`,
    ];

    // Create folders and their files
    for (const folder of folders) {
      const folderPath = path.join(v1Path, folder);
      await createDirectory(folderPath);

      // Create files in each folder
      for (const file of commonFiles) {
        await createFile(path.join(folderPath, file));
      }
    }

    // Create root v1 files
    for (const file of rootFiles) {
      await createFile(path.join(v1Path, file));
    }

    // Create versions.routes.ts in module root
    await createFile(path.join(modulePath, "versions.routes.ts"));

    console.log(`Module ${moduleName} created successfully.`);
  } catch (error) {
    console.error("Error creating module structure:", error);
    process.exit(1);
  }
}

createModuleStructure();