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
      discount: v.optional(v.union(v.object({
        value: v.number(),
        type: v.union(v.literal("percent"), v.literal("fixed")),
      }), v.null())),
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

// === ПРАЙС-ЛИСТ (ПРОДУКТЫ) ===

// Добавить или обновить продукт
export const upsertProduct = mutation({
  args: {
    id: v.string(),
    name: v.string(),
    price: v.number(),
    category: v.union(
      v.literal("leaf"),
      v.literal("frame"),
      v.literal("option"),
      v.literal("hardware"),
      v.literal("accessory")
    ),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    compatibleWith: v.optional(v.array(v.string())),
    doorType: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Проверяем, существует ли продукт с таким id
    const allProducts = await ctx.db.query("products").collect();
    const existing = allProducts.find(p => p.id === args.id);
    
    if (existing) {
      // Обновляем существующий продукт
      await ctx.db.patch(existing._id, {
        name: args.name,
        price: args.price,
        category: args.category,
        description: args.description,
        imageUrl: args.imageUrl,
        compatibleWith: args.compatibleWith,
        doorType: args.doorType,
        isActive: args.isActive ?? true,
        updatedAt: now,
      });
      return existing._id;
    } else {
      // Создаем новый продукт
      return await ctx.db.insert("products", {
        id: args.id,
        name: args.name,
        price: args.price,
        category: args.category,
        description: args.description,
        imageUrl: args.imageUrl,
        compatibleWith: args.compatibleWith,
        doorType: args.doorType,
        isActive: args.isActive ?? true,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

// Получить все продукты
export const getProducts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("products")
      .collect();
  },
});

// Получить продукты по категории
export const getProductsByCategory = query({
  args: {
    category: v.union(
      v.literal("leaf"),
      v.literal("frame"),
      v.literal("option"),
      v.literal("hardware"),
      v.literal("accessory")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

// Получить продукты по типу двери (для полотен и коробов)
export const getProductsByDoorType = query({
  args: {
    doorType: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_doorType", (q) => q.eq("doorType", args.doorType))
      .collect();
  },
});

// Получить только активные продукты
export const getActiveProducts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("products")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .collect();
  },
});

// Обновить цену продукта
export const updateProductPrice = mutation({
  args: {
    productId: v.string(),
    price: v.number(),
  },
  handler: async (ctx, args) => {
    const allProducts = await ctx.db.query("products").collect();
    const product = allProducts.find(p => p.id === args.productId);
    
    if (product) {
      await ctx.db.patch(product._id, {
        price: args.price,
        updatedAt: Date.now(),
      });
    }
  },
});

// Удалить продукт
export const deleteProduct = mutation({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.productId);
  },
});

// Деактивировать продукт (мягкое удаление)
export const deactivateProduct = mutation({
  args: {
    productId: v.string(),
  },
  handler: async (ctx, args) => {
    const allProducts = await ctx.db.query("products").collect();
    const product = allProducts.find(p => p.id === args.productId);
    
    if (product) {
      await ctx.db.patch(product._id, {
        isActive: false,
        updatedAt: Date.now(),
      });
    }
  },
});

// Массовое добавление продуктов (для импорта прайс-листа)
export const bulkUpsertProducts = mutation({
  args: {
    products: v.array(v.object({
      id: v.string(),
      name: v.string(),
      price: v.number(),
      category: v.union(
        v.literal("leaf"),
        v.literal("frame"),
        v.literal("option"),
        v.literal("hardware"),
        v.literal("accessory")
      ),
      description: v.optional(v.string()),
      imageUrl: v.optional(v.string()),
      compatibleWith: v.optional(v.array(v.string())),
      doorType: v.optional(v.string()),
      isActive: v.optional(v.boolean()),
    })),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const results = [];
    
    // Получаем все существующие продукты один раз
    const allProducts = await ctx.db.query("products").collect();
    
    for (const product of args.products) {
      const existing = allProducts.find(p => p.id === product.id);
      
      if (existing) {
        await ctx.db.patch(existing._id, {
          name: product.name,
          price: product.price,
          category: product.category,
          description: product.description,
          imageUrl: product.imageUrl,
          compatibleWith: product.compatibleWith,
          doorType: product.doorType,
          isActive: product.isActive ?? true,
          updatedAt: now,
        });
        results.push({ id: product.id, action: "updated" });
      } else {
        await ctx.db.insert("products", {
          id: product.id,
          name: product.name,
          price: product.price,
          category: product.category,
          description: product.description,
          imageUrl: product.imageUrl,
          compatibleWith: product.compatibleWith,
          doorType: product.doorType,
          isActive: product.isActive ?? true,
          createdAt: now,
          updatedAt: now,
        });
        results.push({ id: product.id, action: "created" });
      }
    }
    
    return results;
  },
});
