import * as express from "express"
import * as bodyParser from "body-parser"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import * as morgan from "morgan"
import { Routes } from "./routes"
import {port} from "./config"

const handleError = (error: Error, req: Request, res: Response, next: Function) => {
    res.status(500).send({message:error.message})
}

AppDataSource.initialize().then(async () => {

    // create express app
    const app = express()
    app.use(morgan('tiny'))
    app.use(bodyParser.json())

    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, async (req: Request, res: Response, next: Function) => {
            try{
                const result = await (new (route.controller as any))[route.action](req, res, next)
                res.json(result)
            } catch (error) {
                next(error)
            }
        })
    })

    app.use(handleError)

    // setup express app here
    // ...

    // start express server
    app.listen(port)

    console.log(`Server has started on port ${port}.`)

}).catch(error => console.log(error))
