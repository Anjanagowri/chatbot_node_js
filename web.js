const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');


const URL = "https://wild11.darwinbox.in/ms/candidate/careers";

request(URL, function (err, res, body) {
    if(err)
    {
        console.log(err);
    }
    else
    {
        const arr = [];
        let $ = cheerio.load(body);
        $('pb-150').each(function(index){


            const name = $(this).find('div._1-2Iqu>div.col-7-12>div._3wU53n').text();
            const obj = {

                name : name
            };
            console.log(obj);
            arr.push(JSON.stringify(obj));
        });
        console.log(arr.toString());
        fs.writeFile('data.txt', arr, function (err) {
            if(err) {
                console.log(err);
            }
                else{
                    console.log("success");
                }
        });

    }
});
