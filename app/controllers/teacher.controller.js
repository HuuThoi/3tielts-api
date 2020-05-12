const db = require("../models/index");

exports.findAll = async(req, res) => {
    try {
        let { limit, offset } = req.params;

        limit = parseInt(limit);
        offset = parseInt(offset);
        const length = await db.Teacher.find().countDocuments();

        const data = await db.Teacher.find()
            .limit(limit)
            .skip((offset - 1) * limit);
        return res.status(200).json({ data, length });

    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving shifts.",
        });
    }
};

exports.findAllNoPaging = async(req, res) => {
    try {
        db.Teacher.find()
            .then((shifts) => {
                res.status(200).json(shifts);
            });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving shifts.",
        });
    }
};

exports.findById = async(req, res) => {
    try {
        db.Teacher.findById(req.params.id)
            .then((teacher) => {
                if (!teacher) {
                    return res.status(404).send({
                        message: "Teacher not found with id " + req.params.id,
                    });
                }
                res.json(teacher);
            })
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving shifts.",
        });
    }
};

exports.create = async(req, res) => {
    try {
        db.Teacher.create(req.body, function(err, teacher) {
            if (err) {
                res.send("error saving teacher");
            } else {
                res.send(teacher);
            }
        });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving shifts.",
        });
    }
};

exports.update = async(req, res) => {
    try {
        db.Teacher.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
            .then(teacher => {
                if (!teacher) {
                    return res.status(404).send({
                        message: "Note not found with id " + req.params.id
                    });
                }
                res.send(teacher);
            })
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving shifts.",
        });
    }
};


exports.delete = async(req, res) => {
    try {
        db.Teacher.findOneAndRemove({
                _id: req.params.id,
            },
            function(err, teacher) {
                if (err) {
                    res.send("error removing");
                } else {
                    res.send({ message: "Teacher deleted successfully!" });
                }
            }
        );
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving shifts.",
        });
    }
};