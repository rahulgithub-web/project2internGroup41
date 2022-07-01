const internModel = require("../models/internModel")
const collegeModel = require("../models/collegeModel")
const validation = require("../middlewares/validator");

let { isEmpty, isValidName, isValidEmail, isValidMobile } = validation;


// ==========> Creating Intern Data <=============
const createInterns = async function (req, res) {
    try {
        let data = req.body;
        let { name, email, mobile, collegeName } = data;

        if (Object.keys(data).length < 1) return res.status(400).send({ status: false, msg: "Insert Data : BAD REQUEST" })

        if (!isEmpty(name)) {
            return res.status(400).send({ status: false, msg: "Enter Intern Name" })
        }
        if (!isValidName(name)) {
            return res.status(400).send({ status: false, msg: "Intern name should be valid" })
        }
        if (!isEmpty(email)) {
            return res.status(400).send({ status: false, msg: " please enter email" })
        }
        if (!isValidEmail(email)) {
            return res.status(400).send({ status: false, msg: " please enter valid email" })
        }
        let emailId = await internModel.findOne({ email: email })
        if (emailId) {
            return res.status(400).send({ status: false, msg: "emailId already exists" });
        }
        if (!isEmpty(mobile)) {
            return res.status(400).send({ status: false, msg: " please enter mobile number" })
        }
        if (!isValidMobile(mobile)) {
            return res.status(400).send({ status: false, msg: " please enter valid mobile Number" })
        }
        let mobileNo = await internModel.findOne({ mobile: mobile })
        if (mobileNo) {
            return res.status(400).send({ status: false, msg: "Add a subheadingmobile no already exists" })
        }
        if (!isEmpty(collegeName)) {
            return res.status(400).send({ status: false, msg: "Enter college Name" })
        }
        collegeName = collegeName.toLowerCase();
        let college = await collegeModel.find({ name: collegeName })
        if (!college) {
            return res.status(404).send({ status: false, msg: "No College Found" })
        }

        const collegeId = college._id

        if (college) {
            data['collegeId'] = collegeId
        } else {
            res.status(400).send({ status: false, msg: "No id Found With This College Name" })
        }

        const createIntern = await internModel.create(data)
        res.status(201).send({ status: true, msg: "Intern is Succesfully registered", data: createIntern })
    }

    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports = { createInterns }
