import path from 'path'
import AutoLoad from '@fastify/autoload'
import { fileURLToPath } from 'url'
import 'dotenv'
import fastifyMysql  from '@fastify/mysql'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import multer from 'fastify-multer';
import fastifyStatic from "@fastify/static";
import fastifyCookie from '@fastify/cookie'
import cors from '@fastify/cors'

// Pass --options via CLI arguments in command to enable these options.
export const options = {}

export default async function (fastify, opts) {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })
  fastify.register(fastifyMysql,{
    promise: true,
    connectionString: process.env.DB_LINK,

  })
  fastify.register(cors,{
    origin: "http://localhost:8080",
    credentials: true
  })

  fastify.register(fastifyCookie, {
    secret: 'help',
    hook: 'onRequest', // set to false to disable cookie autoparsing or set autoparsing on any of the following hooks: 'onRequest', 'preParsing', 'preHandler', 'preValidation'. default: 'onRequest'
    parseOptions: {}
  })

  fastify.register(multer.contentParser)

  console.log('database connected')
  console.log(process.env.JWT_SECRET)
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'uploads'),
    prefix: '/uploads/'
  })

// Rest of your Fastify server setup and routes...

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  })
}
