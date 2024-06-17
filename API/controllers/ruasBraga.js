const ruasBraga = require('../models/ruasBraga');

// List all ruas
module.exports.listarTudo = () => {    
    return ruasBraga.find({}).sort({ _id: 1 }).exec();
};

// Find rua by numero
module.exports.findByID = (id) => {
    return ruasBraga.findOne({ _id : id }).exec();
};

module.exports.findByEntidade = (entidade) => {
    return ruasBraga.find({ entidades: entidade }).sort({ _id: 1 }).exec();
};

module.exports.findByData = (data) => {
    return ruasBraga.find({ datas: data }).sort({ _id: 1 }).exec();
};

module.exports.findByLugar = (lugar) => {
    return ruasBraga.find({ lugares: lugar }).sort({ _id: 1 }).exec();
};


module.exports.addRua = (rua) => {
    return ruasBraga.create(rua);
}

module.exports.deleteRua = (id) => {
    return ruasBraga.deleteOne({ _id: id });
}

module.exports.updateRua = (id, rua) => {
    if (Array.isArray(rua.casas)) {
        // Remove null values from casas array
        for (let i = 0; i < rua.casas.length; i++) {
            if (rua.casas[i] == null) {
                console.log('Null value found in casas array');
                rua.casas.splice(i, 1);
                i--; // Adjust index after removal
            }
        }
    }
    else rua.casas = []
    console.log(rua.casas);
    return ruasBraga.findByIdAndUpdate(id, rua);
}

module.exports.removeImage = (id, folder, image) => {
    image = '../' + folder + '/' + image
    return ruasBraga.updateOne({ _id: id }, { $pull: { figuras: { imagem: image } } });
}

module.exports.listAllLugares = () => {
    return ruasBraga.distinct('lugares').exec();
}

module.exports.listAllDatas = () => {
    return ruasBraga.distinct('datas').exec();
}

module.exports.listAllEntidades = () => {
    return ruasBraga.distinct('entidades').exec();
}

module.exports.nextID = () => {
    return ruasBraga.find().sort({ _id: -1 }).limit(1).exec();
}
