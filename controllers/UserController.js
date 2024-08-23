const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
require("dotenv").config();

module.exports = {
    create: async (req, res) => {
        try {
            await prisma.user.create({
             data: {
                 name: req.body.name,
                 user: req.body.user,
                 pass: req.body.pass,
                 level: req.body.level
             },
 
            });
            return res.send({ message: "ບັນທືກສຳເລັດ"})
         } catch (e) {
             return res.status(500).send({ error: e.message });
         }
    },
    signIn: async (req, res) => {
        try {
            const row = await prisma.user.findFirst({
                select: {
                    id: true,
                    name: true,
                    user: true,
                    level: true,
                },
                where: {
                    user: req.body.username,
                    pass: req.body.password,
                    status: 'use'
                }
            });
            if (row != undefined) {
                const key = process.env.SECRET_KEY;
                const token = jwt.sign(row, key, { expiresIn: '1d' });

                return res.send({ token: token });
            } else {
                return res.status(401).send('unauthorization');
            }
        } catch (e) {
            return res.status(500).send({ error: e.message });
        }
    },
    info: async (req, res) => {
        try {
            const token = req.headers.authorization.replace('Bearer ', '');
            const key = process.env.SECRET_KEY;
            const payload = jwt.verify(token, key);

            res.send(payload);
        } catch (e) {
            res.status(500).send({ error: e.message });
        }
    }
}