import { authOptions } from "@/lib/authOptions";
import { pool } from "@/lib/postgresql";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

function getSortClause(sortBy: string): string {
  if (sortBy === "oldest") return "u.role_approved_at ASC";
  if (sortBy === "name_asc") return "u.name ASC";
  if (sortBy === "name_desc") return "u.name DESC";
  return "u.role_approved_at DESC";
}

function getIntervalForRange(dateRange: string): string | null {
  if (dateRange === "today") return "1 day";
  if (dateRange === "week") return "7 days";
  if (dateRange === "month") return "30 days";
  if (dateRange === "year") return "365 days";
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    
    const { searchParams } = new URL(req.url);

    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 10));
    const offset = (page - 1) * limit;

    const sortBy = searchParams.get("sortBy") || "newest";
    const sortClause = getSortClause(sortBy);

    const dateRange = searchParams.get("dateRange") || "all";
    const interval = getIntervalForRange(dateRange);

    const search = searchParams.get("search")?.trim() || "";

    const conditions: string[] = [`role = 'student'`, `role_status = 'approved'`];
    const values: unknown[] = [];

    if (interval) conditions.push(`role_approved_at >= NOW() - INTERVAL '${interval}'`);

    if (search) {
      values.push(`%${search}%`);
      conditions.push(`(name ILIKE $${values.length} OR email ILIKE $${values.length})`);
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;

    const countResult = await pool.query(
      `SELECT COUNT(*)::int AS total FROM users ${whereClause}`, values
    );
    const totalItems = countResult.rows[0]?.total ?? 0;

    values.push(limit, offset);
    const dataResult = await pool.query(
      `SELECT id, name, email, image, role_approved_at FROM users u
       ${whereClause} ORDER BY ${sortClause}
       LIMIT $${values.length - 1} OFFSET $${values.length}`, values
    );

    return NextResponse.json({
      success: true,
      students: dataResult.rows.map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        image: row.image,
        roleApprovedAt: row.role_approved_at,
      })),
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.max(1, Math.ceil(totalItems / limit)),
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}