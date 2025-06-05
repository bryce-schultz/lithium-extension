const vscode = require('vscode');

// function delcatation regex "fn\s+test\s*\([^)]*\)\s*;"
// function definition regex  "fn\s+test\s*\([^)]*\)\s*[^;\s]"

function findDeclaration(document, word) {
    // Look for variable or function declarations: let/const <word> or fn <word>
    for (let i = 0; i < document.lineCount; i++) {
        let lineText = document.lineAt(i).text;
        const funcDeclRegex = new RegExp(`\\bfn\\s+${word}\\s*\\([^)]*\\)\\s*;`);
        const funcDefRegex = new RegExp(`\\bfn\\s+${word}\\s*\\([^)]*\\)\\s*[^;\\s]`);
        const varDeclRegex = new RegExp(`\\b(let|const)\\s+${word}\\s*=`);

        if (funcDeclRegex.test(lineText)) {
            return new vscode.Location(document.uri, new vscode.Position(i, lineText.indexOf(word)));
        }

        if (varDeclRegex.test(lineText)) {
            return new vscode.Location(document.uri, new vscode.Position(i, lineText.indexOf(word)));
        }

        lineText += '.'; // Add a period to ensure regex matches function definitions that don't end with a semicolon

        // explicit function declarations aren't necessary, if we find a function definition, we can use that as the declaration
        if (funcDefRegex.test(lineText)) {
            return new vscode.Location(document.uri, new vscode.Position(i, lineText.indexOf(word)));
        }
    }
    return null;
}

function findDefinition(document, word) {
    // Look for variable or function declarations: let/const <word> or fn <word>
    for (let i = 0; i < document.lineCount; i++) {
        const lineText = document.lineAt(i).text + '.'; // Add a period to ensure regex matches function definitions that don't end with a semicolon
        const funcDefRegex = new RegExp(`\\bfn\\s+${word}\\s*\\([^)]*\\)\\s*[^;\\s]`);
        const varDeclRegex = new RegExp(`\\b(let|const)\\s+${word}\\s*=`);

        if (funcDefRegex.test(lineText)) {
            return new vscode.Location(document.uri, new vscode.Position(i, lineText.indexOf(word)));
        }

        if (varDeclRegex.test(lineText)) {
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