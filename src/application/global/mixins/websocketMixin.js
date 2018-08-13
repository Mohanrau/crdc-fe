import io from 'socket.io-client'
import { date } from 'quasar'
import { mapState, mapMutations } from 'vuex'

export default {
  components: {
    date
  },
  computed: {
    ...mapState({
      websocket: state => state.globalCMP.websocket
    })
  },
  data: () => ({
    socket: '',
    reconnecting_count: 0
  }),
  created () {
    // Url from env file
    this.socket = io.connect(process.env.WEBSOCKET_URL ? process.env.WEBSOCKET_URL : 'http://nibsdev-be.elken.com', {
      secure: false,
      rejectUnauthorized: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 1000
    })
    this.socket.on('connection', () => {
      this.writeLogData('a user connected: ', this.socket.id)
    })
    if (!this.websocket.connected) {
      this.socket.on('connect', () => {
        this.reconnecting_count = 0
        this.setWebsocketStatus(true)
        this.writeLogData('connected')
      })
    }
    this.socket.on('sales-created:sales.new', (data) => {
      this.writeChannelData('sales-created:sales.new', data)
      this.writeLogData('sales-created:sales.new', data)
    })
    this.socket.on('disconnect', (reason) => {
      this.setWebsocketStatus(false)
      this.writeLogData('disconnected', reason)
    })
    // Todo Not used for now remove if not use at all
    // this.socket.on('reconnect', (attemptNumber) => {
    //   this.setWebsocketStatus(false)
    //   this.writeLogData('reconnect', attemptNumber)
    // })
    // this.socket.on('reconnect_attempt', (attemptNumber) => {
    //   this.setWebsocketStatus(false)
    //   this.socket.io.opts.transports = ['polling', 'websocket']
    //   this.writeLogData('reconnect_attempt', attemptNumber)
    // })
    this.socket.on('reconnecting', (attemptNumber) => {
      this.setWebsocketStatus(false)
      this.socket.io.opts.transports = ['polling', 'websocket']
      this.reconnecting_count = attemptNumber
      this.writeLogData('reconnecting', attemptNumber)
    })
    this.socket.on('reconnect_error', (error) => {
      this.setWebsocketStatus(false)
      this.writeLogData('reconnect_error', error)
    })
    this.socket.on('reconnect_failed', () => {
      this.setWebsocketStatus(false)
      this.writeLogData('reconnect_failed')
    })
    this.socket.on('error', (error) => {
      this.setWebsocketStatus(false)
      this.writeLogData('error', error)
    })
    this.socket.on('connect_error', (error) => {
      this.setWebsocketStatus(false)
      this.writeLogData('connect_error', error)
    })
    this.socket.on('ping', () => {
      this.writeLogData('ping')
    })
    this.socket.on('pong', (latency) => {
      this.writeLogData('pong', latency)
    })
  },
  methods: {
    ...mapMutations({
      writeWebsocketLog: 'WRITE_WEBSOCKET_LOG',
      setWebsocketStatus: 'SET_WEBSOCKET_STATUS',
      writeWebsocketChannelData: 'WRITE_CHANNEL_DATA',
      unsetWebsocketChannelData: 'UNSET_CHANNEL_DATA'
    }),
    writeLogData (type, data) {
      let logger = process.env.WEBSOCKET_LOGGER
      if (logger === 'true') {
        console.log(type, (data !== undefined && data !== '' ? data : ''))
      }
    },
    writeChannelData (event, response) {
      let data = {
        channel: event,
        response: response
      }
      this.writeWebsocketChannelData(data)
    }
  }
}
