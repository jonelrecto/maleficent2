<template>
	<div>
    <q-page class="bgImg">
			<q-toolbar color="faded">
			<q-toolbar-title>
				Messages<span slot="subtitle" class="capitalize">from {{getModelInfo.firstName}} {{getModelInfo.lastName}}</span>
				<!-- <span slot="subtitle">Optional subtitle</span> -->
			</q-toolbar-title>
				<q-btn
				flat round dense
				@click="right = !right"
				icon="email"
				class=""
				>
					<q-chip floating color="red" v-if="GetTotalUnread">{{GetTotalUnread}}</q-chip>
				</q-btn>
			</q-toolbar>

			<div style="width:auto;" class="q-pa-sm">
				<div class="container row msgs" style="border-radius: 20px; height: auto;">
					<div class="scrollA scroll">
						<div class="q-pa-md q-ma-md">
							<q-chat-message
								v-for="msg in getModelMessages"
								:index="$moment(msg.dateTime).format('lll')"
								:key="msg['.key']"
								:label="$moment(msg.dateTime).format('lll')"
								:name="msg.from"
								:text="msg.msg"
								:stamp="$moment(msg.dateTime).fromNow()"
								:bg-color="msg.color"
								:text-color="msg.text"
								:sent="msg.sent"
								:avatar="msg.avatar"
								:id="msg['.key']"
							/>
						</div>
					</div>

					<div class="col-12">
					<q-input type="textarea" hide-underline v-model="message" label="Text" placeholder="Message Here" class="absolute-bottom bg-white text-dark q-pa-xs q-mx-md q-mb-sm" style="border-radius: 15px;border-color: black;">
						<q-btn flat icon="send" @click="send" class="q-ma-sm"/>
					</q-input>
					</div>

				</div>
			</div>
		
		</q-page>
    <q-layout-drawer
      side="right"
      v-model="right"
      :content-class="$q.theme === 'mat' ? 'bg-grey-3' : null"
      :content-style="{fontSize: '16px'}"
    >
			<q-toolbar class="">
			<q-search hide-underline inverted v-model="searchChat" class="bg-white text-dark full-width" clearable placeholder="Search name"/>
			</q-toolbar>
			<q-list-header>Models</q-list-header>
				<q-list separator link v-for="msgs in filteredMessages" :key="msgs['.key']">
						<div @click="setUnreadTrue">
							<q-item :to="'/chat/'+msgs.accountNumber" >
									<q-item-side inverted :letter="returnLetter(msgs)" :color="returnLastColor(msgs)"></q-item-side>
									<q-item-main :class="showBold(msgs.accountNumber)" :label="returnFullName(msgs)" :sublabel="returnLastMessage(msgs)">
											<span class="q-caption">{{$moment(msgs.lastmsgdate).fromNow()}}<br></span>
									</q-item-main>
									<q-item-side right>
									<q-chip color="red" class="small" v-if="showCount(msgs.accountNumber)">{{showCount(msgs.accountNumber)}}</q-chip></q-item-side>
							</q-item>
						</div>
			</q-list>
    </q-layout-drawer>
	</div>
</template>
<style>
.scrollA{
  height:75vh; width:100%;
}
.bgImg{
  background:
    linear-gradient(
      rgba(255, 255, 255, 0.911),
      rgba(255, 255, 255, 0.678)
    ),
    url("/statics/bg-01.jpg");
}
.show-mobile{
     display: none;
}
/* width */
::-webkit-scrollbar {
    width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
    background: #f1f1f1; 
}
 
/* Handle */
::-webkit-scrollbar-thumb {
    background: #888; 
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: #555; 
}
@media (max-width: 960px){
.scrollA{
  height: 78vh;
}
.show-mobile{
     display: block;
}
}
</style>
<script>
import { scroll } from 'quasar'
const { getScrollTarget, setScrollPosition } = scroll
// takes an element object
function scrollToElement (el) {
  let target = getScrollTarget(el)
  let offset = el.offsetTop - el.scrollHeight
  let duration = 1000
  setScrollPosition(target, offset, duration)
}


