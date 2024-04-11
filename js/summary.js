import { workbook } from "./globals.js";
import { geographySelect, regionsMap } from "./index.js";
import { dvrpcTotal } from "./comparison.js";

const scoreHex = {
  low: "#662d91",
  medium: "#F7941D",
  high: "#ED5565",
};

var dvrpcComp = workbook.Sheets["dvrpc"];
dvrpcComp = XLSX.utils
  .sheet_to_json(dvrpcComp, { header: 1 })
  .filter((row) => row[6] === "competitive");

document.getElementById("region-comp-length").textContent = dvrpcComp.length;

var worksheet = workbook.Sheets["summary"];
var raw_data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
raw_data = raw_data.slice(1);

var total;
var prevTotal;

function updateTotal() {
  if (total) total.destroy();
  prevTotal = document.getElementById(geographySelect.value);

  var regionTotal = raw_data
    .filter((row) => row[0] === "Greater Philadelphia")[0][1]
    .toLocaleString(undefined, {
      style: "percent",
      minimumFractionDigits: 1,
    });
  document.getElementById("region-total").textContent = regionTotal;

  var geoTotal = raw_data
    .filter((row) => row[0] === regionsMap[geographySelect.value])[0][1]
    .toLocaleString(undefined, {
      style: "percent",
      minimumFractionDigits: 1,
    });
  document.getElementById("geography-total").textContent = geoTotal;

  var dvrpcSectors = document.getElementById("region-sectors");
  if (dvrpcSectors.innerHTML) dvrpcSectors.innerHTML = "";
  dvrpcComp.map((row) =>
    generateSector(row, row[4] / dvrpcTotal, dvrpcSectors)
  );
  var geoWorksheet = workbook.Sheets[geographySelect.value];
  var geoComp = XLSX.utils.sheet_to_json(geoWorksheet, { header: 1 });
  var geoTotal = geoComp[21][4];
  var geoSectors = document.getElementById("geography-sectors");
  if (geoSectors.innerHTML) geoSectors.innerHTML = "";
  geoComp = geoComp.filter((row) => row[6] === "competitive");
  geoComp.map((row) => generateSector(row, row[4] / geoTotal, geoSectors));

  document.getElementById("geo-comp-length").textContent = geoComp.length;

  total = new Chart(document.getElementById("total-chart"), {
    type: "bar",
    data: {
      labels: raw_data.map((row) => row[0]),
      datasets: [
        {
          data: raw_data.map((row) => row[1] * 100),
          backgroundColor: function (context) {
            return regionsMap[Object.keys(regionsMap)[context.dataIndex]] ===
              regionsMap[geographySelect.value] || context.dataIndex === 0
              ? "#662D91"
              : "#662D9170";
          },
          label: "Percentage of Employment in Competitive Sectors",
        },
      ],
    },
    options: {
      animation: false,
      maintainAspectRatio: false,
      layout: {
        autoPadding: false,
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: {
            callback: function (value, index, ticks) {
              return value + "%";
            },
          },
        },
      },
      plugins: {
        autocolors: {
          mode: "label",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              var row = raw_data.filter((row) => row[0] === context.label)[0];
              var val = `Competitive Employment: ${row[1].toLocaleString(
                undefined,
                {
                  style: "percent",
                  minimumFractionDigits: 1,
                }
              )}`;
              return [val];
            },
          },
        },
      },
    },
  });
}

var automation;
var prevAutomation;

function updateAutomation() {
  if (automation) automation.destroy();
  prevAutomation = document.getElementById(geographySelect.value);

  var regionTotal = raw_data
    .filter((row) => row[0] === "Greater Philadelphia")[0][2]
    .toLocaleString(undefined, {
      style: "percent",
      minimumFractionDigits: 1,
    });
  document.getElementById("region-total-automation").textContent = regionTotal;

  var geoTotal = raw_data
    .filter((row) => row[0] === regionsMap[geographySelect.value])[0][2]
    .toLocaleString(undefined, {
      style: "percent",
      minimumFractionDigits: 1,
    });
  document.getElementById("geography-total-automation").textContent = geoTotal;

  var dvrpcSectors = document.getElementById("region-automation-sectors");
  if (dvrpcSectors.innerHTML) dvrpcSectors.innerHTML = "";
  dvrpcComp.map((row) =>
    generateSector(row, row[2], dvrpcSectors, scoreHex[row[8]])
  );

  var geoWorksheet = workbook.Sheets[geographySelect.value];
  var geoComp = XLSX.utils
    .sheet_to_json(geoWorksheet, { header: 1 })
    .filter((row) => row[6] === "competitive");
  var geoSectors = document.getElementById("geography-automation-sectors");
  if (geoSectors.innerHTML) geoSectors.innerHTML = "";
  geoComp.map((row) =>
    generateSector(row, row[2], geoSectors, scoreHex[row[8]])
  );

  automation = new Chart(document.getElementById("automation-chart"), {
    type: "bar",
    data: {
      labels: raw_data.map((row) => row[0]),
      datasets: [
        {
          label: "High Automation",
          data: raw_data.map((row) => row[4] * 100),
          backgroundColor: function (context) {
            return regionsMap[Object.keys(regionsMap)[context.dataIndex]] ===
              regionsMap[geographySelect.value] || context.dataIndex === 0
              ? "#ED5565"
              : "#ED556570";
          },
        },
        {
          label: "Medium Automation",
          data: raw_data.map((row) => row[3] * 100),
          backgroundColor: function (context) {
            return regionsMap[Object.keys(regionsMap)[context.dataIndex]] ===
              regionsMap[geographySelect.value] || context.dataIndex === 0
              ? "#F7941D"
              : "#F7941D70";
          },
        },
        {
          label: "Low Automation",
          data: raw_data.map((row) => row[2] * 100),
          backgroundColor: function (context) {
            return regionsMap[Object.keys(regionsMap)[context.dataIndex]] ===
              regionsMap[geographySelect.value] || context.dataIndex === 0
              ? "#2B1956"
              : "#2B195670";
          },
        },
      ],
    },
    options: {
      animation: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = (context.raw / 100).toLocaleString("en-GB", {
                style: "percent",
                minimumFractionDigits: 1,
              });
              return `${context.dataset.label}: ${value}`;
            },
          },
        },
      },
      tooltips: {
        enabled: true,
      },
      scales: {
        x: {
          stacked: true,
        },
        y: {
          min: 0,
          max: 100,
          stacked: true,
          ticks: {
            callback: function (value, index, ticks) {
              return value + "%";
            },
          },
        },
      },
      maintainAspectRatio: false,
      layout: {
        autoPadding: false,
      },
    },
  });
}

