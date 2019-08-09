import "reflect-metadata"
import { createConnection, AdvancedConsoleLogger } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import { User } from "./entity/User";


createConnection().then(async (conn) => {
    const app = express();
    app.use(bodyParser.json());

    app.get("/api/users", async (req: Request, res: Response) => {
        const users =  await User.find();
        res.json(users);
    });

    app.post("/api/users", async (req: Request, res: Response) => {
        const user = new User();
        user.firstName = req.body.firstName;
        user.age = req.body.age;
        user.lastName = req.body.lastName;
        await user.save();

        res.json({
            "newUser" : user.id
        });
    });

    app.listen(3000);

    console.log("Server running in http://localhost:3000");

}).catch(err => console.error(err));