const express = require('express');
const mongoose = require('mongoose');
const Joi = require('@hapi/joi')
const { authUser, ifLoggedInDontShowLoginPage, TokenStorage } = require('./verifyToken')
require('dotenv/config');
const router = express.Router();
const Admin = require('../models/Admin');
const JobOpening = require('../models/JobOpening');

const jwt = require('jsonwebtoken');
const bycrypt = require('bcrypt');

const { createNewJobValidation, registerAdminUserValidation, adminLoginValidation } = require('../authorization');

router.get('/login', ifLoggedInDontShowLoginPage, async (req, res) => {
    res.render('login')
})

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
    const tokenStorage = new TokenStorage();
    tokenStorage.store(token);
    console.log(tokenStorage.get())
    // add it to the header
    res.header('auth-token', token).render('dashboard', { authData: user });
})

router.get('/dashboard', authUser, (req, res) => {
    const tokenStorage = new TokenStorage();
    let token = tokenStorage.get();
    jwt.verify(token, process.env.TOKEN_SECRET, (err, authData) => {
        if (err) {
            return res.status(401).json({
                "status": "failed",
                "code": 401,
                "messages": ["Access denied", "You must be logged in to view this page"]
            });
        } else {
            res.render('dashboard', { authData })
        }
    })

});

router.get('/user/create', authUser, async (req, res) => {
    res.render('createUser')
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


router.get('/adminJobsList',authUser, async (req, res) => {
    getAllJobsAndFilterIfNecessary(req, res, 'adminJobsList')
})

router.get('/newJob', authUser, (req, res) => {
    getAllJobsAndFilterIfNecessary(req, res, 'newJob')
    // res.render('newJob');
})

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
    perks.split(/--/gi).forEach(perk => {
        if (perk.trim() !== "") {
            perksObj[`${Object.keys(perksObj).length + 1}`] = perk.replace(/\r\n/gi, "").trim();
        }
    })

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
    const createdJob = new JobOpening(jobToBeCreated)

    // Check if there is an exact job in the DB;
    const jobIsExactIndDB = await JobOpening.findOne(createdJob);
    if (jobIsExactIndDB) {
        return res.status(400).json({
            "status": "failed",
            "code": 400,
            "messages": ["Bad request", "This exact job opening is already added"]
        });
    }

    try {
        const savedJob = await createdJob.save();
        console.log({
            "status": "ok",
            "code": 201,
            "messages": ["Created", "Job opening successfully created"],
            "data": { createdJob }
        })
        return res.redirect('/api/auth/jobCreated');
        // return res.status(201).json({
        //     "status": "ok",
        //     "code": 201,
        //     "messages": ["Created", "Job opening created successfully"],
        //     "result": {
        //         "job": { createdJob }
        //     }
        // })
    } catch (err) {
        return res.status(500).json({
            "status": "failed",
            "code": 500,
            "messages": ["Internal Server Error", "Your request was not completed"]
        });
    }

})

router.get('/job/edit/:_id', authUser, async (req, res) => {
    try {
        console.log({ _id: req.params._id })
        const result = await JobOpening.findOne({ _id: req.params._id });
        const jobs = await JobOpening.find().sort({ position: 1 });
        let deptSet = new Set();
        let locationSet = new Set();

        jobs.forEach(job => {
            locationSet.add(job.location);
            deptSet.add(job.department);
        });
        return res.render('editJob', { job: result, locations: locationSet, departments: deptSet });

    } catch (err) {
        return res.status(401).json({
            "status": "failed",
            "code": 401,
            "messages": ["Internal server error", "Your request was not completed."]
        });

    }
})

router.post('/job/update/:_id', authUser, async (req, res) => {
    try {
        const result = await JobOpening.findOne({ _id: req.params._id });
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

        const updatedJob = await JobOpening.updateOne(
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

        console.log({
            "status": "ok",
            "code": 201,
            "messages": ["updated", "Job successfullly updated"],
            "data": {
                // updatedJob
            }
        })
        return res.redirect('/api/auth/adminJobsList');

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
        const deletedJob = await JobOpening.findByIdAndDelete({ _id: idOfJob });
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
        const queriedResult = await JobOpening.find(generatedQuery).sort({ position: 1 });
        const unfilteredResult = await JobOpening.find().sort({ position: 1 });
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
        const result = await JobOpening.find({}).sort({ position: 1 });
        return res.render(page, { jobs: result });
    } catch (err) {
        return res.status(404).json({ status: "404", message: "Not found" });
    }
}




router.get('/jobCreated', authUser, (req, res) => {
    res.render('jobCreated');
})












module.exports = router;

