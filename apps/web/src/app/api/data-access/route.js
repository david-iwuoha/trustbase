import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { organization_id, access_granted } = body;

    if (!organization_id || typeof access_granted !== "boolean") {
      return Response.json(
        {
          error: "Missing required fields: organization_id, access_granted",
        },
        { status: 400 },
      );
    }

    // Check if organization exists
    const org = await sql`
      SELECT id FROM organizations WHERE id = ${organization_id} LIMIT 1
    `;

    if (org.length === 0) {
      return Response.json(
        { error: "Organization not found" },
        { status: 404 },
      );
    }

    // Use transaction to ensure data consistency between access record and transparency ledger
    const result = await sql.transaction(async (txn) => {
      // Upsert user data access permission
      const timestamp = new Date().toISOString();

      const accessResult = await txn`
        INSERT INTO user_data_access (user_id, organization_id, access_granted, granted_at, revoked_at)
        VALUES (${userId}, ${organization_id}, ${access_granted}, 
          ${access_granted ? timestamp : null}, 
          ${!access_granted ? timestamp : null})
        ON CONFLICT (user_id, organization_id)
        DO UPDATE SET 
          access_granted = EXCLUDED.access_granted,
          granted_at = CASE WHEN EXCLUDED.access_granted THEN ${timestamp} ELSE user_data_access.granted_at END,
          revoked_at = CASE WHEN NOT EXCLUDED.access_granted THEN ${timestamp} ELSE user_data_access.revoked_at END,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *
      `;

      // Create transparency ledger entry for public audit trail
      const anonymizedUserId = await txn`
        SELECT generate_anonymized_id(${userId}, 'User') as anon_id
      `;

      const anonymizedOrgId = await txn`
        SELECT generate_anonymized_id(${organization_id}, 'Org') as anon_id
      `;

      // Get the previous hash for blockchain-like chain integrity
      const previousEntry = await txn`
        SELECT entry_hash FROM transparency_ledger 
        ORDER BY timestamp DESC, id DESC 
        LIMIT 1
      `;

      const previousHash =
        previousEntry.length > 0 ? previousEntry[0].entry_hash : null;
      const actionType = access_granted ? "granted" : "revoked";
      const currentTimestamp = new Date();

      // Generate tamper-evident entry hash
      const entryHashResult = await txn`
        SELECT generate_entry_hash(
          ${anonymizedUserId[0].anon_id},
          ${anonymizedOrgId[0].anon_id},
          ${actionType},
          ${currentTimestamp.toISOString()}::timestamp with time zone,
          ${previousHash}
        ) as hash
      `;

      // Insert transparency ledger entry (public audit trail)
      const ledgerEntry = await txn`
        INSERT INTO transparency_ledger (
          anonymized_user_id,
          anonymized_org_id,
          action_type,
          timestamp,
          entry_hash,
          previous_hash
        ) VALUES (
          ${anonymizedUserId[0].anon_id},
          ${anonymizedOrgId[0].anon_id},
          ${actionType},
          ${currentTimestamp.toISOString()}::timestamp with time zone,
          ${entryHashResult[0].hash},
          ${previousHash}
        )
        RETURNING *
      `;

      return { accessResult: accessResult[0], ledgerEntry: ledgerEntry[0] };
    });

    return Response.json({
      message: access_granted ? "Access granted" : "Access revoked",
      access_record: result.accessResult,
      transparency_entry: result.ledgerEntry,
    });
  } catch (error) {
    console.error("POST /api/data-access error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user's data access permissions with organization details
    const permissions = await sql`
      SELECT 
        uda.*,
        o.name as organization_name,
        o.logo_url,
        o.category,
        o.data_access_reason,
        o.privacy_score
      FROM user_data_access uda
      JOIN organizations o ON uda.organization_id = o.id
      WHERE uda.user_id = ${userId}
      ORDER BY uda.updated_at DESC
    `;

    // Get count of granted permissions
    const grantedCount = await sql`
      SELECT COUNT(*) as count 
      FROM user_data_access 
      WHERE user_id = ${userId} AND access_granted = true
    `;

    return Response.json({
      permissions,
      granted_count: parseInt(grantedCount[0].count),
    });
  } catch (error) {
    console.error("GET /api/data-access error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}



