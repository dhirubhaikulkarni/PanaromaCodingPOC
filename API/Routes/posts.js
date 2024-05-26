const router = require("express").Router();
const bcrypt = require("bcryptjs");
const ObjectID = require('mongodb').ObjectId;

const checkValueEmptyOrNull = (value) => {
    return (value === undefined || value === null || value === "" || value === "NULL" || value === "null") ? false : true;
}


router.post("/addPost", async (req, res) => {
    try {
        const dbConnection = await global.clientConnection;
        const db = await dbConnection.db("PanaromaCodeChallenge");
        const Posts = await db.collection("Posts");
        const post = {
            title: req.body.title,
            content: req.body.content,
            author: req.body.author,
            categoryId: req.body.categoryId,
            createdAt: new Date()
        };

        let result = await Posts.insertOne(post);
        res.status(200).send("Success");
    } catch (error) {
        res.status(500).send("Failed");
    }
});
router.post("/editPost", async (req, res) => {
    try {
        const dbConnection = await global.clientConnection;
        const db = await dbConnection.db("PanaromaCodeChallenge");
        const Posts = await db.collection("Posts");

        // Validate Request
        if (!req.body) {
            return res.status(400).send(JSON.stringify({ message: "Data Can not be Empty"}));
        }

        await Posts.updateOne({ _id: new ObjectID(req.body._id) },
            {
                $set: {
                    title: req.body.title,
                    content: req.body.content,
                    author: req.body.author,
                    categoryId: req.body.categoryId,
                    updatedAt: new Date()

                }
            })


        let newData = await Posts.findOne({ _id: new ObjectID(req.body._id) })

        return res.status(200).send(JSON.stringify({ newData, "message": "User Updated Successfully" }));

    } catch (error) {
        res.status(500).send("Failed");
    }
});

router.get("/", async (req, res) => {
    try {
        const dbConnection = await global.clientConnection;
        const db = await dbConnection.db("PanaromaCodeChallenge");
        const posts = await db.collection("Posts");
        const Posts = await posts.find().toArray();
        if (Posts != null) {
            res.status(200).send(JSON.stringify(Posts));
        }
        else {
            res.status(500).send(JSON.stringify({ message: "no record found" }));
        }
    }
    catch (error) {
        return res.status(500).send(JSON.stringify({ message: error.message }));
    }
});

router.delete("/:_id", async (req, res) => {

    try {
        const dbConnection = await global.clientConnection;
        const db = await dbConnection.db("PanaromaCodeChallenge");
        const posts = await db.collection("Posts");
        const result = await posts.deleteOne({ _id: new ObjectID(req.params._id) })

        if (!result) {
            return res.status(500).send(JSON.stringify({ data: { message: error.message } }));
        } else {
            return res.status(200).send(JSON.stringify({ "message": "Post Deleted Successfully"}));
        }
    }

    catch (error) {
        return res.status(500).send(encrypt(JSON.stringify({ data: { message: error.message } })));
    }
    finally {
        await dbConnection.close();
    }
});




module.exports = router;