const users = require('../models/users');


module.exports.list = () => {
    return users.find().exec();
}

module.exports.findByEmail = (email) => {
    return users.findOne({email: email}).exec();
}

module.exports.addUser = (user) => {
    return users.create(user);
}

module.exports.updateUser = (username, user) => {
    return users.findOneAndUpdate({username: username}, user, {new: true}).exec();
}

module.exports.removeUser = (username) => {
    return users.deleteOne({username: username}).exec();
}