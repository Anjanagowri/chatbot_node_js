const {Wit, log} = require('node-wit');
const client = new Wit({accessToken: 'ZBGZ3TXRPLL4EGBKZYKBYTRRHHCRIMWS'});
var d='';
client.message('where is darwinbox located', {})
.then((data) => {
  d=JSON.stringify(data);
console.log(data.entities.intent[0].value);
})
.catch(console.error);
