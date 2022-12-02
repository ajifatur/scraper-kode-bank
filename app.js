const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const express = require('express');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors({
    origin: '*'
}));

app.get('/', (req, res) => {
    axios
        .get('https://www.atmbersama.com/layanan')
        .then(response => {
            if(response.status === 200) {
                const $ = cheerio.load(response.data);
                let data = [];
                $('.tab-content .bank-item').each(function(i, elem) {
                    data[i] = {
                        name: $(elem).find('.bank').text().trim(),
                        code: $(elem).find('.bankcode').text().trim(),
                        url: $(elem).find('a').attr('href'),
                        category: $(elem).parents('.tab-pane').attr('id') == 'pills-anggota_atm_bersama' ? 'Anggota ATM Bersama' : 'Bank Lain'
                    };
                });
                data = data.filter(n => n !== undefined);
                res.json(data);
            }
        })
        .catch(error => {
            console.log(error);
        })
});

app.use((req, res, next) => {
    res.status(404).send('Route is not found!');
});

app.listen(port, () => {
    console.log(`App listening on port ${port}...`);
});