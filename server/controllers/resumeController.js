const Resume = require('../models/Resume');
const ErrorResponse = require('../utils/errorHandler');

exports.createResume = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const resume = await Resume.create(req.body);

    res.status(201).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

exports.getResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes,
    });
  } catch (error) {
    next(error);
  }
};

exports.getResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return next(new ErrorResponse(`Resume not found`, 404));
    }

    if (resume.user.toString() !== req.user.id) {
      return next(new ErrorResponse(`Not authorized to access this resume`, 401));
    }

    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateResume = async (req, res, next) => {
  try {
    let resume = await Resume.findById(req.params.id);

    if (!resume) {
      return next(new ErrorResponse(`Resume not found`, 404));
    }

    if (resume.user.toString() !== req.user.id) {
      return next(new ErrorResponse(`Not authorized to update this resume`, 401));
    }

    resume = await Resume.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return next(new ErrorResponse(`Resume not found`, 404));
    }

    if (resume.user.toString() !== req.user.id) {
      return next(new ErrorResponse(`Not authorized to delete this resume`, 401));
    }

    await resume.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
