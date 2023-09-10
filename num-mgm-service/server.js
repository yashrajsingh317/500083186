const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 8008;

app.use(express.json());

app.get('/numbers',async(req,res) => {
    const {url} = req.query;

    if(!url){
        return res.status(400).json({ error: 'Missing: URL Parameter'});
    }

    const urls = Array.isArray(url) ? url : [url];
    const requests = [];

    for (const u  of urls){
        requests.push(
            axios.get(u,{timeout:500})
            .then((response) => response.data)
            .catch((error) => {
                console.error('Error fetching $[u]: ${error.message}');
                return null;
            })
        )
    }

    Promise.all(requests)
    .then((responses) => {
        const numbers = responses
        .filter((data) => data !== null)
        .flatMap((data) => data.numbers)
        .filter((number,index,self) => self.indexOf(number) === index)
        .sort((a,b) => a-b);

        res.json({numbers});
    })
    .catch((error) => {
        console.error('Error: Processing URLs - ',error);
        res/status(500).json({error: 'Internal Server Error'});
    });

});

app.listen(port,() => {
    console.log('Server is running on port ${port}');
})