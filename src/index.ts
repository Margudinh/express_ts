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

    app.delete("/api/users/:id",async (req: Request, res: Response) => {
        const id = req.params.id;
        const result = await User.delete(id);

        res.json({
            affected: result.affected,
            raw: result.raw
        });
    });

    app.put("/api/users", async (req: Request, res: Response) => {
        const user = await User.findOne(req.body.id);
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.age = req.body.age;
        user.save();

        res.json(user);
    });

    app.listen(8000);

    console.log("Server running in http://localhost:8000");

}).catch(err => console.error(err));