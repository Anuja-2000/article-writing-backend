const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema(
  {
    articleId: {
      type: String,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      require: true,
    },
    content: {
      type: String,
      require: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    userId: {
      /*type: mongoose.Schema.Types.ObjectId, // Reference to the User schema*/
      type: String,
      require: true,
    },
    status: {
      type: String,
      // pending, approved, rejected
      default: "Not Sent for Approval",
    },
    savedType: {
      type: String, // draft, saved, trashed, deleted
    },
    viewCount:{
      type: Number,
      default: 0,
    },
    keyWords:{
      type: String,
      default: "",
    },
    domain:{
      type: String,
    },
    coverImage: {
      type: String,
      default: "https://ibb.co/kyj3PN8",
    },
    image1: {
      type: String,
      default: "https://picsum.photos/500/300?random=2",
    },
    image2: {
      type: String,
      default: "https://picsum.photos/500/300?random=3",
    },
    image3: {
      type: String,
      default: "https://picsum.photos/500/300?random=4",
    },
    image4: {
      type: String,
      default: "https://picsum.photos/500/300?random=5",
    },
    image5: {
      type: String,
      default: "https://picsum.photos/500/300?random=6",
    },
  },
  { timestamps: true },
  { collection: "article" }
);

module.exports = mongoose.model("Article", ArticleSchema);
