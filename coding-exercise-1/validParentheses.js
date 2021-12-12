function validateParentheses(str) {
    if (str === null || str === undefined) return false;

    let count = 0;
    for (let i = 0; i < str.length; i++) {
        let parens = str[i];
        if (parens == "(") { count += 1; }
        if (parens == ")") { count -= 1; }
      
        if (count < 0) { return false; }
    }
    
    return count == 0;
}

module.exports = validateParentheses;