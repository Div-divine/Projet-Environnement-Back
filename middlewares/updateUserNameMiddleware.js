import Users from "../model/usersModel.js";

async function updateUserName(req, res, next) {
    try {
        const userId = req.params.id;
        const newName = req.body.newName;
        const alreadyExistsName = await Users.ensureUpdateNameDoesNotAlreadyExists(newName, userId);
        
        if(alreadyExistsName.length > 0){
            return res.status(409).json({ error: "User name already exists" });
        }
        if (!userId) {
            return res.status(404).json({ error: "User not found" });
        }
        if (!newName) {
            return res.status(404).json({ error: "Enter a name to update" });
        }

        next();

    } catch (error) {
        console.error('Error updating user name:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export default updateUserName;