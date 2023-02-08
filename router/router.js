import { Router } from "express";
import {isSiteUp} from '../controller/controller.js'

const router =  Router()


router.get('/' ,   isSiteUp)

export default router