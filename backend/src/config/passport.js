import 'dotenv/config';
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import User from "../models/User.js";

console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
  $or: [
    { googleId: profile.id },
    { email: profile.emails[0].value }
  ]
});

if (!user) {
  user = await User.create({
    name: profile.displayName,
    email: profile.emails[0].value,
    googleId: profile.id,
    isVerified: true
  });
} else if (!user.googleId) {
  user.googleId = profile.id;
  await user.save();
}


        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
