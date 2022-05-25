#!/usr/bin/env node

const fs = require("fs");
const es = require('event-stream');
const path = require("path");
const inquirer = require("inquirer");
const readline = require("readline");
const { Transform } = require("stream");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

  rl.question("Укажите директорию: ", (inputedPath) => {
    process.chdir(inputedPath);
    rl.question("Задайте искомое значение: ", (desiredValue) => {
      
      const isFile = (fileName) => {
        return fs.lstatSync(fileName).isFile();
      };
  
      const fileList = fs.readdirSync(inputedPath).filter(isFile);
  
      inquirer
        .prompt([
          {
            name: "fileName",
            type: "list",
            message: "Выберитие файл:",
            choices: fileList,
          },
        ])
        .then((answer) => {
          searchMatching(answer.fileName, desiredValue);
        });
    });
  });

function searchMatching(selectedFile, desiredValue) {
  const readStream = fs.createReadStream(selectedFile, "utf8");

  const transformStream = new Transform({
    transform(line, encoding, callback) {
      const transformedLine = line
        .toString()
        .match(new RegExp(`^.*${desiredValue}.*$`, 'gm'));
      callback(null, transformedLine.join("\n"));
    },
  })

  readStream.pipe(transformStream).pipe(process.stdout);
}