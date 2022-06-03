const catchAsync = require("./../utils/catchAsync");

exports.isOwner = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findOne({ _id: id });

    if (!doc) {
      return res
        .status(403)
        .json({ status: "failed", data: "Unable to find document!" });
    }

    if (doc.owner === req.user.id || doc.owner === req.user.email) {
      return next();
    }

    // prettier-ignore
    return res.status(403).json({status: "failed", data: "You must be an owner to modify this document!"})
  });

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findOne({ _id: id });

    return res.status(200).json({ status: "success", data: doc });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    console.log(req.body);

    return res.status(200).json({ status: "success", data: doc });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id, review } = req.body;
    // make sure only user can update their own review
    const doc = await Model.findOneAndUpdate({ _id: id }, { review });

    return res.status(200).json({ status: "success", data: doc });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.body;
    const doc = await Model.findOneAndDelete({ _id: id });

    return res.status(200).json({ status: "success", data: doc });
  });
