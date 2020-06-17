import {
  addProp,
  processPathPropSet,
  getSourceSetHash,
} from '../../../utils'
import createTests from './createTests'

/*
npm run test:unit ./tests/unit/components/computers/Pack.spec.js -- -w
*/

// this file tests the organizing of item baking result by pack
// which includes:
// - Pack
// - Data
// - Item
// - Baker
// - SourceSet
// - Prop
describe('Pack', () => {
  const groups = [
    {
      // only: true,
      name: 'Generating item.sourceSetHashesByPack',
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
              ]
            },
            {
              path: 'item.itemIdsByPack',
              subs: [
                {
                  id: 'pack_1',
                  value: [
                    'main_item_1',
                    'main_item_2',
                  ]
                },
              ]
            },
            {
              path: 'item.items',
              subs: [
                { id: 'main_item_1' },
                { id: 'main_item_2' },
                {
                  id: 'main_item_3',
                  ps: {
                    p_base_item: addProp([
                      { value: 'base_item_1' },
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
              changes: processPathPropSet({
                path: 'items.main_item_1.ps.p_class',
                value: [
                  {value: 'class_1'},
                  {value: 'class_2'},
                ],
              }),
              tests: [
                (state) => {
                  return {
                    path: 'sourceSetHashesByPack.pack_1',
                    value: [
                      getSourceSetHash(state, 'main_item_2'),
                      getSourceSetHash(state, 'main_item_1'),
                    ]
                  }
                },
              ],
            },
            {
              name: 'change',
              path: 'item',
              init: processPathPropSet({
                path: 'items.main_item_1.ps.p_class',
                value: [
                  {value: 'class_1'},
                  {value: 'class_2'},
                ],
              }),
              changes: [
                ...processPathPropSet({
                  path: 'items.main_item_1.ps.p_class',
                  value: [
                    {value: 'class_1'},
                  ],
                }),
                ...processPathPropSet({
                  path: 'items.main_item_2.ps.p_class',
                  value: [
                    {value: 'class_1'},
                  ],
                }),
              ],
              tests: [
                (state) => {
                  return {
                    path: 'sourceSetHashesByPack.pack_1',
                    value: [
                      getSourceSetHash(state, 'main_item_1'),
                    ]
                  }
                },
              ],
            },
            {
              name: 'deletion',
              path: 'item',
              init: processPathPropSet({
                path: 'items.main_item_1.ps.p_class',
                value: [
                  { value: 'class_1' },
                  { value: 'class_2' },
                ],
              }),
              changes: [
                {
                  path: 'itemIdsByPack.pack_1',
                  value: []
                },
              ],
              tests: [
                (state) => {
                  return {
                    path: 'sourceSetHashesByPack.pack_1',
                    value: []
                  }
                },
              ],
            },
          ]
        },
      ]
    },
    {
      only: true,
      name: 'Generating item.classIdsByPack',
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
              ]
            },
            {
              path: 'item.itemIdsByPack',
              subs: [
                {
                  id: 'pack_1',
                  value: [
                    'main_item_1',
                    'main_item_2',
                  ]
                },
              ]
            },
            {
              path: 'item.items',
              subs: [
                { id: 'main_item_1' },
                { id: 'main_item_2' },
                { id: 'main_item_3' },

                { id: 'base_item_1' },
                { id: 'base_item_2' },
                {
                  id: 'base_item_3',
                  ps: {
                    p_class: addProp([
                      { value: 'class_2' },
                      { value: 'class_3' },
                    ]),
                  }
                },

                { id: 'class_1' },
                { id: 'class_2' },
                { id: 'class_3' },
              ]
            },
          ],
          steps: [
            {
              name: 'addition',
              path: 'item',
              changes: processPathPropSet({
                path: 'items.main_item_1.ps.p_class',
                value: [
                  { value: 'class_1' },
                  { value: 'class_2' },
                ],
              }),
              tests: [
                (state) => {
                  return {
                    path: 'classIdsByPack.pack_1',
                    value: [
                      'class_1',
                      'class_2',
                    ]
                  }
                },
              ],
            },
            {
              name: 'change',
              path: 'item',
              init: processPathPropSet({
                path: 'items.main_item_1.ps.p_class',
                value: [
                  {value: 'class_1'},
                  {value: 'class_2'},
                ],
              }),
              changes: [
                ...processPathPropSet({
                  path: 'items.main_item_1.ps.p_class',
                  value: [
                    {value: 'class_1'},
                  ],
                }),
                ...processPathPropSet({
                  path: 'items.main_item_2.ps.p_base_item',
                  value: [
                    {value: 'base_item_3'},
                  ],
                }),
              ],
              tests: [
                (state) => {
                  return {
                    path: 'classIdsByPack.pack_1',
                    value: [
                      'class_1',
                      'class_2',
                      'class_3',
                    ]
                  }
                },
              ],
            },
            {
              name: 'deletion',
              path: 'item',
              init: processPathPropSet({
                path: 'items.main_item_1.ps.p_class',
                value: [
                  {value: 'class_1'},
                  {value: 'class_2'},
                ],
              }),
              changes: [
                {
                  path: 'itemIdsByPack.pack_1',
                  value: []
                },
              ],
              tests: [
                (state) => {
                  return {
                    path: 'classIdsByPack.pack_1',
                    value: []
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
        //   'item.items.main_item'
        // ],
        // stepInit: [
        //   'item.items.main_item'
        // ],
        // stepChanged: [
        //   'item.items.main_item'
        // ],

        stepAfter: [
          // 'item.items.main_item',
          // 'item.bakedItems.main_item',
          // 'item.mergedSourceSets',
        ],
      }
    }
  })
})
