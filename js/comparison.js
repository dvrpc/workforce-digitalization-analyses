import { workbook } from "./globals.js";
import { geographySelect, regionsMap } from "./index.js";

var colors = {
  51: "#989A9B99",
  61: "#4B743699",
  54: "#74985F99",
  55: "#8CBC7399",
  52: "#F8952199",
  56: "#F36F3199",
  53: "#EA563799",
  62: "#27255E99",
  22: "#4D318999",
  31: "#9D83BC99",
  42: "#A8449999",
  81: "#66318C99",
  71: "#6566AE99",
  23: "#454DA199",
  48: "#D11F4599",
  44: "#D21C8B99",
  72: "#AA272599",
};

var dvrpcWorksheet = workbook.Sheets["dvrpc"];
var dvrpc_data = XLSX.utils.sheet_to_json(dvrpcWorksheet, { header: 1 });
export var dvrpcTotal = dvrpc_data[21][4];
dvrpc_data = dvrpc_data.filter((row) => parseInt(row[4])).slice(0, -2);
var maxRadius = Math.max(...dvrpc_data.map((row) => row[4]));

var dvrpcChart = new Chart(document.getElementById("bubble-dvrpc"), {
  type: "bubble",
  data: {
    labels: dvrpc_data.map((row) => row[1]),
    datasets: [
      {
        label: "null",
        data: dvrpc_data.map((row) => ({
          x: (row[2] * 100).toFixed(1),
          y: (row[3] * 100).toFixed(1),
          r: Math.round((row[4] / maxRadius) * 55),
          category: row[0],
        })),
      },
    ],
  },
  options: {
    animation: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Automation Risk",
        },
      },
      y: {
        title: {
          display: true,
          text: "Telework Capacity",
        },
      },
    },
    maintainAspectRatio: false,
    layout: {
      autoPadding: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const row = dvrpc_data.filter((row) => row[1] === context.label)[0];
            const total = `Employment: ${row[4].toLocaleString()}`;
            const lq = `LQ: ${row[5]}`;
            const naics = `NAICS Code: ${row[0]}`;
            const automation = `Automation Weight: ${row[2].toLocaleString(
              undefined,
              { style: "percent", minimumFractionDigits: 1 }
            )}`;
            const telework = `Telework Score: ${row[3].toLocaleString(
              undefined,
              { style: "percent", minimumFractionDigits: 1 }
            )}`;
            return [total, lq, naics, automation, telework];
          },
        },
      },
    },
    backgroundColor: function (context) {
      return colors[context.raw.category];
    },
  },
});

var chart;
var prev;

function updateChart() {
  if (chart) chart.destroy();
  document
    .querySelectorAll(".geography-header")
    .forEach((item) => (item.textContent = regionsMap[geographySelect.value]));
  prev = document.getElementById(geographySelect.value);

  var worksheet = workbook.Sheets[geographySelect.value];
  var raw_data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  raw_data = raw_data.filter((row) => parseInt(row[4]));

  chart = new Chart(document.getElementById("bubble"), {
    type: "bubble",
    data: {
      labels: raw_data.map((row) => row[1]),
      datasets: [
        {
          label: "null",
          data: raw_data.map((row) => ({
            x: (row[2] * 100).toFixed(1),
            y: (row[3] * 100).toFixed(1),
            r: Math.round((row[4] / maxRadius) * 55),
            category: row[0],
          })),
        },
      ],
    },
    options: {
      animation: false,
      scales: {
        x: {
          title: {
            display: true,
            text: "Automation Risk",
          },
        },
        y: {
          title: {
            display: true,
            text: "Telework Capacity",
          },
        },
      },
      maintainAspectRatio: false,
      layout: {
        autoPadding: false,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const row = raw_data.filter((row) => row[1] === context.label)[0];
              const total = `Employment: ${row[4].toLocaleString()}`;
              const lq = `LQ: ${row[5]}`;
              const naics = `NAICS Code: ${row[0]}`;
              const automation = `Automation Weight: ${row[2].toLocaleString(
                undefined,
                { style: "percent", minimumFractionDigits: 1 }
              )}`;
              const telework = `Telework Score: ${row[3].toLocaleString(
                undefined,
                { style: "percent", minimumFractionDigits: 1 }
              )}`;
              return [total, lq, naics, automation, telework];
            },
          },
        },
      },
      backgroundColor: function (context) {
        return colors[context.raw.category];
      },
    },
  });
}

export { updateChart };
