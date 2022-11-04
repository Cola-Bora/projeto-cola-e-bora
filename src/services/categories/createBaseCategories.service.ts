import AppDataSource from "../../data-source";
import { Categories } from "../../entities/ongCategory";

const createBaseCategoriesService = async () => {
    const categoryRepository = AppDataSource.getRepository(Categories);
    const categories = await categoryRepository.find();

    const baseCategories = [ 'meio ambiente', 'animais', 'assistência social',
                             'cultura', 'saúde', 'desenvolvimento e defesa de direitos',
                             'habitação', 'educação', 'pesquisa'];

    baseCategories.forEach(async (category) => {
        const categoryAlreadyExists = categories.find(cat => cat.name === category);
        if(!categoryAlreadyExists) {
            await categoryRepository.save({ name: category });
        }
    });

    return await categoryRepository.find();
}

export default createBaseCategoriesService;