import fetch from "node-fetch";
import path from "path";
import * as url from "url";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

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

const statement = (invoice, plays) => {
  const totalVolumeCredits = () => {
    let volumeCredits = 0;
    for (let perf of invoice.performances) {
      volumeCredits += volumeCreditsFor(perf);
    }
    return volumeCredits;
  };

  const usd = (aNumber) => {
    // 매개변수 데이터타입을 적어주면 좋다.
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFactionDigits: 2,
    }).format(aNumber);
  };

  const playFor = (aPerformance) => {
    // 임시 변수를 질의 함수로 바꾸기.
    return plays[aPerformance.playID];
  };

  const amountFor = (aPerformance) => {
    // 값이 바뀌지 않는 매개변수
    let result = 0; // 변수를 초기화 한다. 그리고 이름을 바꾸어준다.
    switch (playFor(aPerformance).type) {
      case "tragedy":
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;
        break;
      default:
        throw new Error(
          `알 수 없는 장르: ${JSON.stringify(playFor(aPerformance))}`
        );
    }

    return result; // 함수 안에서 값이 바뀌는 변수
  };

  const volumeCreditsFor = (perf) => {
    let volumeCredits = 0;
    volumeCredits += Math.max(perf.audience - 30, 0);
    if ("comedy" === playFor(perf).type)
      volumeCredits += Math.floor(perf.audience / 5);
    return volumeCredits;
  };

  let totalAmount = 0;
  let result = `청구내역 (고객명 : ${invoice.customer})\n`;

  for (let perf of invoice.performances) {
    //청구내역을 출력한다.
    result += `${playFor(perf).name}: ${usd(amountFor(perf) / 100)} (${
      perf.audience
    }석)\n`;
    totalAmount += amountFor(perf);
  }

  result += `총액: ${usd(totalAmount / 100)}\n`;
  result += `적립 포인트: ${totalVolumeCredits()}점\n`;
  return result;
};

console.log(statement($invoices, $plays));
