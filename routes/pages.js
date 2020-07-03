const express = require('express');
const router = express.Router();
const JobOpening = require('../models/JobOpening');
const Nexmo = require('nexmo');





router.get('/', (req, res) => {
    res.render('index');
})

router.get('/company', (req, res) => {
    res.render('company');
})


router.get('/people', (req, res) => {
    getData(req, res, 'people');
});

router.get('/career', (req, res) => {
    getAllJobsAndFilterIfNecessary(req, res, 'careerList');
});

router.get('/career-details/:id', (req, res) => {
    getOneJob(req, res, 'career-details');
});

router.get('/apply/:id', (req, res) => {
    // getOneJob(req, res, 'apply-job');
    getOneJob(req, res, 'apply-job');
});


router.get('/cta-modal', (req, res) => {
    // getOneJob(req, res, 'apply-job');
    res.render('cta-modal');
});

router.post('/sendAppLink', (req, res) => {
    const number = req.body.phone_number;
    const nexmo = new Nexmo({
      apiKey: process.env.NEXMO_API_KEY,
      apiSecret: process.env.NEXMO_API_SECRET
    })
    nexmo.message.sendSms(process.env.FROM_NUM, number, process.env.SMS_MESSAGE);
    console.log({ number })
    res.render('cta-modal-sent', { number });
});

router.get('/people-videomodal', (req, res) => {
    res.render('people-videomodal');
});

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
        console.log({ queryObj })

        return res.render(page, { jobs: queriedResult, locations: locationSet, departments: deptSet, queryObj });
    } catch (err) {
        return res.status(404).json({ error: "Not found" });
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

async function getOneJob(req, res, page) {
    try {
        const paramsValue = req.params.id.split('---');
        const jobId = paramsValue[1];
        const jobTitle = paramsValue[0];
        console.log({ job_title: jobTitle, _id: jobId })

        const result = await JobOpening.findById({ _id: jobId });
        console.log(result)

        // let data =  res.status(200).json(queriedResult);
        res.render(page, { jobApplyingFor: result });
        return
    } catch (err) {
        res.status(404).json({ error: "Not found" });
    }
}

// GET ONE JOB
router.get('/jobs:id', async (req, res) => {
    try {
        const result = await JobOpening.findById(req.params.id);
        console.log(result);
        res.status(200).json(result)
    } catch (err) {

    }
})



module.exports = router;