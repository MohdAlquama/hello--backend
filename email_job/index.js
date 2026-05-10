require("dotenv").config();

const express = require("express");
const {Agenda} = require("agenda");
const nodemailer = require("nodemailer");

const app = express();

/* =========================
   Middleware
========================= */

app.use(express.json());

/* =========================
   Agenda Setup
========================= */

const agenda = new Agenda({
  db: {
    address: "mongodb://127.0.0.1:27017/mvc",
    collection: "agendaJobs",
  },
});

/* =========================
   Nodemailer Setup
========================= */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mohdalquama01@gmail.com",
    pass: "jlzc wzsw vxfa mdcg",
  },
});

/* =========================
   Email Job Define
========================= */

agenda.define("send email", async (job) => {
  const { to, subject, text } = job.attrs.data;

  try {
    const info = await transporter.sendMail({
      from: "mohdalquama01@gmail.com",
      to,
      subject,
      text,
    });

    console.log("=================================");
    console.log("Email Sent Successfully");
    console.log("To:", to);
    console.log("Message ID:", info.messageId);
    console.log("=================================");
  } catch (error) {
    console.log("=================================");
    console.log("Email Send Failed");
    console.log(error);
    console.log("=================================");
  }
});

/* =========================
   Schedule Email API
========================= */

app.post("/schedule-email", async (req, res) => {
  try {
    const { to, subject, text, time } = req.body;

    // validation
    if (!to || !subject || !text) {
      return res.status(400).json({
        success: false,
        message: "to, subject and text are required",
      });
    }

    // schedule email
    const job = await agenda.schedule(
      time || "now",
      "send email",
      {
        to,
        subject,
        text,
      }
    );

    res.status(200).json({
      success: true,
      message: "Email scheduled successfully",
      jobId: job.attrs._id,
      nextRunAt: job.attrs.nextRunAt,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* =========================
   Get All Jobs API
========================= */

app.get("/jobs", async (req, res) => {
  try {
    const jobs = await agenda.jobs({});

    res.status(200).json({
      success: true,
      total: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* =========================
   Cancel Job API
========================= */

app.delete("/cancel/:id", async (req, res) => {
  try {
    const result = await agenda.cancel({
      _id: req.params.id,
    });

    res.status(200).json({
      success: true,
      message: "Job cancelled successfully",
      deletedJobs: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* =========================
   Start Server
========================= */

(async function () {
  try {
    await agenda.start();

    console.log("=================================");
    console.log("Agenda Started");
    console.log("MongoDB Connected");
    console.log("=================================");

    app.listen(3000, () => {
      console.log("=================================");
      console.log("Server Running On Port 3000");
      console.log("http://localhost:3000");
      console.log("=================================");
    });
  } catch (error) {
    console.log("Server Start Error");
    console.log(error);
  }
})();