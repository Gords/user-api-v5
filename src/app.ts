import * as express from "express"
import * as bodyParser from "body-parser"
import { Request, Response } from "express"
import * as morgan from "morgan"
import { Routes } from "./routes"
import { validationResult } from "express-validator"


const handleError = (error: Error, req: Request, res: Response, next: Function) => {
    res.status(500).send({ message: error.message })
}

// create express app
const app = express()
app.use(morgan('tiny'))
app.use(bodyParser.json())

// register express routes from defined application routes
Routes.forEach(route => {
    const middlewares = route.middleware ? [...route.middleware, ...route.validation] : route.validation;

    (app as any)[route.method](route.route,
        ...middlewares,
        async (req: Request, res: Response, next: Function) => {
            try {
                const errors = validationResult(req)
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }
                const result = await (new (route.controller as any))[route.action](req, res, next)
                if (result !== null && result !== undefined) {
                    res.json(result)
                }
            } catch (error) {
                next(error)
            }
        })
})

app.use(handleError)

export default app


