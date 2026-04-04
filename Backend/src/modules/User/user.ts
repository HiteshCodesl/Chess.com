import express from "express";
import { prisma } from "../../lib/prisma.js";
import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../Auth/auth.js";

export const userRouter = express.Router();

type Role = "VIEWER" | "ANALYST" | "ADMIN";

interface updateData {
    role: Role,
    isActive: boolean
}

userRouter.post('/signup', async (req, res) => {
    try {
        
        const { name, email, password } = req.body;

        const isAlreadyUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (isAlreadyUser) {
            return res.status(404).json({
                "success": false,
                "error": "Already User, Try Login"
            })
        }

        const hashedPassword = await hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username: name,
                email: email,
                password: hashedPassword,
            }
        })

        if (!user) {
            return res.status(404).json({
                "success": false,
                "error": "Failed to Signup, try again"
            })
        }

        return res.status(201).json({
            "success": true,
            "data": user
        })

    } catch (error) {
        return res.status(404).json({
            "success": false,
            "error": "Something went Wrong"
        })
    }
})

userRouter.post('/login', async (req, res) => {
    try {
    
        const { email, password } = req.body;

        const checkUser = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!checkUser) {
            return res.status(404).json({
                "success": false,
                "error": "User Not Exists, try signup"
            })
        }

        const checkPassword = compare(password, checkUser.password);

        if (!checkPassword) {
            return res.status(404).json({
                "success": false,
                "error": "Password or Email not Matches"
            })
        }

        const token = await jwt.sign({
            id: checkUser.id,
        }, process.env.JWT_SECRET!);

        return res.status(200).json({
            "success": true,
            "token": token
        })
    } catch (error) {
        return res.status(404).json({
            "success": false,
            "error": "Something went wrong, try again"
        })
    }
})

userRouter.get('/me', authMiddleware, async (req, res) => {
    const userId = req.id;

    console.log("userId", userId)

    const profile = await prisma.user.findFirst({
        where: {
            id: userId
        }
    })

    if (!profile) {
        return res.status(400).json({
            "success": false,
            "error": "profile not found"
        })
    }

    return res.status(201).json({
        "success": true,
        "data": ({
            id: profile.id,
            username: profile.username,
            email: profile.email,
            createdAt: profile.createdAt
        })
    })
})

