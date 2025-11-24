import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Схема для хранения данных дверного калькулятора DORREN
export default defineSchema({
  // Проекты пользователей
  projects: defineTable({
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
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),

  // Шаблоны конфигураций
  templates: defineTable({
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
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),

  // Пользовательские сессии и черновики
  drafts: defineTable({
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
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),

  // Прайс-лист продуктов
  products: defineTable({
    id: v.string(), // уникальный ID продукта (например, 'l1_ral_base')
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
    compatibleWith: v.optional(v.array(v.string())), // ['single', 'one_half', 'double']
    doorType: v.optional(v.string()), // для полотен и коробов: 'single', 'one_half', 'double'
    isActive: v.boolean(), // активен ли продукт
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_id", ["id"])
    .index("by_category", ["category"])
    .index("by_doorType", ["doorType"])
    .index("by_isActive", ["isActive"]),
});