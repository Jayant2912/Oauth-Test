import { Request, Response } from 'express';
import { getAuthUrl, exchangeForTokens, getContact } from '../utils/hubspotUtils';
import { isAuthorized, getAccessToken } from '../utils/sessionUtils';

// Install the app by redirecting to HubSpot's OAuth page
export const installApp = (req: Request, res: Response) => {
  const authUrl = getAuthUrl();
  res.redirect(authUrl);
};

// Handle the OAuth callback, exchange the authorization code for tokens, and store them in MongoDB
export const handleOAuthCallback = async (req: Request, res: Response) => {
  if (req.query.code) {
    const authCode = req.query.code as string;
    const token = await exchangeForTokens(req.sessionID, authCode);

    if (token.message) {
      return res.redirect(`/error?msg=${token.message}`);
    }
    res.redirect('/');
  } else {
    res.redirect('/error?msg=No authorization code found');
  }
};

// Home route to check if the user is authenticated and show user information
export const home = async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/html');
  if (await isAuthorized(req.sessionID)) {
    const accessToken = await getAccessToken(req.sessionID);
    const contact = await getContact(accessToken!);
    res.write(`<h4>Access token: ${accessToken}</h4>`);
    res.write(`<p>Contact: ${contact.properties.firstname.value} ${contact.properties.lastname.value}</p>`);
  } else {
    res.write(`<a href="/install"><h3>Install the app</h3></a>`);
  }
  res.end();
};

// Handle errors
export const error = (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/html');
  res.write(`<h4>Error: ${req.query.msg}</h4>`);
  res.end();
};
