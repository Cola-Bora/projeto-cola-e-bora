import { Router } from 'express';
import listCategoriesController from '../controllers/categories.controller';
import checkAuthUserMiddlewares from '../middlewares/checkAuthUser.middlewares';
import checkIsActiveUserMiddlewares from '../middlewares/checkIsActiveUser.middlewares';
import checkUserIdMiddlewares from '../middlewares/checkUserId.middlewares';

const categoriesRoutes = Router();

categoriesRoutes.get(
  '',
  checkAuthUserMiddlewares,
  checkIsActiveUserMiddlewares,
  checkUserIdMiddlewares,
  listCategoriesController
);
categoriesRoutes.get('', checkAuthUserMiddlewares, listCategoriesController);
export default categoriesRoutes;
