// Простые хуки для работы с Convex
// Используйте эти хуки напрямую в компонентах React

import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

// === ПРОЕКТЫ ===
export function useProjects() {
  const projects = useQuery(api.functions.getProjects, {});
  const saveProject = useMutation(api.functions.saveProject);
  const deleteProject = useMutation(api.functions.deleteProject);

  return {
    projects: projects || [],
    isLoading: projects === undefined,
    saveProject,
    deleteProject: (projectId: Id<"projects">) => deleteProject({ projectId }),
  };
}

// === ШАБЛОНЫ ===
export function useTemplates() {
  const templates = useQuery(api.functions.getTemplates, {});
  const saveTemplate = useMutation(api.functions.saveTemplate);
  const deleteTemplate = useMutation(api.functions.deleteTemplate);
  const updateTemplate = useMutation(api.functions.updateTemplate);

  return {
    templates: templates || [],
    isLoading: templates === undefined,
    saveTemplate,
    deleteTemplate: (templateId: Id<"templates">) => deleteTemplate({ templateId }),
    updateTemplate: (templateId: Id<"templates">, name: string) => updateTemplate({ templateId, name }),
  };
}

// === ЧЕРНОВИКИ ===
export function useDraft() {
  const draft = useQuery(api.functions.getDraft, {});
  const saveDraft = useMutation(api.functions.saveDraft);
  const deleteDraft = useMutation(api.functions.deleteDraft);

  return {
    draft: draft || null,
    isLoading: draft === undefined,
    saveDraft: (config: any) => saveDraft({ config }),
    deleteDraft: () => deleteDraft({}),
  };
}

// === ПРОДУКТЫ (ПРАЙС-ЛИСТ) ===
export function useProducts() {
  const products = useQuery(api.functions.getProducts, {});
  const activeProducts = useQuery(api.functions.getActiveProducts, {});
  const upsertProduct = useMutation(api.functions.upsertProduct);
  const updateProductPrice = useMutation(api.functions.updateProductPrice);
  const deleteProduct = useMutation(api.functions.deleteProduct);
  const deactivateProduct = useMutation(api.functions.deactivateProduct);
  const bulkUpsertProducts = useMutation(api.functions.bulkUpsertProducts);

  return {
    products: products || [],
    activeProducts: activeProducts || [],
    isLoading: products === undefined,
    upsertProduct,
    updateProductPrice: (productId: string, price: number) => updateProductPrice({ productId, price }),
    deleteProduct: (productId: Id<"products">) => deleteProduct({ productId }),
    deactivateProduct: (productId: string) => deactivateProduct({ productId }),
    bulkUpsertProducts: (productsData: any[]) => bulkUpsertProducts({ products: productsData }),
  };
}

// Хук для получения продуктов по категории
export function useProductsByCategory(category: "leaf" | "frame" | "option" | "hardware" | "accessory") {
  const products = useQuery(api.functions.getProductsByCategory, { category });
  return {
    products: products || [],
    isLoading: products === undefined,
  };
}

// Хук для получения продуктов по типу двери
export function useProductsByDoorType(doorType: string) {
  const products = useQuery(api.functions.getProductsByDoorType, { doorType });
  return {
    products: products || [],
    isLoading: products === undefined,
  };
}
