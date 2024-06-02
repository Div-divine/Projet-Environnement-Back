import UsersGroups from "../model/UsersAndGroupsModel.js";

function enableOneUserInSameGroup(req, res, next){
    const {userId, groupId} = req.body
    const exists = UsersGroups.CheckUserAlreadyExistsInAGroup(userId, groupId);
    console.log('Existing rows:', exists)
    if(exists.count && exists.quit == 0 ){
        return res.status(404).json({ status: 404, message: 'User Already linked to group' });
    }
    next();
}

export default enableOneUserInSameGroup;