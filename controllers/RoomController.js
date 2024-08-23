const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
require("dotenv").config();

module.exports = {
    create: async (req, res) => {
        try {
           await prisma.room.create({
            data: {
                name: req.body.name,
                price: parseInt(req.body.price),
            },

           });
           return res.send({ message: "ບັນທືກສຳເລັດ"})
        } catch (e) {
            return res.status(500).send({ error: e.message });
        }
    },
    list: async (req, res) => {
        try {
            const results = await prisma.room.findMany({
                orderBy:{
                    id: "desc"
                },
                where:{
                    status: "use"
                }
            });
            return res.send({ results: results });
        } catch (e) {
            res.status(500).send({ error: e.message });
        }
    },
    remove: async (req, res)=>{
        try {
            await prisma.room.update({
                data:{
                    status: 'delete',
                },
                where:{
                    id: parseInt(req.params.id),
                }
            });
            return res.send({ message: "success" })
        } catch (e) {
            res.status(500).send({ error: e.message });
        }
    }
}