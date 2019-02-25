const puppeteer = require("puppeteer");
const hbs = require("handlebars");
const moment = require("moment");

const fs = require("fs");
const path = require("path");

async function compileHBS(name, data) {
  const filePath = path.join(__dirname, "template", name + ".handlebars");
  const html = fs.readFileSync(filePath, "utf-8");
  return hbs.compile(html)(data);
}

hbs.registerHelper("dateFormat", (value, format) => {
  return moment(value).format(format);
});

hbs.registerHelper("toJSON", value => {
  return JSON.stringify(value);
});
async function generatePDF(template, data) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const content = await compileHBS(template, data);

  await page.setContent(content);
  await page.emulateMedia("screen");
  await page.pdf({
    path: (data.folder || "") + "/" + (data.fileName || Date.now() + ".pdf"),
    format: "Letter",
    printBackground: true
  });
  await browser.close();
}

function payslip(data) {
  generatePDF("payslip", data);
}

function accounting(data) {
  data = {
    amountDue: data.amountDue,
    dueNet: data.dueNetDays,
    invoiceDate: data.invoiceDate,
    invoiceNumber: data.invoiceNumber,
    loadNumber: data.loadNumber,
    drives: [data.loadRowData],
    fileName: data.fileName,
    folder: data.folder
  };
  generatePDF("invoice", data);
}

var generate = {
  accounting,
  payslip
};
module.exports = generate;
