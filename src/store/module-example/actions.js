import Vue from 'vue'
import VueRouter from 'vue-router'

// update event pages actions
export const test = () => {
  // let proto = VueRouter.prototype
  console.log('vue', Vue.prototype)
  // VueRouter.prototype.push('/eventseason/-LLcqy4vtpwv6OxaUUML')
  // proto.push('attendance')
}

export const addNewEvent = ({state,getters}, {newEvent, range, eventLogo}) => {
  return new Promise(function (resolve, reject) {
    state.eventLoading = true
    let $firebase = Vue.prototype.$firebase
    let storageRef = $firebase.storage().ref()
    let $q = Vue.prototype.$q

    let event = Object.assign({}, newEvent)
    var ageRange = Object.assign([], event.ageRange)
    event.ageRange = ageRange
    // event.eventCode = getters['getAcronym'](event.eventName)
    if (!event.ageRange.infant) {
      event.ageRange.min = range.min + 'yrs old'
      event.ageRange.max = range.max + 'yrs old'
      event.ageRange.type = 'above 4'
    }
    var page = {
      header: '',
      content: '',
      footer: ''
    }
    var pagePhotos = {
      eventLogoUrl: '',
      homeLogoUrl: '',
      titleImageUrl: '',
      registrationImageUrl: ''
    }
    event.page = page
    event.pagePhotos = pagePhotos
    console.log(event, 'event')
    let uploadTask = storageRef.child(`pagePhotos/${event.eventCode}_${event.eventName}`).put(eventLogo)
    uploadTask.on('state_changed', function(snapshot){
      var prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    }, function (error) {
      $q.notify({
        message: `An error occur`,
        type: 'negative',
        color: 'negative',
        textColor: 'white',
        icon: 'warning'
      })
      console.log('error occur', error)
      reject(error)
    }, function () {
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        event.pagePhotos.eventLogoUrl = downloadURL
        console.log('add to event', event)
        $firebase.database().ref('events').push(event)
          .then((snapshot) => {
            $q.notify({
              message: `${event.eventName} has been succesfully added`,
              type: 'positive',
              color: 'positive',
              textColor: 'white',
              icon: 'info'
            })
            console.log('snapshot', snapshot.key)
            state.eventKey = snapshot.key
            resolve(snapshot.key)
            // router.push(`/eventseason/${snapshot.key}`)
            state.eventLoading = false
            state.eventModal = false
          })
          .catch((err) => {
            $q.notify({
              message: `An Error Occured`,
              type: 'negative',
              color: 'negative',
              textColor: 'white',
              icon: 'warning'
            })
            console.log('error', err)
            state.eventLoading = false
            state.eventModal = false
          })
      })
    })
  })
}

export const setupEvents = ({commit}, payload) => {
	commit('setEvents', payload)
}
export const openEventPageModal = ({commit}) => {
	commit('updateEventPageModal', true)
}
export const updatePages = ({commit}, payload) => {
	commit('updatePages', payload)
}

export const addEventPage = ({commit}, {payload, pageData, whatThis, quasu}) => {
	commit('updateEventPageLoading', true)
	let DB3 = whatThis
  let event = Object.assign({}, payload)
  var key = event['.key']
  delete event['.key']
  event.page = pageData

  console.log('DB3', DB3)
  console.log('event in action', event)
  DB3.ref('events').child(key).update(event)
    .then(() => {
      commit('updateEventPageLoading', false)
      commit('updateEventPageModal', false)
      quasu.notify({
        message: `${event.eventName} has been succesfully updated`,
        type: 'positive',
        color: 'positive',
        textColor: 'white',
        icon: 'info'
      })
    })
    .catch(error => {
      commit('updateEventPageLoading', false)
      commit('updateEventPageModal', false)
      quasu.notify({
        message: `An Error Occured`,
        type: 'negative',
        color: 'negative',
        textColor: 'white',
        icon: 'warning'
      })
      console.log('error', error)
    })
}

export const updateEventPhotos = ({commit}, {payload, whatThis, quasu}) => {
  let DB3 = whatThis
  let event = Object.assign({}, payload)
  var key = event['.key']
  delete event['.key']
  console.log('key in action', key)
  console.log('event in action', event)
  setTimeout(() => {
    Vue.prototype.$database.ref(`events/${key}`).update(event)
      .then(() => {
        commit('updateEventPageLoading', false)
        commit('updateEventPagePhotosModal', false)
        quasu.notify({
          message: `${event.eventName} has been succesfully updated`,
          type: 'positive',
          color: 'positive',
          textColor: 'white',
          icon: 'info'
        })
      })
      .catch(error => {
        commit('updateEventPageLoading', false)
        commit('updateEventPagePhotosModal', false)
        quasu.notify({
          message: `An Error Occured`,
          type: 'negative',
          color: 'negative',
          textColor: 'white',
          icon: 'warning'
        })
        console.log('error', error)
      })  
  }, 3000)
  
}
// event pages photos
export const updatePagePhotos = ({commit}, payload) => {
  commit('updatePagePhotos', payload)
}

