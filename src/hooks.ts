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