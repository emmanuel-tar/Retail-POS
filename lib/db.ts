import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

const sql = neon(process.env.DATABASE_URL)

export { sql }

// Database helper functions
export async function executeQuery(query: string, params: any[] = []) {
  try {
    const result = await sql(query, params)
    return { success: true, data: result }
  } catch (error) {
    console.error("Database query error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Transaction helper
export async function executeTransaction(queries: Array<{ query: string; params?: any[] }>) {
  try {
    // Note: Neon doesn't support explicit transactions in serverless mode
    // We'll execute queries sequentially
    const results = []
    for (const { query, params = [] } of queries) {
      const result = await sql(query, params)
      results.push(result)
    }
    return { success: true, data: results }
  } catch (error) {
    console.error("Database transaction error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
