const db = require("../models/index");

// Retrieving and return all admins to the database
exports.findAll = async(req, res) => {
    try {
        let {limit , offset} = req.params;

        limit = parseInt(limit);
        offset = parseInt(offset);
        const assignment = await db.Assignment.find().limit(limit).skip((offset-1)*limit)

        // const data = assignment.map((item) => {
        //     const { displayName, email } = item;
        //     return { displayName, email };
        // })
        res.status(200).json({ data: assignment })
    } catch (err) {
        console.log("err: ", err)
        res.status(500).send({ message: "Có lỗi xảy ra" })

    };
}
