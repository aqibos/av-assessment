const validateParentheses = require('./validParentheses');

test('empty is valid', () => {
    expect(validateParentheses('')).toBe(true);
})

test('null is invalid', () => {
    expect(validateParentheses(null)).toBe(false);
})

test('undefined is invalid', () => {
    expect(validateParentheses(undefined)).toBe(false);
})

test('() is valid', () => {
    expect(validateParentheses('()')).toBe(true);
})

test('( is not valid', () => {
    expect(validateParentheses('(')).toBe(false);
})

test(') is not valid', () => {
    expect(validateParentheses(')')).toBe(false);
})

test(')( is not valid', () => {
    expect(validateParentheses(')(')).toBe(false);
})

test('(()) is valid', () => {
    expect(validateParentheses('(())')).toBe(true);
})

const lispProgram = `
(defun demo-function (flag)
    (print 'entering-outer-block)

    (block outer-block
    (print 'entering-inner-block)
    (print (block inner-block

        (if flag
            (return-from outer-block 3)
            (return-from inner-block 5)
        )

        (print 'This-wil--not-be-printed))
    )

    (print 'left-inner-block)
    (print 'leaving-outer-block)
    t)
)
(demo-function t)
(terpri)
(demo-function nil)`;
test('lisp program is valid', () => {
    expect(validateParentheses(lispProgram)).toBe(true);
})