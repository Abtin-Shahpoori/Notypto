const cryptoHash = require('./crypto-hash')

describe('cryptohash()', () => {
    it('generates SHA-256', () => {
        expect(cryptoHash('abtin')).toEqual("674eb429a7b9d7baf1e27c4dae8a1ee9c71f6b782341a010199e9d619e73d6d8")
    });

    it('order isnt important', () => {
        expect(cryptoHash('one', 'two', 'three')).toEqual(cryptoHash('three', 'one', 'two'))
    });

    it('produces a uniqe hash when the properties have changed an input', () => {
        const foo = {};
        const originalHash = cryptoHash(foo);
        foo['a'] = 'a';

        expect(cryptoHash(foo)).not.toEqual(originalHash);
    });
});