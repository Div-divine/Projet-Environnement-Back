
async function joinUsersWithGroups(req, res, next) {
    try {
        const userId = req.params.id;
        if(!userId){
            return res.status(404).json({message: 'No user found'})
        }
        next();
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export default joinUsersWithGroups;
