const fs = require("fs");
const path = require("path");

const fonts = ["Amiri-Regular.ttf", "Amiri-Bold.ttf"];
const vfs = {};

fonts.forEach((file) => {
    const filePath = path.join(__dirname, "src", "assets", "fonts", file);
    const fileContent = fs.readFileSync(filePath);
    vfs[file] = fileContent.toString("base64");
});

const output = `
export const amiriFont = ${JSON.stringify(vfs, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, "vfs_fonts_amiri.js"), output);

console.log("✅ vfs_fonts_amiri.js created successfully");
