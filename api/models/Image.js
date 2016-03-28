/**
 * Image.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var resemble = require('node-resemble');
module.exports = {
    save: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                if (!data._id) {
                    data._id = sails.ObjectID();
                    db.collection('image').insert(data, function(err, created) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false,
                                comment: "Error"
                            });
                            db.close();
                        } else if (created) {
                            callback({
                                value: true,
                                comment: data
                            });
                            db.close();
                        } else {
                            callback({
                                value: false,
                                comment: "Not created"
                            });
                            db.close();
                        }
                    });
                } else {
                    var image = sails.ObjectID(data._id);
                    delete data._id
                    db.collection('image').update({
                        _id: image
                    }, {
                        $set: data
                    }, function(err, updated) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false,
                                comment: "Error"
                            });
                            db.close();
                        } else if (updated.result.nModified != 0 && updated.result.n != 0) {
                            callback({
                                value: true
                            });
                            db.close();
                        } else if (updated.result.nModified == 0 && updated.result.n != 0) {
                            callback({
                                value: true,
                                comment: "Data already updated"
                            });
                            db.close();
                        } else {
                            callback({
                                value: false,
                                comment: "No data found"
                            });
                            db.close();
                        }
                    });
                }
            }
        });
    },
    find: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("image").find({}, {
                    password: 0
                }).toArray(function(err, found) {
                    if (err) {
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (found && found[0]) {
                        callback(found);
                        db.close();
                    } else {
                        callback({
                            value: false,
                            comment: "No data found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    compare: function(data, callback) {
        Image.find(data, function(respo) {
            if (respo.value != false) {
                var abc = [];
                var i = 0;
                _.each(respo, function(user) {
                    if (user.earimage && user.earimage != "") {
                        resemble('./earCompare/' + data.file).compareTo('./earImage/' + user.earimage).ignoreAntialiasing().onComplete(function(data2) {
                            abc.push({
                                userid: user._id,
                                percentage: data2.misMatchPercentage
                            });
                            i++;
                            if (i == respo.length) {
                                callback(sails._.minBy(abc, 'percentage'));
                                setTimeout(function() {
                                    sails.exec("forever restartall", function(err, stdout, stderr) {
                                        console.log(err);
                                        console.log(stdout);
                                        console.log(stderr);
                                    });
                                }, 2000);
                            }
                        });
                    } else {
                        i++;
                        if (i == respo.length) {
                            callback(sails._.minBy(abc, 'percentage'));
                            setTimeout(function() {
                                sails.exec("forever restartall", function(err, stdout, stderr) {
                                    console.log(err);
                                    console.log(stdout);
                                    console.log(stderr);
                                });
                            }, 2000);
                        }
                    }
                });
            } else {
                callback(respo);
            }
        });
    },
    delete: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            } else {
                db.collection("image").remove({
                    _id: sails.ObjectID(data._id)
                }, function(err, found) {
                    if (err) {
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (found) {
                        callback({
                            value: true,
                            comment: "Deleted"
                        });
                        db.close();
                    } else {
                        callback({
                            value: false,
                            comment: "No data found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    findOne: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("image").find({
                    _id: sails.ObjectID(data._id)
                }).toArray(function(err, found) {
                    if (err) {
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (found && found[0]) {
                        callback(found[0]);
                        db.close();
                    } else {
                        callback({
                            value: false,
                            comment: "No data found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
};
