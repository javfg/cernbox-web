import { $gettext } from './gettext'
import { createQuicklink } from './helpers/share'
import copyToClipboard from 'copy-to-clipboard'

export async function openNewCollaboratorsPanel(ctx) {
  await ctx.store.dispatch('Files/sidebar/openWithPanel', 'sharing-item#peopleShares')
}

export async function openSpaceMembersPanel(ctx) {
  await ctx.store.dispatch('Files/sidebar/openWithPanel', 'space-share-item')
}

export function canShare(item, store) {
  const { capabilities } = store.state.user
  if (item.path === store.getters.homeFolder) {
    return false
  }
  if (!capabilities.files_sharing || !capabilities.files_sharing.api_enabled) {
    return false
  }
  if (item.isReceivedShare() && !capabilities.files_sharing.resharing) {
    return false
  }
  return item.canShare()
}

export function showQuickLinkPasswordModal(ctx, onConfirm) {
  const modal = {
    variation: 'passive',
    title: $gettext('Set password'),
    cancelText: $gettext('Cancel'),
    confirmText: $gettext('Set'),
    hasInput: true,
    inputDescription: $gettext('Passwords for links are required.'),
    inputLabel: $gettext('Password'),
    inputType: 'password',
    onCancel: () => ctx.store.dispatch('hideModal'),
    onConfirm: async (password) => {
      if (!password || password.trim() === '') {
        ctx.store.dispatch('showMessage', {
          title: $gettext('Password cannot be empty'),
          status: 'danger'
        })
      } else {
        await ctx.store.dispatch('hideModal')
        onConfirm(password)
      }
    },
    onInput: (password) => {
      if (password.trim() === '') {
        return ctx.store.dispatch('setModalInputErrorMessage', $gettext('Password cannot be empty'))
      }
      return ctx.store.dispatch('setModalInputErrorMessage', null)
    }
  }

  return ctx.store.dispatch('createModal', modal)
}

export default {
  collaborators: {
    id: 'collaborators',
    label: ($gettext) => $gettext('Add people'),
    icon: 'user-add',
    handler: openNewCollaboratorsPanel,
    displayed: canShare
  },
  quicklink: {
    id: 'quicklink',
    label: ($gettext) => $gettext('Copy quicklink'),
    icon: 'link',
    handler: async (ctx) => {
      const existingQuickLink = ctx.store.getters['Files/currentFileOutgoingLinks'].filter(
        link => link.quicklink || link.name === '__quicklink' || link.name === 'Quicklink'
      )
      if (existingQuickLink.length) {
        copyToClipboard(existingQuickLink.url)
        await ctx.store.dispatch('showMessage', {
          title: $gettext('Quicklink copied into your clipboard')
        })
      } else {
        const passwordEnforced =
          ctx.store.getters.capabilities?.files_sharing?.public?.password?.enforced_for?.read_only ===
          true

        if (passwordEnforced) {
          return showQuickLinkPasswordModal(ctx, async (password) => {
            await createQuicklink({ ...ctx, resource: ctx.item, password })
            await ctx.store.dispatch('Files/sidebar/openWithPanel', 'sharing-item#linkShares')
          })
        }

        await createQuicklink({ ...ctx, resource: ctx.item })
      }
      await ctx.store.dispatch('Files/sidebar/openWithPanel', 'sharing-item#linkShares')
    },
    displayed: canShare
  }
}
