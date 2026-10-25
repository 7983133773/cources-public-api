const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const languages = [
  'english', 'hindi', 'marathi',
  'punjabi', 'tamil', 'telugu'
];

app.get('/', (req, res) => {
  res.json({
    name: 'Courses Public API',
    status: 'online',
    endpoints: languages.map(
      lang => `/api/courses/${lang}`
    )
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/courses/:language', (req, res) => {
  const language = req.params.language.toLowerCase();

  if (!languages.includes(language)) {
    return res.status(404).json({
      error: 'Language not found',
      available: languages
    });
  }

  try {
    const file = path.join(
      __dirname, 'exports', `${language}.json`
    );

    const data = JSON.parse(
      fs.readFileSync(file, 'utf8')
    );

    return res.json({
      language,
      count: Array.isArray(data) ? data.length : undefined,
      data
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Could not read course data'
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Courses API running on port ${PORT}`);
});
