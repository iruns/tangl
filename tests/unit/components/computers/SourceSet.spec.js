import {
  addProp,
  processPathPropSet,
  getSourceSetHash,
} from '../../../utils'
import createTests from './createTests'

/*
npm run test:unit ./tests/unit/components/computers/SourceSet.spec.js -- -w
*/

// this file tests the organizing of item baking result by source items
// which includes:
// - SourceSet
// - Data
// - Item
// - Baker
// - Prop
describe('SourceSet', () => {
  const groups = [
    // Generating item.sourceSetHashesByClass
    {
      only: true,
      name: 'Generating item.sourceSetHashesByClass',
      subs: [
        // Creating and deleting containers
        {
          // only: true,
          name: 'Creating and emptying containers',
          init: [
            {
              path: 'item.items',
              subs: [
                { id: 'main_item_1' },
              ]
            },
          ],
          steps: [
            {
              name: 'change',
              path: 'item',
              changes: [
                ...processPathPropSet({
                  path: 'items.main_item_1.ps.p_base_item',
                  value: [
                    {value: 'base_item_1'},
                  ],
                }),
              ],
              tests: [
                (state) => {
                  return {
                    path: 'sourceSetHashesByClass.none',
                    value: [
                      getSourceSetHash(state, 'main_item_1'),
                    ]
                  }
                },
              ],
            },
          ]
        },
        // Working with many classes and base items
        {
          // only: true,
          name: 'Working with classes and base items',
          init: [
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
                (state) => {
                  return {
                    path: 'sourceSetHashesByClass.class_1',
                    value: [
                      getSourceSetHash(state, 'main_item_1'),
                      getSourceSetHash(state, 'main_item_2'),
                    ]
                  }
                },
                (state) => {
                  return {
                    path: 'sourceSetHashesByClass.class_2',
                    value: [
                      getSourceSetHash(state, 'base_item_3'),
                      getSourceSetHash(state, 'main_item_1'),
                      getSourceSetHash(state, 'main_item_3'),
                    ]
                  }
                },
                (state) => {
                  return {
                    path: 'sourceSetHashesByClass.class_3',
                    value: [
                      getSourceSetHash(state, 'base_item_3'),
                      getSourceSetHash(state, 'main_item_2'),
                      getSourceSetHash(state, 'main_item_3'),
                    ]
                  }
                },
                (state) => {
                  return {
                    path: 'sourceSetHashesByClass.none',
                    value: [
                      getSourceSetHash(state, 'base_item_1'),
                    ]
                  }
                },
              ],
            },
            {
              name: 'change',
              path: 'item',
              init: [
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
              changes: [
                ...processPathPropSet({
                  path: 'items.main_item_1.ps.p_class',
                  value: [
                    { value: 'class_1' },
                    { value: 'class_2' },
                    { value: 'class_3' },
                  ],
                }),
                ...processPathPropSet({
                  path: 'items.main_item_1.ps.p_base_item',
                }),
                ...processPathPropSet({
                  path: 'items.main_item_2.ps.p_class',
                }),
                ...processPathPropSet({
                  path: 'items.main_item_3.ps.p_base_item',
                  value: [
                    { value: 'base_item_1' },
                    { value: 'base_item_3' },
                  ],
                }),
              ],
              tests: [
                (state) => {
                  return {
                    path: 'sourceSetHashesByClass.class_1',
                    value: [
                      getSourceSetHash(state, 'main_item_1'),
                    ]
                  }
                },
                (state) => {
                  return {
                    path: 'sourceSetHashesByClass.class_2',
                    value: [
                      getSourceSetHash(state, 'base_item_3'),
                      getSourceSetHash(state, 'main_item_1'),
                      getSourceSetHash(state, 'main_item_3'),
                    ]
                  }
                },
                (state) => {
                  return {
                    path: 'sourceSetHashesByClass.class_3',
                    value: [
                      getSourceSetHash(state, 'base_item_3'),
                      getSourceSetHash(state, 'main_item_1'),
                      getSourceSetHash(state, 'main_item_3'),
                    ]
                  }
                },
                (state) => {
                  return {
                    path: 'sourceSetHashesByClass.none',
                    value: [
                      getSourceSetHash(state, 'main_item_2'),
                    ]
                  }
                },
              ],
            },
            {
              name: 'deletion',
              path: 'item',
              init: [
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
              changes: [
                ...processPathPropSet({
                  path: 'items.main_item_1.ps.p_class',
                }),
                ...processPathPropSet({
                  path: 'items.main_item_1.ps.p_base_item',
                }),
                ...processPathPropSet({
                  path: 'items.main_item_2.ps.p_class',
                }),
                ...processPathPropSet({
                  path: 'items.main_item_3.ps.p_base_item',
                }),
              ],
              tests: [
                (state) => {
                  return {
                    path: 'sourceSetHashesByClass.class_1',
                  }
                },
                (state) => {
                  return {
                    path: 'sourceSetHashesByClass.class_2',
                    value: [
                      getSourceSetHash(state, 'base_item_3'),
                    ]
                  }
                },
                (state) => {
                  return {
                    path: 'sourceSetHashesByClass.class_3',
                    value: [
                      getSourceSetHash(state, 'base_item_3'),
                    ]
                  }
                },
                (state) => {
                  return {
                    path: 'sourceSetHashesByClass.none',
                    value: [
                      getSourceSetHash(state, 'main_item_1'),
                    ]
                  }
                },
              ],
            },
          ]
        },
      ]
    },
    // Generating item.sourceSetsBy.baseItem
    {
      // only: true,
      name: 'Generating item.sourceSetsBy.baseItem',
      subs: [
        // Adding/Editing/Deleting new Working with sourceSetsBy.baseItem
        {
          // only: true,
          name: 'Adding/Editing/Deleting new Working with sourceSetsBy.baseItem',
          init: [
            {
              type: 'item.items',
              subs: [
                { id: 'main_item_1' },
                { id: 'main_item_2' },
              ]
            }
          ],
          steps: [
            {
              name: 'addition',
              path: 'item',
              changes: processPathPropSet({
                path: 'items.main_item_1.ps.p_base_item',
                value: [
                  { value: 'base_item_1' },
                  { value: 'base_item_2' },
                ],
              }),
              tests: [
                {
                  path: 'sourceSetsBy.baseItem.base_item_1',
                  value: [
                    '26a7dad'
                  ],
                }
              ],
            },
            {
              name: 'change',
              path: 'item',
              init: processPathPropSet({
                path: 'items.main_item_1.ps.p_base_item',
                value: [
                  { value: 'base_item_1' },
                  { value: 'base_item_2' },
                ],
              }),
              changes: processPathPropSet({
                path: 'items.main_item_2.ps.p_base_item',
                value: [
                  { value: 'base_item_1' },
                ],
              }),
              tests: [
                {
                  path: 'sourceSetsBy.baseItem.base_item_1',
                  value: [
                    '26a7dad',
                    '1488b2d',
                  ],
                }
              ],
            },
            {
              name: 'deletion',
              path: 'item',
              init: [
                ...processPathPropSet({
                  path: 'items.main_item_1.ps.p_base_item',
                  value: [
                    { value: 'base_item_1' },
                    { value: 'base_item_2' },
                  ],
                }),
                ...processPathPropSet({
                  path: 'items.main_item_2.ps.p_base_item',
                  value: [
                    { value: 'base_item_1' },
                  ],
                }),
              ],
              changes: [
                {
                  path: 'items.main_item_1.ps.p_base_item',
                },
              ],
              tests: [
                {
                  path: 'sourceSetsBy.baseItem.base_item_1',
                  value: [
                    '1488b2d',
                  ],
                },
                {
                  path: 'sourceSetsBy.baseItem.base_item_2',
                },
              ]
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
          // 'item.items',
          // 'item.bakedItems',
          // 'item.mergedSourceSets',
          // 'item.sourceSetsBy',
        ],
      }
    }
  })
})
