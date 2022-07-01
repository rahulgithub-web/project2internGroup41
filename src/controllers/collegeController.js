const collegeModel = require("../models/collegeModel")
const internModel = require("../models/internModel")
const validation = require("../middlewares/validator");

let { isEmpty, isValidName, isValidFullName,  isValidLogoLink } = validation;

// ============> Creating College Data <============== 
const createColleges = async function (req, res) {
  try {
    let data = req.body;
    let { name, fullName, logoLink } = data;

    if (Object.keys(data).length < 1) return res.status(400).send({ status:false, msg: "Insert Data : BAD REQUEST" })

    let checkCollege = await collegeModel.findOne({ name: name });
    if (checkCollege) {
      return res.status(400).send({ status:false, msg: "college name already exists" })
    }

    if (!isEmpty(name)) {
      return res.status(400).send({ status:false, msg: "Enter College Name" })
    }
    if (!isValidName(name)) {
      return res.status(400).send({ status:false, msg: "name only take alphabets" })
    }
    name = name.replace(/\s+/g, " ").toLowerCase();
    if (!isValidFullName(fullName)) {
      return res.status(400).send({ status:false, msg: "Enter Full Name" })
    }
    if (!isValidFullName(fullName)) {
      return res.status(400).send({ status:false, msg: "fullname only take alphabets" })
    }

    if (!isValidLogoLink(logoLink)) {
      return res.status(400).send({ status:false, msg: "Enter Logo Link" })
    }

    fullName = fullName.replace(/\s+/g, " ");
    data['fullName'] = fullName;
    data['name'] = name;
    let savedData = await collegeModel.create(data);

    return res.status(201).send({ status: true, msg: "college details are successfully created", data: savedData })
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }
}

// =====> Fetching Interns Data by College Name <======
const collegeDetails = async function (req, res) {
  try {
    let collegeName = req.query;

    if (!collegeName.collegeName){
      return res.status(400).send({ status:false, msg: "Provide The College Name" })
    }

    collegeName = collegeName.collegeName.replace(/\s+/g, "").toLowerCase();
    let collegeFound = await collegeModel.findOne({ name: collegeName });
    if (!collegeFound) {
      return res.status(404).send({status:false, msg: "No College Found" })
    }

    const { _id, name, fullName, logoLink } = collegeFound;
    const id = _id.toString()     
    const data = {_id:1, name:1, email:1, mobile:1, email:1};  
    let interns = await internModel.find({ collegeId: id }).select(data);

    if (interns.length == 0) {
      let noIntern = "This College Doesn't Have Any Intern"
      interns = noIntern;
    }
    const college = { name, fullName, logoLink, interns }

    return res.status(200).send({ status: true, msg: "List Of The Interns Of This College", data: { college } })
  }

  catch (err) {
    return res.status(500).send({ status:false, msg: err.message })
  }
}

module.exports = { createColleges, collegeDetails }