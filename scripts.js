let currentCategory = "quadratic";
let currentCorrectAnswer = null;
let problemCount = 0;

const usedProblems = new Set();

function toggleMenu() {
    const menu = document.getElementById("menuDropdown");
    menu.classList.toggle("show");

    menu.onmouseleave = () => {
        menu.classList.remove("show");
    };
}

function selectCategory(category) {
    currentCategory = category;
    toggleMenu();
    generateProblem();
    updateActiveMenuItem(category);
}

function generateUniqueSeed() {
    return Date.now() + Math.random();
}

function isUniqueProblem(problem) {
    if (usedProblems.has(problem)) {
        return false;
    }
    usedProblems.add(problem);
    return true;
}

function generateProblem() {
    let problem;
    let attempts = 0;
    const maxAttempts = 10;

    do {
        const seed = generateUniqueSeed();
        Math.seedrandom(seed);

        switch (currentCategory) {
            case "quadratic":
                problem = generateQuadraticProblem();
                break;
            case "exponential":
                problem = generateExponentialProblem();
                break;
            case "logarithmic":
                problem = generateLogarithmicProblem();
                break;
            case "rational":
                problem = generateRationalProblem();
                break;
            case "polynomial":
                problem = generatePolynomialProblem();
                break;
            case "trigonometry":
                problem = generateTrigonometryProblem();
                break;
            default:
                problem = "Select a problem type from the menu";
        }

        attempts++;
    } while (!isUniqueProblem(problem) && attempts < maxAttempts);

    displayProblem(problem);
    document.getElementById("userAnswer").value = "";
    document.getElementById("feedback").innerHTML = "";
}

function updateActiveMenuItem(page) {
    const menuItems = document.querySelectorAll(".menu-item");
    menuItems.forEach((item) => {
        item.classList.remove("active-page");
        if (item.getAttribute("data-page") === page) {
            item.classList.add("active-page");
        }
    });
}

const menuItems = document.querySelectorAll(".menu-item");
menuItems.forEach((item) => {
    item.setAttribute("data-page", item.textContent.toLowerCase());
});

function generateQuadraticProblem() {
    let a, b, c, discriminant;
    do {
        a = Math.floor(Math.random() * 5) + 1;
        b = Math.floor(Math.random() * 10) - 5;
        c = Math.floor(Math.random() * 10) - 5;
        discriminant = b * b - 4 * a * c;
    } while (discriminant < 0);

    const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    currentCorrectAnswer = {
        type: "quadratic",
        answer: [root1.toFixed(2), root2.toFixed(2)],
    };
    return `Solve the quadratic equation: $${a}x^2 ${
        b >= 0 ? "+" : "-"
    } ${Math.abs(b)}x ${c >= 0 ? "+" : "-"} ${Math.abs(c)} = 0$`;
}

function generateExponentialProblem() {
    const base = Math.floor(Math.random() * 3) + 2;
    const exponent = Math.floor(Math.random() * 4) + 2;
    const result = Math.pow(base, exponent);
    currentCorrectAnswer = {
        type: "exponential",
        answer: exponent,
    };

    return `Solve for x: $${base}^x = ${result}$`;
}

function generateLogarithmicProblem() {
    const base = Math.floor(Math.random() * 4) + 2;
    const value = Math.pow(base, Math.floor(Math.random() * 3) + 2);
    currentCorrectAnswer = {
        type: "logarithmic",
        answer: Math.log(value) / Math.log(base),
    };
    return `Solve for x: $\\log_{${base}}(${value}) = x$`;
}

function generateRationalProblem() {
    let a, b, c, d, e, solution;
    do {
        a = Math.floor(Math.random() * 5) + 1;
        b = Math.floor(Math.random() * 5) - 2;
        c = Math.floor(Math.random() * 5) + 1;
        d = Math.floor(Math.random() * 5) - 2;
        e = Math.floor(Math.random() * 3) + 1;

        const numerator = e * d - b;
        const denominator = a - e * c;
        if (denominator === 0) continue;

        solution = (numerator / denominator).toFixed(2);
        if (c * solution + d === 0) continue;
    } while (isNaN(solution));

    currentCorrectAnswer = {
        type: "rational",
        answer: solution,
    };
    return `Solve for x: $\\frac{${a}x + ${b}}{${c}x + ${d}} = ${e}$`;
}

