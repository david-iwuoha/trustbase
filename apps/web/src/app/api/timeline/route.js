import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get all organizations with their usage data
    const organizations = await sql`
      SELECT 
        o.*,
        COALESCE(uda.access_granted, false) as access_granted,
        COUNT(odu.id) as usage_count,
        MAX(odu.usage_date) as last_usage_date,
        AVG(odu.data_volume_score) as avg_data_volume
      FROM organizations o
      LEFT JOIN user_data_access uda ON o.id = uda.organization_id AND uda.user_id = ${userId}
      LEFT JOIN organization_data_usage odu ON o.id = odu.organization_id AND odu.user_id = ${userId}
      GROUP BY o.id, uda.access_granted
      ORDER BY usage_count DESC, o.name ASC
    `;

    // Get recent data usage activity for timeline visualization
    const recentActivity = await sql`
      SELECT 
        odu.*,
        o.name as organization_name,
        o.logo_url,
        o.category
      FROM organization_data_usage odu
      JOIN organizations o ON odu.organization_id = o.id
      WHERE odu.user_id = ${userId}
      AND odu.usage_date >= CURRENT_DATE - INTERVAL '90 days'
      ORDER BY odu.usage_date DESC, odu.created_at DESC
      LIMIT 100
    `;

    // Format organizations data with calculated metrics
    const formattedOrganizations = organizations.map((org) => ({
      ...org,
      usage_count: parseInt(org.usage_count) || 0,
      avg_data_volume: org.avg_data_volume
        ? parseFloat(org.avg_data_volume).toFixed(1)
        : "0.0",
      last_usage_date: org.last_usage_date,
      activity_level:
        org.usage_count > 20 ? "high" : org.usage_count > 5 ? "medium" : "low",
    }));

    return Response.json({
      organizations: formattedOrganizations,
      recent_activity: recentActivity,
      total_organizations: formattedOrganizations.length,
      active_organizations: formattedOrganizations.filter(
        (org) => org.usage_count > 0,
      ).length,
    });
  } catch (error) {
    console.error("GET /api/timeline error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}



