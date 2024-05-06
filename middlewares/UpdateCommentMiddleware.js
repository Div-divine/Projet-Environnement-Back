function checkUpdateComment(req, res, next){
    try{
        const commentId = req.params.id;
        const updateContent = req.body.updateContent;

        if(!commentId){
            res.status(404).json({message: 'Error getting comment to update'})
        }
        if(!updateContent){
            res.status(404).json({message: 'Error getting new content to update comment '})
        }
        next();

    }catch(error){
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export default checkUpdateComment;