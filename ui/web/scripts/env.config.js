const dotenv = require("dotenv")
const fs = require('fs')


const envMainAoo = dotenv.parse(fs.readFileSync('.env.app'));
const envShared = dotenv.parse(fs.readFileSync('../shared/.env.shared'));
console.log("envShared", envShared, "envmani", envMainAoo)
const combinedEnv = Object.assign(envMainAoo, envShared);

fs.writeFileSync('.env', Object.entries(combinedEnv).map(([key, value]) => `${key}=${value}`).join('\n'));