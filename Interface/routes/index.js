var express = require('express');
var router = express.Router();
var axios = require("axios");
const fs = require('fs');
var jsonwt = require('jsonwebtoken');
const { log } = require('console');


const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })

function checkIfFileExists(filepath) {
  try {
    if (fs.existsSync(filepath)) {
      return true
    }
    else {
      return false
    }
  }
  catch(err) {
    console.error(err)
    return false
  }
}

function verifyToken(req, res, next) {
  var token
  if(req.query && req.query.token) {
    token = req.query.token
  }
  else if (req.body && req.body.token) {
    token = req.body.token
  }
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token
  }
  else {
    res.status(403).send("No token provided")
    return
  }
  jsonwt.verify(token, 'segredo321', function(err, decoded) {
    if (err) {
      res.status(403).send("Invalid token")
    }
    else {
      next()
    }
  })
} 



/* GET home page. */
router.get('/', function(req, res, next) {
  loggedIn = false
  userLevel = "user"
  if (req.cookies && req.cookies.token) {
    try {
      const token = jsonwt.verify(req.cookies.token, 'segredo321');
      loggedIn = true
      userLevel = token.accessLevel
    }
    catch(err) {
      console.error(err)
    }
  }
  res.render('index', { title: 'Ruas de Braga', loggedIn: loggedIn, userLevel: userLevel });
}
);

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
}
);

/* POST login page. */
router.post('/login', function(req, res, next) {
  axios.post('http://localhost:15002/login', req.body)
  .then(function(response) {
    res.cookie('token', response.data.token)
    res.redirect('/')
  })
  .catch(function(error) {
    console.log(error)
  })
}
);

/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
}
);

/* POST register page. */
router.post('/register', function(req, res, next) {
  axios.post('http://localhost:15002/register', req.body)
  .then(function(response) {
    res.cookie('token', response.data.token)
    res.redirect('/')
  })
  .catch(function(error) {
    console.log(error)
  })
}
);

/* GET logout page. */
router.get('/logout', function(req, res, next) {
  res.clearCookie('token')
  res.redirect('/')
}
);

/* GET listRuas page. */
router.get('/ruas', verifyToken, function(req, res, next) {
  loggedIn = false
  userLevel = "user"
  if (req.cookies && req.cookies.token) {
    try {
      const token = jsonwt.verify(req.cookies.token, 'segredo321');
      loggedIn = true
      userLevel = token.accessLevel
    }
    catch(err) {
      console.error(err)
    }
  }
  console.log(loggedIn)
  console.log(userLevel)
  axios.get('http://localhost:15000/braga')
  .then(function(response) {
    res.render('listRuas', { title: 'Ruas', ruas: response.data, loggedIn: loggedIn, userLevel: userLevel })
  })
  .catch(function(error) {
    console.log(error)
  })
}
);

// GET RUA


router.get('/ruas/:id/edit', verifyToken, function(req, res, next) {
  loggedIn = false
  userLevel = "user"
  if (req.cookies && req.cookies.token) {
    try {
      const token = jsonwt.verify(req.cookies.token, 'segredo321');
      loggedIn = true
      userLevel = token.accessLevel
    }
    catch(err) {
      console.error(err)
    }
  }
  if (userLevel !== "admin"){
    res.status(401).send('You are not authorized to edit ruas.'); // Set status code and send string
  }
  else{
    axios.get('http://localhost:15000/braga/' + req.params.id)
    .then(function(response) {
      res.render('editRua', { title: 'EditRua', rua: response.data, loggedIn: loggedIn, userLevel: userLevel })
    })
    .catch(function(error) {
      console.log(error)
    })
  }
}
);

router.get('/ruas/create', verifyToken, function(req, res, next) {
  loggedIn = false
  userLevel = "user"
  if (req.cookies && req.cookies.token) {
    try {
      const token = jsonwt.verify(req.cookies.token, 'segredo321');
      loggedIn = true
      userLevel = token.accessLevel
    }
    catch(err) {
      console.error(err)
    }
  }
  if (userLevel !== "admin"){
    res.status(401).send('You are not authorized to create ruas.'); // Set status code and send string
  }
  else{
    axios.get('http://localhost:15000/braga/newID')
    .then(function(response) {
      var newID = response.data.nextID
      res.render('addRua', { title: 'CreateRua', loggedIn: loggedIn, userLevel: userLevel, nextRuaNumber: newID })
    })
    .catch(function(error) {
      console.log(error)
    })
  }
}
);

router.post('/ruas/new', upload.any(), verifyToken, function(req, res, next) {
  loggedIn = false
  userLevel = "user"
  if (req.cookies && req.cookies.token) {
    try {
      const token = jsonwt.verify(req.cookies.token, 'segredo321');
      loggedIn = true
      userLevel = token.accessLevel
    }
    catch(err) {
      console.error(err)
    }
  }
  if (userLevel !== "admin"){
    res.status(401).send('You are not authorized to create ruas.'); // Set status code and send string
  }
  else{
    if (!req.body.figuras) {
      req.body.figuras = [];
    }
    req.files.forEach(file => {
      console.log(file);
      let path = file.path;
      path = path.replace('public/', '../');
      req.body.figuras.push({ imagem: path, legenda: file.originalname });
    });
    const ruaData = {
      _id: req.body.numero || '',
      nome: req.body.nome || '',
      para: req.body.para ? req.body.para.split(',') : [],
      figuras: req.body.figuras,
      casas: req.body.casas ? JSON.parse(req.body.casas) : [],
      lugares: req.body.lugares ? req.body.lugares.split(',') : [],
      datas: req.body.datas ? req.body.datas.split(',') : [],
      entidades: req.body.entidades ? req.body.entidades.split(',') : [],
    };
    axios.post('http://localhost:15000/braga/', ruaData)
    .then(function(response) {
      res.redirect('/ruas/' + response.data._id)
    })
    .catch(function(error) {
      console.log(error)
    })
  }
}
);

