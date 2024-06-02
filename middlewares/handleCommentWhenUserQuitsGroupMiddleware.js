function updateCommentsOfUserQuitGroup(req, res, next){
    try{
        const groupId = req.params.id
        const userId = req.body.userId

        if(!groupId){
            res.status(404).json({message: 'Error getting group '})
        }
        if(!userId){
            res.status(404).json({message: 'User not found'})
        }
        next();

    }catch(error){
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export default updateCommentsOfUserQuitGroup;