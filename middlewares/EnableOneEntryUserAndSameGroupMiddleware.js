import UsersGroups from "../model/UsersAndGroups.js";

function enableOneUserInSameGroup(req, res, next){
    const {userId, groupId} = req.body
    const exists = UsersGroups.CheckUserAlreadyExistsInAGroup(userId, groupId);
    if(exists){
        return res.status(404).json({ status: 404, message: 'User Already linked to group' });
    }
    next();
}

export default enableOneUserInSameGroup;