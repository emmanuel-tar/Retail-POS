"use client"

import { useState, useEffect } from "react"

interface PrintTemplate {
  id: string
  name: string
  description: string
  type: "sales" | "purchase" | "order"
  is_default: boolean
  settings: {
    show_logo: boolean
    show_barcode: boolean
    paper_size: string
    font_family: string
    font_size: number
  }
}

const defaultTemplates: PrintTemplate[] = [
  {
    id: "modern",
    name: "Modern Receipt",
    description: "Clean, modern design with logo and barcode",
    type: "sales",
    is_default: true,
    settings: {
      show_logo: true,
      show_barcode: true,
      paper_size: "80mm",
      font_family: "Arial",
      font_size: 12,
    },
  },
  {
    id: "classic",
    name: "Classic Receipt",
    description: "Traditional dot-matrix style receipt",
    type: "sales",
    is_default: false,
    settings: {
      show_logo: false,
      show_barcode: false,
      paper_size: "80mm",
      font_family: "Courier New",
      font_size: 10,
    },
  },
  {
    id: "minimal",
    name: "Minimal Receipt",
    description: "Simple, clean design with essential information only",
    type: "sales",
    is_default: false,
    settings: {
      show_logo: false,
      show_barcode: false,
      paper_size: "58mm",
      font_family: "Arial",
      font_size: 11,
    },
  },
]

export function usePrintTemplates() {
  const [templates, setTemplates] = useState<PrintTemplate[]>(defaultTemplates)
  const [defaultTemplate, setDefaultTemplate] = useState<PrintTemplate | null>(null)

  useEffect(() => {
    // Load templates from localStorage
    const stored = localStorage.getItem("pos_print_templates")
    if (stored) {
      try {
        const parsedTemplates = JSON.parse(stored)
        setTemplates(parsedTemplates)
      } catch (error) {
        console.error("Error loading print templates:", error)
      }
    }

    // Set default template
    const defaultTemp = templates.find((t) => t.is_default) || templates[0]
    setDefaultTemplate(defaultTemp)
  }, [])

  const updateTemplate = (templateId: string, updates: Partial<PrintTemplate>) => {
    setTemplates((prev) => {
      const updated = prev.map((template) => (template.id === templateId ? { ...template, ...updates } : template))
      localStorage.setItem("pos_print_templates", JSON.stringify(updated))
      return updated
    })
  }

  const setAsDefault = (templateId: string, type: PrintTemplate["type"]) => {
    setTemplates((prev) => {
      const updated = prev.map((template) => ({
        ...template,
        is_default: template.id === templateId && template.type === type,
      }))
      localStorage.setItem("pos_print_templates", JSON.stringify(updated))
      return updated
    })

    const newDefault = templates.find((t) => t.id === templateId)
    if (newDefault) {
      setDefaultTemplate(newDefault)
    }
  }

  const addTemplate = (template: Omit<PrintTemplate, "id">) => {
    const newTemplate: PrintTemplate = {
      ...template,
      id: `template-${Date.now()}`,
    }

    setTemplates((prev) => {
      const updated = [...prev, newTemplate]
      localStorage.setItem("pos_print_templates", JSON.stringify(updated))
      return updated
    })
  }

  const deleteTemplate = (templateId: string) => {
    setTemplates((prev) => {
      const updated = prev.filter((template) => template.id !== templateId)
      localStorage.setItem("pos_print_templates", JSON.stringify(updated))
      return updated
    })
  }

  return {
    templates,
    defaultTemplate,
    updateTemplate,
    setAsDefault,
    addTemplate,
    deleteTemplate,
  }
}
