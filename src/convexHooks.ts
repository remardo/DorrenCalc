// Простая интеграция с Convex для хранения данных дверного калькулятора
// Пока использует localStorage как резервное хранилище

import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

// Хуки для работы с данными
export function useConvexProjects() {
  const saveProject = useMutation(api.functions.saveProject);
  const getProjects = useQuery(api.functions.getProjects, {});
  const deleteProject = useMutation(api.functions.deleteProject);

  return {
    saveProject,
    projects: getProjects || [],
    deleteProject,
  };
}

export function useConvexTemplates() {
  const saveTemplate = useMutation(api.functions.saveTemplate);
  const getTemplates = useQuery(api.functions.getTemplates, {});
  const deleteTemplate = useMutation(api.functions.deleteTemplate);
  const updateTemplate = useMutation(api.functions.updateTemplate);

  return {
    saveTemplate,
    templates: getTemplates || [],
    deleteTemplate,
    updateTemplate,
  };
}

export function useConvexDrafts() {
  const saveDraft = useMutation(api.functions.saveDraft);
  const getDraft = useQuery(api.functions.getDraft, {});
  const deleteDraft = useMutation(api.functions.deleteDraft);

  return {
    saveDraft,
    draft: getDraft,
    deleteDraft,
  };
}

// Хуки для работы с продуктами (прайс-лист)
export function useConvexProducts() {
  const upsertProduct = useMutation(api.functions.upsertProduct);
  const getProducts = useQuery(api.functions.getProducts, {});
  const getActiveProducts = useQuery(api.functions.getActiveProducts, {});
  const updateProductPrice = useMutation(api.functions.updateProductPrice);
  const deleteProduct = useMutation(api.functions.deleteProduct);
  const deactivateProduct = useMutation(api.functions.deactivateProduct);
  const bulkUpsertProducts = useMutation(api.functions.bulkUpsertProducts);

  return {
    upsertProduct,
    products: getProducts || [],
    activeProducts: getActiveProducts || [],
    updateProductPrice,
    deleteProduct,
    deactivateProduct,
    bulkUpsertProducts,
  };
}