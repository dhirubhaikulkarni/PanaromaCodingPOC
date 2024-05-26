const router = require("express").Router();
const bcrypt = require("bcryptjs");
const ObjectID = require('mongodb').ObjectId;

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
            return res.status(400).send(JSON.stringify({ message: "Data Can not be Empty"}));
        }

        await users.updateOne({ _id: new ObjectID(req.body._id) },
            {
                $set: {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    role:req.body.role,
                    updatedAt: new Date()
                    
                }
            })


        let newData = await users.findOne({ _id: new ObjectID(req.body._id) })
        return res.status(200).send(JSON.stringify({ newData, "message": "User Updated Successfully"}));
        
    } catch (error) {
        res.status(500).send("Failed");
    }
});
router.post("/login", async (req, res) => {
    try {
        console.log("login call");

        const dbConnection = await global.clientConnection;
        const db = await dbConnection.db("PanaromaCodeChallenge");
        const users = await db.collection("Users");

        const user = await users.findOne({ email: req.body.email });
        console.log(user);

        if (!checkValueEmptyOrNull(user)) {
            return res.status(200).send({ error: { code: "Failed", message: "Incorrect credentials" } });
        }

        const compare = await bcrypt.compare(req.body.password, user.password);
        if (!compare) {
            return res.status(200).send({ error: { code: "Failed", message: "Incorrect credentials" } });
        }

        res.status(200).send(user); // Send the user data on successful login
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed");
    }
});

router.get("/", async (req, res) => {
    try {
        // const salt = await bcrypt.genSalt(10);
        // const hashPassword = await bcrypt.hash("Pass@123", salt);
        // const compare = await bcrypt.compare(hashPassword, "$2a$10$YucTuYBmvQ2vo5hN9VG4te1ex8HW/U96tT9XrKyJ8u1lM8QO0i44e")

        // console.log(hashPassword);
        // console.log("compaior: " + compare);
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




module.exports = router;