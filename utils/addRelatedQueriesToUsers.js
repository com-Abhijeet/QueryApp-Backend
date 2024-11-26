import userModel from "../model/userModel.js";
import queryModel from "../model/queryModel.js";

export const addRelatedQueriesToUsers = async (queryId, keywords, userId) => {
    try {
      console.log("Starting addRelatedQueriesToUsers");
      console.log("Query ID:", queryId);
      console.log("Keywords:", keywords);
      console.log("User ID:", userId);
  
      // Find users whose tags match the extracted keywords, excluding the user who created the query
      const matchingUsers = await userModel.find({ tags: { $in: keywords }, _id: { $ne: userId } });
      console.log("Matching Users:", matchingUsers);
  
      // Update the relatedQueries field of the matching users
      await Promise.all(
        matchingUsers.map(async (matchingUser) => {
          console.log("Processing user:", matchingUser.email);
  
          if (!matchingUser.relatedQueries) {
            matchingUser.relatedQueries = [];
          }
  
          // Check if the query ID already exists in relatedQueries
          const queryExists = matchingUser.relatedQueries.some((relatedQuery) => relatedQuery.query.equals(queryId));
          console.log("Query Exists:", queryExists);
  
          if (!queryExists) {
            matchingUser.relatedQueries.push({ query: queryId });
            await matchingUser.save();
            console.log("Updated relatedQueries for user:", matchingUser.email);
          } else {
            console.log("Query ID already exists in relatedQueries for user:", matchingUser.email);
          }
        })
      );
    } catch (error) {
      console.error("Error updating related queries:", error);
    }
  };