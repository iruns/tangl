import {
  addProp,
  processPathPropSet,
} from '../../../utils'
import createTests from './createTests'

/*
npm run test:unit ./tests/unit/components/computers/ClassComp.spec.js -- -w
*/

// this file tests the item baking process which includes:
// - Class
// - Data
// - Item
// - Baker
// - SourceSet
// - Prop
describe('Pack', () => {
  const groups = [
    {
      only: true,
      name: 'Generating item.instanceIdsByPack',
      subs: [
        // Working with classes and base items
        {
          // only: true,
          name: 'Working with classes and base items',
          init: [
            {
              path: 'pack.includes',
              subs: [
                {
                  id: 'pack_1',
                  value: {
                    order: [],
                    config: {}
                  }
                },
                {
                  id: 'pack_2',
                  value: {
                    order: [],
                    config: {}
                  }
                },
              ]
            },
            {
              path: 'item.items',
              subs: [
                { id: 'main_item_1', packId: 'pack_1' },
                { id: 'main_item_2', packId: 'pack_1' },
                { id: 'main_item_3', packId: 'pack_2' },

                { id: 'base_item_1', packId: 'pack_1' },
                { id: 'base_item_2', packId: 'pack_2' },
                {
                  id: 'base_item_3',
                  packId: 'pack_1',
                  props: {
                    p_class: addProp([
                      { value: 'class_2' },
                      { value: 'class_3' },
                    ]),
                  }
                },

                { id: 'class_1', packId: 'pack_1' },
                { id: 'class_2', packId: 'pack_2' },
                { id: 'class_3', packId: 'pack_3' },
              ]
            }
          ],
          steps: [
            {
              name: 'addition',
              path: 'item',
              changes: [
                ...processPathPropSet({
                  path: 'items.main_item_1.ps.p_class',
                  value: [
                    { value: 'class_1' },
                    { value: 'class_2' },
                  ],
                }),
                ...processPathPropSet({
                  path: 'items.main_item_1.ps.p_base_item',
                  value: [
                    { value: 'base_item_1' },
                  ],
                }),
                ...processPathPropSet({
                  path: 'items.main_item_2.ps.p_class',
                  value: [
                    { value: 'class_1' },
                    { value: 'class_3' },
                  ],
                }),
                ...processPathPropSet({
                  path: 'items.main_item_3.ps.p_base_item',
                  value: [
                    { value: 'base_item_2' },
                    { value: 'base_item_3' },
                  ],
                }),
              ],
              tests: [
                {
                  path: 'instanceIdsByPack.pack_1',
                  value: {
                    none: [
                      'base_item_1',
                      'class_1',
                    ],
                    class_1: [
                      'main_item_1',
                      'main_item_2',
                    ],
                    class_2: [
                      'main_item_1',
                      'base_item_3',
                    ],
                    class_3: [
                      'base_item_3',
                      'main_item_2',
                    ],
                  }
                },
                {
                  path: 'instanceIdsByPack.pack_2',
                  value: {
                    none: [
                      'base_item_2',
                      'class_2',
                    ],
                    class_2: [
                      'main_item_3',
                    ],
                    class_3: [
                      'main_item_3',
                    ],
                  }
                },
              ],
            },
            {
              name: 'change',
              init: [
                {
                  path: 'pack.includes.pack_3',
                  value: {
                    order: [],
                    config: {}
                  }
                },
                ...processPathPropSet({
                  path: 'item.items.main_item_1.ps.p_class',
                  value: [
                    { value: 'class_1' },
                    { value: 'class_2' },
                  ],
                }),
                ...processPathPropSet({
                  path: 'item.items.main_item_1.ps.p_base_item',
                  value: [
                    { value: 'base_item_1' },
                  ],
                }),
                ...processPathPropSet({
                  path: 'item.items.main_item_2.ps.p_class',
                  value: [
                    { value: 'class_1' },
                    { value: 'class_3' },
                  ],
                }),
                ...processPathPropSet({
                  path: 'item.items.main_item_3.ps.p_base_item',
                  value: [
                    { value: 'base_item_2' },
                    { value: 'base_item_3' },
                  ],
                }),
              ],
              changes: [
                ...processPathPropSet({
                  path: 'item.items.main_item_1.ps.p_class',
                  value: [
                    { value: 'class_1' },
                    { value: 'class_2' },
                    { value: 'class_3' },
                  ],
                }),
                ...processPathPropSet({
                  path: 'item.items.main_item_1.ps.p_base_item',
                }),
                ...processPathPropSet({
                  path: 'item.items.main_item_2.ps.p_class',
                }),
                ...processPathPropSet({
                  path: 'item.items.main_item_3.ps.p_base_item',
                  value: [
                    { value: 'base_item_1' },
                    { value: 'base_item_3' },
                  ],
                }),
              ],
              tests: [
                {
                  path: 'item.instanceIdsByPack.pack_1',
                  value: {
                    none: [
                      'base_item_1',
                      'class_1',
                      'main_item_2',
                    ],
                    class_1: [
                      'main_item_1',
                    ],
                    class_2: [
                      'base_item_3',
                      'main_item_1',
                    ],
                    class_3: [
                      'base_item_3',
                      'main_item_1',
                    ],
                  }
                },
                {
                  path: 'item.instanceIdsByPack.pack_2',
                  value: {
                    none: [
                      'base_item_2',
                      'class_2',
                    ],
                    class_2: [
                      'main_item_3',
                    ],
                    class_3: [
                      'main_item_3',
                    ],
                  }
                },
                {
                  path: 'item.instanceIdsByPack.pack_3',
                  value: {
                    none: [
                      'class_3',
                    ],
                  }
                },
              ],
            },
            {
              name: 'deletion',
              init: [
                {
                  path: 'pack.includes',
                  value: {
                    pack_1: {
                      id: 'pack_1',
                      value: {
                        order: [],
                        config: {}
                      }
                    },
                  }
                },
                ...processPathPropSet({
                  path: 'item.items.main_item_1.ps.p_class',
                  value: [
                    { value: 'class_1' },
                    { value: 'class_2' },
                  ],
                }),
                ...processPathPropSet({
                  path: 'item.items.main_item_1.ps.p_base_item',
                  value: [
                    { value: 'base_item_1' },
                  ],
                }),
                ...processPathPropSet({
                  path: 'item.items.main_item_2.ps.p_class',
                  value: [
                    { value: 'class_1' },
                    { value: 'class_3' },
                  ],
                }),
                ...processPathPropSet({
                  path: 'item.items.main_item_3.ps.p_base_item',
                  value: [
                    { value: 'base_item_2' },
                    { value: 'base_item_3' },
                  ],
                }),
              ],
              changes: [
                ...processPathPropSet({
                  path: 'item.items.main_item_1.ps.p_class',
                }),
                ...processPathPropSet({
                  path: 'item.items.main_item_1.ps.p_base_item',
                }),
                ...processPathPropSet({
                  path: 'item.items.main_item_2.ps.p_class',
                }),
                ...processPathPropSet({
                  path: 'item.items.main_item_3.ps.p_base_item',
                }),
              ],
              tests: [
                {
                  path: 'item.instanceIdsByPack.pack_1',
                  value: {
                    none: [
                      'base_item_1',
                      'class_1',
                      'main_item_1',
                      'main_item_2',
                    ],
                    class_2: [
                      'base_item_3',
                    ],
                    class_3: [
                      'base_item_3',
                    ],
                  }
                },
                {
                  path: 'item.instanceIdsByPack.pack_2',
                },
              ],
            },
          ]
        },
      ]
    },
    {
      // only: true,
      name: 'Working with propsByClass',
      subs: [
        // Adding/Editing/Deleting propsByClass.blueprint
        {
          // only: true,
          name: 'Adding/Editing/Deleting propsByClass.blueprint',
          init: [
            {
              path: 'item.items',
              subs: [
                { id: 'class_1' },
                {
                  id: 'instance_1',
                  props: {
                    p_class: addProp([
                      { value: 'class_1' },
                    ]),
                  }
                }
              ]
            },
          ],
          steps: [
            {
              name: 'addition',
              path: 'item',
              changes: [
                {
                  path: 'items.class_1.bp.data.ps',
                  value: {
                    prop_1: addProp([{ value: null, type: 'null' }]),
                    prop_2: addProp([{ value: null, type: 'null' }]),
                  },
                },
              ],
              tests: [
                {
                  path: 'propsByClass.class_1.blueprint',
                  value: [
                    'prop_1',
                    'prop_2',
                  ],
                },
              ],
            },
            {
              name: 'change',
              path: 'item',
              init: [
                {
                  path: 'items.class_1.bp.data.ps',
                  value: {
                    prop_1: addProp([{ value: null, type: 'null' }]),
                    prop_2: addProp([{ value: null, type: 'null' }]),
                  },
                },
              ],
              changes: [
                {
                  path: 'items.class_1.bp.data.bp.data.ps',
                  value: {
                    prop_1: addProp([{ value: null, type: 'null' }]),
                    prop_3: addProp([{ value: null, type: 'null' }]),
                  },
                },
                {
                  path: 'items.class_1.bp.data.ps',
                  value: {
                    prop_1: addProp([{ value: null, type: 'null' }]),
                    prop_3: addProp([{ value: null, type: 'null' }]),
                  },
                },
              ],
              tests: [
                {
                  path: 'propsByClass.class_1.blueprint',
                  value: [
                    'prop_1',
                    'prop_3',
                  ],
                },
              ],
            },
            {
              name: 'deletion',
              path: 'item',
              init: [
                {
                  path: 'items.class_1.bp.data.ps',
                  value: {
                    prop_1: addProp([{ value: null, type: 'null' }]),
                    prop_2: addProp([{ value: null, type: 'null' }]),
                  },
                },
              ],
              changes: [
                {
                  path: 'items.class_1.bp.data',
                },
              ],
              tests: [
                {
                  path: 'propsByClass.class_1.blueprint',
                  value: []
                },
              ],
            },
          ]
        },
        // Adding/Editing/Deleting propsByClass.instance
        {
          // only: true,
          name: 'Adding/Editing/Deleting propsByClass.instance',
          init: [
            {
              path: 'item.items',
              subs: [
                { id: 'class_1' },
                {
                  id: 'instance_1',
                  props: {
                    p_class: addProp([
                      { value: 'class_1' },
                    ]),
                  }
                },
                {
                  id: 'instance_2',
                  props: {
                    p_class: addProp([
                      { value: 'class_1' },
                    ]),
                  }
                },
              ]
            },
          ],
          steps: [
            {
              name: 'addition',
              path: 'item',
              changes: [
                {
                  path: 'items.instance_1.ps.prop_1',
                  value: addProp([{ value: null, type: 'null' }]),
                },
                {
                  path: 'items.instance_1.ps.prop_2',
                  value: addProp([{ value: null, type: 'null' }]),
                },
                {
                  path: 'items.instance_2.ps.prop_1',
                  value: addProp([{ value: null, type: 'null' }]),
                },
                {
                  path: 'items.instance_2.ps.prop_3',
                  value: addProp([{ value: null, type: 'null' }]),
                },
              ],
              tests: [
                {
                  path: 'propsByClass.class_1.instances',
                  value: [
                    'p_class',
                    'prop_1',
                    'prop_2',
                    'prop_3',
                  ],
                },
              ],
            },
            {
              name: 'change',
              path: 'item',
              init: [
                {
                  path: 'items.instance_1.ps.prop_1',
                  value: addProp([{ value: null, type: 'null' }]),
                },
                {
                  path: 'items.instance_1.ps.prop_2',
                  value: addProp([{ value: null, type: 'null' }]),
                },
                {
                  path: 'items.instance_2.ps.prop_1',
                  value: addProp([{ value: null, type: 'null' }]),
                },
                {
                  path: 'items.instance_2.ps.prop_3',
                  value: addProp([{ value: null, type: 'null' }]),
                },
              ],
              changes: [
                {
                  path: 'items.instance_1.ps.prop_1',
                  value: addProp([{ value: null, type: 'null' }]),
                },
                {
                  path: 'items.instance_1.ps.prop_2',
                },
                {
                  path: 'items.instance_1.ps.prop_4',
                  value: addProp([{ value: null, type: 'null' }]),
                },
                {
                  path: 'items.instance_2.ps.p_class',
                },
              ],
              tests: [
                {
                  path: 'propsByClass.class_1.instances',
                  value: [
                    'p_class',
                    'prop_1',
                    'prop_4',
                  ],
                },
              ],
            },
            {
              name: 'deletion',
              path: 'item',
              init: [
                {
                  path: 'items.instance_1.ps.prop_1',
                  value: addProp([{ value: null, type: 'null' }]),
                },
                {
                  path: 'items.instance_1.ps.prop_2',
                  value: addProp([{ value: null, type: 'null' }]),
                },
                {
                  path: 'items.instance_2.ps.prop_1',
                  value: addProp([{ value: null, type: 'null' }]),
                },
                {
                  path: 'items.instance_2.ps.prop_3',
                  value: addProp([{ value: null, type: 'null' }]),
                },
              ],
              changes: [
                {
                  path: 'items.instance_1.ps.p_class',
                },
                {
                  path: 'items.instance_2.ps.p_class',
                },
              ],
              tests: [
                {
                  path: 'propsByClass.class_1',
                },
              ],
            },
          ]
        },
        // Adding/Editing/Deleting propsByClass's both contents
        {
          // only: true,
          name: 'Adding/Editing/Deleting propsByClass\'s both contents',
          init: [
            {
              path: 'item.items',
              subs: [
                { id: 'class_1' },
                {
                  id: 'instance_1',
                  props: {
                    p_class: addProp([
                      { value: 'class_1' },
                    ]),
                  }
                },
                {
                  id: 'instance_2',
                  props: {
                    p_class: addProp([
                      { value: 'class_1' },
                    ]),
                  }
                },
              ]
            },
          ],
          steps: [
            {
              name: 'addition',
              path: 'item',
              changes: [
                {
                  path: 'items.class_1.bp.data.ps',
                  value: {
                    blueprint_prop_1: addProp([{ value: null, type: 'null' }]),
                    blueprint_prop_2: addProp([{ value: null, type: 'null' }]),
                    duplicate_prop_1: addProp([{ value: null, type: 'null' }]),
                    duplicate_prop_2: addProp([{ value: null, type: 'null' }]),
                  },
                },
                {
                  path: 'items.instance_1.ps.instance_prop_1',
                  value: addProp([{ value: null, type: 'null' }]),
                },
                {
                  path: 'items.instance_1.ps.instance_prop_2',
                  value: addProp([{ value: null, type: 'null' }]),
                },
                {
                  path: 'items.instance_1.ps.duplicate_prop_1',
                  value: addProp([{ value: null, type: 'null' }]),
                },
                {
                  path: 'items.instance_2.ps.instance_prop_1',
                  value: addProp([{ value: null, type: 'null' }]),
                },
                {
                  path: 'items.instance_2.ps.instance_prop_3',
                  value: addProp([{ value: null, type: 'null' }]),
                },
                {
                  path: 'items.instance_2.ps.duplicate_prop_2',
                  value: addProp([{ value: null, type: 'null' }]),
                },
              ],
              tests: [
                {
                  path: 'propsByClass.class_1',
                  value: {
                    blueprint: [
                      'blueprint_prop_1',
                      'blueprint_prop_2',
                      'duplicate_prop_1',
                      'duplicate_prop_2',
                    ],
                    instances: [
                      'p_class',
                      'instance_prop_1',
                      'instance_prop_2',
                      'instance_prop_3',
                    ],
                  }
                },
              ],
            },
            {
              name: 'change',
              path: 'item',
              init: [
                {
                  path: 'items.class_1.bp.data.ps',
                  value: {
                    blueprint_prop_1: addProp([{ value: null, type: 'null' }]),
                    blueprint_prop_2: addProp([{ value: null, type: 'null' }]),
                    duplicate_prop_1: addProp([{ value: null, type: 'null' }]),
                    duplicate_prop_2: addProp([{ value: null, type: 'null' }]),
                  },
                },
                {
                  path: 'items.instance_1.ps.instance_prop_1',
                  value: addProp([{ value: null, type: 'null' }]),
                },
                {
                  path: 'items.instance_1.ps.instance_prop_2',
                  value: addProp([{ value: null, type: 'null' }]),
                },
                {
                  path: 'items.instance_1.ps.duplicate_prop_1',
                  value: addProp([{ value: null, type: 'null' }]),
                },
                {
                  path: 'items.instance_2.ps.instance_prop_1',
                  value: addProp([{ value: null, type: 'null' }]),
                },
                {
                  path: 'items.instance_2.ps.instance_prop_3',
                  value: addProp([{ value: null, type: 'null' }]),
                },
                {
                  path: 'items.instance_2.ps.duplicate_prop_2',
                  value: addProp([{ value: null, type: 'null' }]),
                },
              ],
              changes: [
                {
                  path: 'items.instance_1.ps.instance_prop_2',
                },
                {
                  path: 'items.instance_1.ps.duplicate_prop_3',
                  value: addProp([{ value: null, type: 'null' }]),
                },
                {
                  path: 'items.instance_2.ps.p_class',
                },
                {
                  path: 'items.class_1.bp.data.ps.duplicate_prop_3',
                  value: addProp([{ value: null, type: 'null' }]),
                },
              ],
              tests: [
                {
                  path: 'propsByClass.class_1',
                  value: {
                    blueprint: [
                      'blueprint_prop_1',
                      'blueprint_prop_2',
                      'duplicate_prop_1',
                      'duplicate_prop_2',
                      'duplicate_prop_3',
                    ],
                    instances: [
                      'p_class',
                      'instance_prop_1',
                    ],
                  }
                },
              ],
            },
          ]
        },
      ]
    },
  ]

  createTests({
    groups,
    options: {
      prettyDiff: true,
      logs: {
        // stepNames: true,

        // init: [
        //   'item.items.instance_1'
        // ],
        // stepInit: [
        //   'item.items.instance_1'
        // ],
        // stepChanged: [
        //   'item.items.instance_1'
        // ],

        stepAfter: [
          // 'item.items',
          // 'item.bakedItems',
          // 'item.mergedSourceSets',
          // 'item.sourceSetsBy.class',
          // 'item.psByClass',
        ],
      }
    }
  })
})
