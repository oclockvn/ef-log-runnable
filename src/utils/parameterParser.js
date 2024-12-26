function isNumeric(str) {
    // Remove quotes and trim whitespace
    str = str.replace(/['"]/g, '').trim();
    // Check if it's a valid number (including negative and decimal)
    return !isNaN(str) && !isNaN(parseFloat(str));
}

function formatParameterValue(value) {
    // Remove surrounding quotes
    const cleanValue = value.replace(/^'|'$/g, '');
    return isNumeric(cleanValue) ? cleanValue : value;
}

export function extractParametersFromFirstLine(text) {
    const firstLine = text.split('\n')[0];
    const paramRegex = /@__\w+_\d+=\'[^\']*\'/g;
    const matches = firstLine.match(paramRegex) || [];
    
    return matches.reduce((acc, param) => {
        const [key, value] = param.split('=');
        acc[key] = formatParameterValue(value);
        return acc;
    }, {});
}

export function replaceParametersInQuery(parameters, query) {
    let result = query;
    Object.entries(parameters).forEach(([param, value]) => {
        const regex = new RegExp(param.replace('=', ''), 'g');
        result = result.replace(regex, value);
    });
    return result;
}