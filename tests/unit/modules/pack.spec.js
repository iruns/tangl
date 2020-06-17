// // import store from '@/store'
// // import firebase from '@/fb'
// // import _ from 'lodash'
// // import hash from 'object-hash'
//
// /*
// npm run unit -- -t=modules-project
// */
//
// // jest.mock('../../../../src/fb')
//
// describe.skip('modules-project', () => {
//
//   const base = {
//     config: {
//       label: 'Base',
//       description: 'Just the base project',
//       include: []
//     }
//   }
//   const project1 = {
//     config: {
//       label: 'Project 1',
//       description: 'Just project 1',
//       include: [
//         'base',
//         'dep1',
//         'dep2',
//         'dep5',
//       ]
//     }
//   }
//   const dep1 = {
//     config: {
//       label: 'dep1',
//       include: [
//         'base',
//       ]
//     }
//   }
//   const dep2 = {
//     config: {
//       label: 'dep2',
//       include: [
//         'base',
//         'dep1',
//         'dep3',
//         'project1',
//       ]
//     }
//   }
//   const dep3 = {
//     config: {
//       label: 'dep3',
//       include: [
//         'base',
//         'dep4',
//       ]
//     }
//   }
//   const dep4 = {
//     config: {
//       label: 'dep4',
//       include: [
//         'base',
//         'dep1',
//       ]
//     }
//   }
//   const dep5 = {
//     config: {
//       label: 'dep5',
//       include: [
//         'base',
//         'dep1',
//         'dep6',
//         'dep7',
//       ]
//     }
//   }
//   const dep6 = {
//     config: {
//       label: 'dep6',
//       include: [
//         'base',
//       ]
//     }
//   }
//   const dep7 = {
//     config: {
//       label: 'dep7',
//       include: [
//         'base',
//       ]
//     }
//   }
//
//   const database = {
//     projects: {
//       base, project1,
//       dep1, dep2, dep3,
//       dep4, dep5, dep6,
//       dep7
//     }
//   }
//
//   describe('selecting a project', () => {
//
//     describe('actions.select()', () => {
//
//       let onValue,
//         onCancel,
//         updateConfig
//
//       beforeAll(() => {
//         onValue = jest.fn()
//         onCancel = jest.fn()
//         updateConfig = jest.spyOn(store._actions['project/updateConfig'], 0)
//           .mockImplementation(() => {})
//       })
//
//       beforeEach(() => {
//
//         // reset mock functions
//         onValue.mockReset()
//         onCancel.mockReset()
//         updateConfig.mockReset()
//
//         // reset database
//         firebase.database.ref()
//           .set(database)
//
//         firebase.mockdatabase.flush()
//
//         // reset store
//         store.dispatch('setState', {
//           key: 'project',
//           value: {
//             selectedId: 'base',
//             used: {
//
//             },
//             includeHash: ''
//           }
//         })
//       })
//
//       it('detaches prev project info listener', () => {
//
//         firebase.database.ref('projects/base/config')
//           .on('value', onValue, onCancel)
//         firebase.mockdatabase.flush()
//
//         store.dispatch('project/select', 'project1')
//
//         firebase.database.ref('projects/base/config')
//           .update({
//             label: 'Not Base'
//           })
//         firebase.mockdatabase.flush()
//
//         expect(onValue).toHaveBeenCalledTimes(1)
//       })
//
//       it('changes the selectedId', () => {
//
//         store.dispatch('project/select', 'project1')
//         expect(store.state.project.selectedId).toBe('project1')
//       })
//
//       it('listens to the selected project\'s config, and calls actions.updateConfig', () => {
//         store.dispatch('project/select', 'project1')
//         expect(updateConfig).toHaveBeenCalledTimes(1)
//       })
//
//       afterAll(() => {
//         // cancel listeners
//         firebase.database.ref('projects/base/config').off()
//         firebase.database.ref('projects/project1/config').off()
//         updateConfig.mockRestore()
//       })
//
//     })
//
//   })
//
//   describe('updating config', () => {
//
//     beforeEach(() => {
//
//       // reset database
//       firebase.database.ref()
//         .set(database)
//
//       firebase.mockdatabase.flush()
//
//       // reset store
//       store.dispatch('setState', {
//         key: 'project',
//         value: {
//           selectedId: 'project1',
//           used: {
//             project1: Object.assign(
//               {includers: []},
//               project1.config,
//             ),
//             B: {
//               includers: ['A']
//             }
//           },
//           includeHash: hash(project1.config.include)
//         }
//       })
//     })
//
//     describe('actions.setConfig', () => {
//
//       it('changes the config in the firebase', (done) => {
//
//         const newConfig = {
//           label: 'new Label',
//           description: 'new description',
//           include: ['base2'],
//         }
//
//         store.dispatch('project/setConfig', newConfig)
//
//         firebase.mockdatabase.flush()
//
//         firebase.database.ref('projects/project1/config')
//           .once('value', snapshot => {
//             expect(snapshot.val()).toEqual(newConfig)
//             done()
//           })
//
//         firebase.mockdatabase.flush()
//       })
//     })
//
//     describe('actions.updateConfig + update mutations', () => {
//
//       describe('if the include is changed, update include', () => {
//
//         let updateUsed
//
//         beforeAll(() => {
//           updateUsed = jest.spyOn(store._actions['project/updateUsed'], 0)
//             .mockImplementation(() => {})
//         })
//
//         beforeEach(() => {
//           updateUsed.mockReset()
//         })
//
//         it('doesn\'t update the include if it\'s not actually changed', () => {
//
//           const updateInclude =
//             jest.spyOn(store._mutations['project/updateInclude'], 0)
//               .mockImplementation(() => {})
//
//           store.dispatch('project/updateConfig', {
//             include: project1.config.include
//           })
//
//           expect(updateInclude).toHaveBeenCalledTimes(0)
//
//           updateInclude.mockRestore()
//         })
//
//         it('calls add mutations.addIncluders with the selectedId and included, and changes the state', () => {
//
//           store.dispatch('project/updateConfig', {
//             include: ['A', 'B']
//           })
//
//           expect(store.state.project.used.A.includers)
//             .toEqual(['project1'])
//           expect(store.state.project.used.B.includers)
//             .toEqual(['A','project1'])
//         })
//
//         it('calls mutations.updateInclude with the new include and includeHash, and changes the state', () => {
//
//           store.dispatch('project/updateConfig', {
//             include: ['A', 'B']
//           })
//
//           expect(store.state.project.used.project1.include)
//             .toEqual(['A','B'])
//
//           expect(store.state.project.includeHash).toBe(hash(['A','B']))
//         })
//
//         it('calls actions.updateUsed with the differences in the old and new config', () => {
//
//           store.dispatch('project/updateConfig', {
//             include: [
//               'base',
//               'dep3',
//               'dep4',
//             ]
//           })
//
//           expect(updateUsed.mock.calls[0][0].fetch).toEqual(
//             ['dep3','dep4']
//           )
//           expect(updateUsed.mock.calls[0][0].remove).toEqual(
//             { id: 'project1', self: false, include: [ 'dep1', 'dep2', 'dep5' ] }
//           )
//         })
//
//         afterAll(() => {
//           updateUsed.mockRestore()
//         })
//
//       })
//
//       it('if the label is changed, call mutations.updateLabel, and changes the state', () => {
//         store.dispatch('project/updateConfig', {
//           label: 'new label'
//         })
//
//         expect(store.state.project.used.project1.label)
//           .toBe('new label')
//       })
//
//       it('if the description is changed, call mutations.updateDescription, and changes the state', () => {
//         store.dispatch('project/updateConfig', {
//           description: 'new description'
//         })
//
//         expect(store.state.project.used.project1.description)
//           .toBe('new description')
//       })
//
//     })
//   })
//
//   describe('updating used projects', () => {
//
//     beforeEach(() => {
//
//       // reset database
//       firebase.database.ref()
//         .set(database)
//
//       firebase.mockdatabase.flush()
//
//       // reset store
//       store.dispatch('setState', _.cloneDeep({
//         key: 'project',
//         value: {
//           selectedId: 'project1',
//           used: {
//             // selected
//             project1: Object.assign(
//               {
//                 includers: [
//                   'dep2',
//                   'dep3',
//                 ]
//               },
//               project1.config,
//             ),
//             // needed, fetched
//             base: Object.assign(
//               {
//                 includers: [
//                   'project1',
//                   'dep1',
//                   'dep3',
//                 ]
//               },
//               base.config,
//             ),
//             // needed, fetched, out of date
//             dep3: Object.assign(
//               {
//                 include: [
//                   'base',
//                 ],
//                 includers: [
//                   'dep2',
//                 ]
//               },
//               dep3.config,
//             ),
//             // unneeded, fetched
//             dep5: Object.assign(
//               {
//                 includers: [
//                   'project1',
//                 ]
//               },
//               dep5.config,
//             ),
//
//             // indirectly uneeded, fetched
//             dep6: {
//               include: [
//                 'dep7'
//               ],
//               includers: [
//                 'dep5'
//               ]
//             },
//             dep7: {
//               includers: [
//                 'dep5',
//                 'dep6',
//               ]
//             },
//           },
//           includeHash: 'any_hash'
//         }
//       }))
//     })
//
//     describe('actions.cleanUpUsed', () => {
//
//       it('removes the projects in the removal list', () => {
//
//         store.dispatch('project/cleanUpUsed', [
//           {
//             id: 'project1',
//             self: true
//           }
//         ])
//
//         expect(store.state.project.used).not.toHaveProperty('project1')
//       })
//
//       it('doesn\'t remove projects when the self==false', () => {
//           store.dispatch('project/cleanUpUsed', [
//             {
//               id: 'project1',
//               self: false,
//               include: [
//                 'dep5',
//                 'dep7',
//               ]
//             }
//           ])
//
//           expect(store.state.project.used).toHaveProperty('project1')
//       })
//
//       it('removes projects that doesn\'t have any more includer', () => {
//
//           store.dispatch('project/cleanUpUsed', [
//             {
//               id: 'project1',
//               self: false,
//               include: [
//                 'dep5',
//                 'dep7',
//               ]
//             }
//           ])
//
//           expect(_.keys(store.state.project.used).sort()).toEqual([
//             'base', 'dep3', 'project1'
//           ])
//       })
//
//     })
//
//     describe('actions.updateUsed', () => {
//
//       let ref
//
//       beforeEach(() => {
//
//         ref = jest.spyOn(firebase.database, 'ref')
//           .mockImplementation(path => {
//             return {
//                 once: (val, callback) => {
//                 const data = _.cloneDeep(_.get(database, path.split('/')))
//
//                 setTimeout(() => {
//                   callback({
//                     val: () => data
//                   })
//                 }, 10)
//               }
//             }
//           })
//       })
//
//       afterEach(() => {
//         ref.mockRestore()
//       })
//
//       it('fetches new, unfetched projects and their subsequent includes', (done) => {
//
//         // subscribe to afterIncludeIsLoaded for final check
//         store.dispatch(
//           'subscribe',
//           {
//             action: 'projects/afterIncludeIsLoaded',
//             subscriber: (payload) => {
//               // "used" is correct
//               expect(_.keys(store.state.project.used).sort()).toEqual([
//                 'base',
//                 'dep1', 'dep2', 'dep3',
//                 'dep5', 'dep6', 'dep7',
//                 'project1'
//               ])
//               // and forceUpdateStaticProjects is empty
//               expect(payload.forceUpdated).toBeUndefined()
//               done()
//             }
//           }
//         )
//
//         // run
//         store.dispatch('project/updateUsed', {
//           update: false,
//           fetch: ['dep2', 'dep3'],
//           fetching: [],
//           done: [],
//           remove: [],
//           includeHash: 'any_hash',
//         })
//       })
//
//       it('if forcing update, fetches all projects and their subsequent includes', async (done) => {
//
//         const afterIncludeIsLoaded = jest.spyOn(store._actions['project/afterIncludeIsLoaded'], 0)
//           .mockImplementation(() => {
//             // "used" is correct
//             expect(_.keys(store.state.project.used).sort()).toEqual([
//               'base',
//               'dep1', 'dep3',
//               'dep4', 'dep5', 'dep6', 'dep7',
//               'project1'
//             ])
//             // and forceUpdateStaticProjects lists projects that needs updating
//             expect(afterIncludeIsLoaded).toHaveBeenCalledWith(
//               [ 'dep3', 'base', 'dep4', 'dep1' ]
//             )
//             afterIncludeIsLoaded.mockRestore()
//             done()
//           })
//         await store.dispatch('project/updateUsed', {
//           update: true,
//           // fetch: ['dep2', 'dep3'],
//           fetch: ['dep3'],
//           fetching: [],
//           done: [],
//           remove: [],
//           includeHash: 'any_hash',
//         })
//       })
//
//       it('updates includers of every project', (done) => {
//
//         const afterIncludeIsLoaded = jest.spyOn(store._actions['project/afterIncludeIsLoaded'], 0)
//           .mockImplementation(() => {
//             expect(_.clone(store.state.project.used.base.includers).sort())
//               .toEqual(['dep1', 'dep2', 'dep3', 'project1'])
//             afterIncludeIsLoaded.mockRestore()
//             done()
//           })
//
//         store.dispatch('project/updateUsed', {
//           update: false,
//           fetch: ['dep2'],
//           fetching: [],
//           done: [],
//           remove: [],
//           includeHash: 'any_hash',
//         })
//       })
//
//       it('calls actions.cleanUpUsed with projects to be removed after fetching is finished', (done) => {
//
//         const cleanUpUsed = jest.spyOn(store._actions['project/cleanUpUsed'], 0)
//           .mockImplementation(() => {})
//
//         const afterIncludeIsLoaded = jest.spyOn(store._actions['project/afterIncludeIsLoaded'], 0)
//           .mockImplementation(() => {
//             // "used" is correct
//             expect(_.keys(store.state.project.used).sort()).toEqual([
//               'base',
//               'dep1', 'dep2', 'dep3',
//               'dep5', 'dep6', 'dep7',
//               'project1'
//             ])
//             // and forceUpdateStaticProjects is empty
//             expect(afterIncludeIsLoaded).toHaveBeenCalledWith(
//               undefined
//             )
//
//             cleanUpUsed.mockRestore()
//             afterIncludeIsLoaded.mockRestore()
//             done()
//           })
//
//         store.dispatch('project/updateUsed', {
//           update: false,
//           fetch: ['dep2', 'dep3'],
//           fetching: [],
//           done: [],
//           remove: ['dep6', 'dep7'],
//           includeHash: 'any_hash',
//         })
//       })
//
//       it('in the end, fetches and removes all the correct projects', (done) => {
//
//         const afterIncludeIsLoaded = jest.spyOn(store._actions['project/afterIncludeIsLoaded'], 0)
//           .mockImplementation(() => {
//             // "used" is correct
//             expect(_.keys(store.state.project.used).sort()).toEqual([
//               'base',
//               'dep1', 'dep2', 'dep3',
//               'project1'
//             ])
//             // and forceUpdateStaticProjects is empty
//             expect(afterIncludeIsLoaded).toHaveBeenCalledWith(
//               undefined
//             )
//             afterIncludeIsLoaded.mockRestore()
//             done()
//           })
//
//         store.dispatch('project/updateUsed', {
//           update: false,
//           fetch: ['dep2', 'dep3'],
//           fetching: [],
//           done: [],
//           remove: [
//             {
//               id: 'project1',
//               self: false,
//               include: ['dep5', 'dep6', 'dep7']
//             }
//           ],
//           includeHash: 'any_hash',
//         })
//       })
//
//     })
//   })
// })
