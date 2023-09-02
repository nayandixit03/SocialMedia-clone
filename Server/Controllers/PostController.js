import PostModel from "../Models/postModel.js";


import mongoose from "mongoose";
import UserModel from "../Models/userModel.js";


//create a new Post
export const createPost=async(req,res)=>{

    const newPost=new PostModel(req.body);

    try {
        await newPost.save();
        res.status(200).json(newPost);
    } catch (error) {
         res.status(500).json(error.message);
    }
}


//get a post
export const getPost=async(req,res)=>{

    const id=req.params.id

    try {
        const post=await PostModel.findById(id);

      res.status(200).json(post)    

    } catch (error) {
        res.status(500).json(error.message);
    }
}

//update a post
export const updatePost=async(req,res)=>{
    //yeah vo hai jo post update kerni hai
    const postId=req.params.id;

    //yeah vo hai jo ki user ki id hai jis update kerni hai
    const {userId}=req.body;

    try {

        //yeah post nikal ke dega
        const post=await PostModel.findById(postId);

        //validation ki jo post me id hai vo same hai req me id hai taki ko or nhi change ker sake
        if(post.userId===userId)
        {
            await post.updateOne({$set:req.body})
            res.status(200).json("Post Update")

        }
        else{
            res.status(403).json("Action forbidden beacuse user is not valid")
        }
        
    } catch (error) {
        res.status(500).json(error.message);
    }
}



//delete a post
export const deletePost=async(req,res)=>{
    //yeah id hai post ki
    const id=req.params.id;
   
    //yeah hai user ki id 
    const {userId}=req.body;

    try {
        const post=await PostModel.findById(id);

        if(post.userId === userId)
        {
             await post.deleteOne();
             res.status(200).json("Post deleted successfyllly");
        }
        else{
            res.status(403).json("Action forbidden beacuse user is not valid")
        }
        
    } catch (error) {
        res.status(500).json(error.message);
    }
}


//likes and dislike of the post
export const likePost=async(req,res)=>{
    const id=req.params.id
    const {userId}=req.body

    try {
        const post=await PostModel.findById(id)
         
        //if current userid is not present in the like arrya of the post
        if(!post.likes.includes(userId))
        {
            await post.updateOne({$push:{likes:userId}})
            res.status(200).json("Post liked");
        }
        else{
            //this will dislike the post
            await post.updateOne({$pull :{likes:userId}})
            res.status(200).json("Post is unliked");

        }
    } catch (error) {
        res.status(500).json(error.message);
    }
}

//doubt hai check kerna 1hr 58min pe
//get timeline post mere shab se story jesa it mean ki kudiki post and those whom he/she is following
export const getTimelinePosts = async (req, res) => {
    const userId = req.params.id
    try {
      const currentUserPosts = await PostModel.find({ userId: userId });
  
      const followingPosts = await UserModel.aggregate([
        { 
          $match: {
            _id: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: "posts",
            localField: "following",
            foreignField: "userId",
            as: "followingPosts",
          },
        },
        {
          $project: {
            followingPosts: 1,
            _id: 0,
          },
        },
      ]);
  
      res.status(200).json(
        currentUserPosts
          .concat(...followingPosts[0].followingPosts)
          .sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          })
      );
    } catch (error) {
      res.status(500).json(error);
    }
  };