/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GuildInfo
// ====================================================

export interface GuildInfo_guild_channels_category {
  __typename: "Category";
  name: string;
  position: number;
}

export interface GuildInfo_guild_channels {
  __typename: "TextChannel";
  name: string;
  id: string;
  position: number;
  topic: string | null;
  canSend: boolean;
  nsfw: boolean;
  category: GuildInfo_guild_channels_category | null;
}

export interface GuildInfo_guild_roles {
  __typename: "Role";
  id: string;
  name: string;
  color: number;
}

export interface GuildInfo_guild {
  __typename: "Guild";
  id: string;
  name: string;
  icon: string | null;
  memberCount: number;
  rulesChannelId: string | null;
  banner: string | null;
  splash: string | null;
  partnered: string;
  verified: string;
  tier: string;
  channels: GuildInfo_guild_channels[];
  roles: GuildInfo_guild_roles[];
}

export interface GuildInfo {
  guild: GuildInfo_guild;
}

export interface GuildInfoVariables {
  guild: string;
}
