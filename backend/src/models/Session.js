// import mongoose from "mongoose";

// const sessionSchema = new mongoose.Schema(
//   {
//     problem: {
//       type: String,
//       required: true,
//     },
//     difficulty: {
//       type: String,
//       enum: ["easy", "medium", "hard"],
//       required: true,
//     },
//     host: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     participant: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null,
//     },
//     status: {
//       type: String,
//       enum: ["active", "completed"],
//       default: "active",
//     },
//     // stream video call ID
//     callId: {
//       type: String,
//       default: "",
//     },
//   },
//   { timestamps: true }
// );

// const Session = mongoose.model("Session", sessionSchema);

// export default Session;





import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    problem: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
    // stream video call ID
    callId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// ================= PERFORMANCE INDEXES =================

// For: Session.find({ status: "active" }).sort({ createdAt: -1 })
sessionSchema.index({ status: 1, createdAt: -1 });

// For: host-based queries (my sessions)
sessionSchema.index({ host: 1 });

// For: participant-based queries
sessionSchema.index({ participant: 1 });

const Session = mongoose.model("Session", sessionSchema);

export default Session;