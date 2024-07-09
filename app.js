const express = require("express");
const mongoose = require("mongoose");

const app = express();
const UserRoute = require('./route/userRoute');
const ContactMessageRoute = require('./route/contactMessageRoute');
const topicDomainRoute = require('./route/topicDomainRoute');
const topicRoutes = require('./route/topicRoute');
const keywordRoutes = require('./route/keywordRoute');
const readerArticle = require('./route/readerArticleRoute');
const comment = require('./route/commentRoute');
const flaggedTopicRoute = require('./route/flaggedTopicRoute')
const article = require('./route/articleRoute')
const fileRoutes = require('./route/fileRoutes')
const userUtilRoute = require('./route/userUtilRoute')
const auth = require('./middleware/auth');
const admin = require('./middleware/admin');
const authRoutes = require('./route/authRoutes');
const followRoutes = require('./route/followRoute');
const viewRoutes = require('./route/viewRoutes');
const likeRoutes = require('./route/likeRoutes');
const reportedArticle = require('./route/reportedArticleRoute');
const approvalRoutes = require('./route/articleApprovalRoute');
const reportedWriter = require('./route/reportedWriterRoute');
const deactivatedWriter = require('./route/deactivatedWriterRoute');
const rejectedArticle= require('./route/rejectedArticleRoute');
const notificationRoute = require('./route/notificationsRoute');
const articleDomainRoute = require('./route/articleDomainRoute');

const dotenv = require('dotenv');
dotenv.config();

const bodyParser = require('body-parser')

const PORT = 3001;
// Increase the payload size limit
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

var cors = require('cors');
app.use(cors());

mongoose.connect(process.env.URI)
  .then(() => {
    console.log("Successfully Connected to the MongoDB Database");
  })
  .catch(error => {
    console.log("MongoDB connection error", error);
  });


app.use('/api/auth', authRoutes);
app.use('/api/user', UserRoute); //http://localhost:3001/api/user
app.use ('/api/user-util', auth, admin, userUtilRoute);
app.use('/api/contactMessage', ContactMessageRoute);

app.use('/api/topicDomains', auth, topicDomainRoute);

app.use('/api/topics',auth, topicRoutes);
app.use('/api/keywords', auth, keywordRoutes);
app.use('/api/readerArticle', readerArticle);
app.use('/api/comment', comment);
app.use('/api/reportArticle', auth, reportedArticle);
app.use('/api/reportedWriter', auth, reportedWriter);
app.use('/api/deactivatedWriter', auth, deactivatedWriter);
app.use('/api/rejectedArticle',auth,  rejectedArticle);
app.use('/api/flaggedTopics', flaggedTopicRoute);
app.use('/api/article', auth, article)
app.use('/api/file', fileRoutes)
app.use('/api/follow', followRoutes)
app.use('/api/like',likeRoutes)
app.use('/api/approval', auth, admin, approvalRoutes)
app.use('/api/notification', notificationRoute);
app.use('/api/view', viewRoutes)
app.use('/api/articleDomain',auth, articleDomainRoute);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

// Export the app instance
module.exports = app;


