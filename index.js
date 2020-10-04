const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./final/modules/replaceTemplate');


//Server


const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`, 'utf-8');
const tempOverview = fs.readFileSync(`${__dirname}/starter/templates/template-overview.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/starter/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/starter/templates/template-product.html`, 'utf-8')
const dataObject = JSON.parse(data);

const slugs = dataObject.map(el => slugify(el.productName, {
  lower: true
}))
console.log(slugs)
const server = http.createServer((req, res) => {
  const {
    query,
    pathname
  } = url.parse(req.url, true);


  //Overview Page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html'
    });

    const cardsHtml = dataObject.map(el => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);


    res.end(output);

    //Product Page
  } else if (pathname === '/product') {
    const product = dataObject[query.id];
    res.writeHead(200, {
      'Content-type': 'text/html'
    });
    const output = replaceTemplate(tempProduct, product);

    res.end(output);

    //API
  } else if (pathname === '/api') {

    res.writeHead(200, {
      'Content-type': 'application/json'
    });
    res.end(data);
  }
  //Not Found
  else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'Hello world'
    });
    res.end("<h1>Page not found</h1>");
  }


});
server.listen(8000, '127.0.0.1', () => {
  console.log("server is on")
});