function generatePolynomialProblem() {
    const degree = Math.floor(Math.random() * 3) + 2;
    const coefficients = Array.from(
        { length: degree + 1 },
        () => Math.floor(Math.random() * 10) - 5
    );
    currentCorrectAnswer = {
        type: "polynomial",
        answer: coefficients,
    };
    let polynomial = coefficients
        .map((coeff, index) => {
            const power = degree - index;
            return `${coeff >= 0 && index > 0 ? "+" : ""}${coeff}x^${power}`;
        })
        .join(" ");
    return `Find the roots: $${polynomial} = 0$`;
}

function generateTrigonometryProblem() {
    const angle = Math.floor(Math.random() * 90) + 1;
    const functionType = Math.random() < 0.5 ? "sin" : "cos";
    const radians = (angle * Math.PI) / 180;
    const answer =
        functionType === "sin" ? Math.sin(radians) : Math.cos(radians);
    currentCorrectAnswer = {
        type: "trigonometry",
        answer: answer.toFixed(2),
    };
    return `Find the value of $${functionType}(${angle}^\\circ)$`;
}

function checkAnswer() {
    const userInput = document.getElementById("userAnswer").value;
    const feedbackElement = document.getElementById("feedback");
    feedbackElement.innerHTML = "";

    if (!currentCorrectAnswer) {
        feedbackElement.innerHTML = "Generate a problem first!";
        return;
    }

    let isCorrect = false;
    let explanation = "";

    switch (currentCorrectAnswer.type) {
        case "quadratic":
            const userRoots = userInput.split(",").map(Number);
            if (userRoots.length !== 2) {
                explanation =
                    "Please enter two roots separated by a comma (e.g., 2, -3)";
                break;
            }
            isCorrect =
                userRoots.some(
                    (r) => r.toFixed(2) == currentCorrectAnswer.answer[0]
                ) &&
                userRoots.some(
                    (r) => r.toFixed(2) == currentCorrectAnswer.answer[1]
                );
            if (!isCorrect) {
                explanation = `Incorrect. The correct roots are ${currentCorrectAnswer.answer.join(
                    " and "
                )}`;
            }
            break;

        case "exponential":
            isCorrect = parseInt(userInput) === currentCorrectAnswer.answer;
            if (!isCorrect) {
                explanation = `Incorrect. The correct exponent is ${currentCorrectAnswer.answer}`;
            }
            break;

        case "logarithmic":
            const userLogAnswer = parseFloat(userInput).toFixed(5);
            const correctLogAnswer = currentCorrectAnswer.answer.toFixed(5);
            isCorrect = userLogAnswer === correctLogAnswer;
            if (!isCorrect) {
                explanation = `Incorrect. The correct answer is ${correctLogAnswer}`;
            }
            break;

        case "polynomial":
            const userCoefficients = userInput
                .split(",")
                .map((num) => parseFloat(num.trim()));
            isCorrect =
                userCoefficients.length === currentCorrectAnswer.answer.length &&
                userCoefficients.every(
                    (coeff, index) =>
                        Math.abs(coeff - currentCorrectAnswer.answer[index]) < 0.01
                );
            if (!isCorrect) {
                explanation = `Incorrect. The correct coefficients are ${currentCorrectAnswer.answer.join(
                    ", "
                )}`;
            }
            break;

        case "trigonometry":
            isCorrect =
                parseFloat(userInput).toFixed(2) === currentCorrectAnswer.answer;
            if (!isCorrect) {
                explanation = `Incorrect. The correct value is ${currentCorrectAnswer.answer}`;
            }
            break;

        default:
            explanation = "Unknown problem type";
            break;
    }

    if (isCorrect) {
        feedbackElement.innerHTML =
            '<span style="color: green;">Correct! Well done!</span>';
        problemCount++;
        document.getElementById(
            "problemCounter"
        ).textContent = `Problems Solved: ${problemCount}`;
        document.getElementById("userAnswer").value = "";
        setTimeout(generateProblem, 1500);
    } else {
        feedbackElement.innerHTML = `<span style="color: red;">${explanation}</span>`;
    }
}

function displayProblem(problem) {
    const problemElement = document.getElementById("problemDisplay");
    problemElement.innerHTML = problem;
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, problemElement]);
}

// Initial problem generation
generateProblem();