const express = require('express'),
  router = express.Router();

router.get('/', (request, response) => {
  response.json({ success: true, msg: 'Show all bootcamps' });
});

router.get('/:id', (request, response) => {
  response.json({ success: true, msg: 'Show bootcamp ' + request.params.id });
});

router.post('/', (request, response) => {
  response.json({ success: true, msg: 'Create a new bootcamp' });
});

router.put('/:id', (request, response) => {
  response.json({
    success: true,
    msg: `Update bootcamp ${request.params.id}`,
  });
});

router.delete('/:id', (request, response) => {
  response.json({ success: true, msg: `Delete bootcamp ${request.params.id}` });
});

module.exports = router;
