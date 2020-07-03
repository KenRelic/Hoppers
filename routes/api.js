const express = require('express');
const mongoose = require('mongoose');
const Joi = require('@hapi/joi')
const { authUser, ifLoggedInDontShowLoginPage, TokenStorage } = require('./verifyToken')
require('dotenv/config');
const router = express.Router();
const Admin = require('../models/Admin');
const Job = require('../models/Job');

const jwt = require('jsonwebtoken');
const bycrypt = require('bcrypt');

const { createNewJobValidation, registerAdminUserValidation, adminLoginValidation } = require('../authorization');

router.post('/login', async (req, res) => {
    const { error } = adminLoginValidation(req.body);
    if (error) {
        return res.status(400).json({
            "status": "failed",
            "code": 400,
            "messages": ["Bad request", error.details[0].message]
        });
    }

    // check if email doesnt exist
    const user = await Admin.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({
            "status": "failed",
            "code": 400,
            "messages": ["Bad request", "The Email or password is incorrect"]
        });
    }

    // Check login details
    const validPassword = await bycrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(400).json({
            "status": "failed",
            "code": 400,
            "messages": ["Bad request", "The Email or password is incorrect"]
        });
    }

    // create token
    const token = jwt.sign({ _id: user._id, fullname: user.fullname }, process.env.TOKEN_SECRET, { expiresIn: '1d' });

    // add it to the header
    res.header('auth-token', token).json({
        "status": "ok",
        "code": 201,
        "messages": ["Login successful"],
        "result": {
            "user": {
                _id: user._id,
                email: user.email,
                token: token
            }
        }
    });
})

router.post('/createUser', authUser, async (req, res) => {
    const { error } = registerAdminUserValidation(req.body);
    if (error) {
        return res.status(400).json({
            "status": "failed",
            "code": 400,
            "messages": ["Bad request", error.details[0].message]
        });
    }

    // hash the password
    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(req.body.password, salt);

    // create Admin user
    const adminUser = new Admin({
        fullname: req.body.fullname,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role
    })

    // Check if email already exists
    const isEmailinDB = await Admin.findOne({ email: req.body.email });
    if (isEmailinDB) {
        return res.status(400).json({
            "status": "failed",
            "code": 400,
            "messages": ["Bad request", "This Email already exists"]
        });
    }

    try {
        const savedUser = await adminUser.save();
        return res.status(201).json({
            "status": "ok",
            "code": 201,
            "messages": ["Created", "User created successfully"],
            "result": {
                "user": {
                    "id": savedUser._id,
                }
            }
        })
    } catch (err) {
        return res.status(500).json({
            "status": "failed",
            "code": 500,
            "messages": ["Internal Server Error", "Your request was not completed"]
        });
    }

});


router.post('/job/add', authUser, async (req, res) => {
    const { position, department, location, role, description, role_requirement, perks } = req.body;
    let descObj = {};
    let roleRequirementObj = {};
    let perksObj = {};

    description.split(/--/gi).forEach(desc => {
        if (desc.trim() !== "") {
            descObj[`${Object.keys(descObj).length + 1}`] = desc.replace(/\r\n/gi, "").trim();
        }
    })
    role_requirement.split(/--/gi).forEach(roleReq => {
        if (roleReq.trim() !== "") {
            roleRequirementObj[`${Object.keys(roleRequirementObj).length + 1}`] = roleReq.replace(/\r\n/gi, "").trim();
        }
    })
    if (perks) {
        perks.split(/--/gi).forEach(perk => {
            if (perk.trim() !== "") {
                perksObj[`${Object.keys(perksObj).length + 1}`] = perk.replace(/\r\n/gi, "").trim();
            }
        })
    }


    const jobToBeCreated = {
        position: position.trim(),
        department: department.trim(),
        location: location.trim(),
        role: role.trim(),
        description: descObj,
        role_requirement: roleRequirementObj,
        perks: perksObj
    }
    //code to add job
    const { error } = createNewJobValidation(jobToBeCreated);
    if (error) {
        return res.status(400).json({
            "status": "failed",
            "code": 400,
            "messages": ["Bad request", error.details[0].message]
        });
    }


    //get the person that creted the job
    // const jobCreator = res.header
    // create new job opening
    const createdJob = new Job(jobToBeCreated)

    try {
        const savedJob = await createdJob.save();

        return res.status(201).json({
            "status": "ok",
            "code": 201,
            "messages": ["Created", "Job opening created successfully"],
            "result": {
                "job": { createdJob }
            }
        })

    } catch (err) {
        return res.status(500).json({
            "status": "failed",
            "code": 500,
            "messages": ["Internal Server Error", "Your request was not completed"]
        });
    }

})


