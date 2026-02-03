const readline = require("readline");
const { CITIES } = require("./config");

function askCity() {
  return new Promise((resolve) => {
    console.log("\nAvailable Cities:");
    Object.entries(CITIES).forEach(([key, value]) => {
      console.log(`- ${key} (${value})`);
    });

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question("\nEnter city key: ", (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

module.exports = askCity;
