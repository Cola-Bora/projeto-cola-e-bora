import app from "./app";
import AppDataSource from "./data-source";
import "dotenv/config";
import createBaseCategoriesService from "./services/categories/createBaseCategories.service";

(async () => {
  await AppDataSource.initialize().catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

  await createBaseCategoriesService();

  app.listen(process.env.PORT || 3000, () => {
    console.log("Servidor executando");
  });
})();
