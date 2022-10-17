const express = require("express");
const passport = require("passport");

const Web3Strategy = require("passport-dapp-web3");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const users = [];

/**
 * Called when authorization succeeds. Perform any additional verification here,
 * and either return the user's data (if valid), or deny authorization by
 * passing an error to the `done` callback.
 */
const onAuth = (address, done, req, params) => {
  // signature successful
  // find user if exists, then login

  // if not, create new account

  // return login result
  req.res.send({
    address: req.body.address,
    client_sig: req.body.signed,
    server_sig: params.signed
  });

  // optional additional validation. To deny auth:
  // done(new Error('User is not authorized.'));
  // User.findOne({ address }, (err, user) => done(err, user));
};

let id = 0;
passport.use(new Web3Strategy({
      addressField: 'address',
      messageField: 'msg',
      signedField: 'signed',
      session: false
    },
    function (address, message, signed, done) {
      let ethUser = users.find(e => e.address === address);
      if (ethUser) {
        console.log("Return existing user")
        return done(null, ethUser);
      } else {
        console.log("Created New User")
        let newUser = {
          id: id++,
          address,
          message,
          signed,
        };
        users.push(newUser)
        return done(null, newUser);
      }
    }
));

// Create a new Express application.
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(passport.initialize({}));
app.use(cors());

let authenticate = (req, res, next) => {
  passport.authenticate('web3', {}, (info, user, error) => {
    console.log({info, user, error})
    if (error) return next(error)
    if (user) {
      const token = jwt.sign(user, 'your_jwt_secret')
      return res.json({user, token})
    } else {
      return res.status(422).json(info)
    }
  })(req, res, next);
}

console.log({authenticate})

app.post('/login', authenticate);

app.listen(port, () => console.log(`Listening on port ${port}`));
