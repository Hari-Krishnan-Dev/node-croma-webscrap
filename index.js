const axios = require('axios');
const cheerio =require('cheerio');
const fs =require('fs');
const xlsx = require('xlsx');

// Create a new workbook
const workbook = xlsx.utils.book_new();

const examplePage = 'https://www.croma.com/phones-wearables/mobile-phones/android-phones/c/95';

 const requestExamplePage = async () => {
  try {
    const { data } = await axios.get(examplePage, { responseType: 'document' });
    return  fs.writeFileSync('scrapdata.txt',data);
  } catch (error) {
    console.error('Error fetching HTML:', error);
    return null;
  }
}

console.log('\x1b[35m','fetch data from api is successful');
 requestExamplePage();
const readfile =fs.readFileSync('scrapdata.txt',{encoding: 'utf-8'});
const $ = cheerio.load(readfile);
console.log('\x1b[37m');
///
//   using cheerio from onwards 
///
const parent = $('div.content-wrap ul li');
const exeldata = [['Mobile-Name', 'Price']];
const metadata = parent.each((i,el)=>{
    const names= $(el).find('div.plp-prod-title-rating-cont').children('h3').text();
    const amount=$(el).find('.amount.plp-srp-new-amount').text();
    // const rating=$(el).find('span.discount.discount-mob-plp.discount-newsearch-plp').children('span').text();
    exeldata.push([names,amount]);
});
const sheet = xlsx.utils.aoa_to_sheet(exeldata);
xlsx.utils.book_append_sheet(workbook, sheet, 'Sheet1');
xlsx.writeFile(workbook,"data.xlsx");
