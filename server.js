const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const UserController = require('./controllers/UserController');
const RoomController = require('./controllers/RoomController');
const RoomImageController = require('./controllers/RoomImageController')
const RoomRentController = require('./controllers/RoomRentController')
const cors = require('cors');
const fileUpload = require('express-fileupload');

app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.send('API Working.');
});
app.post('/api/user/create', (req, res) => UserController.create(req, res));
app.post('/api/user/signIn', (req, res) => UserController.signIn(req, res));
app.get('/api/user/info', (req, res) => UserController.info(req, res));

app.post('/api/room/create', (req, res) => RoomController.create(req, res));
app.get('/api/room/list', (req, res) => RoomController.list(req, res));
app.delete('/api/room/remove/:id', (req, res) => {
    RoomController.remove(req, res)
})

app.post('/api/roomImage/create/:roomId', (req, res) =>{
    RoomImageController.create(req, res)
})
app.get('/api/roomImage/list/:roomId', (req, res) =>{
    RoomImageController.list(req, res)
})
app.delete('/api/roomImage/remove/:id', (req, res) =>{
    RoomImageController.remove(req, res)
})

app.get('/api/roomRent/list', (req, res) => RoomRentController.list(req, res));
app.post('/api/roomRent/isRent', (req, res) => RoomRentController.isRent(req, res));
app.post('/api/roomRent/rent', (req, res) => RoomRentController.rent(req, res));

app.listen(3000, (err) => {
    if (err) console.log(err);
    console.log('server start on port 3000');
});