var telework;
var prevTelework;

function updateTelework() {
  if (telework) telework.destroy();
  prevTelework = document.getElementById(geographySelect.value);

  var regionTotal = raw_data
    .filter((row) => row[0] === "Greater Philadelphia")[0][5]
    .toLocaleString(undefined, {
      style: "percent",
      minimumFractionDigits: 1,
    });
  document.getElementById("region-total-telework").textContent = regionTotal;

  var geoTotal = raw_data
    .filter((row) => row[0] === regionsMap[geographySelect.value])[0][5]
    .toLocaleString(undefined, {
      style: "percent",
      minimumFractionDigits: 1,
    });
  document.getElementById("geography-total-telework").textContent = geoTotal;

  var dvrpcSectors = document.getElementById("region-telework-sectors");
  if (dvrpcSectors.innerHTML) dvrpcSectors.innerHTML = "";
  dvrpcComp.map((row) =>
    generateSector(row, row[3], dvrpcSectors, scoreHex[row[9]])
  );

  var geoWorksheet = workbook.Sheets[geographySelect.value];
  var geoComp = XLSX.utils
    .sheet_to_json(geoWorksheet, { header: 1 })
    .filter((row) => row[6] === "competitive");
  var geoSectors = document.getElementById("geography-telework-sectors");
  if (geoSectors.innerHTML) geoSectors.innerHTML = "";
  geoComp.map((row) =>
    generateSector(row, row[3], geoSectors, scoreHex[row[9]])
  );

  telework = new Chart(document.getElementById("telework-chart"), {
    type: "bar",
    data: {
      labels: raw_data.map((row) => row[0]),
      datasets: [
        {
          label: "High Telework",
          data: raw_data.map((row) => row[7] * 100),
          backgroundColor: function (context) {
            return regionsMap[Object.keys(regionsMap)[context.dataIndex]] ===
              regionsMap[geographySelect.value] || context.dataIndex === 0
              ? "#ED5565"
              : "#ED556570";
          },
        },
        {
          label: "Medium Telework",
          data: raw_data.map((row) => row[6] * 100),
          backgroundColor: function (context) {
            return regionsMap[Object.keys(regionsMap)[context.dataIndex]] ===
              regionsMap[geographySelect.value] || context.dataIndex === 0
              ? "#F7941D"
              : "#F7941D70";
          },
        },
        {
          label: "Low Telework",
          data: raw_data.map((row) => row[5] * 100),
          backgroundColor: function (context) {
            return regionsMap[Object.keys(regionsMap)[context.dataIndex]] ===
              regionsMap[geographySelect.value] || context.dataIndex === 0
              ? "#2B1956"
              : "#2B195670";
          },
        },
      ],
    },
    options: {
      animation: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = (context.raw / 100).toLocaleString("en-GB", {
                style: "percent",
                minimumFractionDigits: 1,
              });
              return `${context.dataset.label}: ${value}`;
            },
          },
        },
      },
      tooltips: {
        enabled: true,
      },
      scales: {
        x: {
          stacked: true,
        },
        y: {
          min: 0,
          max: 100,
          stacked: true,
          ticks: {
            callback: function (value, index, ticks) {
              return value + "%";
            },
          },
        },
      },
      maintainAspectRatio: false,
      layout: {
        autoPadding: false,
      },
    },
  });
}

const generateSector = (row, num, sectors, hex = null) => {
  var sector = document.createElement("div");
  sector.className = "sector";
  var stat = document.createElement("h2");
  if (hex) stat.style.color = hex;
  stat.className = "sector-stat";
  stat.textContent = num.toLocaleString(undefined, {
    style: "percent",
    minimumFractionDigits: 1,
  });
  var name = document.createElement("h4");
  name.className = "sector-name";
  name.textContent = row[1];
  sector.appendChild(stat);
  sector.appendChild(name);
  sectors.appendChild(sector);
};

export { updateTotal, updateTelework, updateAutomation };
