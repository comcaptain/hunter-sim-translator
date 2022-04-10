import * as https from 'https';
import { JSDOM } from 'jsdom';
import { Readable } from 'stream';
import { createGunzip } from 'zlib';


async function fetch(url: string): Promise<Document>
{
	return new Promise(resolve =>
	{
		https.get(url, response =>
		{
			let output: Readable = response;
			if (response.headers['content-encoding'] === "gzip")
			{
				const gunzip = createGunzip();
				response.pipe(gunzip);
				output = gunzip;
			}
			const chunks: any[] = [];
			output.on("data", d =>
			{
				chunks.push(d);
			})
			output.on("end", () =>
			{
				resolve(new JSDOM(Buffer.concat(chunks).toString()).window.document);
			})
		})
	})
}

async function main()
{
	const mainURL = 'https://nyaa.si'
	const mainDocument = await fetch(mainURL + "/");
	const aNodes = mainDocument.querySelectorAll("a[href^=\\/view\\/]:not(.comments)");
	console.info(aNodes.length)
	for (const a of aNodes)
	{
		const url = mainURL + a.getAttribute("href");
		const title = a.textContent;
		const threadDOM = await fetch(url);
		const magnetURL = threadDOM.querySelector("a[href^=magnet]")?.getAttribute("href");
		console.info(`${title}\t${magnetURL}`);
	}
}

main();
