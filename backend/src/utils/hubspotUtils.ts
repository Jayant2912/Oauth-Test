// import request from "request-promise-native";
// import { RequestPromiseOptions } from "request";
// import { UserModel } from "../models/UserModel";

// const CLIENT_ID = process.env.CLIENT_ID as string;
// const CLIENT_SECRET = process.env.CLIENT_SECRET as string;
// const PORT = process.env.PORT || 3000;
// const REDIRECT_URI = `http://localhost:${PORT}/oauth-callback`;

// // Exchange authorization code for tokens and save them to MongoDB
// export const exchangeForTokens = async (userId: string, code: string) => {
//   const tokenUrl = "https://api.hubapi.com/oauth/v1/token";
//   const options: RequestPromiseOptions = {
//     form: {
//       grant_type: "authorization_code",
//       client_id: CLIENT_ID,
//       client_secret: CLIENT_SECRET,
//       redirect_uri: REDIRECT_URI,
//       code,
//     },
//   };

//   try {
//     const response = await request.post(tokenUrl, options);
//     const tokens = JSON.parse(response);

//     // Get the contact details using the access token
//     const contact = await getContact(tokens.access_token);

//     // Save or update the user in MongoDB
//     const user = await UserModel.findOneAndUpdate(
//       { email: contact.properties.email.value }, // Use email as unique identifier
//       {
//         firstName: contact.properties.firstname.value,
//         lastName: contact.properties.lastname.value,
//         refreshToken: tokens.refresh_token,
//         accessToken: tokens.access_token,
//       },
//       { new: true, upsert: true } // Upsert if user doesn't exist
//     );

//     return tokens.access_token;
//   } catch (error) {
//     // Handle errors during token exchange
//     return JSON.parse(error.response.body);
//   }
// };

// // Retrieve a contact from HubSpot using the access token
// export const getContact = async (accessToken: string) => {
//   const headers = {
//     Authorization: `Bearer ${accessToken}`,
//     "Content-Type": "application/json",
//   };

//   try {
//     const response = await request.get(
//       "https://api.hubapi.com/contacts/v1/lists/all/contacts/all?count=1",
//       { headers }
//     );
//     return JSON.parse(response).contacts[0]; // Return the first contact
//   } catch (error) {
//     throw new Error("Failed to fetch contact from HubSpot");
//   }
// };

// // Generate the HubSpot authorization URL
// export const getAuthUrl = (): string => {
//   const scopes = "crm.objects.contacts.read"; // Add additional scopes if needed
//   return `https://app.hubspot.com/oauth/authorize?client_id=${CLIENT_ID}&scope=${encodeURIComponent(
//     scopes
//   )}&redirect_uri=${REDIRECT_URI}`;
// };
import request from "request-promise-native";
import { UserModel } from "../models/UserModel";

const CLIENT_ID = process.env.CLIENT_ID as string;
const CLIENT_SECRET = process.env.CLIENT_SECRET as string;
const PORT = process.env.PORT || 3000;
const REDIRECT_URI = `http://localhost:${PORT}/oauth-callback`;

// Exchange authorization code for tokens and save them to MongoDB
export const exchangeForTokens = async (userId: string, code: string) => {
  const tokenUrl = "https://api.hubapi.com/oauth/v1/token";
  const options = {
    form: {
      grant_type: "authorization_code",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      code,
    },
  };

  try {
    const response = await request.post(tokenUrl, options);
    const tokens = JSON.parse(response);

    // Get the contact details using the access token
    const contact = await getContact(tokens.access_token);

    // Save or update the user in MongoDB
    const user = await UserModel.findOneAndUpdate(
      { email: contact.properties.email.value }, // Use email as unique identifier
      {
        firstName: contact.properties.firstname.value,
        lastName: contact.properties.lastname.value,
        refreshToken: tokens.refresh_token,
        accessToken: tokens.access_token,
      },
      { new: true, upsert: true } // Upsert if user doesn't exist
    );

    return tokens.access_token;
  } catch (error: any) {
    // Handle errors during token exchange
    return JSON.parse(error.response.body);
  }
};

// Retrieve a contact from HubSpot using the access token
export const getContact = async (accessToken: string) => {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await request.get(
      "https://api.hubapi.com/contacts/v1/lists/all/contacts/all?count=1",
      { headers }
    );
    return JSON.parse(response).contacts[0]; // Return the first contact
  } catch (error) {
    throw new Error("Failed to fetch contact from HubSpot");
  }
};

// Generate the HubSpot authorization URL
export const getAuthUrl = (): string => {
  const scopes = "crm.objects.contacts.read"; // Add additional scopes if needed
  return `https://app.hubspot.com/oauth/authorize?client_id=${CLIENT_ID}&scope=${encodeURIComponent(
    scopes
  )}&redirect_uri=${REDIRECT_URI}`;
};
