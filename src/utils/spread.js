export function createBlankSpread (packId) {
  return {
    info: {
      packId,
      label: 'New spread',
      description: 'No description',
    },
    config: {
      filters: {
        packs: {
          order: [packId],
          values: {[packId]: true}
        },
        classes: {
          order: [
            'item',
          ],
          values: {
            item: true,
          }
        },
        baseItems: {
          order: [
            'any',
            'none',
          ],
          values: {
            any: true, // all items
            none: false, // items with no superitems
          }
        },
        props: {
          order: [
            'p_description',
          ],
          values: {
            p_description: true,
          }
        },
      },
      // groupings: {
      //
      // },
      style: {
        classes: {
          default: {
            colors: [
              'grey darken-4',
              '#212121',
              'white',
            ],
            size: 0,
            props: {
              default: {
                colors: [
                  'grey darken-4',
                  '#212121',
                  'white',
                ],
                show: true,
                connector: {
                  path: 'curve'
                }
              },
            }
          },
          prop: {
            colors: [
              'blue accent-3',
              '#2979FF',
              'white',
            ],
            size: 0,
          },
        },
        // groups: {
        //
        // }
      },
      // layout: {
      //
      // }
    }
  }
}
