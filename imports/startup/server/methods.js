Meteor.methods({
  sendPasswordResetLink: email => {
    const user = Accounts.findUserByEmail(email);
    if (user) {
      Accounts.sendResetPasswordEmail(user._id);
    } else {
      throw new Error();
    }
  }
});
