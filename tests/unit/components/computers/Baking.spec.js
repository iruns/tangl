import {
  addProp,
  addFillerProps,
  processPathPropSet,
  // getSourceSetHash,
} from '../../../utils'
import createTests from './createTests'

/*
npm run test:unit ./tests/unit/components/computers/Baking.spec.js -- -w
*/

// this file tests the item baking process which includes:
// - Data
// - Item
// - Baker
// - Blueprint
// - SourceSet
// - Prop
describe('Baking', () => {
  const groups = [
    // TODO: test for replacement
    // TODO: test for part replacement
    // Baking with baseItems
    {
      only: true,
      name: 'Baking with baseItems',
      subs: [
        // Editing the item
        {
          only: true,
          name: 'Editing the item',
          init: [
            {
              path: 'item.items',
              subs: [
                ...addFillerProps({
                  items: [
                    { id: 'base_item_1' },
                    // { id: 'base_item_bp_1' },
                    // { id: 'base_item_bp_bp_1' },
                  ],
                  qualifier: true,
                  // blueprints: true
                }),
                addFillerProps({
                  item: {
                    id: 'main_item',
                    ps: {
                      p_base_item: addProp([
                        { vs: ['base_item_1'] },
                      ]),
                    },
                    // bp: {
                    //   data: {
                    //     ps: {
                    //       p_base_item: addProp([
                    //         { vs: ['base_item_bp_1'] },
                    //       ]),
                    //     },
                    //     bp: {
                    //       data: {
                    //         ps: {
                    //           p_base_item: addProp([
                    //             { vs: ['base_item_bp_bp_1'] },
                    //           ]),
                    //         },
                    //       }
                    //     }
                    //   }
                    // }
                  }
                }),
              ]
            }
          ],
          steps: [
            {
              name: 'addition',
              path: 'item',
              changes: processPathPropSet({
                path: 'items.main_item.ps.prop_0',
                value: [
                  {
                    vs: [['i', 'replace_statement', 'p_result_statement']],
                    qs: {
                      v: {
                        'p_replacement_statement': [{ vs: ['main_item prop_0 a'] }],
                        'p_source_statement': [{ vs: [['s', 'base_item_1.ps.prop_0.base_item_1__v0']] }]
                      }
                    }
                  }, // replace
                  // replace parts
                  { vs: ['main_item prop_0 c'] }, // add
                ],
                // blueprints: true,
              }),
              tests: [
                // ...processPathPropSet({
                //   path: 'bakedItems.main_item.data.ps.prop_0',
                //   value: [
                //     { vs: ['base_item_1 prop_0 b'], id: 'base_item_1.ps.prop_0.v1' }, // inherited
                //     { vs: ['main_item prop_0 a'] }, // replaced
                //     { vs: ['main_item prop_0 c'] }, // added
                //   ],
                //   // blueprints: true,
                // }),
                // ...processPathPropSet({
                //   path: 'bakedItems.main_item.data.mps.prop_0',
                //   value: [
                //     { vs: ['main_item prop_0 a'] }, // replaced
                //     { vs: ['base_item_1 prop_0 b'], id: 'base_item_1.ps.prop_0.v1' }, // inherited
                //     { vs: ['main_item prop_0 d'] }, // added
                //   ],
                //   // blueprints: true,
                // }),
              ]
            },
            // {
            //   name: 'change',
            //   path: 'item',
            //   init: processPathPropSet({
            //     path: 'items.main_item.ps.prop_0',
            //     value: [
            //       { vs: ['main_item prop_0 a'] }, // replace baseItem_1
            //       { vs: ['main_item prop_0 d'] }, // add
            //     ],
            //     blueprints: true,
            //   }),
            //   changes: processPathPropSet({
            //     path: 'items.main_item.ps.prop_0',
            //     value: [
            //       { vs: ['main_item prop_0 a ch'] }, // replace baseItem
            //       { vs: null, t: 'null' }, // nullify baseItem
            //     ],
            //     blueprints: true,
            //   }),
            //   tests: processPathPropSet({
            //     path: 'bakedItems.main_item.data.ps.prop_0',
            //     value: [
            //       { vs: ['main_item prop_0 a ch'] }, // replace baseItem
            //       { vs: null, t: 'null' }, // nullify baseItem
            //       { vs: ['base_item_2 prop_0 b'] }, // inherited
            //     ],
            //     blueprints: true,
            //   })
            // },
            // {
            //   name: 'deletion',
            //   path: 'item',
            //   init: processPathPropSet({
            //     path: 'items.main_item.ps.prop_0',
            //     value: [
            //       { vs: ['main_item prop_0 a'] }, // replace baseItem_1
            //       { vs: ['main_item prop_0 d'] }, // add
            //     ],
            //     blueprints: true,
            //   }),
            //   changes: processPathPropSet({
            //     path: 'items.main_item.ps.prop_0',
            //     blueprints: true,
            //   }),
            //   tests: processPathPropSet({
            //     path: 'bakedItems.main_item.data.ps.prop_0',
            //     value: [
            //       { vs: ['base_item_1 prop_0 a'] }, // inherited
            //       { vs: ['base_item_2 prop_0 a'] }, // inherited
            //       { vs: ['base_item_2 prop_0 b'] }, // inherited
            //     ],
            //     blueprints: true,
            //   })
            // },
          ]
        },
      ]
    },
    // TODO: 2-level baking
    // TODO: test for overlapping replacement
    // TODO: test for overlapping part replacement
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
          // 'item.items.main_item',
          // 'item.bakedItems.main_item',
          // 'item.mergedSourceSets',
        ],
      }
    }
  })
})
