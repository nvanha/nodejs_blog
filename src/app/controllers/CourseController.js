const Course = require("./../models/Course");
const { mongooseToObject } = require("./../../util/mongoose");

class CourseController {
  // [GET] /courses/:slug
  show(req, res, next) {
    Course.findOne({ slug: req.params.slug })
      .then((course) => {
        res.render("courses/show", {
          course: mongooseToObject(course),
        });
      })
      .catch(next);
  }

  // [GET] /courses/create
  create(req, res, next) {
    res.render("courses/create");
  }

  // [POST] /courses/store
  store(req, res, next) {
    const formData = req.body;
    formData.image = `https://img.youtube.com/vi/${req.body.videoId}/sddefault.jpg`;
    const course = new Course(req.body);
    course
      .save()
      .then(() => res.redirect(`/`))
      .catch((err) => {
        console.log(err);
      });
  }

  // [GET] /courses/:id/edit
  edit(req, res, next) {
    Course.findById(req.params.id)
      .then((course) =>
        res.render("courses/edit", {
          course: mongooseToObject(course),
        })
      )
      .catch(next);
  }

  // [PUT] /courses/:id
  update(req, res, next) {
    Course.updateOne({ _id: req.params.id }, req.body)
      .then(() => res.redirect("/me/stored/courses"))
      .catch(next);
  }

  // [DELETE] /courses/:id
  destroy(req, res, next) {
    Course.deleteOne({ _id: req.params.id }, req.body)
      .then(() => res.redirect("back"))
      .catch(next);
  }
}

/**
 * GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD
 * - GET: gửi yêu cầu lên server, yêu cầu server trả dữ liệu cho client
 * - POST: gửi yêu cầu lên server, yêu cầu server lưu lại một dữ liệu, tạo mới một dữ liệu
 * - PUT, PATCH: dùng để chỉnh sửa dữ liệu
 *      + PUT: replace cả dữ liệu
 *      + PATCH: sửa từng filed
 */

module.exports = new CourseController();
