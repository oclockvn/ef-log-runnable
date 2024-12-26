// Extracts the text between [Parameters=...] from the input
export function extractParametersText(text) {
    const lines = text.split('\n');
    for (const line of lines) {
        if (line.includes('DbCommand [Parameters=')) {
            const match = line.match(/\[Parameters=(.*?)\]/);
            if (match && match[1]) {
                return match[1];
            }
        }
    }
    return '';
}