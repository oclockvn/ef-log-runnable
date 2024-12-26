import { extractParametersFromFirstLine, replaceParametersInQuery } from './src/utils/parameterParser.js';
import { copyToClipboard } from './src/utils/clipboard.js';

const input1 = document.getElementById('input1');
const input2 = document.getElementById('input2');
const copyButton = document.getElementById('copyButton');

input1.addEventListener('input', (e) => {
    const text = e.target.value;
    const parameters = extractParametersFromFirstLine(text);
    const queryPart = text.split('\n').slice(1).join('\n');
    const result = replaceParametersInQuery(parameters, queryPart);
    input2.value = result;
});

copyButton.addEventListener('click', async () => {
    const success = await copyToClipboard(input2.value);
    const originalText = copyButton.textContent;
    
    copyButton.textContent = success ? 'Copied!' : 'Failed to copy';
    copyButton.classList.add('copied');
    
    setTimeout(() => {
        copyButton.textContent = originalText;
        copyButton.classList.remove('copied');
    }, 2000);
});