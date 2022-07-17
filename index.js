const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./Models/modules/replaceTemplate');
const slugify = require('slugify');

const tempOverview = fs.readFileSync(
  `${__dirname}/Models/templates/template-overview.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/Models/templates/template-product.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/Models/templates/template-card.html`,
  'utf-8'
);

const data = fs.readFileSync(
  `${__dirname}/Models/dev-data/data.json`,
  'utf-8'
);
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  // const pathName = req.url;

  if (pathname === '/' || pathname === '/overview') {
    //overView Page

    const cardHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHtml);

    console.log(slugs);

    res.end(output);
  } else if (pathname === '/product') {
    //Product Page

    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  } else if (pathname === '/api') {
    //API Page

    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(data);
  } else {
    //Not Found
    res.writeHead(404, { 'Content-type': 'text/html' });
    res.end('<h1>Page Not Found</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('listening to requests on port 8000');
});
