const mongoose = require("mongoose");
const reportSchema = require("../models/ReportSchema");
const userSchema = require("../models/UserSchema");

const createReportController = async (req, res) => {
  try {
    const { ownerId, reason, description, userPhoneNumber } = req.body || {};

    if (!mongoose.isValidObjectId(ownerId)) {
      return res
        .status(400)
        .send({ success: false, message: "A valid ownerId is required" });
    }

    const owner = await userSchema.findById(ownerId).select("_id type");
    if (!owner || String(owner.type || "").trim().toLowerCase() !== "owner") {
      return res
        .status(404)
        .send({ success: false, message: "Property owner not found" });
    }

    const report = await reportSchema.create({
      userId: req.authenticatedUserId || null,
      ownerId,
      reason,
      description,
      userPhoneNumber,
    });

    return res.status(201).send({
      success: true,
      message: "Report submitted",
      data: report,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).send({ success: false, message: error.message });
    }
    console.error("Error creating report:", error);
    return res
      .status(500)
      .send({ success: false, message: "Unable to submit report" });
  }
};

const getAllReportsController = async (req, res) => {
  try {
    const reports = await reportSchema
      .find({})
      .populate("userId", "name email")
      .populate("ownerId", "name email type")
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      message: "All reports",
      data: reports,
    });
  } catch (error) {
    console.error("Error retrieving reports:", error);
    return res
      .status(500)
      .send({ success: false, message: "Unable to retrieve reports" });
  }
};

const getReportController = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.reportId)) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid report ID" });
    }

    const report = await reportSchema
      .findById(req.params.reportId)
      .populate("userId", "name email")
      .populate("ownerId", "name email type");

    if (!report) {
      return res
        .status(404)
        .send({ success: false, message: "Report not found" });
    }

    return res.status(200).send({ success: true, data: report });
  } catch (error) {
    console.error("Error retrieving report:", error);
    return res
      .status(500)
      .send({ success: false, message: "Unable to retrieve report" });
  }
};

const updateReportStatusController = async (req, res) => {
  try {
    const { status } = req.body || {};
    if (!["settled", "in progress"].includes(status)) {
      return res.status(400).send({
        success: false,
        message: "Status must be 'settled' or 'in progress'",
      });
    }

    if (!mongoose.isValidObjectId(req.params.reportId)) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid report ID" });
    }

    const report = await reportSchema.findByIdAndUpdate(
      req.params.reportId,
      { status },
      { new: true, runValidators: true }
    );

    if (!report) {
      return res
        .status(404)
        .send({ success: false, message: "Report not found" });
    }

    return res.status(200).send({
      success: true,
      message: "Report status updated",
      data: report,
    });
  } catch (error) {
    console.error("Error updating report status:", error);
    return res
      .status(500)
      .send({ success: false, message: "Unable to update report status" });
  }
};

const deleteReportController = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.reportId)) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid report ID" });
    }

    const report = await reportSchema.findByIdAndDelete(req.params.reportId);
    if (!report) {
      return res
        .status(404)
        .send({ success: false, message: "Report not found" });
    }

    return res
      .status(200)
      .send({ success: true, message: "Report deleted" });
  } catch (error) {
    console.error("Error deleting report:", error);
    return res
      .status(500)
      .send({ success: false, message: "Unable to delete report" });
  }
};

module.exports = {
  createReportController,
  getAllReportsController,
  getReportController,
  updateReportStatusController,
  deleteReportController,
};
