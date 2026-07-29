import jwt from "jsonwebtoken"
import User from "../../../database/models/User.model.js"
import bcryptjs from 'bcryptjs'
import { errorHandling } from "../../middleware/errorHandling.js"
import { AppError } from "../../utils/AppError.js"

// - API for signning up and registering new users to the application.

export const signupUser = errorHandling(async (req, res) => {
    req.body.password = bcryptjs.hashSync(req.body.password, 8)
    let newUser = await User.insertMany(req.body)
    newUser[0].password = undefined
    res.status(201).json({ message: "New User Registered!", newUser })
})

// - API for signning in to the application and sending a token into response to be used.

export const signinUser = errorHandling(async (req, res, next) => {
    let user = await User.findOne({
        $or: [
            { email: req.body.email },
            { mobileNumber: req.body.mobileNumber },
            { recoveryEmail: req.body.recoveryEmail }
        ]
    })
    if (!user || !bcryptjs.compareSync(req.body.password, user.password)) return next(new AppError("Invalid Credentials", 401))
    jwt.sign({
        id: user._id,
        email: user.email,
        recoveryEmail: user.recoveryEmail,
        role: user.role
    }, process.env.SECRET_KEY, async (err, token) => {
        if (err) return res.status(500).json({ message: err.message })
        await User.findOneAndUpdate({ email: req.body.email }, { status: 'online' })
        res.status(200).json({ message: "User Signed In!", token: token })
    })
})

// - API for updating user in to the application and require a token into response to be used.

export const updateUser = errorHandling(async (req, res, next) => {
    let user = await User.findByIdAndUpdate(req.user.id, {
        $set: {
            email: req.body.email,
            mobileNumber: req.body.mobileNumber,
            recoveryEmail: req.body.recoveryEmail,
            DOB: req.body.DOB,
            lastName: req.body.lastName,
            firstName: req.body.firstName,
        }
    }, { new: true })
    if (!user) return next(new AppError("User Not Found!", 404))
    user.password = undefined
    res.status(200).json({ message: "User Updated!", user })
})

// - API for deleting user from the application and require a token into response to be used.

export const deleteUser = errorHandling(async (req, res, next) => {
    let user = await User.findByIdAndDelete(req.user.id)
    if (!user) return next(new AppError("User Not Found!", 404))
    user.password = undefined
    res.status(200).json({ message: "User Deleted!", user })
})

// - API for getting user data from the application and require a token into response to be used.

export const getUserData = errorHandling(async (req, res, next) => {
    let userData = await User.findById(req.user.id)
    if (!userData) return next(new AppError("User Not Found!", 404))
    userData.password = undefined
    res.status(200).json({ message: "User Data!", userData })
})

// - API for getting any user data from the application by Id and require a token into response to be used.

export const getUserById = errorHandling(async (req, res, next) => {
    let userData = await User.findById(req.params.id)
    if (!userData) return next(new AppError("User Not Found!", 404))
    userData.password = undefined
    res.status(200).json({ message: "User Data!", userData })
})

// - API for updating old password with new password requires a token into response to be used.

export const updateUserPassword = errorHandling(async (req, res, next) => {
    if (!req.body.password || !req.body.newPassword) {
        return next(new AppError("Both current and new passwords are required", 400))
    }

    let user = await User.findById(req.user.id);
    if (!user) return next(new AppError("User Not Found!", 404))

    if (!bcryptjs.compareSync(req.body.password, user.password)) {
        return next(new AppError("Current password is incorrect", 401))
    }

    user.password = bcryptjs.hashSync(req.body.newPassword, 8);
    await user.save();

    user.password = undefined;
    res.status(200).json({ message: "User password updated successfully!", user });
})

// - API for getting data from user with recovery email.

export const getUserByRecovery = errorHandling(async (req, res, next) => {
    let userData = await User.find({ recoveryEmail: req.body.recoveryEmail })
    userData.map((element) => element.password = undefined)
    if (!userData) return next(new AppError("User Not Found!", 404))
    res.status(200).json({ message: "User Data!", userData })
})
