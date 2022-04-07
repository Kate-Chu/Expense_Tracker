const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const FacebookStrategy = require("passport-facebook").Strategy;

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passReqToCallback: true },
      async (req, email, password, done) => {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, req.flash("error", "信箱或密碼不正確"));
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, req.flash("error", "信箱或密碼不正確"));
        }
        return done(null, user);
      }
    )
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ["email", "displayName"],
      },
      async (accessToken, refreshToken, profile, done) => {
        const { name, email } = profile._json;
        const user = await User.findOne({ email });

        if (user) return done(null, user);

        const randPassword = Math.random().toString(36).slice(-8);
        const hashPassword = await bcrypt.hash(randPassword, 10);
        const newUser = await User.create({
          name,
          email,
          password: hashPassword,
        });
        return done(null, newUser);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then((user) => done(null, user))
      .catch((err) => done(err, null));
  });
};
