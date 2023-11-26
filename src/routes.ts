import { param, body } from "express-validator"
import { UserController } from "./controller/UserController"

export const Routes = [{
    method: "get",
    route: "/users",
    controller: UserController,
    action: "all",
    validation: [],
}, {
    method: "get",
    route: "/users/:id",
    controller: UserController,
    action: "one",
    validation: [
        param('id').isUUID(),
    ],
}, {
    method: "post",
    route: "/users",
    controller: UserController,
    action: "save",
    validation:[
        body('name').isString(),
        body('email').isString(),
        body('email').isEmail(),
        body('password').isString().isLength({min: 4}),
    ]
},
{
    method: "post",
    route: "/users/login",
    controller: UserController,
    action: "login",
    validation: [
        body('email').isString(),
        body('email').isEmail(),
        body('password').isString().isLength({min: 4}),
    ]
},
{
    method: "put",
    route: "/users/:id",
    controller: UserController,
    action: "update",
    validation: [
        body('name').isString(),
        body('email').isString(),
        body('email').isEmail(),
        body('password').isString().isLength({min: 4}),
    ],
},
{
    method: "patch",
    route: "/users/:id",
    controller: UserController,
    action: "update",
    validation: [
        body('name').isString(),
        body('email').isString(),
        body('email').isEmail(),
        body('password').isString().isLength({min: 4}),
    ],
},
{
    method: "delete",
    route: "/users/:id",
    controller: UserController,
    action: "remove",
    validation: [
        param('id').isInt(),
    ],
}]