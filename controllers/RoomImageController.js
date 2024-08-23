const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
require("dotenv").config();

module.exports = {
    create: async (req, res) => {
        try {
           const fileRoom = req.files.fileRoom;
           fileRoom.mv('./uploads/' + fileRoom.name, async (err) =>{
            if (err) throw err;

            await prisma.roomImage.create({
                data:{
                    roomId: parseInt(req.params.roomId),
                    name: fileRoom.name,
                }
            })

            return res.send({ message: "success" });
           });
        } catch (e) {
            return res.status(500).send({ error: e.message });
        }
    },
    list: async (req, res) => {
        try {
            const roomId = parseInt(req.params.roomId);
            const results = await prisma.roomImage.findMany({
                
                where:{
                    roomId: roomId
                }
            });
            return res.send({ results: results });
        } catch (e) {
            res.status(500).send({ error: e.message });
        }
    },
    remove: async (req, res)=>{
        try {
            const id = parseInt(req.params.id);
            const row = await prisma.roomImage.findFirst({
                where: {
                    id: id
                }
            })
            const ImageName = row.name; //name from database
            const fs = require("fs");
            fs.unlinkSync("./uploads/" + ImageName);

            await prisma.roomImage.delete({
                where:{
                    id: id,
                }
            });
            return res.send({ message: "success" })
        } catch (e) {
            res.status(500).send({ error: e.message });
        }
    }
}