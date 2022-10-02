import fetch from "node-fetch";
import path from "path";
import * as url from "url";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
import createStatementData from "./createStatementData.js";

const $invoices = {
  customer: "BigCo",
  performances: [
    {
      playID: "ham-let",
      audience: 55,
    },
    {
      playID: "as-like",
      audience: 35,
    },
    {
      playID: "othe-llo",
      audience: 40,
    },
  ],
};

const $plays = {
  "ham-let": { name: "Hamlet", type: "tragedy" },
  "as-like": { name: "As You Like It", type: "comedy" },
  "othe-llo": { name: "Othello", type: "tragedy" },
};

function statement(invoice, plays) {
  return renderPlainText(createStatementData(invoice, plays));
}

function renderPlainText(data, plays) {
  let result = `청구내역 (고객명 : ${data.customer})\n`;

  for (let perf of data.performances) {
    //청구내역을 출력한다.
    result += `${perf.play.name}: ${usd(perf.amount / 100)}(${
      perf.audience
    }석)\n`;
  }

  result += `총액: ${usd(data.totalPee / 100)}\n`;
  result += `적립 포인트: ${data.totalVolumeCredits}점\n`;
  return result;
}

function htmlStatement(invoice, plays) {
  return renderHTML(createStatementData(invoice, plays));
}

function renderHTML(data, plays) {
  let result = `<h1>청구내역 (고객명 : ${data.customer})</h1>\n`;
  result += "<table>\n";
  result += "<tr><th>연극</th><th>좌석 수</th><th>금액</th></tr>";

  for (let perf of data.performances) {
    //청구내역을 출력한다.
    result += `<tr><td>${perf.play.name}</td><td>(${perf.audience}석)</td>`;
    result += `<td>${usd(perf.amount / 100)}</td></tr>\n`;
  }

  result += "<table>\n";
  result += `<p>총액: <em>${usd(data.totalPee / 100)}</em></p>\n`;
  result += `<p>적립 포인트: <em>${data.totalVolumeCredits}점</em></p>\n`;
  return result;
}

function usd(aNumber) {
  // 매개변수 데이터타입을 적어주면 좋다.
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFactionDigits: 2,
  }).format(aNumber);
}

console.log(statement($invoices, $plays));
