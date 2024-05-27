var express = require('express');
var router = express.Router();

let deliveries = [
  {
    id: 1,
    from: 'Location A',
    to: 'Location B',
    orderNumber: '12345',
    price: 20
  },
  {
    id: 2,
    from: 'Location C',
    to: 'Location D',
    orderNumber: '67890',
    price: 25
  },
  {
    id: 3,
    from: 'Location A',
    to: 'Location B',
    orderNumber: '12345',
    price: 500
  },
  {
    id: 4,
    from: 'Location C',
    to: 'Location D',
    orderNumber: '67890',
    price: 2500
  },
  {
    id: 5,
    from: 'Location A',
    to: 'Location B',
    orderNumber: '12345',
    price: 2000
  },
  {
    id: 6,
    from: 'Location C',
    to: 'Location D',
    orderNumber: '67890',
    price: 25888
  }
];

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

// Route to get deliveries
router.get('/deliveries', function(req, res, next) {
  res.json(deliveries);
});

module.exports = router;
