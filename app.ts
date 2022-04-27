import * as https from 'https';

https.get("https://cn.tbc.wowhead.com/item=32235", response =>
{
	console.info(Buffer.from(response.headers.location!, 'binary').toString('utf8'));
})