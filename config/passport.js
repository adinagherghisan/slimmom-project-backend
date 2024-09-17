const passport = require("passport");
const passportJWT = require("passport-jwt");
const User = require("../models/user");
require("dotenv").config();

const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const secret = process.env.SECRET_KEY;

const params = {
  secretOrKey: secret,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
};

module.exports = passport => {
  passport.use(
    new Strategy(params, async (payload, done) => {
      try {
        const user = await User.findById(payload.id);
        if (user) {
          console.log('User found:', user);
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    })
  );
};