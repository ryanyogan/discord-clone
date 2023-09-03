"use server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";

export async function deleteChannel({
  channelId,
  serverId,
}: {
  channelId: string | undefined;
  serverId: string | undefined;
}) {
  try {
    const profile = await currentProfile();

    if (!profile || !serverId) {
      throw new Error("Unauthorized");
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: channelId,
            name: {
              not: "general",
            },
          },
        },
      },
    });

    return server;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function editChannel({
  channelId,
  serverId,
  name,
  type,
}: {
  channelId: string | undefined;
  serverId: string | undefined;
  name: string;
  type: ChannelType;
}) {
  try {
    const profile = await currentProfile();

    if (!profile || !serverId) {
      throw new Error("Unauthorized");
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: channelId,
              NOT: {
                name: "general",
              },
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    });

    return server;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
