import cloudinary from "@/app/lib/cloudinary";

const MAX_BATCH_SIZE = 20;

type BatchResult =
  | {
      status: "fulfilled";
      publicId: string;
      optimizedUrl: string;
      stats: {
        originalBytes: number;
        optimizedBytes: number;
        savedBytes: number;
        savedPercent: string;
      };
    }
  | {
      status: "rejected";
      publicId: string;
      error: string;
    };

async function optimizeSingle(publicId: string): Promise<BatchResult> {
  try {
    const result = await cloudinary.uploader.explicit(publicId, {
      type: "upload",
      eager: [
        {
          fetch_format: "auto",
          quality: "auto",
          flags: "strip_profile",
        },
      ],
    });

    const originalBytes = result.bytes;
    const optimizedBytes = result.eager?.[0]?.bytes ?? originalBytes;

    return {
      status: "fulfilled",
      publicId,
      optimizedUrl: result.eager?.[0]?.secure_url,
      stats: {
        originalBytes,
        optimizedBytes,
        savedBytes: originalBytes - optimizedBytes,
        savedPercent: `${(((originalBytes - optimizedBytes) / originalBytes) * 100).toFixed(1)}%`,
      },
    };
  } catch (error: unknown) {
    return {
      status: "rejected",
      publicId,
      error: error instanceof Error ? error.message : "Optimization failed",
    };
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const {
    publicIds,
    concurrency = 5, // how many to process in parallel
  } = body;

  if (!Array.isArray(publicIds) || publicIds.length === 0) {
    return Response.json(
      { error: "publicIds must be a non-empty array" },
      { status: 400 },
    );
  }

  if (publicIds.length > MAX_BATCH_SIZE) {
    return Response.json(
      { error: `Maximum batch size is ${MAX_BATCH_SIZE} images` },
      { status: 400 },
    );
  }

  // Process in chunks to respect concurrency limit
  const results: BatchResult[] = [];

  for (let i = 0; i < publicIds.length; i += concurrency) {
    const chunk = publicIds.slice(i, i + concurrency);
    const chunkResults = await Promise.all(chunk.map(optimizeSingle));
    results.push(...chunkResults);
  }

  const fulfilled = results.filter((r) => r.status === "fulfilled");
  const rejected = results.filter((r) => r.status === "rejected");

  const totalOriginal = fulfilled.reduce(
    (sum, r) => (r.status === "fulfilled" ? sum + r.stats.originalBytes : sum),
    0,
  );
  const totalOptimized = fulfilled.reduce(
    (sum, r) => (r.status === "fulfilled" ? sum + r.stats.optimizedBytes : sum),
    0,
  );

  return Response.json({
    success: true,
    summary: {
      total: publicIds.length,
      succeeded: fulfilled.length,
      failed: rejected.length,
      stats: {
        totalOriginalBytes: totalOriginal,
        totalOptimizedBytes: totalOptimized,
        totalSavedBytes: totalOriginal - totalOptimized,
        totalSavedPercent: `${(((totalOriginal - totalOptimized) / totalOriginal) * 100).toFixed(1)}%`,
      },
    },
    results,
  });
}