export const updateEvent = ({commit}, payload) => {
  commit('updateEvent', payload)
}

// season actions
export const updateSeasonModal = ({commit}, payload) => {
  commit('seasonModal', payload)
}
export const addNewSeason = ({state}) => {
  // if season is only 1
  let $database = Vue.prototype.$database
  let $q = Vue.prototype.$q
  function removeComma (total) {
    return total.replace(',', '')
  }
  var key = state.newSeason.eventKey
  // console.log('season', state.newSeason)
  let seasonActivities = {...state.newSeason}
  for (var i = 0; i < state.newSeasonActivities.length; i++) {
    state.newSeasonActivities[i].batch = 1
    state.newSeasonActivities[i].startDate = state.newSeasonActivities[i].startDate.toString()
    state.newSeasonActivities[i].endDate = state.newSeasonActivities[i].endDate.toString()
    state.newSeasonActivities[i].dueDate = state.newSeasonActivities[i].dueDate ? state.newSeasonActivities[i].dueDate.toString() : ''
    state.newSeasonActivities[i].time = state.newSeasonActivities[i].time ? state.newSeasonActivities[i].time.toString() : ''
    state.newSeasonActivities[i].updated = false
  }
  seasonActivities.activities = state.newSeasonActivities
  seasonActivities.batchNumber = 1
  seasonActivities.batchStart = state.newSeasonActivities[0].startDate
  seasonActivities.totalAmount = removeComma(state.newSeason.totalAmount)
  state.newSeason.totalAmount = removeComma(state.newSeason.totalAmount)
  console.log('season activities in aciton', seasonActivities)
  
  var seasonNumber = state.newSeason.seasonNumber
    --seasonNumber
  console.log('new season in aciton', state.newSeason)
  console.log('season number', seasonNumber)
  $database.ref(`events/${key}/seasons/${seasonNumber}`).set(state.newSeason)
    .then(() => {
      $database.ref(`event_schedules`).push(seasonActivities)
        .then(() => {
          $q.notify({
            message: `${state.newSeason.seasonName} Batch 1 has been added`,
            type: 'positive',
            color: 'positive',
            textColor: 'white',
            icon: 'info'
          })
        })
    })
    .catch(error => {
      $q.notify({
        message: `We got an error`,
        type: 'negative',
        color: 'negative',
        textColor: 'white',
        icon: 'warning'
      })
      console.log('error', error)
    })
  state.isNewSeasonActivities = false
}

export const updateSeason = ({commit}, {payload,seasonNumber,fireb, quasu}) => {
  // commit('seasonLoading', true)
  let season = Object.assign({}, payload)
  var key = season.eventKey
  // delete season.__index
  console.log('season to update', season)
  console.log('season in action', `event/${key}/seasons/${seasonNumber}`)
  fireb.ref(`events/${key}/seasons/${seasonNumber}`).update(season)
    .then(() => {
      commit('seasonLoading', false)
      commit('seasonModal', false)
      quasu.notify({
        message: `${season.eventName} has been succesfully updated`,
        type: 'positive',
        color: 'positive',
        textColor: 'white',
        icon: 'info'
      })
    })
    .catch(error => {
      commit('seasonLoading', false)
      commit('seasonModal', false)
      quasu.notify({
        message: `An Error Occured`,
        type: 'negative',
        color: 'negative',
        textColor: 'white',
        icon: 'warning'
      })
      console.log('error', error)
    })
}

export const deleteSeason = ({commit}, {payload, key, index, fireb, quasu}) => {
  quasu.dialog({
    title: 'Delete Confirmation',
    message: `Do you want to delete ${payload.seasonName}?`,
    ok: 'Yes',
    cancel: 'No'
  }).then(() => {
      fireb.ref(`events/${key}/seasons/${index}`).remove()
        .then(() => {
          quasu.notify({
            message: `${payload.eventName} deleted`,
            type: 'info',
            color: 'info',
            textColor: 'white',
            icon: 'info'
          })
        })
        .catch(err => {
          quasu.notify({
            message: `An Error occur`,
            type: 'info',
            color: 'info',
            textColor: 'white',
            icon: 'info'
          })
          console.log('err', err)
        })
    }).catch(() => {})
}

