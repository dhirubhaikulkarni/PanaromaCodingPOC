const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { Authentication } = require("../Authentication/Authentication");
const ObjectID = require('mongodb').ObjectId;

const checkValueEmptyOrNull = (value) => {
    return (value === undefined || value === null || value === "" || value === "NULL" || value === "null") ? false : true;
}


router.post("/addPost", Authentication, async (req, res) => {
    try {
        const dbConnection = await global.clientConnection;
        const db = await dbConnection.db("PanaromaCodeChallenge");
        const Posts = await db.collection("Posts");

        const post = {
            title: req.body.title,
            content: req.body.content,
            author: new ObjectID(req.body.author),
            category: new ObjectID(req.body.categoryId),
            createdAt: new Date()
        };

        let result = await Posts.insertOne(post);
        res.status(200).send("Success");
    } catch (error) {
        res.status(500).send("Failed");
    }
});
router.put("/editPost/:id", Authentication, async (req, res) => {
    try {

        const dbConnection = await global.clientConnection;
        const db = await dbConnection.db("PanaromaCodeChallenge");
        const Posts = db.collection("Posts");

        const { id } = req.params;  // Get postId from URL
        const { title, content, selectedCategory } = req.body;

        // Validate Request
        if (!title || !content || !selectedCategory) {
            return res.status(400).send({ message: "All fields are required" });
        }

        const postId = new ObjectID(id);
        await Posts.updateOne(
            { _id: postId },
            {
                $set: {
                    title,
                    content,
                    category: new ObjectID(selectedCategory),
                    updatedAt: new Date(),
                },
            }
        );

        const updatedPost = await Posts.findOne({ _id: postId });

        return res.status(200).send({ newData: updatedPost, message: "Post Updated Successfully" });

    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).send({ message: "Failed to update post" });
    }
});

router.get("/", async (req, res) => {

    try {
        const dbConnection = await global.clientConnection;
        const db = await dbConnection.db("PanaromaCodeChallenge");
        const aggregatedPosts = await db.collection("Posts").aggregate([
            {
                $lookup: {
                    from: "Users",
                    localField: "author",
                    foreignField: "_id",
                    as: "authorDetails"
                }
            },
            {
                $unwind: "$authorDetails"
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "categoryDetails"
                }
            },
            {
                $unwind: "$categoryDetails"
            },
            {
                $project: {
                    title: 1,
                    content: 1,
                    authorName: { $concat: ["$authorDetails.firstName", " ", "$authorDetails.lastName"] },
                    categoryName: "$categoryDetails.name",
                    author: 1,
                    category: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]).sort({ _id: -1 }).toArray();
        if (aggregatedPosts != null) {
            res.status(200).send(JSON.stringify(aggregatedPosts));
        }
        else {
            res.status(500).send(JSON.stringify({ message: "no record found" }));
        }


    }
    catch (error) {
        return res.status(500).send(JSON.stringify({ message: error.message }));
    }



});


router.delete("/:_id", Authentication, async (req, res) => {
    try {
        const dbConnection = await global.clientConnection;
        const db = await dbConnection.db("PanaromaCodeChallenge");
        const posts = await db.collection("Posts");
        const result = await posts.deleteOne({ _id: new ObjectID(req.params._id) })

        if (!result) {
            return res.status(500).send(JSON.stringify({ data: { message: error.message } }));
        } else {
            return res.status(200).send(JSON.stringify({ "message": "Post Deleted Successfully" }));
        }
    }

    catch (error) {
        return res.status(500).send(encrypt(JSON.stringify({ data: { message: error.message } })));
    }
});



module.exports = router;