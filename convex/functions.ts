import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// === ПРОЕКТЫ ===
export const saveProject = mutation({
  args: {
    name: v.string(),
    customer: v.string(),
    manager: v.string(),
    comments: v.string(),
    items: v.array(v.object({
      id: v.string(),
      doorType: v.string(),
      leaf: v.union(v.object({
        id: v.string(),
        name: v.string(),
        price: v.number(),
        category: v.string(),
        description: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
      }), v.null()),
      frame: v.union(v.object({
        id: v.string(),
        name: v.string(),
        price: v.number(),
        category: v.string(),
        description: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
      }), v.null()),
      options: v.array(v.object({
        id: v.string(),
        name: v.string(),
        price: v.number(),
        category: v.string(),
        description: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
      })),
      hardware: v.array(v.object({
        id: v.string(),
        name: v.string(),
        price: v.number(),
        category: v.string(),
        description: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
      })),
      accessories: v.array(v.object({
        id: v.string(),
        name: v.string(),
        price: v.number(),
        category: v.string(),
        description: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
      })),
      quantity: v.number(),
      discount: v.union(v.object({
        value: v.number(),
        type: v.union(v.literal("percent"), v.literal("fixed")),
      }), v.null()),
    })),
    totalAmount: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("projects", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const getProjects = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("projects")
      .order("desc")
      .collect();
    return projects;
  },
});

export const deleteProject = mutation({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.projectId);
  },
});

// === ШАБЛОНЫ ===
export const saveTemplate = mutation({
  args: {
    name: v.string(),
    config: v.object({
      doorType: v.string(),
      leaf: v.union(v.object({
        id: v.string(),
        name: v.string(),
        price: v.number(),
        category: v.string(),
        description: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
      }), v.null()),
      frame: v.union(v.object({
        id: v.string(),
        name: v.string(),
        price: v.number(),
        category: v.string(),
        description: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
      }), v.null()),
      options: v.array(v.object({
        id: v.string(),
        name: v.string(),
        price: v.number(),
        category: v.string(),
        description: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
      })),
      hardware: v.array(v.object({
        id: v.string(),
        name: v.string(),
        price: v.number(),
        category: v.string(),
        description: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
      })),
      accessories: v.array(v.object({
        id: v.string(),
        name: v.string(),
        price: v.number(),
        category: v.string(),
        description: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
      })),
    }),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("templates", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const getTemplates = query({
  args: {},
  handler: async (ctx) => {
    const templates = await ctx.db
      .query("templates")
      .order("desc")
      .collect();
    return templates;
  },
});

export const deleteTemplate = mutation({
  args: {
    templateId: v.id("templates"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.templateId);
  },
});

export const updateTemplate = mutation({
  args: {
    templateId: v.id("templates"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.templateId, {
      name: args.name,
    });
  },
});

// === ЧЕРНОВИКИ ===
export const saveDraft = mutation({
  args: {
    config: v.object({
      activeTab: v.string(),
      selectedLeaf: v.union(v.object({
        id: v.string(),
        name: v.string(),
        price: v.number(),
        category: v.string(),
        description: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
      }), v.null()),
      selectedFrame: v.union(v.object({
        id: v.string(),
        name: v.string(),
        price: v.number(),
        category: v.string(),
        description: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
      }), v.null()),
      selectedOptions: v.array(v.object({
        id: v.string(),
        name: v.string(),
        price: v.number(),
        category: v.string(),
        description: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
      })),
      selectedHardware: v.array(v.object({
        id: v.string(),
        name: v.string(),
        price: v.number(),
        category: v.string(),
        description: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
      })),
      selectedAccessories: v.array(v.object({
        id: v.string(),
        name: v.string(),
        price: v.number(),
        category: v.string(),
        description: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
      })),
      configQuantity: v.number(),
      configDiscountValue: v.string(),
      configDiscountType: v.union(v.literal("percent"), v.literal("fixed")),
    }),
  },
  handler: async (ctx, args) => {
    // Удаляем старый черновик, если есть
    const existingDrafts = await ctx.db
      .query("drafts")
      .order("desc")
      .collect();
    
    if (existingDrafts.length > 0) {
      await ctx.db.delete(existingDrafts[0]._id);
    }

    // Создаем новый черновик
    return await ctx.db.insert("drafts", {
      config: args.config,
      createdAt: Date.now(),
    });
  },
});

export const getDraft = query({
  args: {},
  handler: async (ctx) => {
    const drafts = await ctx.db
      .query("drafts")
      .order("desc")
      .collect();
    return drafts.length > 0 ? drafts[0] : null;
  },
});

export const deleteDraft = mutation({
  args: {},
  handler: async (ctx) => {
    const drafts = await ctx.db
      .query("drafts")
      .order("desc")
      .collect();
    
    if (drafts.length > 0) {
      await ctx.db.delete(drafts[0]._id);
    }
  },
});