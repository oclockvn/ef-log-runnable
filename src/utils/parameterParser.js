import { extractParametersText } from './textParser.js';

function isNumeric(str) {
    str = str.replace(/['"]/g, '').trim();
    return !isNaN(str) && !isNaN(parseFloat(str));
}

function formatParameterValue(value) {
    const cleanValue = value.replace(/^'|'$/g, '');
    return isNumeric(cleanValue) ? cleanValue : value;
}

function parseParameters(parametersText) {
    const paramRegex = /@__\w+(?:_\d+)?=\'[^\']*\'(?:\s*\([^)]*\))?/g;
    const matches = parametersText.match(paramRegex) || [];
    
    return matches.reduce((acc, param) => {
        const [keyValue] = param.split('('); // Split to remove any type information
        const [key, value] = keyValue.split('=');
        acc[key] = formatParameterValue(value);
        return acc;
    }, {});
}

export function extractParametersFromText(text) {
    const parametersText = extractParametersText(text);
    return parseParameters(parametersText);
}

export function replaceParametersInQuery(parameters, text) {
    // Extract the query part (everything after the parameters line)
    const lines = text.split('\n');
    const queryLines = lines.filter(line => !line.includes('DbCommand [Parameters='));
    const query = queryLines.join('\n').trim();

    // Replace parameters in the query
    let result = query;
    Object.entries(parameters).forEach(([param, value]) => {
        const regex = new RegExp(param.replace('=', ''), 'g');
        result = result.replace(regex, value);
    });
    return result;
}