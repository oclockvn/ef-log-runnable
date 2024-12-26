// import { copyToClipboard } from './src/utils/clipboard.js';

const input1 = document.getElementById('input1');
const input2 = document.getElementById('input2');
const copyButton = document.getElementById('copyButton');

// Restore the last value of input1 from localStorage
document.addEventListener('DOMContentLoaded', () => {
    const savedInput1Value = localStorage.getItem('input1Value');
    if (savedInput1Value) {
        input1.value = savedInput1Value;
        input2.value = convertToSql(savedInput1Value);
    }
});

input1.addEventListener('input', async (e) => {
    const text = e.target.value;
    if (!text || !text.length) {
        return;
    }

    // Save the current value of input1 to localStorage
    localStorage.setItem('input1Value', text);

    input2.value = convertToSql(text);
    await copyToClipboard(input2.value);
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

function convertToSql(dbLog) {
  const paramsMatch = dbLog.match(/Parameters=\[(.*?)\]/);

  if (!paramsMatch) {
    return dbLog;
  }

  const paramsString = paramsMatch[1];

  // Parse parameters
  const params = {};
  const paramRegex = /@__(\w+?)_\d+='(.*?)'/g;
  let match;
  while ((match = paramRegex.exec(paramsString)) !== null) {
    params[match[1]] = match[2];
  }

  // Replace parameter placeholders with actual values
  let finalSql = dbLog.replace(/^.*Parameters=\[.*?\].*$/m, '-- $&'); // Comment out the line containing parameters
  for (const [key, value] of Object.entries(params)) {
    const regex = new RegExp(`@__${key}_\\d+`, 'g');
    const replacement = isNaN(value) ? `'${value}'` : value; // Check if value is a number
    finalSql = finalSql.replace(regex, replacement);
  }
  return finalSql.trim(); // Combine trim and return
}

// console.log(convertToSql(dbLog));

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy text:', err);
        return false;
    }
}
