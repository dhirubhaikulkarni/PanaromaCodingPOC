const router = require("express").Router();
const bcrypt = require("bcryptjs");
const ObjectID = require('mongodb').ObjectId;
const jwt = require("jsonwebtoken");

const checkValueEmptyOrNull = (value) => {
    return (value === undefined || value === null || value === "" || value === "NULL" || value === "null") ? false : true;
}

// router.post("/register", async (req, res) => {
//     try {
//         const dbConnection = await global.clientConnection;
//         const db = await dbConnection.db("PanaromaCodeChallenge");
//         const users = await db.collection("Users");
//         const salt = await bcrypt.genSalt(10);
//         const hashPassword = await bcrypt.hash(req.body.password, salt);
//         const user = {
//             username: req.body.username,
//             password: hashPassword,
//             email: req.body.email,
//             role: req.body.role,
//             firstName: req.body.firstName,
//             lastName: req.body.lastName,
//             createdAt: new Date()
//         };

//         let result = await users.insertOne(user);
//         res.status(200).send("Success");
//     } catch (error) {
//         res.status(500).send("Failed");
//     }
// });

router.post("/register", async (req, res) => {
    try {
        const dbConnection = await global.clientConnection;
        const db = await dbConnection.db("PanaromaCodeChallenge");
        const users = await db.collection("Users");

        // Check if user with provided email exists
        const existingEmailUser = await users.findOne({ email: req.body.email });
        if (existingEmailUser) {
            return res.status(400).send("Email is already registered.");
        }

        // Check if user with provided username exists
        const existingUsernameUser = await users.findOne({ username: req.body.username });
        if (existingUsernameUser) {
            return res.status(400).send("Username is already taken.");
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        const user = {
            username: req.body.username,
            salt: salt,
            password: hashPassword,
            email: req.body.email,
            role: "author",
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            createdAt: new Date()
        };

        let result = await users.insertOne(user);
        res.status(200).send("Success");
    } catch (error) {
        res.status(500).send("Failed");
    }
});

router.post("/userEdit", async (req, res) => {
    try {
        const dbConnection = await global.clientConnection;
        const db = await dbConnection.db("PanaromaCodeChallenge");
        const users = await db.collection("Users");

        // Validate Request
        if (!req.body) {
            return res.status(400).send(JSON.stringify({ message: "Data Can not be Empty" }));
        }

        await users.updateOne({ _id: new ObjectID(req.body._id) },
            {
                $set: {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    role: req.body.role,
                    username: req.body.username,
                    updatedAt: new Date()

                }
            })

        let newData = await users.findOne({ _id: new ObjectID(req.body._id) })
        return res.status(200).send(JSON.stringify({ newData, "message": "User Updated Successfully" }));

    } catch (error) {
        res.status(500).send("Failed");
    }
});
router.post("/login", async (req, res) => {
    try {
        const dbConnection = await global.clientConnection;
        const db = await dbConnection.db("PanaromaCodeChallenge");
        const users = await db.collection("Users");

        const user = await users.findOne({ email: req.body.email });
        if (!checkValueEmptyOrNull(user)) {
            return res.status(200).send({ error: { code: "Failed", message: "Incorrect credentials" } });
        }

        const compare = await bcrypt.compare(req.body.password, user.password);
        if (!compare) {
            return res.status(200).send({ error: { code: "Failed", message: "Incorrect credentials" } });
        }

        const token = jwt.sign({
            id: user._id,
            role: user.role,
            email: user.email,
            username: user.username

        },
            process.env.JWT_PRIVATEKEY,
            {
                // expiresIn: "120s", // expires in 365 days
                expiresIn: process.env.JWT_EXPIRESIN
                //expiresIn: "4h"
            }
        );

        let userData = {
            user,
            token
        }
        res.status(200).send(userData); // Send the user data on successful login
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed");
    }
});

router.get("/", async (req, res) => {
    try {
        const dbConnection = await global.clientConnection;
        const db = await dbConnection.db("PanaromaCodeChallenge");
        const users = await db.collection("Users");
        const user = await users.find().toArray();
        if (user != null) {
            res.status(200).send(JSON.stringify(user));
        }
        else {
            res.status(500).send(JSON.stringify({ message: "no record found" }));
        }
    }
    catch (error) {
        return res.status(500).send(JSON.stringify({ message: error.message }));
    }
});


router.post("/resetpassword", async (req, res) => {
    try {
        const dbConnection = await global.clientConnection;
        const db = await dbConnection.db("PanaromaCodeChallenge");
        const users = await db.collection("Users");

        const currentSalt = await bcrypt.genSalt(10);
        const currentHashPassword = await bcrypt.hash(req.body.password, currentSalt);
        // Check if user with provided email exists
        const existingEmailUser = await users.findOne({ email: req.body.email });
        if (existingEmailUser == null) {
            return res.status(400).send("Email is already registered.");
        }
        const hashPassword = await bcrypt.hash(req.body.previousPassword, existingEmailUser.salt);

        // Check if user with provided username exists
        if (existingEmailUser.password != hashPassword) {
            return res.status(400).send("Old Password Not matched.");
        }


        await users.updateOne({ email: req.body.email },
            {
                $set: {
                    salt: currentSalt,
                    password: currentHashPassword,
                }
            })

        res.status(200).send("Success");
    } catch (error) {
        console.log(error);
        res.status(500).send("Failed");
    }
});

router.get("/getUsers", async (req, res) => {
    try {
        const dbConnection = await global.clientConnection;
        const db = await dbConnection.db("PanaromaCodeChallenge");
        const users = await db.collection("Users");
        const user = await users.find().sort({ _id: -1 }).toArray();
        if (user != null) {
            res.status(200).send(JSON.stringify(user));
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