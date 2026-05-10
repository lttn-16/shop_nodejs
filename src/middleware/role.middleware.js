const AccessControl = require('accesscontrol');

let grantList = [
    { role: 'admin', resource: 'profile', action: 'read:any', attributes: '*, !views' },
    { role: 'shop', resource: 'profile', action: 'read:own', attributes: '*' }
];

const ac = new AccessControl(grantList);
module.exports = ac