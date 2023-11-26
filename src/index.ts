import { AppDataSource } from "./data-source"
import app from "./app"
import 'dotenv/config'

const port = process.env.PORT || 3000


AppDataSource.initialize().then(async () => {
    app.listen(port)
    console.log(`Server has started on port ${port}.`)
}).catch(error => console.log(error))
