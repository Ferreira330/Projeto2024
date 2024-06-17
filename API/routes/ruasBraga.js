var express = require('express');
var router = express.Router();
var ruasBraga = require('../controllers/ruasBraga');

/* GET home page. */
router.get('/', function(req, res, next) {
  ruasBraga.listarTudo()
      .then(dados => res.jsonp(dados))
      .catch(erro => res.status(500).jsonp(erro));
});

router.get('/newID', function(req, res, next) {
  ruasBraga.nextID()
    .then(dados => {
      const nextID = dados.length > 0 ? dados[0]._id + 1 : 1; // Determine the next ID
      res.jsonp({ nextID });
    })
      .catch(erro => res.status(500).jsonp(erro));
}
);

router.get('/lugares', function(req, res, next) {
  ruasBraga.listAllLugares()
      .then(dados => res.jsonp(dados))
      .catch(erro => res.status(500).jsonp(erro));
});

router.get('/datas', function(req, res, next) {
  ruasBraga.listAllDatas()
      .then(dados => res.jsonp(dados))
      .catch(erro => res.status(500).jsonp(erro));
});

router.get('/entidades', function(req, res, next) {
  ruasBraga.listAllEntidades()
      .then(dados => res.jsonp(dados))
      .catch(erro => res.status(500).jsonp(erro));
});


router.get('/:id', function(req, res, next) {
  ruasBraga.findByID(req.params.id)
      .then(dados => res.jsonp(dados))
      .catch(erro => res.status(500).jsonp(erro));
});

router.get('/entidade/:id', function(req, res, next) {
  ruasBraga.findByEntidade(req.params.id)
      .then(dados => res.jsonp(dados))
      .catch(erro => res.status(500).jsonp(erro));
});

router.get('/data/:id', function(req, res, next) {
  ruasBraga.findByData(req.params.id)
      .then(dados => res.jsonp(dados))
      .catch(erro => res.status(500).jsonp(erro));
});

router.get('/lugar/:id', function(req, res, next) {
  ruasBraga.findByLugar(req.params.id)
      .then(dados => res.jsonp(dados))
      .catch(erro => res.status(500).jsonp(erro));
});

router.post('/', function(req, res, next) {
  console.log(req.body)
  ruasBraga.addRua(req.body)
      .then(dados => res.jsonp(dados))
      .catch(erro => res.status(500).jsonp(erro));
});

router.delete('/:id', function(req, res, next) {
  ruasBraga.deleteRua(req.params.id)
      .then(dados => res.jsonp(dados))
      .catch(erro => res.status(500).jsonp(erro));
});

router.put('/:id', function(req, res, next) {
  ruasBraga.updateRua(req.params.id, req.body)
      .then(dados => res.jsonp(dados))
      .catch(erro => res.status(500).jsonp(erro));
}
);

router.get('/:id/remove-image/:folder/:image', function(req, res, next) {
  ruasBraga.removeImage(req.params.id, req.params.folder, req.params.image)
      .then(dados => res.jsonp(dados))
      .catch(erro => res.status(500).jsonp(erro));
}
);




module.exports = router;