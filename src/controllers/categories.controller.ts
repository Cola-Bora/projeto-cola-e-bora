import listCategoriesService from '../services/categories/listCategories.service';
import { Request, Response } from 'express';

const listCategoriesController = async (req: Request, resp: Response) => {
  const categories = await listCategoriesService();
  return resp.status(200).json(categories).send();
};

export default listCategoriesController;
