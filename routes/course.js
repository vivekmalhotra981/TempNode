const express = require('express');
const courseControllers = require('../controllers/course');
const { requireSingin } = require('../controllers/auth');
const { userById } = require('../controllers/user');


const Course = require('../models/course');

const router = express.Router();

router.get('/courses', courseControllers.getCourses);



router.post('/course/new', requireSingin , courseControllers.createCourse);
router.get('/course/:courseId', courseControllers.singleCourse);

router.delete('/course/:courseId', requireSingin, courseControllers.deleteCourse);

router.put('/course/:courseId', requireSingin, courseControllers.updateCourse);

router.get('/enroll/:userId/:courseId', requireSingin, courseControllers.isEnroller, courseControllers.enrollCourse);

router.param("userId", userById);
router.param("courseId", courseControllers.courseById);
module.exports = router;