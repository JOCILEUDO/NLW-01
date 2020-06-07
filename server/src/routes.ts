import express from 'express'
import PointsController from "./controllers/PointsController"
import ItemsController from "./controllers/ItemsController"
import multer from 'multer'
import multerConfig from "./config/multer"
import { celebrate, Joi } from "celebrate" 

const routes = express.Router()
const upload = multer(multerConfig)

const pointController = new PointsController()
const itemsController = new ItemsController()


routes.get('/', (req, res) => {
  return res.json({ message: 'Hello world' })
})

routes.get('/items', itemsController.index) 
routes.get('/points', pointController.index)
routes.get('/points/:id', pointController.show)

routes.post(
  '/points',
  upload.single('image'),
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      whatsapp: Joi.string().required(),
      latitude: Joi.string().required(),
      longitude: Joi.string().required(),
      city: Joi.string().required(),
      uf: Joi.string().required().max(2),
      items: Joi.string(),
    })
  },{
    abortEarly: false
  }),
  pointController.create)

export default routes
