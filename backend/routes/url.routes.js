import express from 'express'
import {
  createShortUrl,
  redirectToUrl,
  getAllCodes,
  deleteCodeofUser,
} from "../controllers/url.controller.js";
import { ensureAuthenticated, autherizationMiddleware } from "../middleware/auth.middleware.js";


const router = express.Router();

// url redirect
router.get('/codes/:code', redirectToUrl);

//shortner
router.use(autherizationMiddleware)
router.use(ensureAuthenticated)
router.post('/shorten', createShortUrl);

// Get all codes
router.get('/codes',getAllCodes);

//delete route
router.delete('/codes/:id', deleteCodeofUser);


export default router;