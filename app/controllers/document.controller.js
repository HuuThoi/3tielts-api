const db = require("../models/index");

exports.findAll = async(req, res) => {
    var data = [];
    try {
        const length = await db.Document.find().countDocuments();

        await db.Document.find() .populate({
            path: "categoryId",
            select: 'name'
          })
          .populate({
            path: "authorID",
            select: 'displayName'
          }).exec(function (err, result) {
                if (err) res.status(500).json({ message: err })
                else {
                  for (let i = 0; i < result.length; i++) {
                    let obj = {
                        _id: result[i]._id,
                        name: result[i].name,
                        isRecommend: result[i].status == true ? "Có/True" : "Không/False",
                        categoryName: result[i].categoryId.name != null?result[i].categoryId.name:null,
                        shortDesc: result[i].shortDesc,
                        userName: (result[i].authorID && result[i].authorID.displayName!=null)?result[i].authorID.displayName:null,
                    }
                    data.push(obj);
                  }
                  return res.status(200).json({ data, length });;
                }
            });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving documents.",
        });
    }
};

exports.findAllNoPaging = async(req, res) => {
    try {
        db.Document.find()
            .then((documents) => {
                res.status(200).json(documents);
            });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving documents.",
        });
    }
};

exports.findById = async(req, res) => {
    try {
        db.Document.findById(req.params.id)
            .then((document) => {
                if (!document) {
                    return res.status(404).send({
                        message: "Document not found with id " + req.params.id,
                    });
                }
                res.json(document);
            })
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving documents.",
        });
    }
};

exports.create = async(req, res) => {
    let {name, shortDesc, contents, categoryId, isRecommend} = req.body;
    let authorID = req.userData.id;
    try {
        db.Document.create(
            {
              name: name,
              shortDesc: shortDesc,
              contents:contents,
              categoryId: categoryId,
              isRecommend: isRecommend,
              authorID:authorID
            },
            (err, result) => {
                if (err) {
                    res.status(400).json({message: err});
                } else {
                    res.json({result: result});
                }
            }
          );
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving documents.",
        });
    }
};

exports.update = async(req, res) => {
    try {
        db.Document.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
            .then(document => {
                if (!document) {
                    return res.status(404).send({
                        message: "Note not found with id " + req.params.id
                    });
                }
                res.send(document);
            })
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving documents.",
        });
    }
};

exports.delete = async(req, res) => {
    try {
        db.Document.findOneAndRemove({
                _id: req.params.id,
            },
            function(err, document) {
                if (err) {
                    res.send("error removing");
                } else {
                    res.send({ message: "Document deleted successfully!" });
                }
            }
        );
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving documents.",
        });
    }
};