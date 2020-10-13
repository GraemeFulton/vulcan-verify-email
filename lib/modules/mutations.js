import { addGraphQLResolvers, addGraphQLMutation } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';

//craete customer mutation
addGraphQLMutation('verifyUserEmail(token: String): JSON');


const resolver = {
    Mutation: {
        async verifyUserEmail(root, args, context) {

            // if (context && context.userId) {
            //     throw new Error('User already logged in');
            //   }
              const { input } = args;
              const { token } = args;
              if (!token) {
                throw new Error('Empty token');
              }
              return await verifyUserEmail(token);


        },

    },
};
addGraphQLResolvers(resolver);


/**
 * https://github.com/meteor/meteor/blob/devel/packages/accounts-password/password_server.js#L917
 * @param {*} email
 */
 const verifyUserEmail = async token => {
    const user = await Meteor.users.findOne(
      { 'services.email.verificationTokens.token': token },
      {
        fields: {
          services: 1,
          emails: 1,
        },
      }
    );
    if (!user) throw new Error('Verify email link expired or invalid');
    const userId = user._id;
  
    // check validity
    const tokenRecord = user.services.email.verificationTokens.find(t => t.token == token);
    if (!tokenRecord)
      return {
        userId: userId,
        error: new Error('Verify email link expired'),
      };
  
    // find user based on token email
    const emailsRecord = user.emails.find(e => e.address == tokenRecord.address);
    if (!emailsRecord) {
      return {
        userId: userId,
        error: new Error('Verify email link is for unknown address'),
      };
    }
  
    // By including the address in the query, we can use 'emails.$' in the
    // modifier to get a reference to the specific object in the emails
    // array. See
    // http://www.mongodb.org/display/DOCS/Updating/#Updating-The%24positionaloperator)
    // http://www.mongodb.org/display/DOCS/Updating#Updating-%24pull
    await Meteor.users.update(
      { _id: user._id, 'emails.address': tokenRecord.address },
      { $set: { 'emails.$.verified': true }, $pull: { 'services.email.verificationTokens': { address: tokenRecord.address } } }
    );
  
    return { userId: userId };
  };
