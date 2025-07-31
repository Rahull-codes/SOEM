import projectModel from '../models/project.model.js';
import mongoose from 'mongoose';

export const createProject = async ( {
    name  , userId 

}) => {

    if(!name){
        throw new Error ('Name is required')
    }

    if(!userId){
        throw new Error ('Name is required')
    }

    const project = await projectModel.create({
        name,
        users: [userId]
    })

    return project ;
}

export const getAllProjectByUserId = async ({userId}) =>{
    if(!userId){
        throw new Error ('UserId is required')
    }

    const allUserProjects = await projectModel.find({
        users: userId,
    })

    return allUserProjects
}

export const addUserToProject = async ({ projectId, users , userId }) => {
    if (!projectId) {
        throw new Error("projectId is required");
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId");
    }

    if (!users || !Array.isArray(users)) {
        throw new Error("users must be an array");
    }

    for (const userId of users) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error(`Invalid userId: ${userId}`);
        }
    }

    if(!userId){
        throw new Error ("userId is required")
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid projectId");
    }


    const project = await projectModel.findOne({
        _id : projectId ,
        users : userId ,
    })

    if(!project){
        throw new Error ("User not belong to this project")
    }

    const updatedProject = await projectModel.findOneAndUpdate({
        _id : projectId
    }, {
        $addToSet:{
            users:{
                $each : users
            }
        }
    },{
        new : true,
    })

return updatedProject
}

export const getProjectById = async ({ projectId }) => {
    if (!projectId) {
        throw new Error("projectId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId")
    }

    const project = await projectModel.findOne({
        _id: projectId
    }).populate('users')

    return project;
}