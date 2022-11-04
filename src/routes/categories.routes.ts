import { Router } from 'express';
import listCategoriesController from '../controllers/categories.controller';
import checkAuthUserMiddlewares from '../middlewares/checkAuthUser.middlewares';

const categoriesRoutes = Router();

categoriesRoutes.get('', checkAuthUserMiddlewares, listCategoriesController);

export default categoriesRoutes;
