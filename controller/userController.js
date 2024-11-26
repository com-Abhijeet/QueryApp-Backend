import userModel from "../model/userModel.js";
import { hashPassword, comparePassword } from "../utils/passwordutils.js";
import { generateToken } from "../utils/tokenUtils.js";

/*
1.Collect Data from request,
2. Validate the data
3. Check if User exists,
4. Hash Password if new user
5. Save User
*/ 
export const registerUser = async(req,res)=>{
    try{
        const {
            name,
            email,
            password,
            contact,
            tags
        } = req.body

        if(!name || !email || !password || !contact ){
            return res.status(400).json({message: "Please fill in all fields."})
        }

        const isUser = await userModel.findOne({email : email});
        if(isUser){
            return res.status(400).json({message: "User already exists"})
        }

        const hashedPassword = await hashPassword(password);
        const normalizedTags = tags.map(tag => tag.toLowerCase());

        const user = new userModel({
            name,
            email,
            password : hashedPassword,
            contact,
            tags : normalizedTags
        });

        await user.save();

        return res.status(201).json({
            message : "User registered successfully", 
            user
        })

    }catch(error){
        console.log("error in registering user : ", error);
        return res.status(500).json({
            message : "Internal Server Error",
        })

    }
}
/*
1. Collect data from request
2. Check if user exists
3. compare passswords
4. generate token
5. login user
*/
export const loginUser = async (req, res) => {
    console.log("Login Request Received");
    try {
        const { email, password } = req.body;
        console.log("Email from request body:", email);

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        const isUser = await userModel.findOne({ email });
        console.log("User found:", isUser);

        if (!isUser) {
            return res.status(400).json({ message: "User does not exist" });
        }

        const isMatch = await comparePassword(password, isUser.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = generateToken(isUser.name, email);

        return res.status(200).json({
            message: "Logged in successfully",
            user: {
                id: isUser._id,
                name: isUser.name,
                email: isUser.email,
                contact: isUser.contact,
                tags: isUser.tags,
                created_at: isUser.created_at,
            },
            token,
        });
    } catch (error) {
        console.log("Error in logging in user:", error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};