export const deleteSeason2 = (state, {eventKey, index, seasonNo}) => {
 let db = Vue.prototype.$database
 let q = Vue.prototype.$q
 console.log('eventkey', eventKey)
 db.ref(`events/${eventKey}/seasons/${index}`).remove()
  .then(() => {
    q.notify({
      message: `Season ${seasonNo} has been removed`,
      type: 'info',
      color: 'info',
      textColor: 'white',
      icon: 'info'
    })
  })
  .catch(err => {
    q.notify({
      message: `An Error occur`,
      type: 'negative',
      color: 'negative',
      textColor: 'white',
      icon: 'info'
    })
    console.log('err', err)
  })
}

export const finishedSeason = ({commit}, {payload, fireb, quasu}) => {
  fireb.ref('finished_season').push(payload)
    .then(() => {
      quasu.notify({
        message: `${payload.eventName} Season ${payload.seasonNumber} has been finished`,
        type: 'info',
        color: 'info',
        textColor: 'white',
        icon: 'info'
      })
    })
    .catch(err => {
      quasu.notify({
        message: `An Error occur`,
        type: 'info',
        color: 'info',
        textColor: 'white',
        icon: 'info'
      })
      console.log('err', err)
    })
  fireb.ref('events')
}

export const addNewBatch = (state, batch) => {
  let $database = Vue.prototype.$database
  let $q = Vue.prototype.$q
  delete batch['.key']
  console.log('batch in action', batch)
  $database.ref('event_schedules').push(batch)
    .then(() => {
      $q.notify({
        message: `Batch ${batch.batchNumber} has been created`,
        type: 'positive',
        color: 'positive',
        textColor: 'white',
        icon: 'info'
      })
      state.newSeasonActivities = []
    })
    .catch(err => {
      quasu.notify({
        message: `An Error occur`,
        type: 'info',
        color: 'info',
        textColor: 'white',
        icon: 'info'
      })
      console.log('err', err)
    })
}

export const launchSeason = (state, {event, season}) => {
  let db = Vue.prototype.$database
  let q = Vue.prototype.$q
  let _ = Vue.prototype.$lodash
  let index = _.findIndex(event.seasons, s => {
    return s.seasonNumber === season.seasonNumber
  })
  db.ref(`events/${season.eventKey}/seasons/${index}/status`).set('open')
    .then(() => {
      q.notify({
        message: `Season ${season.seasonNumber} has been launched`,
        type: 'positive',
        color: 'positive',
        textColor: 'white',
        icon: 'info'
      })
    })
    .catch(err => {
      q.notify({
        message: `An Error occur`,
        type: 'info',
        color: 'info',
        textColor: 'white',
        icon: 'info'
      })
      console.log('err', err)
    })
}

export const standBySeason = (state, {event, season}) => {
  const db = Vue.prototype.$database
  const q = Vue.prototype.$q
  const _ = Vue.prototype.$lodash
  let index = _.findIndex(event.seasons, s => {
    return s.seasonNumber === season.seasonNumber
  })
  db.ref(`events/${season.eventKey}/seasons/${index}/status`).set('standby')
    .then(() => {
      q.notify({
        message: `Season ${season.seasonNumber} has been cancelled`,
        type: 'positive',
        color: 'positive',
        textColor: 'white',
        icon: 'info'
      })
    })
    .catch(err => {
      q.notify({
        message: `An Error occur`,
        type: 'info',
        color: 'info',
        textColor: 'white',
        icon: 'info'
      })
      console.log('err', err)
    })
}

export const updateSeasonBatches = (state, batches) => {
  console.log('batches in actions', batches)
  let db = Vue.prototype.$database
  console.log('database', db)
  for (var i = 0; i < batches.length; i++) {
    var batchKey = batches[i]['.key']
    console('batchkey', batchKey)
    let activities = batches[i].activities
    for (var j = 0; j < activities.length; j++) {
      activities[j].startDate = activities[j].startDate.toString()
      activities[j].endDate = activities[j].endDate.toString()
      activities[j].dueDate = activities[j].dueDate ? activities[j].dueDate.toString() : ''
      activities[j].time = activities[j].time ? activities[j].time.toString() : ''
    }
    console.log('act', activities)
    setTimeout(() => {
      db.ref(`event_schedules/${batchKey}/activities`).update(activities)
      .then(() => {
        console.log('success')
      })
      .catch((err) => {
        console.log('error', err)
        return
      })
    }, 1000)
  }
}