router.get('/search/data/:data', verifyToken, function(req, res, next) {
  axios.get('http://localhost:15000/braga/data/' + req.params.data)
  .then(function(response) {
    res.render('search', { title: 'Search', ruas: response.data, searchTerm: req.params.data, searchType: 'Data'})
  })
  .catch(function(error) {
    console.log(error)
  })
}
);

router.get('/search/entidade/:entidade', verifyToken, function(req, res, next) {
  axios.get('http://localhost:15000/braga/entidade/' + req.params.entidade)
  .then(function(response) {
    res.render('search', { title: 'Search', ruas: response.data, searchTerm: req.params.entidade, searchType: 'Entidade' })
  })
  .catch(function(error) {
    console.log(error)
  })
}
);

router.get('/search/lugar/:lugar', verifyToken, function(req, res, next) {
  axios.get('http://localhost:15000/braga/lugar/' + req.params.lugar)
  .then(function(response) {
    res.render('search', { title: 'Search', ruas: response.data, searchTerm: req.params.lugar, searchType: 'Lugar' })
  })
  .catch(function(error) {
    console.log(error)
  })
}
);

router.post('/ruas/:id/edit', upload.any(), verifyToken, function(req, res, next) {
  loggedIn = false
  userLevel = "user"
  if (req.cookies && req.cookies.token) {
    try {
      const token = jsonwt.verify(req.cookies.token, 'segredo321');
      loggedIn = true
      userLevel = token.accessLevel
    }
    catch(err) {
      console.error(err)
    }
  }
  if (userLevel !== "admin"){
    res.status(401).send('You are not authorized to edit ruas.'); // Set status code and send string
  }
  else{
    req.files.forEach(file => {
      console.log(file)
      var path = file.path
      path = path.replace('public/', '../')
      req.body.figuras.push({ imagem: path, legenda: file.originalname })
    })
    console.log(req.body)
    axios.put('http://localhost:15000/braga/' + req.params.id, req.body)
    .then(function(response) {
      res.redirect('/ruas/' + req.params.id)
    })
    .catch(function(error) {
      console.log(error)
    })
  }
}
);

router.get('/ruas/:id/edit/:folder/:image', function(req, res, next) {
  axios.get('http://localhost:15000/braga/' + req.params.id + '/remove-image/' + req.params.folder + '/' + req.params.image)
  .catch(function(error) {
    console.log(error)
  })
}
);

router.get('/datas', verifyToken, function(req, res, next) {
  axios.get('http://localhost:15000/braga/datas')
  .then(function(response) {
    res.render('listDatas', { title: 'Datas', datas: response.data })
  })
  .catch(function(error) {
    console.log(error)
  })
}
);

router.get('/entidades', verifyToken, function(req, res, next) {
  axios.get('http://localhost:15000/braga/entidades')
  .then(function(response) {
    res.render('listEntidades', { title: 'Entidades', entidades: response.data })
  })
  .catch(function(error) {
    console.log(error)
  })
}
);

router.get('/lugares', verifyToken, function(req, res, next) {
  axios.get('http://localhost:15000/braga/lugares')
  .then(function(response) {
    res.render('listLugares', { title: 'Lugares', lugares: response.data })
  })
  .catch(function(error) {
    console.log(error)
  })
}
);

router.get('/ruas/:id/delete', verifyToken, function(req, res, next) {
  loggedIn = false
  userLevel = "user"
  if (req.cookies && req.cookies.token) {
    try {
      const token = jsonwt.verify(req.cookies.token, 'segredo321');
      loggedIn = true
      userLevel = token.accessLevel
    }
    catch(err) {
      console.error(err)
    }
  }
  if (userLevel !== "admin"){
    res.status(401).send('You are not authorized to delete ruas.'); // Set status code and send string
  }
  else{
    axios.delete('http://localhost:15000/braga/' + req.params.id)
    .then(function(response) {
      res.redirect('/ruas')
    })
    .catch(function(error) {
      console.log(error)
    })
  }
}
);

router.get('/ruas/:id', verifyToken, function(req, res, next) {
  loggedIn = false
  userLevel = "user"
  if (req.cookies && req.cookies.token) {
    try {
      const token = jsonwt.verify(req.cookies.token, 'segredo321');
      loggedIn = true
      userLevel = token.accessLevel
    }
    catch(err) {
      console.error(err)
    }
  }
  axios.get('http://localhost:15000/braga/' + req.params.id)
  .then(function(response) {
    res.render('rua', { title: 'Rua', rua: response.data, loggedIn: loggedIn, userLevel: userLevel })
  })
  .catch(function(error) {
    console.log(error)
  })
}
);




module.exports = router;
