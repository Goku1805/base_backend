import UserController from "~/controllers/user.js";
import authMiddleware from "~/middlewares/auth";
import express from "express";

let router = express.Router();
router.get("/profile", authMiddleware, UserController.getProfile);
router.put("/profile", authMiddleware, UserController.updateProfile);
router.post("/addUser", authMiddleware, UserController.createUser);
router.post("/deliveryBoys", authMiddleware, UserController.createDeliveryBoy);
router.get("/deliveryBoys", authMiddleware, UserController.getAllDeliveryBoys);
router.get(
  "/deliveryBoys/:userUUID",
  authMiddleware,
  UserController.getDeliveryBoy
);
router.put(
  "/deliveryBoys/:userUUID",
  authMiddleware,
  UserController.updateDeliveryBoy
);
router.put("/editUser/:userUUID", authMiddleware, UserController.editUser);
router.put("/blockUser/:userUUID", authMiddleware, UserController.blockUser);

export default router;
