
const express = require('express');
const path = require('path');
const app = express();

/** Force ssl */
// app.use((req, res, next) => {
//   if (req.header('x-forwarded-proto') !== 'https')
//     res.redirect(`https://${req.header('host')}${req.url}`)
//   else
//   next();
// });

app.use(express.static(__dirname + '/dist/frontend'));

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname+'/dist/frontend/de-AT/index.html'));
});

app.get('/:lang/*', function(req, res) {
  const language = req.params.lang;
  if(!language || (language != 'de-AT' && language != 'en-US')){
    return res.sendFile(path.join(__dirname+'/dist/frontend/de-AT/index.html'));
  }
  res.sendFile(path.join(__dirname+`/dist/frontend/${language}/index.html`));
});

app.listen(process.env.PORT || 8080, () => {
  console.log('Server is running on port 8080!')
});