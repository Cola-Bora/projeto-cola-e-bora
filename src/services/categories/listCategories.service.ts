import AppDataSource from '../../data-source';
import { Categories } from '../../entities/ongCategory';

const listCategoriesService = async (): Promise<Categories[]> => {
  const categoriesRepository = AppDataSource.getRepository(Categories);
  const categories = categoriesRepository.find();
  return categories;
};

export default listCategoriesService;