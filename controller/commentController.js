const Comment = require('../model/commentSchema')

const saveComment=(req,resp)=>{
    const commentDto = new Comment({
       comId:req.body.comId,
       commentorName:req.body.commentorName,
       commentContent:req.body.commentContent,
       time:req.body.time,
       profilePic:req.body.profilePic,
       artId:req.body.artId,
    });
    commentDto.save().then(result=>{
        resp.status(201).json(result);
    }).catch(error=>{
        resp.status(500).json(error);
    });
}
const updateComment=(req,resp)=>{
    Comment.updateOne({comId:req.body.comId},{
       commentContent:req.body.commentContent,
    }).then(result=>{
        resp.status(201).json(result);
    }).catch(error=>{
        resp.status(500).json(error);
    });
}
const getComment=(req,resp)=>{
    Comment.find({artId:req.headers.id}).then(result=>{
        resp.status(200).json(result);
    }).catch(error=>{
       resp.status(500).json(error);
    });

}
const deleteComment=(req,resp)=>{
    Comment.deleteOne({comId:req.headers.id}).then(result=>{
        resp.status(200).json(result);
    }).catch(error=>{
        resp.status(500).json(error);
    });
}
const getAllComment=(req,resp)=>{
    Comment.find().then(result=>{
        resp.status(200).json(result);
    }).catch(error=>{
        resp.status(500).json(error);
    });
}

const searchComment=(req,resp)=>{
    Comment.find({
        $or: [
            {comId:{$regex:req.headers.text, $options:'i' }},
            {commentorName:{$regex:req.headers.text, $options:'i' }},
            {commentContent:{$regex:req.headers.text, $options:'i' }},
            {artId:{$regex:req.headers.text, $options:'i' }}
        ]
    }).then(result=>{
        resp.status(200).json(result);
    }).catch(error=>{
        resp.status(500).json(error);
    });
}

module.exports= {
    saveComment,
    updateComment,
    deleteComment,
    getComment,
    getAllComment,
    searchComment
}