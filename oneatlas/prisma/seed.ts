import { PrismaClient } from "../src/generated/prisma"
import { PrismaPg } from "@prisma/adapter-pg"
import "dotenv/config"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  const templates = [
    {
      name: "CRM Workspace",
      slug: "crm-workspace",
      category: "Sales",
      complexity: "Moderate",
      description: "Track customers, deals, and pipeline stages",
      tags: ["crm", "customers", "deals", "pipeline", "sales", "contacts", "leads"],
      schemaDefaults: {
        title: "CRM Workspace",
        layout: "sidebar",
        components: [
          {
            id: "contacts-table",
            name: "Contacts",
            type: "table",
            order: 1,
            fields: [
              { name: "name", type: "string", required: true },
              { name: "email", type: "string", required: true },
              { name: "company", type: "string" },
              { name: "status", type: "select" },
              { name: "createdAt", type: "date" },
            ],
          },
          {
            id: "deals-table",
            name: "Deals",
            type: "table",
            order: 2,
            fields: [
              { name: "title", type: "string", required: true },
              { name: "value", type: "number" },
              { name: "stage", type: "select" },
              { name: "closeDate", type: "date" },
            ],
          },
          {
            id: "pipeline-chart",
            name: "Pipeline Overview",
            type: "chart",
            order: 3,
            fields: [
              { name: "stage", type: "string" },
              { name: "count", type: "number" },
            ],
          },
        ],
      },
    },
    {
      name: "Admin Dashboard",
      slug: "admin-dashboard",
      category: "Operations",
      complexity: "Simple",
      description: "Manage users, roles, and system settings",
      tags: ["admin", "users", "roles", "settings", "dashboard", "management", "permissions"],
      schemaDefaults: {
        title: "Admin Dashboard",
        layout: "sidebar",
        components: [
          {
            id: "users-table",
            name: "Users",
            type: "table",
            order: 1,
            fields: [
              { name: "name", type: "string", required: true },
              { name: "email", type: "string", required: true },
              { name: "role", type: "select" },
              { name: "status", type: "select" },
              { name: "joinedAt", type: "date" },
            ],
          },
          {
            id: "stats-card",
            name: "System Stats",
            type: "card",
            order: 2,
            fields: [
              { name: "totalUsers", type: "number" },
              { name: "activeUsers", type: "number" },
              { name: "newToday", type: "number" },
            ],
          },
          {
            id: "activity-list",
            name: "Recent Activity",
            type: "list",
            order: 3,
            fields: [
              { name: "action", type: "string" },
              { name: "user", type: "string" },
              { name: "timestamp", type: "date" },
            ],
          },
        ],
      },
    },
    {
      name: "Analytics Workspace",
      slug: "analytics-workspace",
      category: "Analytics",
      complexity: "Advanced",
      description: "Visualize metrics, revenue, and growth data",
      tags: ["analytics", "metrics", "revenue", "charts", "growth", "data", "reports", "kpi"],
      schemaDefaults: {
        title: "Analytics Workspace",
        layout: "single",
        components: [
          {
            id: "kpi-cards",
            name: "KPI Overview",
            type: "card",
            order: 1,
            fields: [
              { name: "revenue", type: "number" },
              { name: "users", type: "number" },
              { name: "conversion", type: "number" },
              { name: "churn", type: "number" },
            ],
          },
          {
            id: "revenue-chart",
            name: "Revenue Chart",
            type: "chart",
            order: 2,
            fields: [
              { name: "month", type: "string" },
              { name: "revenue", type: "number" },
              { name: "expenses", type: "number" },
            ],
          },
          {
            id: "traffic-chart",
            name: "Traffic Sources",
            type: "chart",
            order: 3,
            fields: [
              { name: "source", type: "string" },
              { name: "visits", type: "number" },
            ],
          },
        ],
      },
    },
    {
      name: "Inventory System",
      slug: "inventory-system",
      category: "Operations",
      complexity: "Moderate",
      description: "Track products, stock levels, and suppliers",
      tags: ["inventory", "stock", "products", "warehouse", "suppliers", "orders", "items"],
      schemaDefaults: {
        title: "Inventory System",
        layout: "sidebar",
        components: [
          {
            id: "products-table",
            name: "Products",
            type: "table",
            order: 1,
            fields: [
              { name: "name", type: "string", required: true },
              { name: "sku", type: "string", required: true },
              { name: "quantity", type: "number" },
              { name: "price", type: "number" },
              { name: "category", type: "select" },
            ],
          },
          {
            id: "suppliers-table",
            name: "Suppliers",
            type: "table",
            order: 2,
            fields: [
              { name: "name", type: "string", required: true },
              { name: "contact", type: "string" },
              { name: "email", type: "string" },
              { name: "leadTime", type: "number" },
            ],
          },
          {
            id: "stock-chart",
            name: "Stock Levels",
            type: "chart",
            order: 3,
            fields: [
              { name: "product", type: "string" },
              { name: "quantity", type: "number" },
            ],
          },
        ],
      },
    },
    {
      name: "HR Dashboard",
      slug: "hr-dashboard",
      category: "HR",
      complexity: "Moderate",
      description: "Manage employees, attendance, and payroll",
      tags: ["hr", "employees", "payroll", "attendance", "leave", "hiring", "people", "staff"],
      schemaDefaults: {
        title: "HR Dashboard",
        layout: "sidebar",
        components: [
          {
            id: "employees-table",
            name: "Employees",
            type: "table",
            order: 1,
            fields: [
              { name: "name", type: "string", required: true },
              { name: "department", type: "select" },
              { name: "role", type: "string" },
              { name: "salary", type: "number" },
              { name: "joinDate", type: "date" },
            ],
          },
          {
            id: "attendance-table",
            name: "Attendance",
            type: "table",
            order: 2,
            fields: [
              { name: "employee", type: "string" },
              { name: "date", type: "date" },
              { name: "status", type: "select" },
              { name: "hoursWorked", type: "number" },
            ],
          },
          {
            id: "headcount-card",
            name: "Headcount Summary",
            type: "card",
            order: 3,
            fields: [
              { name: "total", type: "number" },
              { name: "onLeave", type: "number" },
              { name: "newHires", type: "number" },
            ],
          },
        ],
      },
    },
  ]

  for (const template of templates) {
    await prisma.template.upsert({
      where: { slug: template.slug },
      update: {},
      create: template,
    })
  }

  console.log("✅ Seeded 5 templates")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
