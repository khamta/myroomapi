const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
require("dotenv").config();


module.exports = {
    list: async (req, res) => {
        try {
            const results = await prisma.roomRent.findMany({
                include:{
                    RoomRentDetails: {
                        include:{
                            Room: true,
                        }
                    },
                }
            });

            return res.send({ results: results });
        } catch (e) {
            return res.status(500).send({ error: e.message });
        }
    },
    checkFreeRoom: async (req, res) =>{
        const roomId = passeInt(req.params.id);
        const checkinDate = req.body.checkinDate;
        const checkoutDate = req.body.checkoutDate;
    },
    rent: async(req, res) => {
       try {
        const rooms = req.body.rooms;

        const roomRent = await prisma.roomRent.create({
            data: {
                 customerName : req.body.customerName,
                 customerPhone : req.body.customerPhone,
                 rentDate: new Date(),
                 checkinDate: new Date(req.body.checkinDate),
                 checkoutDate: new Date(req.body.checkoutDate),
            },
        });

        for(let i = 0; i < rooms.length; i++){
            const roomId = rooms[i]

            await prisma.roomRentDetail.create({
                data:{
                    roomId: roomId,
                    roomRentId: roomRent.id,
                }
            })
        }

        return res.send({ message: 'success' })
       } catch (e) {   
        return res.status(500).send({ error: e.message })
    }
    },
    isRent: async (req, res) => {
        try {
            const roomId = parseInt(req.body.roomId);
            const checkinDate = new Date(req.body.checkinDate);

            const row = await prisma.roomRentDetail.findMany({
                where: {
                    roomId: roomId,
                    RoomRent: {
                        checkoutDate: {
                            gt: checkinDate,
                        },
                    }
                },
                include:{
                    RoomRent: true,
                },
            });

            return res.send({ result: row})
        } catch (e) {
            return res.status(500).send({ error: e.message })
        }
    }
}