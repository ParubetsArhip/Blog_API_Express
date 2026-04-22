import "dotenv/config"
import express, {NextFunction} from "express"
import { Response, Request } from "express"
import {postRouter} from "@/controllers/post.controller";
import { prisma } from "@/client";
import {authRouter} from "@/controllers/auth.controller";

const app = express()

async function main() {
    app.use(express.json())

    app.use('/', authRouter)

    app.use("/", postRouter)

    app.use((req: Request, res: Response) => {
        res.status(404).json({ message: "Not Found" })
    })

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        res.status(500).json({ message: err.message })
    })

    app.listen(4200, () => {
        console.log("Server running successfully")
    })
}

main()
    .then(async () => {
        await prisma.$connect()
        console.log("Connected to Prisma API")
    })
    .catch(async (e) => {
        console.log(`Disconnected from Prisma API ${e}`)
        await prisma.$disconnect()
        process.exit(1)
    })
