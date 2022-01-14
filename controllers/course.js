const Course = require('../models/course');
const _ = require('lodash');
const formidable = require('formidable');
const fs = require('fs');
exports.courseById = (req, res, next, id) => {
    Course.findById(id)
        .populate("joinedBy", "_id name")
        .select("_id title body created category joinedBy")
        .exec((err, course) => {
            if (err || !course) {
                return res.status(400).json({
                    error: err
                });
            }
            req.course = course;
            next();
        });
};
exports.getCourses = async (req, res) => {
    const courses = await Course.find()
        .populate("joinedBy", "_id name")
        .select("_id title body created category joinedBy")
        .sort({ created: -1 })
        .then(courses => {
            res.json(courses);
        })
        .catch(err => console.log(err));
};
exports.createCourse = (req,res, next) => {
    const course = new Course(req.body);
    course.save((err, result) => {
        if(err){
            return res.status(400).json({
                error: err
            });
        }
        res.status(200).json({
            course: result
        });
    });
};


exports.updateCourse = (req,res,next) =>
{
    let course = req.course;
    course = _.extend(course, req.body);
    course.updated = Date.now();
    course.save((err) => {
        if(err){
            return res.status(400).json({
                error: err
            });
        }
        res.json({course});
    });
};

exports.deleteCourse = (req, res) => {
    let course = req.course;
    course.remove((err, course) => {
        if(err)
        {
            return res.status(400).json({error: err});
        }
        res.json({"message":"Course deleted Successfully"});
    });
};

exports.singleCourse = (req,res,next) =>{
    return res.json(req.course);
};

exports.enrollCourse = (req,res) =>{
    let course = req.course;
    let user = req.profile;
    Course.find({title:course.title,joinedBy: user._id}, function (err, docs) {
        if(err){
            return res.status(400).json({
                error: err
            });
        }
        if (docs.length){
            return res.status(400).json({'message':'User already enrolled'});
        }else{
            Course.findByIdAndUpdate(course._id,{$push: {joinedBy:user._id}}, {new : true})
        .populate("joinedBy", "_id name")
        .exec((err, result) => {
            if(err){
                return res.status(400).json({
                    error: err
                });
            }
            res.json(result);
        });
        }
    });
    
}

exports.isEnroller = (req,res, next) => {
    let isenroller = req.profile && req.auth && req.profile._id == req.auth._id
    if(!isenroller)
    {
        return res.status(400).json({error: "This User is not authorized to enroll."});
    }
    next();
}