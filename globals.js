var url = "https://dvrpc.github.io/cms-embedded-items/ceds/regions.xlsx";
var file = await (await fetch(url)).arrayBuffer();
var workbook = XLSX.read(file);

export { workbook };
