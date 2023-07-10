const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
const { v4: uuid_v4  } = require('uuid');

const HttpError = require('../models/http-error');
const Doctor = require('../schemas/doctorSchema');
// const Payment = require('../schemas/payment-schema');
// const Role = require('../_helpers/role');


// user auth
// const authenticate = async ({ email, password }) => {
//     let user = null;
//     try{
//         user = await User.findOne({ email: email });
//       } catch(err) {
//         const error = new HttpError(
//           'Something went wrong, could not find user.',
//           500
//         );
//         return error;
//       }

// const { Doctor } = require("../_helpers/role");

//       const match = await bcrypt.compare(password, user.password);
//       if(match) {
//         const token = jwt.sign({ sub: user.id, role: user.role }, config.secret);
//         const { password, ...userWithoutPassword } = user;
//         return {
//             ...userWithoutPassword,
//             token
//         };
//       } else {
//         return res.json({success: false, message: 'passwords do not match'});
//       }
// }



// Save Docotr details
const saveDoctor = async (req, res, next) => {
    console.log('Adding the doctor');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Invalid inputs! Please check again.', 422));
    }

    const { name, email, phone, fee, age, speciality, address, degree, salary,availbleTime, typeavailbleTime, dateOfJoin ,gender } = req.body;

    let existingDoctor;
    try{
      existingDoctor = await Doctor.findOne({ email: email});
    } catch(err) {
      const error = new HttpError(
        'Something went wrong, could not add doctor details.',
        500
      );
      return next(error);
    }

    if(existingDoctor) {
        const error = new HttpError(
          'Doctor already exists.',
          422
        );
        return next(error);
      }

    // const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(hashedPassword);
    const newDoctor = new Doctor({
        doctorid: uuid_v4(),
        name,
        email,
        phone,
        fee, 
        age, 
        speciality, 
        address, 
        degree, 
        salary, 
        availbleTime, 
        typeavailbleTime,
        dateOfJoin,
        gender
    });

    await newDoctor.save()
      .then(data => {
        res.status(200).send({ data: data });
      })
      .catch(error => {
        res.status(500).send({ error: error.message });
      });
};

const getAllDoctors = async (req, res) => {
  await Doctor.find({})
    .then(data => {
      res.status(200).send({ data: data });
    })
    .catch(error => {
      res.status(500).send({ error: error.message });
    });
}

const getSingleDoctor = async (req, res) => {
  await Doctor.findById(req.params.id)
    .then(data => {
      res.status(200).send({ data: data });
    })
    .catch(error => {
      res.status(500).send({ error: error.message });
    });
}

const updateDoctor = async (req, res) => {
  console.log(req.body)
  if(!req.body){
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }
    await Doctor.findByIdAndUpdate(req.params.id,req.body,{useFindAndModify : false})
      .then(data => {
        if(!data){
          res.status(400).send({ message: 'cannot update doctor details' });
        }else res.status(200).send({ data: data });
      })
      .catch(error => {
        res.status(500).send({ error: error.message });
      });
  
}





exports.saveDoctor = saveDoctor;
exports.getAllDoctors = getAllDoctors;
exports.getSingleDoctor = getSingleDoctor;
exports.updateDoctor = updateDoctor;