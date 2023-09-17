const express = require('express');
const connection = require('../connection');
const router = express.Router();
let auth = require('../services/authentication');
let checkRole = require('../services/checkrole');

router.post('/add', auth.authenticateToken, (req, res, next) => {
  let category = req.body;
  console.log(category);

  let insertQuery = "INSERT INTO category (name,Pname,lastName,PlastName, fatherFulName, grandFatherName,familyName,cnic,dob,Pdob,placeOfBirth,country, province, district, village,countryofResidence, otherNationalities,  gender, children,  hieght,materialStatus, hairColurs, eyeColor,  currentAddress, previousAddress, emailAddress, mobileAddress, userId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

  let selectQuery = "SELECT categoryId FROM category WHERE cnic = ? ORDER BY categoryId DESC LIMIT 1";

  connection.query(insertQuery, [ category.name,category.Pname,category.lastName,category.PlastName,category.fatherFulName, category.grandFatherName, category.familyName, category.cnic,category.dob,category.Pdob,category.placeOfBirth,category.country, category.province, category.district, category.village,category.countryofResidence,category.otherNationalities,  category.gender, category.children,  category.hieght,category.materialStatus, category.hairColurs, category.eyeColor,  category.currentAddress, category.previousAddress, category.emailAddress, category.mobileAddress, category.userId], (err, result) => {
    if (!err) {
      connection.query(selectQuery, [category.cnic], (selectErr, selectResult) => {
        if (!selectErr && selectResult.length > 0) {
          const categoryId = selectResult[0].categoryId; 
          console.log("this is the id of categoryId", categoryId);
          return res.status(200).json({ message: "Category added successfully", categoryId: categoryId });
        } else {
          return res.status(500).json(selectErr);
        }
      });
    } else {
      return res.status(500).json(err);
    }
  });
});
;

router.delete("/delete/:id", auth.authenticateToken, checkRole.checkRole, (req, res) => {
  let sql = "DELETE FROM category WHERE id = ?";
  
  connection.query(sql, [req.params.id], (error, result) => {
    if (error) {
      res.send({ status: false, message: "Student Deletion Failed" });
    } else {
      res.send({ status: true, message: "Student Deleted successfully" });
    }
  });
});
router.get("/search/:id", (req, res) => {
  let sql = "select * from category where id=?"
  let values = [req.params.id]
    // return res.send(sql);
       connection.query(sql, values, (err, result)=>{
        if(err){
          return res.status(404).send({message: err.message})
        }else{
          return res.status(200).send({data: result[0]})
        }
      })
});

router.get("/searchIdof/:id", (req, res) => {
  let query = `
    SELECT DISTINCT user.id, user.email, category.*, files.*
    FROM user
    INNER JOIN category ON category.userId = user.id
  INNER JOIN files on files.categoryId = category.categoryId
    WHERE files.categoryId = ?
    GROUP BY  category.categoryId , files.categoryId`;

  let values = [req.params.id];
  console.log('This is the id to be searched:', values);

  connection.query(query, values, (err, result) => {
    if (err) {
      return res.status(404).send({ message: err.message });
    } else {
      console.log('Query result:', result);
      return res.status(200).send({ data: result });
    }
  });
});





router.put("/update/:id", (req, res) => {
  console.log(req.params.id);
  let sql =
    "UPDATE category SET cnic=?, name=?, familyName=?, givenName=?, fatherFulName=?, grandFatherName=?, materialStatus=? WHERE id=?";
  
  let values = [
    req.body.cnic,
    req.body.name,
    req.body.familyName,
    req.body.givenName,
    req.body.fatherFulName,
    req.body.grandFatherName,
    req.body.materialStatus,
    req.params.id
  ];

  connection.query(sql, values, (error, result) => {
    if (error) {
      res.send({ status: false, message: "Category update failed" });
    } else {
      res.send({ status: true, message: "Category updated successfully" });
    }
  });
});





  module.exports = router;

  // now these routes to be conneected with our routes 