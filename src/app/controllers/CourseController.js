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
    const formData = { ...req.body };
    formData.image = `https://img.youtube.com/vi/${req.body.videoId}/sddefault.jpg`;
    const course = new Course(formData);
    course
      .save()
      .then(() => res.redirect(`/me/stored/courses`))
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
    Course.delete({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }

  // [DELETE] /courses/:id/force
  forceDestroy(req, res, next) {
    Course.deleteOne({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }

  // [PATCH] /courses/:id/restore
  restore(req, res, next) {
    Course.restore({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }

  // [PATCH] /courses/handle-form-action
  handleFormAction(req, res, next) {
    switch (req.body.action) {
      case "delete":
        Course.delete({ _id: { $in: req.body.courseIds } })
          .then(() => res.redirect("back"))
          .catch(next);
        break;
      case "restore":
        Course.restore({ _id: { $in: req.body.courseIds } })
          .then(() => res.redirect("back"))
          .catch(next);
        break;
      case "forceDelete":
        Course.deleteMany({ _id: { $in: req.body.courseIds } })
          .then(() => res.redirect("back"))
          .catch(next);
        break;
      default:
        res.json({ message: "Action invalid" });
    }
  }
}

/**
 * GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD
 * - GET: gửi yêu cầu lên server, yêu cầu server trả dữ liệu cho client
 * - POST: gửi yêu cầu lên server, yêu cầu server lưu lại một dữ liệu, tạo mới một dữ liệu
 * - PUT, PATCH: dùng để chỉnh sửa dữ liệu
 *      + PUT: replace cả dữ liệu
 *      + PATCH: sửa từng filed
 *
 * 1. Create -> POST
 * 2. Update -> PUT, PATCH
 * 3. Delete -> DELETE
 * 4. Reload -> GET
 */

module.exports = new CourseController();
