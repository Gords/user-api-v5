import { AppDataSource } from "./data-source"
import {port} from "./config"
import app from "./app"


AppDataSource.initialize().then(async () => {
    app.listen(port)
    console.log(`Server has started on port ${port}.`)
}).catch(error => console.log(error))