router.post('/job/update/:_id', authUser, async (req, res) => {
    try {
        const result = await Job.findOne({ _id: req.params._id });
        if (!result) {
            return res.status(400).json({
                "status": "failed",
                "code": 400,
                "messages": ["Bad request", `The job id ${req.params._id} doesnt exist in the database`]
            });
        }
        const { position, department, location, role, description, role_requirement, perks } = req.body;
        let descObj = {};
        let roleRequirementObj = {};
        let perksObj = {};

        description.split(/--/gi).forEach(desc => {
            if (desc.trim() !== "") {
                descObj[`${Object.keys(descObj).length + 1}`] = desc.replace(/\r\n/gi, "").trim();
            }
        })
        role_requirement.split(/--/gi).forEach(roleReq => {
            if (roleReq.trim() !== "") {
                roleRequirementObj[`${Object.keys(roleRequirementObj).length + 1}`] = roleReq.replace(/\r\n/gi, "").trim();
            }
        })
        perks.split(/--/gi).forEach(perk => {
            if (perk.trim() !== "") {
                perksObj[`${Object.keys(perksObj).length + 1}`] = perk.replace(/\r\n/gi, "").trim();
            }
        })

        const updatedJob = await Job.updateOne(
            result,
            {
                position: position.trim(),
                department: department.trim(),
                location: location.trim(),
                role: role.trim(),
                description: descObj,
                role_requirement: roleRequirementObj,
                perks: perksObj
            },
            { new: true }
        )

        return res.status(201).json({
            "status": "ok",
            "code": 201,
            "messages": ["Job opening has been updated successfully"],
            "result": {
                "job": { updatedJob }
            }
        });

    } catch (err) {
        return res.status(500).json({
            "status": "failed",
            "code": 500,
            "messages": ["Internal server error", "Your request was not completed."]
        });

    }
})


router.post('/job/delete/:id', authUser, async (req, res) => {
    // code to delete one job
    try {
        const idOfJob = req.params._id;
        const deletedJob = await Job.findByIdAndDelete({ _id: idOfJob });
        return res.status(201).json({
            "status": "ok",
            "code": 201,
            "messages": ["Created", "Job opening deleted successfully"],
            "result": {
                "job": {
                    "id": deletedJob._id,
                }
            }
        })
    } catch (err) {
        return res.status(401).json({
            "status": "failed",
            "code": 401,
            "messages": `["Bad request", No job opening with the _id ${req.params._id}]`
        });
    }
})


async function getAllJobsAndFilterIfNecessary(req, res, page) {

    // query paramter filter
    let queryObj = req.query;
    const keys = Object.keys(queryObj);
    const values = Object.values(queryObj);
    let generatedQuery = {};


    for (let i = 0; i < keys.length; i += 1) {
        generatedQuery[`${keys[i]}`] = { $regex: new RegExp(values[i], 'i') };
    }

    try {
        const queriedResult = await Job.find(generatedQuery).sort({ position: 1 });
        const unfilteredResult = await Job.find().sort({ position: 1 });
        let deptSet = new Set();
        let locationSet = new Set();

        unfilteredResult.forEach(job => {
            locationSet.add(job.location);
            deptSet.add(job.department);
        });
        // console.log({ jobs: queriedResult, locations: locationSet, departments: deptSet })

        return res.render(page, { jobs: queriedResult, locations: locationSet, departments: deptSet, queryObj });
    } catch (err) {
        return res.status(401).json({
            "status": "failed",
            "code": 401,
            "messages": ["Internal server error", "Your request was not completed."]
        });
    }
}

async function getData(req, res, page) {
    try {
        const result = await Job.find({}).sort({ position: 1 });
        return res.render(page, { jobs: result });
    } catch (err) {
        return res.status(404).json({ status: "404", message: "Not found" });
    }
}



module.exports = router;

