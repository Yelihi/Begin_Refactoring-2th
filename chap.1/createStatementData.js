export default function createStatementData(invoice, plays) {
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);
  statementData.totalPee = totalPee(statementData);
  return statementData;

  function enrichPerformance(aPerformance) {
    const result = Object.assign({}, aPerformance);
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
    return result;
  }

  function playFor(aPerformance) {
    // 임시 변수를 질의 함수로 바꾸기.
    return plays[aPerformance.playID];
  }

  function amountFor(aPerformance) {
    // 값이 바뀌지 않는 매개변수
    let result = 0; // 변수를 초기화 한다. 그리고 이름을 바꾸어준다.
    switch (aPerformance.play.type) {
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
          `알 수 없는 장르: ${JSON.stringify(aPerformance.play)}`
        );
    }

    return result; // 함수 안에서 값이 바뀌는 변수
  }

  function volumeCreditsFor(aPerformance) {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if ("comedy" === aPerformance.play.type)
      result += Math.floor(aPerformance.audience / 5);
    return result;
  }

  function totalVolumeCredits(data) {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
  }

  function totalPee(data) {
    return data.performances.reduce((total, p) => total + p.amount, 0);
  }
}
