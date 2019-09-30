function eval() {
  // Do not use eval!!!
  return;
}

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

  const evalNoBrackets = (newExpr, blankExpr, whereFrom) => {
    const rawExpr = "" + newExpr;

    if (rawExpr === "") {
      return blankExpr;
    }

    if (!rawExpr.match(/[\+\-\*\/]/g)) {
      return +rawExpr.replace("n", "-");
    }

    const expr = rawExpr.replace("n", "-").replace(/(?<=[\-\+\/\*])\-+/g, "n");

    const adds = expr.split("+");
    if (adds.length > 1) {
      const addsResult = adds.reduce((acc, el) => {
        return evalNoBrackets(acc, 0) + evalNoBrackets(el, 0);
      });
      return addsResult;
    }

    const subs = expr.split("-");
    if (subs.length > 1) {
      const subsResult = subs.reduce((acc, el) => evalNoBrackets(acc, 0) - evalNoBrackets(el, 0));
      return subsResult;
    }

    const multipliers = expr.split("*");
    if (multipliers.length > 1) {
      const muliplyResult = multipliers.reduce(
        (acc, el) => evalNoBrackets(acc, 1) * evalNoBrackets(el, 1)
      );
      return muliplyResult;
    }

    const dividers = expr.split("/");
    if (dividers.length > 1) {
      const divideResult = dividers.reduce(
        (acc, el) => evalNoBrackets(acc, 1) / evalNoBrackets(el, 1)
      );
      return divideResult;
    }
  };

  const calculateExpr = expr => {
    const isNested = findExprInBrackets(expr);
    if (!isNested) {
      return evalNoBrackets(expr, "", "start");
    }
    const leftPart = expr.slice(0, isNested[1]);
    const centralPart = isNested[0];
    const rightPart = expr.slice(isNested[2] + 1);
    return calculateExpr(`${leftPart}${calculateExpr(centralPart)}${rightPart}`);
  };

  const result = calculateExpr(expWithoutSpaces);

  if (result === Infinity || isNaN(result)) {
    throw new Error("TypeError: Division by zero.");
  } else {
    return result;
  }
}

module.exports = {
  expressionCalculator
};
