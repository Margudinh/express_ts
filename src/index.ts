import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express from 'express';
import * as bodyParser from 'body-parser';
import { Request, Response } from 'express';
import { User } from './entity/User';
import next from 'next';



const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 8000;
const app =  next({ dev });

const handle = app.getRequestHandler();

createConnection().then(async (conn) => {

    app.prepare().then(()=>{

        const server = express();
        server.use(bodyParser.json());

        server.get("/api/users", async (req: Request, res: Response) => {
            const users =  await User.find();
            res.json(users);
        });

        server.post("/api/users", async (req: Request, res: Response) => {
            const user = new User();
            user.firstName = req.body.firstName;
            user.age = req.body.age;
            user.lastName = req.body.lastName;
            await user.save();

            res.json({
                "newUser" : user.id
            });
        });

        server.delete("/api/users/:id",async (req: Request, res: Response) => {
            const id = req.params.id;
            const result = await User.delete(id);

            res.json({
                affected: result.affected,
                raw: result.raw
            });
        });

        server.put("/api/users", async (req: Request, res: Response) => {
            const user = await User.findOne(req.body.id);
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.age = req.body.age;
            user.save();

            res.json(user);
        });

        server.use("*",(req: Request, res: Response)=> {
            handle(req , res);
        });

        server.listen(8000);

        console.log("Server running in http://localhost:8000");

    });

}).catch(err => console.error(err));

process.on('SIGINT', function() {
    console.log( "\nI've seen things people wouldn't believe");
    console.log( "\nAttack ships on fire on the shoulder of orion");
    console.log("\nAll those moments will be lost in time like tears in the rain");
    console.log("\nTime to die...");
    process.exit(1);
});