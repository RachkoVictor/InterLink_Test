const fs = require('fs');

const file = fs.readFileSync('./acme_worksheet.csv'); 
const fileAsString = file.toString();
const rows = fileAsString
  .split('\n')
  .map(row => row.trim());

const table = rows
  .map(row => row.split(','));

const dates = ['Name / Date'];
let names = [];
table.forEach((row, index) => {
  if (index === 0) {
    return;
  }
  const name = row[0], date = row[1];
  if (!dates.includes(date)) {
    dates.push(date);
  }
  if (!names.includes(name)) {
    names.push(name);
  }
});

names = names.sort();

const headerString = dates.join(',');

const summaryTable = [headerString];
names.forEach(name => {
  const summaryRow = [name];
  dates.forEach((date, index) => {  
    if (index === 0) {
      return;
    }

    let hours;
    const row = table.find(row => row.includes(name) && row.includes(date));
    if (row) {
      hours = row[2];
    } else {
      hours = 0;
    }
    summaryRow.push(hours);
  });
  summaryTable.push(summaryRow.join(','));
});

const writeStream = fs.createWriteStream('summary.csv');
const summaryString = summaryTable.join('\n');
writeStream.write(summaryString);