export default {
    data () {
        return {
            accountNum: '',
            contractsigned: [],
            messages: [],
            message: '',
            right: true,
            msgsCount: [],
            showChip: true,
            searchChat: '',
        }
    },
    mounted () {
        this.scrollToEnd()
    },
    updated() {
        this.scrollToEnd();
            
    },
    created () {
        this.$bindAsArray('contractsigned', this.$database.ref('contractSigned'))
        this.accountNum = this.$route.params.id
        this.$bindAsArray('messages', this.$database.ref('messages/'+ this.accountNum))
        this.$bindAsArray('allMessage', this.$database.ref('messages'))
        console.log('accountNum', this.accountNum)
        console.log('msgsfilter', this.messages)
        this.setUnreadTrue()
    },
    watch: {
    },
    computed: {
        filteredMessages: function(){
        return this.getMessagesFrom.filter((s) => {
          var reg = new RegExp(this.searchChat, "i")
          var string = s.firstName +' '+ s.lastName
          return string.match(reg)
        })
      },
        getModelKey () {
            let modKey = this.$route.params.id
            // console.log('model Key', modKey)
            return modKey
        },
        getMessagesFrom () {
			let accounts = []
			try {
				for (var i = 0; i < this.contractsigned.length; i++) {
				var s = Object.assign([], this.contractsigned[i])
					for (var j = 0; j < this.allMessage.length; j++) {
                        var msgs = Object.assign({}, this.allMessage[j])
                        // var msgs = Object.values(this.allMessage[j])
						if(s.accountNumber === msgs['.key']){
                            delete msgs['.key']
							accounts.push(Object.assign({}, s,{msgs: Object.values(msgs)})) 
						}
					}
				}

                for(var x =0 ; x < accounts.length; x++) {
                    let index = accounts[x].msgs.length-1
                    let date = new Date(accounts[x].msgs[index].dateTime)
                    accounts[x].lastmsgdate = date
                    accounts[x].lastmessage = accounts[x].msgs[index].msg
                    accounts[x].lastmsgcolor = accounts[x].msgs[index].color
                    accounts[x].lastmsgtext = accounts[x].msgs[index].text
                    accounts[x].lastmsgto = accounts[x].msgs[index].to
                }
                let sorted = this.$lodash.orderBy(accounts,['lastmsgdate'],['desc'])
                console.log('sorted',sorted)
                console.log('accts', accounts)
				return sorted
			} catch (err) {
                return null
            }
        },
        getModelMessages () {
            this.$bindAsArray('modelmsgs', this.$database.ref('messages/'+ this.$route.params.id))
            let filter = []
            try {
                for (var i = 0; i < this.modelmsgs.length; i++) {
                var s = Object.assign([], this.modelmsgs[i])
                if (s.from !== 'Model Coordinator') {
                    delete s.sent
                    filter.push(Object.assign({}, s))
                } else {
                    filter.push(Object.assign({}, s))
                }
                }
                console.log('filter SENT', filter)
                return filter
            } catch (err) {
            }
        },
        getLastMessageKey (){
            let length = this.getModelMessages.length
            let lastkey = this.getModelMessages[length-1]['.key']
            let string = '#' + lastkey.toString()
            console.log(string)
            return string
        },
        getModelInfo () {
            try {
                let modelList = this.$lodash.filter(this.contractsigned, c => {
                    return c.accountNumber === this.getModelKey
                })
                console.log('list', modelList)
                return modelList[0]
            } catch {
                return {}
            }
            
        },
        MessageCounter () {
            console.log('mes', this.allMessage[0])
				let counter = []
				for (var x = 0; x < this.allMessage.length; x++) {
					let accntNumber = this.allMessage[x]['.key']
					let keys = Object.keys(this.allMessage[x])
					let mess = []
					for (var i = 0; i < keys.length-1; i++) {
						mess.push({...this.allMessage[x][keys[i]]})
					}
					let filtered = this.$lodash.filter(mess, m => {
						return m.to === 'Model Coordinator' && m.seen === false
					})
                    console.log('filtered',filtered)
					counter.push({count: filtered.length, key: accntNumber})
				}
                console.log('COUNTER', counter)
                return counter
        },
        GetTotalUnread () {
			try {
				let total = this.$lodash.sumBy(this.MessageCounter, 'count')
				if (total === 0) {
					return 0
				} else {
					return total
				}	
			} catch (error) {
				return null
			}

		}
    },
    methods: {
        send () {
        let msg = {
            to: this.getModelInfo.firstName,
            from: 'Model Coordinator',
            msg: [this.message],
            dateTime: this.$moment().format('LLL'),
            color: 'white',
            text: 'dark',
            avatar: 'statics/secreterial.png',
            sent: true,
            seen: false
        }
        // let msg = {
        //     label: this.$moment().format('MMM Do')
        // }
        console.log(msg)
        this.$database.ref('messages/' + this.getModelKey).push(msg).then(() => {
            this.message = ''
        })
        },
        showCount (e) {
            let count = 0
            try {
                for (var x = 0; x < this.MessageCounter.length; x++) {
                    let key = this.MessageCounter[x].key
                if (key === e) {
                    count = this.MessageCounter[x].count
                }
                }
                if(count === 0) {
                    return 0
                } else {
                    return count
                }
            } catch (error) {
            }
        },
        showBold (e) {
            let count = 0
            try {
                for (var x = 0; x < this.MessageCounter.length; x++) {
                    let key = this.MessageCounter[x].key
                if (key === e) {
                    count = this.MessageCounter[x].count
                }
                }
                if(count === 0) {
                    return 'q-body-1'
                } else {
                    return 'text-weight-bolder q-body-1'
                }
            } catch (error) {
            }
        },
        setUnreadTrue () {
            let e = this.$route.params.id
            for (var y=0; y < this.getModelMessages.length; y++) {
                if (this.getModelMessages[y].to === 'Model Coordinator' && this.getModelMessages[y].seen === false){
                    this.$database.ref('messages/' + e + '/' + this.getModelMessages[y]['.key'] + '/seen').set(true)
                }
            }
        },
        getMsgs (s) {
            let model = s
            let key = s['.key']
            this.$bindAsArray('modelmsgsdate', this.$database.ref('messages/'+ key))
            try {
                let last = this.modelmsgsdate
                console.log('S', last)
                return lastf
            } catch (err) {
            }
        },
        returnFullName (s) {
            try {
                let full = this.$lodash.capitalize(s.firstName) + ' ' + this.$lodash.capitalize(s.lastName)
                return full
            } catch (err) {
                return ''
            }
        },
        returnLastMessage (s) {
        try {
            let full = s.lastmessage.toString()
            if(s.lastmsgto === 'Model Coordinator') {
                if(full.length > 45) {
                    return full.slice(0,45) + ' [. . .]'
                } else {
                    return full
                }
            } else {
                let msg = 'You: ' + full
                if(full.length > 45) {
                    return msg.slice(0,45) + ' [. . .]'
                } else {
                    return msg
                }
            }
        } catch (err) {
            return ''
        }
        },
        returnLastColor (s) {
        try {
            let admin = s.lastmsgtext
            let model = s.lastmsgcolor
            if (s.lastmsgto !== 'Model Coordinator') {
                return 'light'
            } else {
                return model
            }
        } catch (err) {
            return ''
        }
        },
    returnLetter (s) {
        try {
            let full = s.firstName
            let letter = this.$lodash.filter(full, e=> {
                return e
            })
            return letter[0].toUpperCase()
        } catch (err) {
            return ''
        }
    },
    scrollToEnd() {
        var container = document.querySelector(".scrollA");
        var scrollHeight = container.scrollHeight;
        container.scrollTop = scrollHeight;
        this.setUnreadTrue()
    }
    //end of methods
  }
}
</script>

            

        