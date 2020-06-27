const db = require("../models/index");

exports.findAll = async (req, res) => {
  var data = [];
  try {
    let { limit, offset } = req.params;

    limit = parseInt(limit);
    offset = parseInt(offset);
    const length = await db.Shift.find().countDocuments();

    await db.Shift.find().populate({
      path: "classID",
      select: 'name'
    })
      .limit(limit)
      .skip((offset - 1) * limit).exec(function (err, result) {
        if (err) res.status(500).json({ message: err })
        else {
          for (let i = 0; i < result.length; i++) {
            let obj = {
              id: result[i]._id,
              status: result[i].status == true ? "Active" : "InActive",
              timeOut: result[i].timeOut,
              timeIn: result[i].timeIn,
              className: result[i].classID != null ? result[i].classID.name : null,
            }
            data.push(obj);
          }
          return res.status(200).json({ data, length });
        }
      });

  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving shifts.",
    });
  }
};

exports.findAllNoPaging = async (req, res) => {
  try {
    db.Shift.find()
      .then((shifts) => {
        res.status(200).json(shifts);
      });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving shifts.",
    });
  }
};

exports.findById = async (req, res) => {
  try {
    db.Shift.findById(req.params.id)
      .then((shift) => {
        if (!shift) {
          return res.status(404).send({
            message: "Shift not found with id " + req.params.id,
          });
        }
        res.json(shift);
      })
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving shifts.",
    });
  }
};

exports.create = async (req, res) => {
  try {
    db.Shift.create(req.body, function (err, shift) {
      if (err) {
        res.status(400).json({ message: err });
      } else {
        res.send(shift);
      }
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving shifts.",
    });
  }
};

exports.update = async (req, res) => {
  try {
    db.Shift.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
      .then(shift => {
        if (!shift) {
          return res.status(404).send({
            message: "Note not found with id " + req.params.id
          });
        }
        res.send(shift);
      })
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving shifts.",
    });
  }
};


exports.delete = async (req, res) => {
  try {
    db.Shift.findOneAndRemove(
      {
        _id: req.params.id,
      },
      function (err, shift) {
        if (err) {
          res.send("error removing");
        } else {
          res.send({ message: "Shift deleted successfully!" });
        }
      }
    );
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving shifts.",
    });
  }
};