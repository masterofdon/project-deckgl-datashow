import seedrandom from 'seedrandom';

const isNull =  (r) => (r == null || r === 'undefined');
Math.seedrandom('added entropy.', { entropy: true });

export function RandomAlphaNumeric(length){
    if(isNull(length)){
        length = 10;
    }
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return _randomCharacters(length,chars);

}
export function RandomNumeric(length){
    if(isNull(length)){
        length = 10;
    }
    var chars = '0123456789';
    return _randomCharacters(length,chars);
}

function _randomCharacters(length,chars){
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];    
    return result;
}
var RandomUtil = {};
RandomUtil.RandomAlphaNumeric = RandomAlphaNumeric;
RandomUtil.RandomNumeric = RandomNumeric;
export default RandomUtil;