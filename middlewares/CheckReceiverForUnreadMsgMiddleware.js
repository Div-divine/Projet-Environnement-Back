function checkReceiverAndMsgState (req, res, next){
    try{
        const receiverId = req.params.id;
        if(!receiverId){
            res.status(404).json({message: 'No receiver found'});
        }

        next();
    }catch(error){

    }
}

export default checkReceiverAndMsgState;