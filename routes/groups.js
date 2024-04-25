import { Router } from 'express';
import Groups from '../model/groupsModel.js';
import verifyToken from '../middlewares/webtokenMiddleware.js';
import getGroupById from '../middlewares/GetGroupByIdMiddleware.js';

const router = Router();

router.get('/', verifyToken, async (req, res) => {
    try {
        const groupsData = await Groups.selectAllFromGroups();
        if (!groupsData) {
            return res.status(404).json({ message: 'No groups found' });
        }
        res.json(groupsData);
    } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:id', getGroupById, verifyToken, async (req, res) => {
    try{
        const groupId = req.params.id;
        const groupData = await Groups.SelectOneFromGroups(groupId);
        if(!groupData){
            return res.status(404).json({ message: 'No groups found' });
        }
        // Return user details
        res.status(200).json(groupData);

    }catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


export default router;