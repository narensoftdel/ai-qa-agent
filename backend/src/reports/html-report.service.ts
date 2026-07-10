import fs from 'fs';
import path from 'path';

export class HtmlReportService {
  generate(scanId: string, data: any): string {
    const report = `
<!DOCTYPE html>
<html>

<head>

<meta charset="utf-8">

<title>AI Security Report</title>

<style>

body{

font-family:Arial;

padding:40px;

background:#f5f5f5;

}

.container{

background:white;

padding:30px;

border-radius:10px;

box-shadow:0 0 10px rgba(0,0,0,.2);

}

table{

width:100%;

border-collapse:collapse;

margin-top:20px;

}

th,td{

border:1px solid #ddd;

padding:10px;

}

th{

background:#1976d2;

color:white;

}

h1{

color:#1976d2;

}

.summary{

display:flex;

gap:20px;

margin:20px 0;

}

.card{

background:#fafafa;

padding:15px;

border:1px solid #ddd;

flex:1;

border-radius:5px;

}

</style>

</head>

<body>

<div class="container">

<h1>AI Security Scan Report</h1>

<p><strong>Scan ID :</strong> ${scanId}</p>

<p><strong>Target :</strong> ${data.url}</p>

<p><strong>Generated :</strong> ${new Date().toLocaleString()}</p>

<div class="summary">

<div class="card">

<h3>Total Findings</h3>

<h2>${data.totalFindings}</h2>

</div>

<div class="card">

<h3>Pages</h3>

<h2>${data.pagesDiscovered}</h2>

</div>

<div class="card">

<h3>Status</h3>

<h2>Completed</h2>

</div>

</div>

<h2>Security Findings</h2>

<table>

<thead>

<tr>

<th>Category</th>

<th>Severity</th>

<th>Title</th>

<th>Description</th>

</tr>

</thead>

<tbody>

${data.findings
  .map(
    (f: any) => `

<tr>

<td>${f.category}</td>

<td>${f.severity}</td>

<td>${f.title}</td>

<td>${f.description}</td>

</tr>

`
  )
  .join('')}

</tbody>

</table>

</div>

</body>

</html>
`;

    const reportPath = path.join(
      process.cwd(),

      'storage',

      scanId,

      'report.html'
    );

    fs.writeFileSync(reportPath, report);

    return reportPath;
  }
}

export const htmlReportService = new HtmlReportService();
