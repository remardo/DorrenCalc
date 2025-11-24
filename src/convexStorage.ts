// Адаптер для замены localStorage на Convex
// Этот файл пока содержит заглушки для плавного перехода на Convex

// Заглушки для совместимости с существующим кодом
export class ConvexStorageAdapter {
  private data: any = {};

  // Projects
  async saveProject(projectData: any): Promise<string> {
    const id = 'convex_' + Date.now();
    this.data[id] = projectData;
    localStorage.setItem('convex_projects_backup', JSON.stringify(this.data));
    return id;
  }

  async getProjects(): Promise<any[]> {
    const backup = localStorage.getItem('convex_projects_backup');
    return backup ? Object.values(JSON.parse(backup)) : [];
  }

  async deleteProject(projectId: string): Promise<void> {
    delete this.data[projectId];
    localStorage.setItem('convex_projects_backup', JSON.stringify(this.data));
  }

  // Templates
  async saveTemplate(templateData: any): Promise<string> {
    const id = 'convex_template_' + Date.now();
    const templates = this.getStoredTemplates();
    templates.push({ ...templateData, id: parseInt(id.split('_')[2]) });
    localStorage.setItem('convex_templates', JSON.stringify(templates));
    return id;
  }

  async getTemplates(): Promise<any[]> {
    return this.getStoredTemplates();
  }

  async deleteTemplate(templateId: string): Promise<void> {
    const templates = this.getStoredTemplates().filter(t => t.id !== templateId);
    localStorage.setItem('convex_templates', JSON.stringify(templates));
  }

  async updateTemplate(templateId: string, name: string): Promise<void> {
    const templates = this.getStoredTemplates();
    const index = templates.findIndex(t => t.id === templateId);
    if (index !== -1) {
      templates[index].name = name;
      localStorage.setItem('convex_templates', JSON.stringify(templates));
    }
  }

  // Drafts
  async saveDraft(config: any): Promise<void> {
    localStorage.setItem('convex_draft_config', JSON.stringify(config));
  }

  async getDraft(): Promise<any> {
    const draft = localStorage.getItem('convex_draft_config');
    return draft ? JSON.parse(draft) : null;
  }

  async deleteDraft(): Promise<void> {
    localStorage.removeItem('convex_draft_config');
  }

  private getStoredTemplates(): any[] {
    const stored = localStorage.getItem('convex_templates');
    return stored ? JSON.parse(stored) : [];
  }
}

export default new ConvexStorageAdapter();