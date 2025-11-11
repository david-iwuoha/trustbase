import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get all organizations with current user's access status
    const organizations = await sql`
      SELECT 
        o.*,
        COALESCE(uda.access_granted, false) as access_granted,
        uda.granted_at,
        uda.revoked_at
      FROM organizations o
      LEFT JOIN user_data_access uda ON o.id = uda.organization_id AND uda.user_id = ${userId}
      ORDER BY o.name ASC
    `;

    return Response.json({ organizations });
  } catch (error) {
    console.error("GET /api/organizations error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      logo_url,
      category,
      data_access_reason,
      website_url,
      contact_email,
      privacy_score,
    } = body;

    if (!name || !logo_url || !category || !data_access_reason) {
      return Response.json(
        {
          error:
            "Missing required fields: name, logo_url, category, data_access_reason",
        },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO organizations (name, logo_url, category, data_access_reason, website_url, contact_email, privacy_score)
      VALUES (${name}, ${logo_url}, ${category}, ${data_access_reason}, ${website_url}, ${contact_email}, ${privacy_score || 7})
      RETURNING *
    `;

    return Response.json({ organization: result[0] }, { status: 201 });
  } catch (error) {
    console.error("POST /api/organizations error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}



