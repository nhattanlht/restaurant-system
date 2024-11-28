const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/user.model");

module.exports = function (passport) {
    passport.use(
        "local-login",
        new LocalStrategy(
            { usernameField: "email" },
            async (email, password, done) => {
                try {
                    const user = await User.findOne({ email });

                    if (!user) {
                        return done(null, false, { message: "Invalid email or password" });
                    }

                    const isMatch = await bcrypt.compare(password, user.password);
                    if (!isMatch) {
                        return done(null, false, { message: "Invalid email or password" });
                    }

                    return done(null, user);
                } catch (err) {
                    return done(err);
                }
            }
        )
    );

    passport.use(
        "local-register",
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "password",
                passReqToCallback: true,
            },
            async (req, email, password, done) => {
                try {
                    const { username, confirm_password } = req.body;

                    if (password !== confirm_password) {
                        return done(null, false, { message: "Passwords do not match" });
                    }

                    const existingUser = await User.findOne({ email, username });
                    if (existingUser) {
                        return done(null, false, {
                            message: "Email or username already registered",
                        });
                    }

                    const user = await User.createUser({
                        username,
                        email,
                        password,
                    });

                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
};