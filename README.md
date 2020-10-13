# Vulcan Verify Email
A vulcan package that handles email verification

## How it works

Install this package like other vulcan packages. Once it's installed, it'll send an email verification email to new members that sign up.

This is triggered in `/lib/modules/parameters.js`. It hooks into the user create callback, and uses Accounts package to send the email:

```
async function sendVerificationEmail({ document: user }) {
Accounts.sendVerificationEmail(user._id);
}

addCallback('user.create.async', sendVerificationEmail);
```

When the new member opens the email, they'll find a link that directs to `/verify-email/jaiejgiaerjgpaie`. That `verify-email/key`route is set in the `routes.js`

The component `VerifyEmal.jsx` calls a graphql mutation to check if the email key is valid. See that mutation in `modules/mutations.jsx` - it was pretty much copied form the `AuthPassword.js` in the Vulcan Users package!

## Modify it!

You can modify the mutation to add the user to a new group, such as verifiedMembers. 

The component at the route is just plain text, so you might want to copy that to your own package and customise it so it looks nice.
