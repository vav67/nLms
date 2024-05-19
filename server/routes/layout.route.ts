import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import {
  createLayout,
   editLayout,
  getLayoutByType,
} from "../controllers/layout.controller";
import { updateAccessToken } from "../controllers/user.controller";
const layoutRouter = express.Router();

layoutRouter.post("/create-layout",
updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
  isAutheticated, authorizeRoles("admin"), createLayout);

layoutRouter.put( "/edit-layout",
updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
  isAutheticated, authorizeRoles("admin"), editLayout);

//макет нужен как домашняя страница и даже не аудентифицируються 
//layoutRouter.get( "/get-layout",  getLayoutByType );
layoutRouter.get("/get-layout/:type",getLayoutByType);


export default layoutRouter;
