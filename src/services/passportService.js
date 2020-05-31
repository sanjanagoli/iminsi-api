import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user_model';

// options for local strategy, we'll use username AS the username
// not have separate ones
const localOptions = { usernameField: 'username' };

// options for jwt strategy
// we'll pass in the jwt in an `authorization` header
// so passport can find it there
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.AUTH_SECRET,
};
// NOTE: we are not calling this a bearer token (although it technically is), if you see people use Bearer in front of token on the internet you could either ignore it, use it but then you have to parse it out here as well as prepend it on the frontend.


// username + password authentication strategy
const localLogin = new LocalStrategy(localOptions, (username, password, done) => {
  // Verify this username and password, call done with the user
  // if it is the correct username and password
  // otherwise, call done with false
  console.log('in local login');
  // eslint-disable-next-line consistent-return
  User.findOne({ username }, (err, user) => {
    if (err) {
      return done(err);
    }

    if (!user) {
      return done(null, false);
    }

    // compare passwords - is `password` equal to user.password?
    user.comparePassword(password, (err, isMatch) => {
      if (err) {
        done(err);
      } else if (!isMatch) {
        done(null, false);
      } else {
        done(null, user);
      }
    });
  });
});

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  // is called with confirmed jwt we just need to confirm that user exits
  // See if the user ID in the payload exists in our database
  // If it does, call 'done' with that other
  // otherwise, call done without a user object
  User.findById(payload.sub, (err, user) => {
    if (err) {
      done(err, false);
    } else if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);


export const requireAuth = passport.authenticate('jwt', { session: false });
export const requireSignin = passport.authenticate('local', { session: false });
