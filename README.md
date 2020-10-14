# Vulcan Verify Email
A vulcan package that handles email verification.

This package is a combination of 2 parts of vulcan that already exist.

1. The server side part is here: https://github.com/VulcanJS/Vulcan/blob/devel/packages/vulcan-users/lib/server/AuthPassword.js#L302
2. The client side part is here: https://github.com/VulcanJS/Vulcan/blob/cdb0d7da18e59395b56239f3c1d41bcd301eb155/packages/vulcan-accounts/imports/ui/components/VerifyEmail.jsx

By making it a standalone package, it gives more control of the verification mutation in your own app. For example, you could modify it to add users to a new group. Details on that below:

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
