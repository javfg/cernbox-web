// These interfaces have empty (unused) __${type}SpaceResource properties which are only
// there to make the types differ, in order to make TypeScript type narrowing work correctly
// With empty types TypeScript does not accept this code
// ```
//   if(isPublicSpaceResource(resource)) { console.log(resource.id) } else { console.log(resource.id) }
// ```
// because in the else block resource gets the type never. If this is changed in a later TypeScript version
// or all types get different members, the underscored props can be removed.
import { Resource } from '../resource'

export interface SpaceResource extends Resource {
  webDavUrl: string
  getWebDavUrl(resource: Resource): string
  getDriveAliasAndItem(resource: Resource): string
}

export interface PersonalSpaceResource extends SpaceResource {
  __personalSpaceResource?: any
}
export const isPersonalSpaceResource = (resource: Resource): resource is PersonalSpaceResource => {
  return resource.driveType === 'personal'
}

export interface ProjectSpaceResource extends SpaceResource {
  __projectSpaceResource?: any
}
export const isProjectSpaceResource = (resource: Resource): resource is ProjectSpaceResource => {
  return resource.driveType === 'project'
}

export interface ShareSpaceResource extends SpaceResource {
  __shareSpaceResource?: any
}
export const isShareSpaceResource = (resource: Resource): resource is ShareSpaceResource => {
  return resource.driveType === 'share'
}

export interface PublicSpaceResource extends SpaceResource {
  publicLinkPassword?: string
  publicLinkItemType?: string
  publicLinkPermission?: number
  publicLinkExpiration?: string
  publicLinkShareDate?: string
  publicLinkShareOwner?: string
}
export const isPublicSpaceResource = (resource: Resource): resource is PublicSpaceResource => {
  return resource.driveType === 'public'
}