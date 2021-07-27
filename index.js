const http = require("http");
const fs = require("fs");

var requests = require("requests");

const homeFile = fs.readFileSync("home.html" , "utf-8");

const replaceVal = (tempVal , orgVal) =>
{
    let temperture = tempVal.replace("{%tempval%}" , orgVal.main.temp);
    temperture = temperture.replace("{%tempmin%}" , orgVal.main.temp_min);
    temperture = temperture.replace("{%tempmax%}" , orgVal.main.temp_max);
    temperture = temperture.replace("{%location%}" , orgVal.name);
    temperture = temperture.replace("{%country%}" , orgVal.sys.country);
    temperture = temperture.replace("{%tempStatus%}" , orgVal.weather[0].main);

    return temperture;
};

const server = http.createServer((req,res)=>
{

    if(req.url == "/")
    {
        requests("https://api.openweathermap.org/data/2.5/weather?q=Etawah&appid=4628af122ba074b283d859b6501cf3c3&units=metric")

        .on("data" , (chunk) =>
        {
            const objData = JSON.parse(chunk);
            const arrData = [objData];
            //console.log(arrData[0].main.temp);

            const realTimeData = arrData.map(val=>   replaceVal(homeFile , val)).join();
            res.write(realTimeData);
           // console.log(realTimeData);

        })
        .on("end" , (err) =>
        {
            if(err)
            return console.log("Connection Failed ",err);
            res.end();
        });
    }

});
server.listen(8000 , "127.0.0.1");
{
    console.log("Server is at http://localhost:8000");
}