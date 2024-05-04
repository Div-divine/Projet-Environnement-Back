function checkPostUpdate(req, res, next){
    try {
    const postId = req.params.id;
    const postContent = req.body;
    if(!postId && postContent){
        return res.status(404).json({ status: 404, message: 'Post not found' });
    }
    if(!postId){
        return res.status(404).json({ status: 404, message: 'Error getting post Id' });
    }
    if(!postContent){
        return res.status(404).json({ status: 404, message: 'No content to update' });
    }
    next();
}catch (error){
     // Handle error
     console.error('Error updating post:', error);
     return res.status(500).json({ status: 500, message: 'Internal server error' });
}

}

export default checkPostUpdate;