/**
 * ImageController
 *
 * @description :: Server-side logic for managing Images
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
    upload: function(req, res) {
        var path = req.param('path');
        if (path && path != "") {
            req.file("file").upload(function(err, uploadedFiles) {
                if (err) return res.send(500, err);
                _.each(uploadedFiles, function(n) {
                    var oldpath = n.fd;
                    var source = sails.fs.createReadStream(n.fd);
                    n.fd = n.fd.split('\\').pop().split('/').pop();
                    var split = n.fd.split('.');
                    n.fd = split[0] + "." + split[1].toLowerCase();
                    var dest = sails.fs.createWriteStream('./' + path + '/' + n.fd);
                    source.pipe(dest);
                    source.on('end', function() {
                        sails.fs.unlink(oldpath, function(data) {
                            console.log(data);
                        });
                    });
                    source.on('error', function(err) {
                        console.log(err);
                    });
                });
                return res.json({
                    message: uploadedFiles.length + ' file(s) uploaded successfully!',
                    files: uploadedFiles
                });
            });
        } else {
            res.json({
                value: false,
                comment: "Please provide path"
            });
        }
    },
    resize: function(req, res) {
        var file = req.query.file;
        var path1 = req.query.path;
        var filepath = './' + path1 + '/' + file;
        var isfile = sails.fs.existsSync(filepath);

        function showimage(path) {
            var image = sails.fs.readFileSync(path);
            var mimetype = sails.mime.lookup(path);
            res.set('Content-Type', mimetype);
            res.send(image);
        }
        if (isfile == false) {
            var path = './' + path1 + '/noimage.jpg';
            var split = path.substr(path.length - 3);
            var image = sails.fs.readFileSync(path);
            var mimetype = sails.mime.lookup(split);
            res.set('Content-Type', mimetype);
            res.send(image);
        } else {
            showimage(filepath);
        }
    },
    save: function(req, res) {
        if (req.body) {
            if (req.body._id) {
                if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                    image();
                } else {
                    res.json({
                        value: false,
                        comment: "User-id is incorrect"
                    });
                }
            } else {
                image();
            }

            function image() {
                var print = function(data) {
                    res.json(data);
                }
                Image.save(req.body, print);
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    find: function(req, res) {
        if (req.body) {
            function callback(data) {
                res.json(data);
            };
            Image.find(req.body, callback);
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    compare: function(req, res) {
        // res.connection.setTimeout(200000);
        // req.connection.setTimeout(200000);
        if (req.query) {
            if (req.query.file && req.query.file != "") {
                function callback(data) {
                    res.json(data);
                };
                Image.compare(req.query, callback);
            } else {
                res.json({
                    value: false,

                    comment: "Please provide file"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
};
