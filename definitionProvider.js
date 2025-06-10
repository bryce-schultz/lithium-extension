const vscode = require('vscode');

// function delcatation regex "fn\s+test\s*\([^)]*\)\s*;"
// function definition regex  "fn\s+test\s*\([^)]*\)\s*[^;\s]"

function findDeclaration(document, word, currentLine = 0) {
    // Look for variable or function declarations: let/const <word> or fn <word>
    // For variables, search upwards from the current line for the closest match
    const funcDeclRegex = new RegExp(`\\bfn\\s+${word}\\s*\\([^)]*\\)\\s*;`);
    const funcDefRegex = new RegExp(`\\bfn\\s+${word}\\s*\\([^)]*\\)\\s*[^;\\s]`);
    const varDeclRegex = new RegExp(`\\b(let|const)\\s+${word}\\s*=`);

    // First, check for variable declarations upwards from currentLine
    for (let i = currentLine; i >= 0; i--) {
        let lineText = document.lineAt(i).text;
        if (varDeclRegex.test(lineText)) {
            return new vscode.Location(document.uri, new vscode.Position(i, lineText.indexOf(word)));
        }
    }

    // Then, check for function declarations/definitions from top to bottom
    for (let i = 0; i < document.lineCount; i++) {
        let lineText = document.lineAt(i).text;
        if (funcDeclRegex.test(lineText)) {
            return new vscode.Location(document.uri, new vscode.Position(i, lineText.indexOf(word)));
        }
        lineText += '.'; // Add a period to ensure regex matches function definitions that don't end with a semicolon
        if (funcDefRegex.test(lineText)) {
            return new vscode.Location(document.uri, new vscode.Position(i, lineText.indexOf(word)));
        }
    }
    return null;
}

function findDefinition(document, word, currentLine = 0) {
    // For variables, search upwards from the current line for the closest match
    const varDeclRegex = new RegExp(`\\b(let|const)\\s+${word}\\s*=`);
    for (let i = currentLine; i >= 0; i--) {
        const lineText = document.lineAt(i).text;
        if (varDeclRegex.test(lineText)) {
            return new vscode.Location(document.uri, new vscode.Position(i, lineText.indexOf(word)));
        }
    }

    // For functions, search from top to bottom
    const funcDefRegex = new RegExp(`\\bfn\\s+${word}\\s*\\([^)]*\\)\\s*[^;\\s]`);
    for (let i = 0; i < document.lineCount; i++) {
        const lineText = document.lineAt(i).text + '.'; // Add a period to ensure regex matches function definitions that don't end with a semicolon
        if (funcDefRegex.test(lineText)) {
            return new vscode.Location(document.uri, new vscode.Position(i, lineText.indexOf(word)));
        }
    }
    return null;
}

function provideDefinition(document, position) {
    const wordRange = document.getWordRangeAtPosition(position, /[a-zA-Z_][a-zA-Z0-9_]*/);
    if (!wordRange) return;
    const word = document.getText(wordRange);
    return findDefinition(document, word);
}

function provideDeclaration(document, position) {
    const wordRange = document.getWordRangeAtPosition(position, /[a-zA-Z_][a-zA-Z0-9_]*/);
    if (!wordRange) return;
    const word = document.getText(wordRange);
    return findDeclaration(document, word);
}

module.exports = function(context) {
    context.subscriptions.push(
        vscode.languages.registerDefinitionProvider('lithium', { provideDefinition })
    );
    context.subscriptions.push(
        vscode.languages.registerDeclarationProvider('lithium', { provideDeclaration })
    );
};