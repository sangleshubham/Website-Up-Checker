import { Router } from "express";
import {isSiteUp, enumerateCountry} from '../controller/controller.js'

const router =  Router()


router.get('/' ,   isSiteUp)
router.get('/enumerateCountry' ,   enumerateCountry)


export default router