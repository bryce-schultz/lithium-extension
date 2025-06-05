const vscode = require('vscode');
const hoverProvider = require('./hoverProvider');
const definitionProvider = require('./definitionProvider');

function activate(context) {
    hoverProvider(context);
    definitionProvider(context);
}

function deactivate() {
}

module.exports = {
    activate,
    deactivate
};