const https = require('https');
const csv = require('csv-parser');
const fs = require('fs');

const url = "https://docs.google.com/spreadsheets/d/1frOwPzCDgQ-5Z4frFhyK167BKE3YhBPcdw2U_v6kRNg/export?format=csv";

const results = [];

https.get(url, (response) => {
    // Handle redirects
    if (response.statusCode === 307 || response.statusCode === 302) {
        https.get(response.headers.location, (res) => {
            res.pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => {
                    console.log(results.slice(0, 2));
                });
        });
    } else {
        response.pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                console.log(results.slice(0, 2));
            });
    }
});
