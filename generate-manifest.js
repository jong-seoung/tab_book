// manifest.js 파일 생성 스크립트
// 이 스크립트는 secrets.json 파일에서 비밀 키를 읽어와서 manifest.template.json 파일을 기반으로 manifest.json 파일을 생성합니다.
// node generate-manifest.js 명령어로 실행할 수 있습니다.

const fs = require("fs");

const secrets = JSON.parse(fs.readFileSync("secrets.json", "utf-8"));
let manifest = fs.readFileSync("manifest.template.json", "utf-8");

manifest = manifest
  .replace(/__CLIENT_ID__/g, secrets.CLIENT_ID)
  .replace(/__EXTENSION_KEY__/g, secrets.EXTENSION_KEY);

fs.writeFileSync("manifest.json", manifest);

console.log("manifest.json generated in dist/");