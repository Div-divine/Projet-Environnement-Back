
function checkIfIdAdded(req, res, next) {
    const userId = req.params.id;

    if (userId) {
        // ID exists in the params
        next(); // Proceed to the next middleware
    } else {
        // ID does not exist in the params
        res.status(400).json({ error: "No user ID provided" });
    }
}

export default checkIfIdAdded;