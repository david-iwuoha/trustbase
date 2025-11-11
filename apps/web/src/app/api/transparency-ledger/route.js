import sql from "@/app/api/utils/sql";

// Public endpoint - no authentication required for transparency
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit")) || 50;
    const offset = parseInt(searchParams.get("offset")) || 0;

    // Get transparency ledger entries (public audit trail)
    const entries = await sql`
      SELECT 
        id,
        anonymized_user_id,
        anonymized_org_id,
        action_type,
        timestamp,
        entry_hash,
        previous_hash
      FROM transparency_ledger
      ORDER BY timestamp DESC, id DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    // Get total count for pagination
    const totalCount = await sql`
      SELECT COUNT(*) as count FROM transparency_ledger
    `;

    // Verify chain integrity (tamper evidence)
    let chainValid = true;
    for (let i = 1; i < entries.length; i++) {
      const currentEntry = entries[i];
      const previousEntry = entries[i - 1];

      if (currentEntry.previous_hash !== previousEntry.entry_hash) {
        chainValid = false;
        break;
      }
    }

    // Get statistics
    const stats = await sql`
      SELECT 
        COUNT(*) as total_entries,
        COUNT(CASE WHEN action_type = 'granted' THEN 1 END) as grants_count,
        COUNT(CASE WHEN action_type = 'revoked' THEN 1 END) as revokes_count,
        COUNT(DISTINCT anonymized_user_id) as unique_users,
        COUNT(DISTINCT anonymized_org_id) as unique_orgs,
        MIN(timestamp) as first_entry,
        MAX(timestamp) as latest_entry
      FROM transparency_ledger
    `;

    return Response.json({
      entries,
      pagination: {
        total: parseInt(totalCount[0].count),
        limit,
        offset,
        has_more: offset + limit < parseInt(totalCount[0].count),
      },
      chain_integrity: {
        valid: chainValid,
        verified_at: new Date().toISOString(),
      },
      statistics: stats[0] || {
        total_entries: 0,
        grants_count: 0,
        revokes_count: 0,
        unique_users: 0,
        unique_orgs: 0,
        first_entry: null,
        latest_entry: null,
      },
    });
  } catch (error) {
    console.error("GET /api/transparency-ledger error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}



