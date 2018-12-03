const rp = require('request-promise');
const ci = require('cheerio');
const process = require('process');

(async () => {
    const cookies = rp.jar();
    let res = await rp({
        method: 'GET',
        url: 'http://student.tsinghua.edu.cn/login',
        jar: cookies,
    });
    res = await rp({
        method: 'POST',
        url: 'https://id.tsinghua.edu.cn/do/off/ui/auth/login/check',
        jar: cookies,
        form: {
            i_user: process.argv[2],
            i_pass: process.argv[3],
            i_captcha: '',
        }
    });
    const $ = ci.load(res);
    const redirect = $('a').attr('href');
    res = await rp({
        method: 'GET',
        uri: redirect,
        jar: cookies,
    });
    res = await rp({
        method: 'GET',
        uri: 'http://student.tsinghua.edu.cn/api/person/index',
        jar: cookies,
        json: true,
    });
    const result = [];
    for (let candidate of res.candidates) {
        result.push(`stu-thu-vote18,id=${candidate.id},name=${candidate.name} ballot=${candidate.ballot}i`);
    }
    console.log(result.join('\n'));
})();

