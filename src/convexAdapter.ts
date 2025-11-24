import { useEffect } from "react";
import {
  useSaveProject,
  useGetProjects,
  useDeleteProject,
  useSaveTemplate,
  useGetTemplates,
  useDeleteTemplate,
  useUpdateTemplate,
  useSaveDraft,
  useGetDraft,
  useDeleteDraft,
} from "../src/hooks";

// Адаптер для работы с данными через Convex
export class ConvexDataAdapter {
  private saveProjectMutation: any;
  private deleteProjectMutation: any;
  private saveTemplateMutation: any;
  private deleteTemplateMutation: any;
  private updateTemplateMutation: any;
  private saveDraftMutation: any;
  private deleteDraftMutation: any;

  constructor() {
    this.saveProjectMutation = useSaveProject();
    this.deleteProjectMutation = useDeleteProject();
    this.saveTemplateMutation = useSaveTemplate();
    this.deleteTemplateMutation = useDeleteTemplate();
    this.updateTemplateMutation = useUpdateTemplate();
    this.saveDraftMutation = useSaveDraft();
    this.deleteDraftMutation = useDeleteDraft();
  }

  // Работа с проектами
  async saveProject(projectData: any): Promise<string> {
    const result = await this.saveProjectMutation(projectData);
    return result._id;
  }

  async getProjects(): Promise<any[]> {
    // Этот метод будет переопределен компонентом, который использует useGetProjects
    return [];
  }

  async deleteProject(projectId: string): Promise<void> {
    await this.deleteProjectMutation({ projectId });
  }

  // Работа с шаблонами
  async saveTemplate(templateData: any): Promise<string> {
    const result = await this.saveTemplateMutation(templateData);
    return result._id;
  }

  async getTemplates(): Promise<any[]> {
    // Этот метод будет переопределен компонентом, который использует useGetTemplates
    return [];
  }

  async deleteTemplate(templateId: string): Promise<void> {
    await this.deleteTemplateMutation({ templateId });
  }

  async updateTemplate(templateId: string, name: string): Promise<void> {
    await this.updateTemplateMutation({ templateId, name });
  }

  // Работа с черновиками
  async saveDraft(config: any): Promise<void> {
    await this.saveDraftMutation({ config });
  }

  async getDraft(): Promise<any> {
    // Этот метод будет переопределен компонентом, который использует useGetDraft
    return null;
  }

  async deleteDraft(): Promise<void> {
    await this.deleteDraftMutation({});
  }
}

// Хук для интеграции Convex с компонентами
export function useConvexIntegration() {
  const { data: projects, refetch: refetchProjects } = useGetProjects();
  const { data: templates, refetch: refetchTemplates } = useGetTemplates();
  const { data: draft, refetch: refetchDraft } = useGetDraft();

  // Создаем адаптер с данными
  const adapter: ConvexDataAdapter = {
    async saveProject(projectData: any): Promise<string> {
      const result = await useSaveProject()(projectData);
      refetchProjects();
      return result._id;
    },

    async getProjects(): Promise<any[]> {
      return projects || [];
    },

    async deleteProject(projectId: string): Promise<void> {
      await useDeleteProject()({ projectId });
      refetchProjects();
    },

    async saveTemplate(templateData: any): Promise<string> {
      const result = await useSaveTemplate()(templateData);
      refetchTemplates();
      return result._id;
    },

    async getTemplates(): Promise<any[]> {
      return templates || [];
    },

    async deleteTemplate(templateId: string): Promise<void> {
      await useDeleteTemplate()({ templateId });
      refetchTemplates();
    },

    async updateTemplate(templateId: string, name: string): Promise<void> {
      await useUpdateTemplate()({ templateId, name });
      refetchTemplates();
    },

    async saveDraft(config: any): Promise<void> {
      await useSaveDraft()({ config });
    },

    async getDraft(): Promise<any> {
      return draft || null;
    },

    async deleteDraft(): Promise<void> {
      await useDeleteDraft()({});
      refetchDraft();
    },
  };

  return adapter;
}

export default ConvexDataAdapter;