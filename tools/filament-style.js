Prism.languages.filament = {
    'comment': /\/\/[\s\S]*?\n/,
    'boolean': /\b(?:true|false)\b/,

    'function': /[a-z0-9_]+(?=\()/i,
    'string': /".*"/,
    'number': /[0-9]+/,
    'keyword': /\b(?:if|then|else|end|function)\b/,
    // 'operator': /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
    'operator':/ (->) | (<<) | (>>) |[-+*/] /,
    'punctuation': /[(){};:,\"]/,
    'parameter':[
        {
            // word followed by :
            pattern: /[a-zA-Z]+:/,
            greedy:true
        }
    ],
    'variable': /\b[a-zA-Z]/,




};




