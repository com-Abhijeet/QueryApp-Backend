import queryModel from "../model/queryModel.js";
import userModel from "../model/userModel.js";
import { extractKeywords } from "../utils/extractKeywords.js";
import { addRelatedQueriesToUsers } from "../utils/addRelatedQueriesToUsers.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

export const addQuery = async (req, res) => {
  try {
    const { query, userId, image } = req.body;

    if (!query || !userId) {
      return res.status(400).json({ message: 'Query and userId are required.' });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Extract keywords from the query
    const keywords = extractKeywords(query);

    let imageUrl = '';
    if (image) {
      imageUrl = await uploadToCloudinary(image);
    }

    const newQuery = new queryModel({
      query,
      createdBy: userId,
      status: 'Active',
      keywords, // Add the extracted keywords to the query document
      imageUrl, // Add the image URL to the query document
    });

    const savedQuery = await newQuery.save();

    // Add related queries to users
    await addRelatedQueriesToUsers(savedQuery._id, keywords, userId);

    return res.status(201).json({ message: 'Query added successfully', query: savedQuery });
  } catch (error) {
    console.error('Error adding query:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getUserQueries = async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      const queries = await queryModel.find({ createdBy: userId, status: "Active" }).populate('createdBy', 'name email');
      console.log(queries);
      return res.status(200).json({ queries });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
};
export const getUserRelatedQueries = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await userModel.findById(userId).populate({
      path: 'relatedQueries.query',
      select: 'query status createdBy createdAt imageUrl',
      populate: {
        path: 'createdBy',
        select: 'id name'
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Sort relatedQueries by createdAt in descending order
    const sortedRelatedQueries = user.relatedQueries.sort((a, b) => {
      return new Date(b.query.createdAt) - new Date(a.query.createdAt);
    });

    return res.status(200).json({ relatedQueries: sortedRelatedQueries });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};