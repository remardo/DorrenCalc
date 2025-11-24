import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

// Хуки для работы с проектами
export const useSaveProject = () => {
  return useMutation(api.functions.saveProject);
};

export const useGetProjects = () => {
  return useQuery(api.functions.getProjects, {});
};

export const useDeleteProject = () => {
  return useMutation(api.functions.deleteProject);
};

// Хуки для работы с шаблонами
export const useSaveTemplate = () => {
  return useMutation(api.functions.saveTemplate);
};

export const useGetTemplates = () => {
  return useQuery(api.functions.getTemplates, {});
};

export const useDeleteTemplate = () => {
  return useMutation(api.functions.deleteTemplate);
};

export const useUpdateTemplate = () => {
  return useMutation(api.functions.updateTemplate);
};

// Хуки для работы с черновиками
export const useSaveDraft = () => {
  return useMutation(api.functions.saveDraft);
};

export const useGetDraft = () => {
  return useQuery(api.functions.getDraft, {});
};

export const useDeleteDraft = () => {
  return useMutation(api.functions.deleteDraft);
};

// Хуки для работы с продуктами (прайс-лист)
export const useUpsertProduct = () => {
  return useMutation(api.functions.upsertProduct);
};

export const useGetProducts = () => {
  return useQuery(api.functions.getProducts, {});
};

export const useGetProductsByCategory = (category: "leaf" | "frame" | "option" | "hardware" | "accessory") => {
  return useQuery(api.functions.getProductsByCategory, { category });
};

export const useGetProductsByDoorType = (doorType: string) => {
  return useQuery(api.functions.getProductsByDoorType, { doorType });
};

export const useGetActiveProducts = () => {
  return useQuery(api.functions.getActiveProducts, {});
};

export const useUpdateProductPrice = () => {
  return useMutation(api.functions.updateProductPrice);
};

export const useDeleteProduct = () => {
  return useMutation(api.functions.deleteProduct);
};

export const useDeactivateProduct = () => {
  return useMutation(api.functions.deactivateProduct);
};

export const useBulkUpsertProducts = () => {
  return useMutation(api.functions.bulkUpsertProducts);
};