import UserModel from "../Models/userModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

  
//get all user
export const getAllUsers = async (req, res) => {

    try {
      let users = await UserModel.find();
      users = users.map((user)=>{
        const {password, ...otherDetails} = user._doc
        return otherDetails
      })
      res.status(200).json(users);
     
    } catch (error) {
      res.status(500).json(error);
    }
  };

//get a user
export const getUser=async(req,res)=>{
    const id=req.params.id;

    try{
        const user=await UserModel.findById(id);

        if(user){
            
            //it will take out the password from it and only show the rest
            const {password,...otherDetails}=user._doc

            res.status(200).json(otherDetails);
        } 
        else{
            res.status(400).json("NO such User exist");
        }   
    }
    catch(error){
        res.status(500).json(error.message);
    }
};



//update a user
export const updateUser=async(req,res)=>{
    const id=req.params.id;
    const {_id,currentUserAdminStatus,password}=req.body


    //both the self and admin can only update
    if(id===_id )
    {
        try{
          

            if(password){
                const salt=await bcrypt.genSalt(10);
                req.body.password=await bcrypt.hash(password,salt)

            }

            //info which we want to update in req  and id is used to search who is to updated and true it will return the update useer in response
            const user=await UserModel.findByIdAndUpdate(id,req.body,{new:true})

            const token=jwt.sign(
                {username:user.username,id:user._id},
                process.env.JWT_KEY,{expiresIn:'1h'}
            );

            res.status(200).json({user,token})
        } catch (error) {
            res.status(500).json(error.message);
        }
    }
    else{
        res.status(403).json("Access Denied! you can only update your own profile")
    }
}


//delete User
export const deletUser=async(req,res)=>{
     //url se id le leta hai
     const id=req.params.id;

     const {currentUserId,currentUserAdminStatus}=req.body;

     if(currentUserId ===id || currentUserAdminStatus){

        try {
             await UserModel.findByIdAndDelete(id);
             res.status(200).json("uSer deleted successfully");
        } catch (error) {
            res.status(500).json(error.message);
        }
     }
     else{
        res.status(403).json("Access deined ! you can only delte your own profile");
     }
}
   


//follow a User
export const followUser=async(req,res)=>{
    //yeah vo hai jo ki follow hone wala hai
    const id=req.params.id;


    //yeah vo hai jo ki usko follow kerna chata hai
    const {_id}=req.body;

    //koi kud ko follow kerna chata hai
    if(_id === id)
    {
        res.status(403).json("Action forbidden you can not follow your self");
    }
    else{
        try {
            //yeah vo hai jisko hum follow kerna chate hai new temp user is create to acess data
            const followUser=await UserModel.findById(id);

            //yeah vo hai jo uper vale ko follow kerna chata hai
           const followingUser=await UserModel.findById(_id);
            
           //yani ki ager followUser ki id me hum nhi hai to 
           if(!followUser.followers.includes(_id))
           {
               //jisko follow kena chate hai use me update ho gya hai
                await followUser.updateOne({$push :{followers:_id}})
                
                //ab apni bari
                await followingUser.updateOne({$push:{following:id}})

                res.status(200).json("User followed");
           }
           else{
            res.status(403).json("User is Already followed by you")
           }

        } catch (error) {
            res.status(500).json(error.message);
        }
    }
}


//unfollow a user
export const UnFollowUser=async(req,res)=>{
    //yeah vo hai jo ki follow hone wala hai
    const id=req.params.id;


    //yeah vo hai jo ki usko follow kerna chata hai
    const {_id}=req.body;

    //koi kud ko follow kerna chata hai
    if(_id === id)
    {
        res.status(403).json("Action forbidden you can not follow your self");
    }
    else{
        try {
            //yeah vo hai jisko hum follow kerna chate hai new temp user is create to acess data
            const followUser=await UserModel.findById(id);

            //yeah vo hai jo uper vale ko follow kerna chata hai
           const followingUser=await UserModel.findById(_id);
            
           //yani ki ager followUser ki id me hum  hai to uske me
           if(followUser.followers.includes(_id))
           {
               //jisko follow kena chate hai use me update ho gya hai
                await followUser.updateOne({$pull :{followers:_id}})
                
                //ab apni bari
                await followingUser.updateOne({$pull:{following:id}})

                res.status(200).json("User Unfollowed");
           }
           else{
            res.status(403).json("User is not  followed by you")
           }

        } catch (error) {
            res.status(500).json(error.message);
        }
    }
}