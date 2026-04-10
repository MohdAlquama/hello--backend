import { Router } from "express";
import User from "../model/user.js";

const homeRouter = Router();

homeRouter.get('/', (req, res) => {
    res.render('index' , { title: 'Dell not buy' });
});

homeRouter.post('/submit', (req, res) => {

    User.create({ name: 'John', age: 70 })
        .then(user => {
            res.send('User created successfully!');
        })
        .catch(err => {
            res.status(400).send('Error creating user.');
        });
});

export default homeRouter;