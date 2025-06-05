const vscode = require('vscode');

const hoverTexts = {
    "print": "Outputs the specified text or value to the console.",
    "if": "Conditional statement. Executes a block of code if the specified condition is true.",
    "else": "Conditional statement. Executes a block of code if the specified condition is false.",
    "while": "Loop statement. Repeats a block of code while the specified condition is true.",
    "for": "Loop statement. Repeats a block of code a specified number of times.",
    "asm": "Inline assembly function. Allows you to write assembly code directly in your Lithium program.",
    "fn": "Function declaration. Defines a new function with the specified name and parameters.",
    "let": "Variable declaration. Declares a new variable with the specified name and value.",
    "const": "Constant declaration. Declares a new constant with the specified name and value.",
    "return": "Returns a value from a function. Ends the execution of the function.",
    "true": "Boolean literal. Represents the true value.",
    "false": "Boolean literal. Represents the false value.",
    "exit": "Exits the program immediately. Can be used to terminate the execution of the Lithium program.",
    "&&": "Logical AND operator. Returns true if both operands are true.",
    "||": "Logical OR operator. Returns true if either operand is true.",
    "!=": "Not equal operator. Returns true if the operands are not equal.",
    "==": "Equal operator. Returns true if the operands are equal.",
    "<": "Less than operator. Returns true if the left operand is less than the right operand.",
    ">": "Greater than operator. Returns true if the left operand is greater than the right operand.",
    "<=": "Less than or equal operator. Returns true if the left operand is less than or equal to the right operand.",
    ">=": "Greater than or equal operator. Returns true if the left operand is greater than or equal to the right operand.",
    "+": "Addition operator. Adds two operands.",
    "-": "Subtraction operator. Subtracts the right operand from the left operand.",
    "*": "Multiplication operator. Multiplies two operands.",
    "/": "Division operator. Divides the left operand by the right operand.",
    "%": "Modulus operator. Returns the remainder of the division of the left operand by the right operand.",
    "++": "Increment operator. Increases the value of the operand by 1."
};

function provideHover(document, position) {
    const range = document.getWordRangeAtPosition(position, /[a-zA-Z_]+[a-zA-Z0-9_]*|&&|\|\||==|!=|<|<=|>|>=|\+|-|\*|\/|%|\+\+/);
    if (!range) return;
    const word = document.getText(range);

    console.log(word);

    if (hoverTexts[word]) {
        return new vscode.Hover(hoverTexts[word]);
    }
}

module.exports = function(context) {
    context.subscriptions.push(vscode.languages.registerHoverProvider('lithium', {
        provideHover
    }));
};