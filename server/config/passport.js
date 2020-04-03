const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const UserModel = require("../models/UserModel");

const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const jwtSecret = require("./jwt").secret;

passport.use(
    "register",
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await UserModel.findOne({ username });

            if (user) {
                return done(null, false, {
                    message: "usedUsername"
                });
            }

            UserModel.create({ username, password }).then(user => {
                done(null, user, { message: "success" });
            });
        } catch (err) {
            done(err);
        }
    })
);

passport.use(
    "login",
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await UserModel.findOne({ username });

            if (!user) {
                return done(null, false, {
                    message: "notRegistered"
                });
            }

            const compare = await user.validatePassword(password);
            if (!compare) {
                return done(null, false, {
                    message: "incorrectPassword"
                });
            }

            //signing the token
            const tokenBody = { _id: user._id, username: user.username };
            const token = jwt.sign({ user: tokenBody }, jwtSecret);
            done(null, user, { message: "success", token });
        } catch (err) {
            done(err);
        }
    })
);

passport.use(
    new JWTStrategy(
        {
            secretOrKey: jwtSecret,
            jwtFromRequest: ExtractJWT.fromHeader("token")
        },
        (jwt_payload, done) => {
            try {
                done(null, jwt_payload.user);
            } catch (err) {
                done(err);
            }
        }
    )
);
