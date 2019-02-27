import _ from 'lodash'

import Messenger from './messenger'
import outgoing from './outgoing'
import incoming from './incoming'
import Users from './users'
import UMM from './umm'
import DB from './db'

let messenger = null
const outgoingPending = outgoing.pending

let users = null

const outgoingMiddleware = (event, next) => {
  if (event.platform !== 'facebook') {
    return next()
  }

  if (!outgoing[event.type]) {
    return next('Unsupported event type: ' + event.type)
  }

  const setValue = method => (...args) => {
    if (event.__id && outgoingPending[event.__id]) {
      if (args && args[0] && args[0].message_id) {
        outgoingPending[event.__id].timestamp = new Date().getTime() - 1000
        outgoingPending[event.__id].mid = args[0].message_id
      }

      if (method === 'resolve' && (event.raw.waitDelivery || event.raw.waitRead)) {
        // We skip setting this value because we wait
      } else {
        outgoingPending[event.__id][method].apply(null, args)
        delete outgoingPending[event.__id]
      }
    }
  }

  outgoing[event.type](event, next, messenger).then(setValue('resolve'), setValue('reject'))
}

const initializeMessenger = async (bp, configurator) => {
  const config = await configurator.loadAll()

  messenger = new Messenger(bp, config)
  users = Users(bp, messenger)

  const enabled = config.enabled

  if (!enabled) {
    return bp.logger.warn('[Messenger] Connection disabled')
  }

  return messenger
    .connect()
    .then(() => messenger.updateSettings())
    .catch(err => bp.logger.error(err))
}

let hostname = []
const defaultHostname =
  process.env.BOTPRESS_URL && process.env.NODE_ENV === 'production'
    ? (hostname = process.env.BOTPRESS_URL.match(/https:\/\/(.*?)\//)) && hostname[1]
    : ''

module.exports = {
  config: {
    applicationID: { type: 'string', required: true, default: '', env: 'MESSENGER_APP_ID' },
    accessToken: { type: 'string', required: true, default: '', env: 'MESSENGER_ACCESS_TOKEN' },
    appSecret: { type: 'string', required: true, default: '', env: 'MESSENGER_APP_SECRET' },
    verifyToken: { type: 'string', required: false, default: '', env: 'MESSENGER_VERIFY_TOKEN' },
    enabled: { type: 'bool', required: true, default: true },
    enableAllProfileFields: { type: 'bool', required: true, default: false },
    hostname: { type: 'string', required: false, default: defaultHostname, env: 'MESSENGER_HOST' },

    graphVersion: { type: 'string', required: true, default: '2.12' },
    displayGetStarted: { type: 'bool', required: false, default: true },
    greetingMessage: { type: 'string', required: false, default: 'Default greeting message' },
    persistentMenu: { type: 'bool', required: false, default: false },
    persistentMenuItems: { type: 'any', required: false, default: [], validation: v => _.isArray(v) },
    composerInputDisabled: { type: 'bool', required: false, default: false },
    automaticallyMarkAsRead: { type: 'bool', required: false, default: true },
    targetAudience: { type: 'string', required: true, default: 'openToAll' },
    targetAudienceOpenToSome: { type: 'string', required: false },
    targetAudienceCloseToSome: { type: 'string', required: false },
    trustedDomains: { type: 'any', required: false, default: [], validation: v => _.isArray(v) },

    autoResponseOption: { type: 'string', required: false, default: 'autoResponseTextRenderer' },
    autoResponseText: { type: 'string', required: false, default: 'Hello, human!' }, // TODO: unused, remove in v11
    autoResponseTextRenderer: { type: 'string', required: false, default: '#builtin_text' },
    autoResponsePostback: { type: 'string', required: false, default: 'YOUR_POSTBACK' },
    paymentTesters: { type: 'any', required: false, default: [], validation: v => _.isArray(v) },
    chatExtensionHomeUrl: { type: 'string', required: false, default: '' },
    chatExtensionInTest: { type: 'bool', required: false, default: true },
    chatExtensionShowShareButton: { type: 'bool', required: false, default: false },
    webhookSubscriptionFields: {
      type: 'any',
      required: true,
      default: [
        'message_deliveries',
        'message_reads',
        'messages',
        'messaging_optins',
        'messaging_postbacks',
        'messaging_referrals'
      ]
    }
  },

  init: async function(bp) {
    bp.middlewares.register({
      name: 'messenger.sendMessages',
      type: 'outgoing',
      order: 100,
      handler: outgoingMiddleware,
      module: 'botpress-messenger',
      description:
        'Sends out messages that targets platform = messenger.' +
        ' This middleware should be placed at the end as it swallows events once sent.'
    })

    bp.messenger = {}

    const knex = await bp.db.get()
    await DB(knex).initialize()

    UMM(bp) // Initializes Messenger in the UMM
  },

  ready: async function(bp, config) {
    await initializeMessenger(bp, config)
    incoming(bp, messenger)
    bp.messenger._internal = messenger
  }
}
