// import fs from "fs";
// import path from "path";
// import { execSync } from "child_process";

// const SRC_DIR = "./src"; // adjust if your source folder is different

// function findExternalImports(dir: string): Set<string> {
//   const modules = new Set<string>();
//   const files = fs.readdirSync(dir);

//   for (const file of files) {
//     const fullPath = path.join(dir, file);
//     const stat = fs.statSync(fullPath);

//     if (stat.isDirectory()) {
//       const subModules = findExternalImports(fullPath);
//       subModules.forEach((m) => modules.add(m));
//     } else if (/\.(ts|tsx|js|jsx)$/.test(file)) {
//       const content = fs.readFileSync(fullPath, "utf8");

//       // match import statements and dynamic requires
//       const regex = /import\s+(?:.*?\s+from\s+)?["']([^"']+)["']|require\(["']([^"']+)["']\)/g;
//       let match: RegExpExecArray | null;
//       while ((match = regex.exec(content)) !== null) {
//         const mod = match[1] || match[2];
//         if (
//           mod &&
//           !mod.startsWith(".") &&  // ignore relative paths
//           !mod.startsWith("/") &&  // ignore absolute paths
//           !mod.startsWith("@/")    // ignore Vite aliases
//         ) {
//           modules.add(mod);
//         }
//       }
//     }
//   }

//   return modules;
// }

// try {
//   const externalModules = Array.from(findExternalImports(SRC_DIR));
//   if (externalModules.length === 0) {
//     console.log("No external dependencies detected.");
//   } else {
//     console.log("Detected external dependencies:", externalModules.join(", "));
//     console.log("Installing packages...");
//     execSync(`npm install ${externalModules.join(" ")}`, { stdio: "inherit" });
//     console.log("✅ Installation complete.");
//   }
// } catch (err) {
//   console.error("Error detecting/installing dependencies:", err);
// }