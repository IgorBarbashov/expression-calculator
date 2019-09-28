// function eval() {
//   // Do not use eval!!!
//   return;
// }

function expressionCalculator(expr) {
  const openedBrackets = expr.match(/\(/g) || [];
  const closedBrackets = expr.match(/\)/g) || [];
  if (openedBrackets.length !== closedBrackets.length) {
    throw new Error("ExpressionError: Brackets must be paired");
  }
  const expWithoutSpaces = expr.replace(/ /g, "");

  const findExprInBrackets = expr => {
    if (!expr.match(/\(/g)) {
      return null;
    }
    const opened = expr.indexOf("(");
    const [, closed] = [...expr.slice(opened + 1)].reduce(
      (acc, el, i) => {
        const [count, index] = acc;
        if (count === 0) {
          return acc;
        }
        if (el === "(") {
          return [count + 1, index];
        }
        if (el === ")") {
          return [count - 1, opened + 1 + i];
        }
        return acc;
      },
      [1, opened + 1]
    );
    return [expr.slice(opened + 1, closed), opened, closed];
  };

  const evalNoBrackets = (expr, blankExpr) => {
    console.log("!!!!!!!!!!!!!!!!!!!! expr", `--${expr}--`);
    if (expr === "") {
      return blankExpr;
    }

    if (!expr.match(/[\+\-\*\/]/g)) {
      console.log("no signs", expr);
      return +expr;
    }

    const adds = expr.split("+");
    console.log("adds:", adds);
    if (adds.length > 1) {
      const addsResult = adds.reduce((acc, el) => {
        console.log("-----> acc:", acc);

        return evalNoBrackets(acc, 0) + evalNoBrackets(el, 0);
      });
      console.log("addsResult:", addsResult);
      return addsResult;
    }

    const subs = expr.split("-");
    console.log("subs:", subs);
    if (subs.length > 1) {
      const subsResult = subs.reduce((acc, el) => evalNoBrackets(acc, 0) - evalNoBrackets(el, 0));
      console.log("subsResult:", subsResult);
      return subsResult;
    }

    const multipliers = expr.split("*");
    console.log("multipliers:", multipliers);
    if (multipliers.length > 1) {
      const muliplyResult = multipliers.reduce(
        (acc, el) => evalNoBrackets(acc, 1) * evalNoBrackets(el, 1)
      );
      console.log("muliplyResult:", muliplyResult);
      return muliplyResult;
    }

    const dividers = expr.split("/");
    console.log("dividers:", dividers);
    const divideResult = dividers.reduce(
      (acc, el) => evalNoBrackets(acc, 1) / evalNoBrackets(el, 1)
    );
    console.log("divideResult:", divideResult);
    return divideResult;
  };

  const trimSigns = expr => {
    const leftSide = expr.match(/^[\+\-\*\/]/) || [""];
    const leftSideLength = leftSide[0].length;
    const rigthSide = expr.match(/[\+\-\*\/]$/) || [""];
    const rigthSideLength = rigthSide[0].length;
    return [leftSide[0], expr.slice(leftSideLength, expr.length - rigthSideLength), rigthSide[0]];
  };

  const calculateExpr = expr => {
    const isNested = findExprInBrackets(expr);
    if (!isNested) {
      return evalNoBrackets(expr, 0);
    }
    const leftPart = expr.slice(0, isNested[1]);
    const trimmedLeftPart = trimSigns(leftPart);
    const centralPart = isNested[0];
    const rightPart = expr.slice(isNested[2] + 1);
    const trimmedRightPart = trimSigns(rightPart);

    return calculateExpr(
      `${trimmedLeftPart[0]}${calculateExpr(trimmedLeftPart[1])}${
        trimmedLeftPart[2]
      }${calculateExpr(centralPart)}${trimmedRightPart[0]}${calculateExpr(trimmedRightPart[1])}${
        trimmedRightPart[2]
      }`
    );
  };

  return calculateExpr(expWithoutSpaces);
}

const yy = expressionCalculator("1 * (5 +    6 ) / ( 3-(    9+12) *8)");
console.log("типа ответ:", yy);
console.log(eval("1 * (5 +    6 ) / ( 3-(    9+0) *8)"));

// module.exports = {
//   expressionCalculator
// };
