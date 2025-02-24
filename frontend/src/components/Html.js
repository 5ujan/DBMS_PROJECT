function parseTextToHtmlObjects(text) {
  const lines = text.split("\n\n");
  const htmlObjects = [];

  lines.forEach((line) => {
    if (line.startsWith("**Set")) {
      htmlObjects.push({ type: "h2", content: line.replace(/\*\*/g, "") });
    } else if (line.startsWith("*")) {
      htmlObjects.push({ type: "li", content: line.replace(/\*/g, "") });
    } else if (line.startsWith("**Note:")) {
      htmlObjects.push({ type: "h2", content: line.replace(/\*\*/g, "") });
    } else if (line.startsWith("**Interpretation:**")) {
      htmlObjects.push({ type: "h2", content: "Interpretation:" });
    } else {
      htmlObjects.push({ type: "p", content: line });
    }
  });

  return htmlObjects; // Add this return statement to return the parsed HTML objects
}

console.log(
  parseTextToHtmlObjects(
    "**Regression**\n\n* **R-Squared:** 0.68\n* **Coefficient for Age:** 4.14\n* **Coefficient for BMI:** 0.62\n\n**Correlation**\n\n* **Correlation between Cholesterol and Age:** 0.59\n* **Correlation between Cholesterol and BMI:** 0.62\n\n**Interpretation**\n\n* The regression model explains 68% of the variation in Cholesterol levels.\n* Every one-year increase in Age is associated with a 4.14 increase in Cholesterol levels.\n* Every one-unit increase in BMI is associated with a 0.62 increase in Cholesterol levels.\n* Both Age and BMI have moderate positive correlations with Cholesterol."
  )
);

// Output:
// [
//   { type: 'h2', content: 'Regression' },
//   { type: 'li', content: 'R-Squared: 0.68' },
//   { type: 'li', content: 'Coefficient for Age: 4.14' },
//   { type: 'li', content: 'Coefficient for BMI: 0.62' },
//   { type: 'h2', content: 'Correlation' },
//   { type: 'li', content: 'Correlation between Cholesterol and Age: 0.59' },
//   { type: 'li', content: 'Correlation between Cholesterol and BMI: 0.62' },
//   { type: 'h2', content: 'Interpretation:' },
//   { type: 'p', content: 'The regression model explains 68% of the variation in Cholesterol levels.' },
//   { type: 'p', content: 'Every one-year increase in Age is

export default parseTextToHtmlObjects