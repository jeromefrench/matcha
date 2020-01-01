const querystring = require('querystring');
const { Curl } = require('node-libcurl');
const path = require('path');
const fs = require('fs');

const curl = new Curl();

const data = {
  //Data to send, inputName : value
  'login': 'jchardin',
  'passwd': 'Lavisse5351@'
}

const cookieJarFile = path.join(__dirname, 'cookiejar.txt')


curl.setOpt('URL', 'http://localhost:8080/sign-in');
curl.setOpt('FOLLOWLOCATION', true);

curl.setOpt(Curl.option.POSTFIELDS, querystring.stringify(data))
curl.setOpt(Curl.option.VERBOSE, true)

curl.setOpt(Curl.option.COOKIEFILE, cookieJarFile)
curl.setOpt(Curl.option.COOKIEJAR, cookieJarFile)

if (!fs.existsSync(cookieJarFile)) {
  fs.writeFileSync(cookieJarFile)
}

curl.on('end', function (statusCode, data, headers) {
  console.info(statusCode);
  console.info('---');
  console.info(data.length);
  console.info('---');
  console.info(this.getInfo( 'TOTAL_TIME'));

  this.close();
});

curl.on('error', curl.close.bind(curl));
curl.perform();
