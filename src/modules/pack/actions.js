export default {

  select (context, selectedId) {
    if (context.state.selectedId !== selectedId) {
      // bind selection, and unbind unselected
      //    pack
      // context.dispatch('updateIncluder', {
      //   ids: [selectedId],
      //   includer: '_PS_'
      // })
      //    spreads
      // context.dispatch(
      //   'spread/updateIncluder',
      //   {
      //     config: {[selectedId]: true},
      //     includer: '_PS_'
      //   },
      //   {root: true}
      // )
      //    items
      context.dispatch(
        'item/updateIncluder',
        {
          config: {[selectedId]: true},
          includer: '_PS_'
        },
        {root: true}
      )
      // change the selectedId
      context.commit('select', selectedId)
    }
  },

  updateIncluder (context, {ids, includer}) {
    // bind included pack's info
    context.dispatch(
      'vf/updateBinder',
      {
        binder: includer + ' info',
        ids,
        getPath: id => 'packInfos/' + id,
        config: {
          parent: context.state.infos,
          refParent: context.state.infoRefs,
        }
      },
      {root: true}
    )
    // bind included pack's include
    context.dispatch(
      'vf/updateBinder',
      {
        binder: includer + ' include',
        ids,
        getPath: id => 'packConfigs/' + id + '/include',
        config: {
          parent: context.state.includes,
          refParent: context.state.includeRefs,
        },
      },
      {root: true}
    )
  },
}
