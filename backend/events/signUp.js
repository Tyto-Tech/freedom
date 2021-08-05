const users = require('../models/user'),
  { nanoid } = require('nanoid'),
  log = require('../utils/logging'),
  fs = require('fs'),
  emailChecker = require('email-check');

module.exports = (socket) => {
  // On the socket event: signUp, run a function
  socket.on(
    'signUp',
    async ({ email, password, username, name, pfp }, callback) => {
      // If the callback is undefined, or isn't a function, make it an empty function
      callback = typeof callback === 'function' ? callback : () => {};

      // If any of the required arguments don't exist, return an error
      if (!name || !username || !email || !password)
        return callback({
          message: 'Missing Required Arguments!',
          created: false
        });

      username = username.replace(/\</g, '&lt;');
      pfp =
        pfp ||
        fs.readFileSync(`${__dirname}/../../frontend/images/watermelon.png`, {
          encoding: 'base64'
        });
      identifier = nanoid(4);

      // Find a user with the provided email, then run a function with the user
      await users.findOne(
        {
          identifier,
          username
        },
        async (err, data) => {
          // If the user exists, return an error
          if (data)
            return callback({
              message: `Email Is Already Connected To An Account!`,
              created: false
            });

          // If there is an error, return the error
          if (err)
            return callback({
              message: err,
              created: false
            });

          // If the user doesn't exit, create the user with the info provided
          if (!data) {
            if (
              (await emailChecker(email, {
                from: 'email-check@freedomapp.cc'
              })) === false
            ) {
              return callback({
                created: false,
                message: "Email Doesn't Work!"
              });
            }

            const user = await users.create({
              name,
              username,
              email,
              password,
              pfp,
              id: nanoid(64),
              codename: `${username}#${identifier}`,
              identifier,
              userid: (await users.countDocuments({}).exec()) + 1
            });

            callback({
              message: 'User Successfully Created.',
              created: true,
              user
            });

            log.info(`Created User: ${user.username}`);
          }
        }
      );
    }
  );
};
