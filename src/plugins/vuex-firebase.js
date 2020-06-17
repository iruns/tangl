import {mapActions} from 'vuex'
import _ from 'lodash'

export default {
  install (Vue, options) {
    const store = options.store
    const firebase = options.firebase

    // IDEA optimization: maybe change the path to a tree instead of separate paths for each
    function getFullPath ({path, ref}) {
      path =
        (ref
          ? ref().path.toString() + '/'
          : '') +
        (path || '')
      return path
    }

    function getLink (state, payload) {
      return state.links[getFullPath(payload)]
    }

    store.registerModule('vf', {
      namespaced: true,
      state: {
        links: {},
        groupedLinks: {},
      },
      actions: {
        // PUBLIC
        /**
         * Binds the source inside the parent object as a new object.
         * If a binder is supplied, this will either create a new bound or add a binder to an existing bound. Binders are removed by unbind()
         * Only bounds with no more binders will actually be removed
         * @param  {String}   payload.id                id of the firebase object (used as the object's key)
         * @param  {String}   payload.binder            id of the binder
         * @param  {Object}   payload.config.parent     state object that will contain the firebase object
         * @param  {String}   [payload.ref]             existing firebase ref
         * @param  {String}   [payload.path]            additional path to the firebase child
         * @param  {Boolean}  [payload.live = true]     whether or not listening live
         * @param  {Object}   [payload.config.refParent]            state object that will contain the ref to the database
         * @param  {Boolean}  [payload.config.getPlaceholder]       function to create placeholder data before the actual one is fetched
         * @param  {Boolean}  [payload.config.asArray = false]      set type of the container to Array instead of Object
         * @param  {Boolean}  [payload.config.bindChildren = false] bind children directly to the parent, with no self object
         * @param  {Object}   [payload.config.childListParent]      only if bindChildren, state object for the parent for the firebase object's childList array
         * @param  {Function} [payload.config.customAddChild]       function to be called on addChild. Signature: (key, child, parent) => { childAlreadyAdded }
         * @param  {Function} [payload.config.customRemoveChild]    function to be called on removeChild. Signature: (key, parent) => { childAlreadyRemoved }
         */
        bind (context, payload) {
          const fullPath = payload.fullPath = getFullPath(payload)

          const {config} = payload

          // get existing or create new link
          context.commit('getOrCreateLink', payload)
          const link = context.state.links[fullPath]

          // if new and there's a getPlaceholder, assign it
          if (link.new && config.getPlaceholder) {
            context.commit(
              'setData',
              {
                link,
                newData: config.getPlaceholder(payload.id),
              }
            )
          }

          // delete the temp data
          context.commit('updateLink', [link, 'new'])
          context.commit('updateLink', [link, 'tempData'])

          // set / update live
          context.dispatch('setLive', link)

          // return the bound firebase ref for easy manipulation
          return link.ref
        },

        /**
         * Unbound an object. If the object has other binders, it won't be removed yet
         * @param  {String} payload.ref   firebase ref
         * @param  {String} payload.path  additional path to the firebase child
         * @param  {String} payload.binder  id of the binder
         */
        unbind (context, payload) {
          const {binder} = payload
          // delete the link
          context.dispatch('unbindLink', {
            link: getLink(context.state, payload),
            binder
          })
        },

        /**
         * [unbindAfter description]
         * @param  {String} payload.ref firebase ref
         * @param  {String} payload.path additional path to the firebase child
         * @param  {Object} payload.link the link object itself
         * @param  {String} payload.binder  id of the binder
         * @param  {Number} [payload.delay = 60000] delay (ms) before it's actually unbound
         */
        unbindAfter (context, payload) {
          const {
            link = getLink(context.state, payload),
            // delay = 60000,
            delay = 1000
          } = payload

          if (link) {
            // if there's an old countdown timer, stop
            if (link.cds[payload.binder]) {
              clearTimeout(link.cds[payload.binder])
            }
            // start countdown to unbinding
            link.cds[payload.binder] = setTimeout(
              () => {
                context.dispatch('unbindLink', {
                  link,
                  binder: payload.binder
                })
              }, delay
            )
          }
        },

        /**
         * Bind new links and unbind unused links of a binder
         * @param  {String}   payload.binder [description]
         * @param  {Object}   payload.getPath [description]
         * @param  {Object}   payload.config see bind()
         * @param  {Array}    [payload.ids = []] [description]
         * @param  {Object}   [payload.getLive] [description]
         * @param  {Object}   [payload.getBinder] [description]
         * @param  {Number}   [payload.unBindDelay = 0] delay (ms) before it's actually unbound
         */
        updateBinder (context, payload) {
          const {
            binder,
            ids = [],
            getPath,
            config,
            getLive = id => true,
            unBindDelay
          } = payload

          const oldLinks =
            _.clone(context.state.groupedLinks[binder]) ||
            {}

          ids.map(id => {
            // remove from oldLinks to be unbound later
            delete oldLinks[id]
            // and bind
            context.dispatch('bind', {
              path: getPath(id),
              live: getLive ? getLive(id) : true,
              id,
              binder,
              config
            })
          })
          // unbind old links
          _.forEach(oldLinks, (link, id) => {
            // if no delay, unbind right away
            if (!unBindDelay) {
              context.dispatch('unbindLink', {link, binder})
            } else {
              // else unbind after
              context.dispatch('unbindAfter', {
                link,
                binder,
                delay: unBindDelay
              })
            }
          })
        },

        /**
         * [remove description]
         * @param  {String} payload.ref firebase ref
         * @param  {String} payload.path additional path to the firebase child
         */
        forceUpdate (context, payload) {
          const link = getLink(payload)
          link.ref().once('value', snapshot => {
            context.commit('setData', {
              link,
              newData: snapshot.val(),
            })
          })
        },

        // PRIVATE
        setLive (context, link) {
          // if there are live binders (binder: true), set as live
          let live = false
          _.forEach(link.binders, l => {
            if (l) {
              live = true
              return false
            }
          })

          // if different
          if (link.live !== live) {
            // if not live, get once
            if (!live) {
              // if was live, turn off
              if (link.live) {
                link.ref().off()
              } else {
                // if was never set, get once
                link.ref().once('value', snapshot => {
                  context.commit('setData', {
                    link,
                    newData: snapshot.val(),
                  })
                })
              }
            } else {
              // else, listen
              link.ref().on('child_added', snapshot => {
                context.commit('addChild', {
                  parent: link.object,
                  key: snapshot.key,
                  value: snapshot.val(),
                  link: link,
                })
              })
              link.ref().on('child_changed', snapshot => {
                context.commit('setChild', {
                  parent: link.object,
                  key: snapshot.key,
                  value: snapshot.val(),
                  link: link,
                })
              })
              link.ref().on('child_removed', snapshot => {
                context.commit('removeChild', {
                  parent: link.object,
                  key: snapshot.key,
                  value: snapshot.val(),
                  link: link,
                })
              })
            }
            // update value
            context.commit('updateLink', [link, 'live', live])
          }
        },
        unbindLink (context, {link, binder}) {
          // if the link is found
          if (link) {
            // remove the binder
            context.commit('removeBinder', {link, binder})
            // if there's still binders, update live status
            if (_.keys(link.binders).length > 0) {
              context.dispatch('setLive', link)
            } else {
              // if there are no more binders, remove from state and mute
              context.commit('removeLink', link)
            }
          }
        },
      },
      mutations: {
        // LINK
        /**
         * get existing or create new link
         * @param  {[type]} payload [description]
         * @return {Object}         the link
         */
        getOrCreateLink (state, payload) {
          const {
            id, binder, path, fullPath, live = true,
          } = payload
          const {
            parent, refParent,
            asArray,
            bindChildren, childListParent,
            customAddChild,
          } = payload.config

          let link = state.links[fullPath]

          // bind only if the path doesn't exist yet
          if (!link) {
            // if no ref, start from root
            let ref = this.ref || firebase.ref()
            // use additional path (if provided)
            if (path) {
              ref = ref.child(path)
            }

            // create link object
            link = {
              new: true,
              ref: () => ref,
              path: fullPath,
              id,
              parent,
              refParent,
              customAddChild,
              cds: {}, // binder removal countdowns,
              binders: {}
            }

            // if binding object
            if (!bindChildren) {
              // set or create object/array that will contain the data to existing state object
              if (!parent[id]) {
                Vue.set(parent, id, !asArray ? {} : [])
              }
              link.object = parent[id]

              // if saving refs, save the ref directly
              // (as opposed to saving the children's refs)
              if (refParent) {
                Vue.set(refParent, id, () => ref)
              }
            } else {
              // if binding the children directly
              // create key list
              link.childList = []
              // if saving childList in an object, save and add childList
              if (childListParent) {
                link.childListParent = childListParent
                childListParent[id] = link.childList
              }

              // set object that will contain the data to the parent
              link.object = link.parent
            }

            Vue.set(state.links, link.path, link)
          } else {
            // if there's a removal countdown for this binder, stop
            if (link.cds[binder]) {
              clearTimeout(link.cds[binder])
              Vue.delete(link.cds, 'binder')
            }
          }

          // if the binder is new, add link to groupedLinks
          if (link.binders[binder] === undefined) {
            if (!state.groupedLinks[binder]) {
              state.groupedLinks[binder] = {}
            }
            Vue.set(state.groupedLinks[binder], link.id, link)
          }
          // add new or update binder
          Vue.set(link.binders, binder, live)
        },
        updateLink (state, [link, key, val]) {
          if (val !== undefined) {
            Vue.set(link, key, val)
          } else {
            Vue.delete(link, key)
          }
        },
        removeBinder (state, {link, binder}) {
          // remove links from the binder group
          const links = state.groupedLinks[binder]
          if (links[link.id]) {
            Vue.delete(links, link.id)
            // if the links is empty, delete
            if (_.keys(links).length === 0) {
              Vue.delete(state.groupedLinks, binder)
            }
          }
          // remove the binder
          Vue.delete(link.binders, binder)
          // remove any countdown of that binder
          Vue.delete(link.cds, binder)
        },
        removeLink (state, link) {
          const {
            id, parent, path, ref,
            refParent,
            childList, childListParent
          } = link

          // if assigned self to parent as an object
          if (!childList) {
            // delete self
            Vue.delete(parent, id)
          } else {
            // if assigned children to parent
            // delete own children
            childList.map(key => {
              Vue.delete(parent, key)
            })
            // and childListParent
            if (childListParent) {
              Vue.delete(childListParent, id)
            }
          }
          // if saving the refs
          if (refParent) {
            // if assigned self to parent as an object
            if (!childList) {
              Vue.delete(refParent, id)
            } else {
              // if assigned children to parent
              childList.map(key => {
                Vue.delete(refParent, key)
              })
            }
          }
          // remove from state and mute
          ref().off()
          Vue.delete(state.links, path)
        },

        // DATA
        /**
         * Replaces values of the keys in an object without replacing the object
         * @param {[type]} payload.link [description]
         * @param {[type]} payload.newData [description]
         */
        setData (state, payload) {
          const {link} = payload
          const {
            id, object,
            ref, refParent,
            childList, childListParent
          } = link

          const newKeyList = _.keys(payload.newData)

          // diff with saved keys
          const unusedKeys = _.difference(
            childList || _.keys(object),
            newKeyList
          )
          // apply value for each key
          _.forEach(payload.newData, (val, key) => {
            Vue.set(object, key, val)
          })
          // delete unused keys
          unusedKeys.map(key => {
            Vue.delete(object, key)
          })
          // update the childList & childListParent (bindContentsIn)
          if (childList) {
            Vue.set(link, 'childList', newKeyList)
            if (childListParent) {
              Vue.set(childListParent, id, link.childList)
            }
          }
          // if saving the refs
          if (refParent) {
            // if binding object
            if (!childList) {
              Vue.set(refParent, id, ref)
            } else {
              // if binding children
              childList.map(childId => {
                Vue.set(
                  refParent, childId,
                  () => ref().child(childId)
                )
              })
            }
          }
        },

        addChild (state, {parent, key, value, link}) {
          let childAlreadyAdded = false
          if (link.customAddChild) {
            childAlreadyAdded = link.customAddChild(key, value, parent)
          }
          if (!childAlreadyAdded) {
            Vue.set(parent, key, value)
          }
          // if there's a childList, update
          if (link.childList) {
            link.childList.push(key)
            // if saving the refs
            if (link.refParent) {
              Vue.set(
                link.refParent, key,
                () => link.ref().child(key)
              )
            }
          }
        },
        setChild (state, {parent, key, value, link}) {
          Vue.set(parent, key, value)
        },
        removeChild (state, {parent, key, value, link}) {
          let childAlreadyRemoved = false
          if (link.customRemoveChild) {
            childAlreadyRemoved = link.customRemoveChild(key, value, parent)
          }
          if (!childAlreadyRemoved) {
            Vue.delete(parent, key)
          }
          // if there's a childList, update
          if (link.childList) {
            link.childList.splice(
              link.childList.indexOf(key),
              1
            )
            // if saving the refs
            if (link.refParent) {
              Vue.delete(link.refParent, key)
            }
          }
        }
      }
    })

    Vue.mixin({
      methods: {
        ...mapActions('vf', [
          'bind',
          'unbind',
          'unbindAfter',
          'updateBinder',
          'forceUpdate',
        ])
      }
    })
  }
}
