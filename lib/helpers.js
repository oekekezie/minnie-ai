/*
* Project Name: Minnie AI
* By: Obi Ekekezie
* Date Created: 11/16/2018
*/

const HASH_ALGORITHM = 'sha256';
const HASH_SALT = process.env.HASH_SALT || '5C549FB9XB09Z310';

const crypto = require('crypto');

let hash = (raw, salt = HASH_SALT) => {
    if (typeof salt !== 'string' || typeof raw !== 'string') {
      return null;
    }
  
    const _hash = crypto.createHash(HASH_ALGORITHM);
    _hash.update(`${salt}${raw}`, 'utf8');
  
    return _hash.digest('base64');
};

module.exports = {
    hash
}
  