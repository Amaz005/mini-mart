import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from "path";
// import { ImportProduct } from "./entities/ImportProduct";
// import { SaleProduct } from "./entities/SaleProduct";
// import { Product } from "./entities/Product";
import { UserAccount } from "./entities/UserAccount";

export default {
    migrations: {
        path: path.join(__dirname,"./migrations"),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: [Post,UserAccount],
    dbName: 'equipmentdb',
    user: 'ductheduck',
    password: '123',
    type: 'postgresql',
    debug: !__prod__
} as Parameters<typeof MikroORM.init>[0]