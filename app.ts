import * as https from 'https';
import { createGunzip } from 'zlib';


https.get("https://nyaa.si/", response =>
{
	console.info(response.headers['content-type']);
	console.info(response.headers['content-encoding']);
	const gunzip = createGunzip();
	response.pipe(gunzip);
	gunzip.on("data", d =>
	{
		console.info(d.toString())
	})
})