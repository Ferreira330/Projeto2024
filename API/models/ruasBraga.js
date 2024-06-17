const mongoose = require("mongoose");
const { Schema } = mongoose;

const figuraSchema = new Schema({
    id: String,
    imagem: String,
    legenda: String,
});

const casaSchema = new Schema({
    número: String,
    enfiteuta: String,
    foro: String,
    desc: String,
});

const ruaSchema = new Schema({
    _id: Number,
    nome: String,
    figuras: [figuraSchema],
    para: [String],
    casas: [casaSchema],
    lugares: [String],
    datas: [String],
    entidades: [String],
});

module.exports = mongoose.model("ruasBraga", ruaSchema, "ruasBraga");
