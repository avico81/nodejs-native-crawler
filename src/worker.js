const { parentPort } = require('worker_threads');
const URL = require("url");
const utils = require('./utils');


function crawlPage(data, url) {
   if(!data.length) {
      return [];
   }
   let domain = utils.extractDomain(url.host);
   let splitAtLink = data.split('<a href="').slice(1);
   let links = splitAtLink.map(x => x.split('"', 2)[0]);
   let relevantLinks = [];
   links.forEach(link => {
      if(link.slice(0, 4) === 'http') {  // absolute link
         let linkUrl = URL.parse(link);
         let linkDomain = utils.extractDomain(linkUrl.host);
         if(linkDomain === domain) {
            relevantLinks.push(link);
         }
      } else {  // relative link
         if(link[0] !== '#') {  // avoid navigation links
            relevantLinks.push(
                url.protocol + '//' +
                url.host + (url.port && (':' + url.port) || '') +
                (link[0] === '/' ? link : ('/' + link)));
         }
      }
   });
   return relevantLinks ;
}

function crawlLink(link) {
   return new Promise((resolve, reject) => {
      let url = URL.parse(link);

      if(url.protocol !== 'http:' && url.protocol !== 'https:') {
         return reject('Failed to resolve protocol');
      }

      let protocol = require(url.protocol.substring(0, url.protocol.length - 1));

      protocol.get(link, (resp) => {
         let data = '';
         resp.on('data', (chunk) => {
            data += chunk;
         });
         resp.on('end', () => {
            return resolve(crawlPage(data, url));
         });
      }).on("error", (err) => {
         return reject(err.message);
      });
   });
}


parentPort.on('message', async function(link) {
   let res = {};
   try{
      res.links = await crawlLink(link);
   } catch (e) {
      res.err = e;
   }
   parentPort.postMessage(res);
});