import * as https from 'https';
import { JSDOM } from 'jsdom';
import { Readable } from 'stream';
import { createGunzip } from 'zlib';


https.get("https://nyaa.si/", response =>
{
	let output: Readable = response;
	if (response.headers['content-encoding'] === "gzip")
	{
		const gunzip = createGunzip();
		response.pipe(gunzip);
		output = gunzip;
	}
	output.on("data", d =>
	{
		parseContent(d.toString())
	})
})

function parseContent(html: string)
{
	const dom = new JSDOM(html);
	dom.window.document.querySelectorAll("a[href^=\\/view\\/]:not(.comments)").forEach(a =>
	{
		console.info(`${a.getAttribute("href")}\t${a.textContent}`);
	})
}