const {OAuth2Client} = require('google-auth-library');

const CLIENT_ID = '495155214494-gjblj1or2u9u0hlumsfs8i8lbpoc73ua.apps.googleusercontent.com'


const client = new OAuth2Client(CLIENT_ID);

const validarGoogleIdToken = async ( token ) => {

    try {
        
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: [
                CLIENT_ID,
                '495155214494-1rbpkqkismditme2iqb19b1aiverma23.apps.googleusercontent.com',
              ]  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
    
        const userid = payload['sub'];
        // If the request specified a Google Workspace domain:
        // const domain = payload['hd'];
    
        return {
            name: payload['name'],
            picture: payload['picture'],
            email: payload['email'],
        }

    } catch (error) {
        return console.log(error);
    }

    
}


module.exports = {
    validarGoogleIdToken,
}