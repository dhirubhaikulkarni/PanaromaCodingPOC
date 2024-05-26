const router = require("express").Router();
const bcrypt = require("bcryptjs");
const ObjectID = require('mongodb').ObjectId;

router.post("/addCategory", async (req, res) => {
    try {
        const dbConnection = await global.clientConnection;
        const db = await dbConnection.db("PanaromaCodeChallenge");
        const categories = await db.collection("categories");
        const category = {
            name: req.body.name,
            isActive: req.body.isActive,
            createdAt: new Date()
        };

        let result = await categories.insertOne(category);
        res.status(200).send("Success");
    } catch (error) {
        res.status(500).send("Failed");
    }
});
router.post("/editCategory", async (req, res) => {
    try {
        const dbConnection = await global.clientConnection;
        const db = await dbConnection.db("PanaromaCodeChallenge");
        const categories = await db.collection("categories");

        // Validate Request
        if (!req.body) {
            return res.status(400).send(JSON.stringify({ message: "Data Can not be Empty"}));
        }

        await categories.updateOne({ _id: new ObjectID(req.body._id) },
            {
                $set: {
                    name: req.body.name,
                    isActive: req.body.isActive,
                    updatedAt: new Date()

                }
            })


        let newData = await categories.findOne({ _id: new ObjectID(req.body._id) })
        return res.status(200).send(JSON.stringify({ newData, "message": "Category Updated Successfully" }));

    } catch (error) {
        res.status(500).send("Failed");
    }
});
router.delete("/:_id", async (req, res) => {

    try {
        const dbConnection = await global.clientConnection;
        const db = await dbConnection.db("PanaromaCodeChallenge");
        const categories = await db.collection("categories");
        const result = await categories.deleteOne({ _id: new ObjectID(req.params._id) })

        if (!result) {
            return res.status(500).send(JSON.stringify({ data: { message: error.message } }));
        } else {
            return res.status(200).send(JSON.stringify({ "message": "Category Deleted Successfully"}));
        }
    }

    catch (error) {
        return res.status(500).send(encrypt(JSON.stringify({ data: { message: error.message } })));
    }
    finally {
        await dbConnection.close();
    }
});

router.get("/", async (req, res) => {
    try {
        const dbConnection = await global.clientConnection;
        const db = await dbConnection.db("PanaromaCodeChallenge");
        const categories = await db.collection("categories");
        const category = await categories.find().toArray();
        if (category != null) {
            res.status(200).send(JSON.stringify(category));
        }
        else {
            res.status(500).send(JSON.stringify({ message: "no record found" }));
        }
    }
    catch (error) {
        return res.status(500).send(JSON.stringify({ message: error.message }));
    }
});




module.exports = router;