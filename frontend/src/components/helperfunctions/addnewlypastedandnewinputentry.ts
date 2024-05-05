import type {
  AtNumber,
  NumberSearchType,
  StringSearchType,
  NumberType,
  NumberSearchExcludeEqualToType,
  NumberSearchExcludeFromToType
} from '../types/SupportedDatatypesTypeDeclaration'
import { nextTick, type ShallowRef, triggerRef } from 'vue'

const numberlimit = 10,
  wordlimit = 100

function scrollToElement(el: HTMLDivElement | HTMLLIElement) {
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

export async function repaginateExcludeEqualtoPage(
  holder: ShallowRef<NumberType['search']['multiple'] | AtNumber<NumberSearchType>>,
  from?: 'NUMBER-SEARCHER-MODAL' | 'NUMBER-STRING-OR-SINGLE-WORD-STRING-SEARCHER-MODAL' | undefined
) {
  let allinflatarray = [],
    done = false
  for (
    let i = 0;
    i <
    (
      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
        ? (holder.value as NumberType['search']['multiple'])
        : (holder.value as AtNumber<NumberSearchType>).search
      )?.exclude?.equalto as NumberSearchExcludeEqualToType
    ).pages.length;
    i++
  ) {
    const jsize = (
      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
        ? (holder.value as NumberType['search']['multiple'])
        : (holder.value as AtNumber<NumberSearchType>).search
      )?.exclude?.equalto as NumberSearchExcludeEqualToType
    ).pages[i].length
    if (jsize === 0) {
      ;(
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search
        )?.exclude?.equalto as NumberSearchExcludeEqualToType
      ).pages.splice(i, 1)
    }
    ;(
      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
        ? (holder.value as NumberType['search']['multiple'])
        : (holder.value as AtNumber<NumberSearchType>).search
      )?.exclude?.equalto as NumberSearchExcludeEqualToType
    ).pages = [
      ...(
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search
        )?.exclude?.equalto as NumberSearchExcludeEqualToType
      ).pages.filter((item: string[] | undefined | null) => item !== undefined && item !== null)
    ]
    triggerRef(holder)
  }
  allinflatarray = storeAllInExcludeEqualToPagesIntoAFlatArray(
    holder as ShallowRef<NumberType['search']['multiple'] | AtNumber<NumberSearchType>>,
    from
  ) as string[]
  ;(
    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
      ? (holder.value as NumberType['search']['multiple'])
      : (holder.value as AtNumber<NumberSearchType>).search
    )?.exclude?.equalto as NumberSearchExcludeEqualToType
  ).pages = []
  ;(
    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
      ? (holder.value as NumberType['search']['multiple'])
      : (holder.value as AtNumber<NumberSearchType>).search
    )?.exclude?.equalto as NumberSearchExcludeEqualToType
  ).addeditemsref = []
  ;(
    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
      ? (holder.value as NumberType['search']['multiple'])
      : (holder.value as AtNumber<NumberSearchType>).search
    )?.exclude?.equalto as NumberSearchExcludeEqualToType
  ).inneraddeditemsref = []
  ;(
    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
      ? (holder.value as NumberType['search']['multiple'])
      : (holder.value as AtNumber<NumberSearchType>).search
    )?.exclude?.equalto as NumberSearchExcludeEqualToType
  ).endoflistitemref = undefined
  ;(
    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
      ? (holder.value as NumberType['search']['multiple'])
      : (holder.value as AtNumber<NumberSearchType>).search
    )?.exclude?.equalto as NumberSearchExcludeEqualToType
  ).addloading = false
  ;(
    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
      ? (holder.value as NumberType['search']['multiple'])
      : (holder.value as AtNumber<NumberSearchType>).search
    )?.exclude?.equalto as NumberSearchExcludeEqualToType
  ).loading = false
  ;(
    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
      ? (holder.value as NumberType['search']['multiple'])
      : (holder.value as AtNumber<NumberSearchType>).search
    )?.exclude?.equalto as NumberSearchExcludeEqualToType
  ).show = []
  ;(
    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
      ? (holder.value as NumberType['search']['multiple'])
      : (holder.value as AtNumber<NumberSearchType>).search
    )?.exclude?.equalto as NumberSearchExcludeEqualToType
  ).shake = []
  ;(
    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
      ? (holder.value as NumberType['search']['multiple'])
      : (holder.value as AtNumber<NumberSearchType>).search
    )?.exclude?.equalto as NumberSearchExcludeEqualToType
  ).bottom = false
  triggerRef(holder)
  allinflatarray.forEach(async (item) => {
    await addNewInputEntry(item, 'EXCLUDE-EQUAL-TO', holder, from)
  })
  allinflatarray = []
  done = true
  return done
}

async function isAlreadyInPageArray(
  newinputentry: string | [string, string],
  holder: ShallowRef<
    NumberType['search']['multiple'] | AtNumber<NumberSearchType> | StringSearchType
  >,
  direction:
    | 'DIRECT'
    | 'INDIRECT-CHECK-WHETHER-NEWINPUTENTRY-WITHIN-RANGE-OF-EXCLUDE-FROMTO'
    | 'INDIRECT-CHECK-WHETHER-RANGE-NEWINPUTENTRY-COVERS-EXCLUDE-EQUALTO',
  inputtype?:
    | 'WORD'
    | 'EXCLUDE-EQUAL-TO'
    | 'EXCLUDE-FROM-TO'
    | 'NOT-EQUAL-TO'
    | 'EQUAL-TO'
    | undefined,
  from?: 'NUMBER-SEARCHER-MODAL' | 'NUMBER-STRING-OR-SINGLE-WORD-STRING-SEARCHER-MODAL' | undefined
) {
  let inpage = false,
    pageindex = 0,
    pos = 0
  if (direction === 'DIRECT') {
    for (
      let i = 0;
      i <
      (inputtype === 'WORD'
        ? (holder.value as StringSearchType).pages.length
        : inputtype === 'EQUAL-TO'
        ? (
            (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
              ? (holder.value as NumberType['search']['multiple'])
              : (holder.value as AtNumber<NumberSearchType>).search
            )?.equalto as NumberSearchExcludeEqualToType
          ).pages.length
        : inputtype === 'NOT-EQUAL-TO'
        ? (
            (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
              ? (holder.value as NumberType['search']['multiple'])
              : (holder.value as AtNumber<NumberSearchType>).search
            )?.notequalto as NumberSearchExcludeEqualToType
          ).pages.length
        : inputtype == 'EXCLUDE-EQUAL-TO'
        ? (
            (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
              ? (holder.value as NumberType['search']['multiple'])
              : (holder.value as AtNumber<NumberSearchType>).search
            )?.exclude?.equalto as NumberSearchExcludeEqualToType
          ).pages.length
        : (
            (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
              ? (holder.value as NumberType['search']['multiple'])
              : (holder.value as AtNumber<NumberSearchType>).search
            )?.exclude?.fromto as NumberSearchExcludeFromToType
          ).pages.length);
      i++
    ) {
      for (
        let j = 0;
        j <
        (inputtype === 'WORD'
          ? (holder.value as StringSearchType).pages[i].length
          : inputtype === 'EQUAL-TO'
          ? (
              (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                ? (holder.value as NumberType['search']['multiple'])
                : (holder.value as AtNumber<NumberSearchType>).search
              )?.equalto as NumberSearchExcludeEqualToType
            ).pages[i].length
          : inputtype === 'NOT-EQUAL-TO'
          ? (
              (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                ? (holder.value as NumberType['search']['multiple'])
                : (holder.value as AtNumber<NumberSearchType>).search
              )?.notequalto as NumberSearchExcludeEqualToType
            ).pages[i].length
          : inputtype == 'EXCLUDE-EQUAL-TO'
          ? (
              (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                ? (holder.value as NumberType['search']['multiple'])
                : (holder.value as AtNumber<NumberSearchType>).search
              )?.exclude?.equalto as NumberSearchExcludeEqualToType
            ).pages[i].length
          : (
              (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                ? (holder.value as NumberType['search']['multiple'])
                : (holder.value as AtNumber<NumberSearchType>).search
              )?.exclude?.fromto as NumberSearchExcludeFromToType
            ).pages[i].length);
        j++
      ) {
        if (
          inputtype === 'WORD' ||
          inputtype === 'EQUAL-TO' ||
          inputtype === 'NOT-EQUAL-TO' ||
          inputtype === 'EXCLUDE-EQUAL-TO'
        ) {
          if (
            newinputentry ===
            (inputtype === 'WORD'
              ? (holder.value as StringSearchType).pages[i][j]
              : inputtype === 'EQUAL-TO'
              ? (
                  (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                    ? (holder.value as NumberType['search']['multiple'])
                    : (holder.value as AtNumber<NumberSearchType>).search
                  )?.equalto as NumberSearchExcludeEqualToType
                ).pages[i][j]
              : inputtype === 'NOT-EQUAL-TO'
              ? (
                  (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                    ? (holder.value as NumberType['search']['multiple'])
                    : (holder.value as AtNumber<NumberSearchType>).search
                  )?.notequalto as NumberSearchExcludeEqualToType
                ).pages[i][j]
              : (
                  (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                    ? (holder.value as NumberType['search']['multiple'])
                    : (holder.value as AtNumber<NumberSearchType>).search
                  )?.exclude?.equalto as NumberSearchExcludeEqualToType
                ).pages[i][j])
          ) {
            pageindex = i
            pos = j
            inpage = true
            break
          }
        } else {
          if (
            (parseFloat(newinputentry[0]) >=
              parseFloat(
                (
                  (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                    ? (holder.value as NumberType['search']['multiple'])
                    : (holder.value as AtNumber<NumberSearchType>).search
                  )?.exclude?.fromto as NumberSearchExcludeFromToType
                ).pages[i][j][0]
              ) &&
              parseFloat(newinputentry[0]) <
                parseFloat(
                  (
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.exclude?.fromto as NumberSearchExcludeFromToType
                  ).pages[i][j][1]
                ) &&
              parseFloat(newinputentry[1]) >=
                parseFloat(
                  (
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.exclude?.fromto as NumberSearchExcludeFromToType
                  ).pages[i][j][1]
                )) ||
            (parseFloat(newinputentry[0]) >=
              parseFloat(
                (
                  (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                    ? (holder.value as NumberType['search']['multiple'])
                    : (holder.value as AtNumber<NumberSearchType>).search
                  )?.exclude?.fromto as NumberSearchExcludeFromToType
                ).pages[i][j][0]
              ) &&
              parseFloat(newinputentry[1]) <=
                parseFloat(
                  (
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.exclude?.fromto as NumberSearchExcludeFromToType
                  ).pages[i][j][1]
                )) ||
            (((parseFloat(newinputentry[1]) <=
              parseFloat(
                (
                  (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                    ? (holder.value as NumberType['search']['multiple'])
                    : (holder.value as AtNumber<NumberSearchType>).search
                  )?.exclude?.fromto as NumberSearchExcludeFromToType
                ).pages[i][j][1]
              ) &&
              parseFloat(newinputentry[1]) >=
                parseFloat(
                  (
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.exclude?.fromto as NumberSearchExcludeFromToType
                  ).pages[i][j][0]
                )) ||
              parseFloat(newinputentry[1]) >=
                parseFloat(
                  (
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.exclude?.fromto as NumberSearchExcludeFromToType
                  ).pages[i][j][1]
                )) &&
              parseFloat(newinputentry[0]) <=
                parseFloat(
                  (
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.exclude?.fromto as NumberSearchExcludeFromToType
                  ).pages[i][j][0]
                )) ||
            parseFloat(newinputentry[1]) ===
              parseFloat(
                (
                  (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                    ? (holder.value as NumberType['search']['multiple'])
                    : (holder.value as AtNumber<NumberSearchType>).search
                  )?.exclude?.fromto as NumberSearchExcludeFromToType
                ).pages[i][j][0]
              ) ||
            parseFloat(newinputentry[0]) ===
              parseFloat(
                (
                  (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                    ? (holder.value as NumberType['search']['multiple'])
                    : (holder.value as AtNumber<NumberSearchType>).search
                  )?.exclude?.fromto as NumberSearchExcludeFromToType
                ).pages[i][j][1]
              )
          ) {
            pageindex = i
            pos = j
            inpage = true
            break
          }
        }
      }
      if (inpage) break
    }
  } else if (direction === 'INDIRECT-CHECK-WHETHER-NEWINPUTENTRY-WITHIN-RANGE-OF-EXCLUDE-FROMTO') {
    if (typeof newinputentry === 'string') {
      for (
        let i = 0;
        i <
        (
          (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
            ? (holder.value as NumberType['search']['multiple'])
            : (holder.value as AtNumber<NumberSearchType>).search
          )?.exclude?.fromto as NumberSearchExcludeFromToType
        ).pages.length;
        i++
      ) {
        for (
          let j = 0;
          j <
          (
            (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
              ? (holder.value as NumberType['search']['multiple'])
              : (holder.value as AtNumber<NumberSearchType>).search
            )?.exclude?.fromto as NumberSearchExcludeFromToType
          ).pages[i].length;
          j++
        ) {
          if (
            parseFloat(newinputentry) >=
              parseFloat(
                (
                  (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                    ? (holder.value as NumberType['search']['multiple'])
                    : (holder.value as AtNumber<NumberSearchType>).search
                  )?.exclude?.fromto as NumberSearchExcludeFromToType
                ).pages[i][j][0]
              ) &&
            parseFloat(newinputentry) <=
              parseFloat(
                (
                  (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                    ? (holder.value as NumberType['search']['multiple'])
                    : (holder.value as AtNumber<NumberSearchType>).search
                  )?.exclude?.fromto as NumberSearchExcludeFromToType
                ).pages[i][j][1]
              )
          ) {
            pageindex = i
            pos = j
            inpage = true
            const time3: ReturnType<typeof setTimeout> = setTimeout(() => {
              ;(
                (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                  ? (holder.value as NumberType['search']['multiple'])
                  : (holder.value as AtNumber<NumberSearchType>).search
                )?.exclude?.fromto as NumberSearchExcludeFromToType
              ).current = i
              ;(
                (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                  ? (holder.value as NumberType['search']['multiple'])
                  : (holder.value as AtNumber<NumberSearchType>).search
                )?.exclude?.fromto as NumberSearchExcludeFromToType
              ).signal++
              triggerRef(holder)
              if (
                (
                  (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                    ? (holder.value as NumberType['search']['multiple'])
                    : (holder.value as AtNumber<NumberSearchType>).search
                  )?.exclude?.fromto as NumberSearchExcludeFromToType
                ).addeditemsref[pos] as HTMLDivElement
              ) {
                scrollToElement(
                  (
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.exclude?.fromto as NumberSearchExcludeFromToType
                  ).addeditemsref[pos] as HTMLDivElement
                )
                ;(
                  (
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.exclude?.fromto as NumberSearchExcludeFromToType
                  ).inneraddeditemsref[pos] as HTMLDivElement
                ).style.backgroundColor = 'red'
                ;(
                  (
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.exclude?.fromto as NumberSearchExcludeFromToType
                  ).inneraddeditemsref[pos] as HTMLDivElement
                ).style.color = '#fff'
                ;(
                  (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                    ? (holder.value as NumberType['search']['multiple'])
                    : (holder.value as AtNumber<NumberSearchType>).search
                  )?.exclude?.fromto as NumberSearchExcludeFromToType
                ).show[pos] = true
                ;(
                  (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                    ? (holder.value as NumberType['search']['multiple'])
                    : (holder.value as AtNumber<NumberSearchType>).search
                  )?.exclude?.fromto as NumberSearchExcludeFromToType
                ).shake[pos] = true
                triggerRef(holder)
              }
              clearTimeout(time3)
            }, 100)

            const time1: ReturnType<typeof setTimeout> = setTimeout(() => {
              ;(
                (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                  ? (holder.value as NumberType['search']['multiple'])
                  : (holder.value as AtNumber<NumberSearchType>).search
                )?.exclude?.fromto as NumberSearchExcludeFromToType
              ).shake[pos] = true
              triggerRef(holder)
              clearTimeout(time1)
            }, 800)
            const time2: ReturnType<typeof setTimeout> = setTimeout(() => {
              if (
                (
                  (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                    ? (holder.value as NumberType['search']['multiple'])
                    : (holder.value as AtNumber<NumberSearchType>).search
                  )?.exclude?.fromto as NumberSearchExcludeFromToType
                ).inneraddeditemsref[pos] as HTMLDivElement
              ) {
                if (
                  (
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.exclude?.fromto as NumberSearchExcludeFromToType
                  ).inneraddeditemsref[pos].style.backgroundColor !== '#fff'
                ) {
                  ;(
                    (
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.exclude?.fromto as NumberSearchExcludeFromToType
                    ).inneraddeditemsref[pos] as HTMLDivElement
                  ).style.backgroundColor = '#fff'
                  ;(
                    (
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.exclude?.fromto as NumberSearchExcludeFromToType
                    ).inneraddeditemsref[pos] as HTMLDivElement
                  ).style.color = 'black'
                  ;(
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.exclude?.fromto as NumberSearchExcludeFromToType
                  ).shake[pos] = false
                  triggerRef(holder)
                }
              }
              clearTimeout(time2)
            }, 810)
            break
          }
        }
        if (inpage) break
      }
    }
  } else {
    if (typeof newinputentry !== 'string') {
      const inpagepageindexandpos = await isAlreadyInPageArray(
        newinputentry,
        holder,
        'DIRECT',
        'EXCLUDE-FROM-TO',
        from
      )
      if (!inpagepageindexandpos.inpage) {
        const time1: ReturnType<typeof setTimeout>[] = [],
          time2: ReturnType<typeof setTimeout>[] = [],
          time3: ReturnType<typeof setTimeout>[] = [],
          time7: ReturnType<typeof setTimeout>[] = []
        let time1Index = 0,
          time2Index = 0,
          time3Index = 0,
          time7Index = 0,
          somethingdeleted = false
        for (
          let i = 0;
          i <
          (
            (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
              ? (holder.value as NumberType['search']['multiple'])
              : (holder.value as AtNumber<NumberSearchType>).search
            )?.exclude?.equalto as NumberSearchExcludeEqualToType
          ).pages.length;
          i++
        ) {
          for (
            let j = 0;
            j <
            (
              (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                ? (holder.value as NumberType['search']['multiple'])
                : (holder.value as AtNumber<NumberSearchType>).search
              )?.exclude?.equalto as NumberSearchExcludeEqualToType
            ).pages[i].length;
            j++
          ) {
            if (
              parseFloat(
                (
                  (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                    ? (holder.value as NumberType['search']['multiple'])
                    : (holder.value as AtNumber<NumberSearchType>).search
                  )?.exclude?.equalto as NumberSearchExcludeEqualToType
                ).pages[i][j]
              ) >= parseFloat(newinputentry[0]) &&
              parseFloat(
                (
                  (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                    ? (holder.value as NumberType['search']['multiple'])
                    : (holder.value as AtNumber<NumberSearchType>).search
                  )?.exclude?.equalto as NumberSearchExcludeEqualToType
                ).pages[i][j]
              ) <= parseFloat(newinputentry[1])
            ) {
              pageindex = i
              pos = j
              inpage = true
              time3[time3Index] = setTimeout(() => {
                ;(
                  (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                    ? (holder.value as NumberType['search']['multiple'])
                    : (holder.value as AtNumber<NumberSearchType>).search
                  )?.exclude?.equalto as NumberSearchExcludeEqualToType
                ).current = i
                ;(
                  (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                    ? (holder.value as NumberType['search']['multiple'])
                    : (holder.value as AtNumber<NumberSearchType>).search
                  )?.exclude?.equalto as NumberSearchExcludeEqualToType
                ).signal++
                triggerRef(holder)
                if (
                  (
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.exclude?.equalto as NumberSearchExcludeEqualToType
                  ).addeditemsref[j] as HTMLDivElement
                ) {
                  scrollToElement(
                    (
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.exclude?.equalto as NumberSearchExcludeEqualToType
                    ).addeditemsref[j] as HTMLDivElement
                  )
                  ;(
                    (
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.exclude?.equalto as NumberSearchExcludeEqualToType
                    ).inneraddeditemsref[j] as HTMLDivElement
                  ).style.backgroundColor = 'red'
                  ;(
                    (
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.exclude?.equalto as NumberSearchExcludeEqualToType
                    ).inneraddeditemsref[j] as HTMLDivElement
                  ).style.color = '#fff'
                  ;(
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.exclude?.equalto as NumberSearchExcludeEqualToType
                  ).show[j] = true
                  ;(
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.exclude?.equalto as NumberSearchExcludeEqualToType
                  ).shake[j] = true
                  triggerRef(holder)
                }
                clearTimeout(time3[time3Index])
              }, 400)
              time3Index++
              time1[time1Index] = setTimeout(() => {
                ;(
                  (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                    ? (holder.value as NumberType['search']['multiple'])
                    : (holder.value as AtNumber<NumberSearchType>).search
                  )?.exclude?.equalto as NumberSearchExcludeEqualToType
                ).shake[j] = true
                triggerRef(holder)
                clearTimeout(time1[time1Index])
              }, 900)
              time1Index++
              time2[time2Index] = setTimeout(() => {
                if (
                  (
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.exclude?.equalto as NumberSearchExcludeEqualToType
                  ).inneraddeditemsref[j] as HTMLDivElement
                ) {
                  if (
                    (
                      (
                        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                          ? (holder.value as NumberType['search']['multiple'])
                          : (holder.value as AtNumber<NumberSearchType>).search
                        )?.exclude?.equalto as NumberSearchExcludeEqualToType
                      ).inneraddeditemsref[j] as HTMLDivElement
                    ).style.backgroundColor !== '#fff'
                  ) {
                    ;(
                      (
                        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                          ? (holder.value as NumberType['search']['multiple'])
                          : (holder.value as AtNumber<NumberSearchType>).search
                        )?.exclude?.equalto as NumberSearchExcludeEqualToType
                      ).inneraddeditemsref[j] as HTMLDivElement
                    ).style.backgroundColor = '#fff'
                    ;(
                      (
                        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                          ? (holder.value as NumberType['search']['multiple'])
                          : (holder.value as AtNumber<NumberSearchType>).search
                        )?.exclude?.equalto as NumberSearchExcludeEqualToType
                      ).inneraddeditemsref[j] as HTMLDivElement
                    ).style.color = 'black'
                    ;(
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.exclude?.equalto as NumberSearchExcludeEqualToType
                    ).shake[j] = false
                    ;(
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.exclude?.equalto as NumberSearchExcludeEqualToType
                    ).show[j] = false
                    triggerRef(holder)
                  }
                }
                clearTimeout(time2[time2Index])
              }, 910)
              time2Index++
              time7[time7Index] = setTimeout(() => {
                ;(
                  (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                    ? (holder.value as NumberType['search']['multiple'])
                    : (holder.value as AtNumber<NumberSearchType>).search
                  )?.exclude?.equalto as NumberSearchExcludeEqualToType
                ).shake[j] = false
                triggerRef(holder)
                clearTimeout(time7[time7Index])
              }, 915)
              time7Index++
            }
          }
        }
        const time4: ReturnType<typeof setTimeout> = setTimeout(() => {
          for (
            let i = 0;
            i <
            (
              (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                ? (holder.value as NumberType['search']['multiple'])
                : (holder.value as AtNumber<NumberSearchType>).search
              )?.exclude?.equalto as NumberSearchExcludeEqualToType
            ).pages.length;
            i++
          ) {
            for (
              let j = 0;
              j <
              (
                (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                  ? (holder.value as NumberType['search']['multiple'])
                  : (holder.value as AtNumber<NumberSearchType>).search
                )?.exclude?.equalto as NumberSearchExcludeEqualToType
              ).pages[i].length;
              j++
            ) {
              if (
                parseFloat(
                  (
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.exclude?.equalto as NumberSearchExcludeEqualToType
                  ).pages[i][j]
                ) >= parseFloat(newinputentry[0]) &&
                parseFloat(
                  (
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.exclude?.equalto as NumberSearchExcludeEqualToType
                  ).pages[i][j]
                ) <= parseFloat(newinputentry[1])
              ) {
                if (
                  i in
                  Object.keys(
                    (
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.exclude?.equalto as NumberSearchExcludeEqualToType
                    ).pages
                  )
                ) {
                  if (
                    (
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.exclude?.equalto as NumberSearchExcludeEqualToType
                    ).pages[i][j] !== null &&
                    (
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.exclude?.equalto as NumberSearchExcludeEqualToType
                    ).pages[i][j] !== undefined
                  ) {
                    delete (
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.exclude?.equalto as NumberSearchExcludeEqualToType
                    ).pages[i][j]
                    delete (
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.exclude?.equalto as NumberSearchExcludeEqualToType
                    ).shake[j]
                    delete (
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.exclude?.equalto as NumberSearchExcludeEqualToType
                    ).inneraddeditemsref[j]
                    delete (
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.exclude?.equalto as NumberSearchExcludeEqualToType
                    ).addeditemsref[j]
                    delete (
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.exclude?.equalto as NumberSearchExcludeEqualToType
                    ).show[j]
                    triggerRef(holder)
                    somethingdeleted = true
                  }
                } else {
                  i = -1
                  j =
                    (
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.exclude?.equalto as NumberSearchExcludeEqualToType
                    ).pages[i].length - 1
                }
              }
            }
          }
          clearTimeout(time4)
        }, 920)
        const time5: ReturnType<typeof setTimeout> = setTimeout(() => {
          for (
            let i = 0;
            i <
            (
              (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                ? (holder.value as NumberType['search']['multiple'])
                : (holder.value as AtNumber<NumberSearchType>).search
              )?.exclude?.equalto as NumberSearchExcludeEqualToType
            ).pages.length;
            i++
          ) {
            for (
              let j = 0;
              j <
              (
                (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                  ? (holder.value as NumberType['search']['multiple'])
                  : (holder.value as AtNumber<NumberSearchType>).search
                )?.exclude?.equalto as NumberSearchExcludeEqualToType
              ).pages[i].length;
              j++
            ) {
              ;(
                (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                  ? (holder.value as NumberType['search']['multiple'])
                  : (holder.value as AtNumber<NumberSearchType>).search
                )?.exclude?.equalto as NumberSearchExcludeEqualToType
              ).pages[i] = [
                ...(
                  (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                    ? (holder.value as NumberType['search']['multiple'])
                    : (holder.value as AtNumber<NumberSearchType>).search
                  )?.exclude?.equalto as NumberSearchExcludeEqualToType
                ).pages[i].filter((item) => item !== undefined && item !== null)
              ]
              ;(
                (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                  ? (holder.value as NumberType['search']['multiple'])
                  : (holder.value as AtNumber<NumberSearchType>).search
                )?.exclude?.equalto as NumberSearchExcludeEqualToType
              ).shake = [
                ...(
                  (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                    ? (holder.value as NumberType['search']['multiple'])
                    : (holder.value as AtNumber<NumberSearchType>).search
                  )?.exclude?.equalto as NumberSearchExcludeEqualToType
                ).shake.filter((item) => item !== undefined && item !== null)
              ]
              ;(
                (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                  ? (holder.value as NumberType['search']['multiple'])
                  : (holder.value as AtNumber<NumberSearchType>).search
                )?.exclude?.equalto as NumberSearchExcludeEqualToType
              ).inneraddeditemsref = [
                ...(
                  (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                    ? (holder.value as NumberType['search']['multiple'])
                    : (holder.value as AtNumber<NumberSearchType>).search
                  )?.exclude?.equalto as NumberSearchExcludeEqualToType
                ).inneraddeditemsref.filter((item) => item !== undefined && item !== null)
              ]
              ;(
                (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                  ? (holder.value as NumberType['search']['multiple'])
                  : (holder.value as AtNumber<NumberSearchType>).search
                )?.exclude?.equalto as NumberSearchExcludeEqualToType
              ).addeditemsref = [
                ...(
                  (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                    ? (holder.value as NumberType['search']['multiple'])
                    : (holder.value as AtNumber<NumberSearchType>).search
                  )?.exclude?.equalto as NumberSearchExcludeEqualToType
                ).addeditemsref.filter((item) => item !== undefined && item !== null)
              ]
              ;(
                (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                  ? (holder.value as NumberType['search']['multiple'])
                  : (holder.value as AtNumber<NumberSearchType>).search
                )?.exclude?.equalto as NumberSearchExcludeEqualToType
              ).show = [
                ...(
                  (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                    ? (holder.value as NumberType['search']['multiple'])
                    : (holder.value as AtNumber<NumberSearchType>).search
                  )?.exclude?.equalto as NumberSearchExcludeEqualToType
                ).show.filter((item) => item !== undefined && item !== null)
              ]
              triggerRef(holder)
            }
          }
          clearTimeout(time5)
        }, 925)
        const time6: ReturnType<typeof setTimeout> = setTimeout(async () => {
          if (somethingdeleted) {
            if (
              await repaginateExcludeEqualtoPage(
                holder as ShallowRef<NumberType['search']['multiple']>,
                from
              )
            ) {
              const inpagepageindexandpos = await isAlreadyInPageArray(
                newinputentry,
                holder,
                direction,
                inputtype,
                from
              )
              inpage = inpagepageindexandpos.inpage
              pageindex = inpagepageindexandpos.pageindex
              pos = inpagepageindexandpos.pos
            }
          }
          clearTimeout(time6)
        }, 930)
      }
    }
  }
  return { inpage, pageindex, pos }
}

function storeAllInExcludeEqualToPagesIntoAFlatArray(
  holder: ShallowRef<NumberType['search']['multiple'] | AtNumber<NumberSearchType>>,
  from?: 'NUMBER-SEARCHER-MODAL' | 'NUMBER-STRING-OR-SINGLE-WORD-STRING-SEARCHER-MODAL' | undefined
) {
  const allinflatarray = []
  for (
    let i = 0;
    i <
    (
      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
        ? (holder.value as NumberType['search']['multiple'])
        : (holder.value as AtNumber<NumberSearchType>).search
      )?.exclude?.equalto as NumberSearchExcludeEqualToType
    ).pages.length;
    i++
  ) {
    for (
      let j = 0;
      j <
      (
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search
        )?.exclude?.equalto as NumberSearchExcludeEqualToType
      ).pages[i].length;
      j++
    ) {
      allinflatarray.push(
        (
          (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
            ? (holder.value as NumberType['search']['multiple'])
            : (holder.value as AtNumber<NumberSearchType>).search
          )?.exclude?.equalto as NumberSearchExcludeEqualToType
        ).pages[i][j]
      )
    }
  }

  return allinflatarray
}

export async function addNewInputEntry(
  newinputentry: string | [string, string],
  inputtype: 'WORD' | 'EXCLUDE-EQUAL-TO' | 'EXCLUDE-FROM-TO' | 'NOT-EQUAL-TO' | 'EQUAL-TO',
  holder: ShallowRef<
    NumberType['search']['multiple'] | AtNumber<NumberSearchType> | StringSearchType
  >,
  from?: 'NUMBER-SEARCHER-MODAL' | 'NUMBER-STRING-OR-SINGLE-WORD-STRING-SEARCHER-MODAL' | undefined
) {
  nextTick(async () => {
    if (
      inputtype === 'EQUAL-TO' ||
      inputtype === 'EXCLUDE-EQUAL-TO' ||
      inputtype === 'NOT-EQUAL-TO' ||
      inputtype === 'WORD'
    ) {
      switch (inputtype) {
        case 'WORD': {
          const maxwordlength = 40
          if (typeof newinputentry === 'string') {
            if (newinputentry.trim().length > 0 && newinputentry.length <= maxwordlength) {
              const inpagepageindexandpos = await isAlreadyInPageArray(
                newinputentry,
                holder,
                'DIRECT',
                inputtype,
                from
              )
              if (!inpagepageindexandpos.inpage) {
                ;(holder.value as StringSearchType).enteredwhennotinpage = true
                ;(holder.value as StringSearchType).addloading = true
                triggerRef(holder)
                const time1: ReturnType<typeof setTimeout> = setTimeout(() => {
                  scrollToElement(
                    (holder.value as StringSearchType).endoflistitemref as HTMLLIElement
                  )
                  clearTimeout(time1)
                }, 110)
                const time2: ReturnType<typeof setTimeout> = setTimeout(() => {
                  ;(holder.value as StringSearchType).addloading = false
                  triggerRef(holder)
                  let sum = 0
                  if ((holder.value as StringSearchType).pages.length > 0) {
                    for (
                      let i = 0;
                      i <
                      (holder.value as StringSearchType).pages[
                        (holder.value as StringSearchType).pages.length - 1
                      ].length;
                      i++
                    ) {
                      sum += (holder.value as StringSearchType).pages[
                        (holder.value as StringSearchType).pages.length - 1
                      ][i].length
                    }
                    if (sum + newinputentry.length < wordlimit) {
                      ;(holder.value as StringSearchType).pages[
                        (holder.value as StringSearchType).pages.length - 1
                      ].push(newinputentry)
                    } else {
                      ;(holder.value as StringSearchType).pages = [
                        ...(holder.value as StringSearchType).pages,
                        [newinputentry]
                      ]
                    }
                  } else {
                    ;(holder.value as StringSearchType).pages = [[newinputentry]]
                  }
                  triggerRef(holder)
                  clearTimeout(time2)
                }, 100)
                const time3: ReturnType<typeof setTimeout> = setTimeout(() => {
                  ;(holder.value as StringSearchType).current =
                    (holder.value as StringSearchType).pages.length - 1
                  ;(holder.value as StringSearchType).signal++
                  triggerRef(holder)
                  clearTimeout(time3)
                }, 120)
              } else {
                ;(holder.value as StringSearchType).enteredwheninpage = true
                triggerRef(holder)
                //scroll to element and show effect that word is in page
                const time1: ReturnType<typeof setTimeout> = setTimeout(() => {
                  ;(holder.value as StringSearchType).current = inpagepageindexandpos.pageindex
                  ;(holder.value as StringSearchType).signal++
                  triggerRef(holder)
                  clearTimeout(time1)
                }, 400)
                const time7: ReturnType<typeof setTimeout> = setTimeout(() => {
                  if (
                    (holder.value as StringSearchType).addeditemsref[
                      inpagepageindexandpos.pos
                    ] as HTMLDivElement
                  ) {
                    scrollToElement(
                      (holder.value as StringSearchType).addeditemsref[
                        inpagepageindexandpos.pos
                      ] as HTMLDivElement
                    )
                    ;(
                      (holder.value as StringSearchType).addeditemsref[
                        inpagepageindexandpos.pos
                      ] as HTMLDivElement
                    ).style.backgroundColor = 'red'
                    ;(
                      (holder.value as StringSearchType).addeditemsref[
                        inpagepageindexandpos.pos
                      ] as HTMLDivElement
                    ).style.color = '#fff'
                    triggerRef(holder)
                  }
                  clearTimeout(time7)
                }, 500)
                const time2: ReturnType<typeof setTimeout> = setTimeout(() => {
                  if (
                    (holder.value as StringSearchType).addeditemsref[
                      inpagepageindexandpos.pos
                    ] as HTMLDivElement
                  ) {
                    if (
                      (
                        (holder.value as StringSearchType).addeditemsref[
                          inpagepageindexandpos.pos
                        ] as HTMLDivElement
                      ).style.backgroundColor !== '#fff'
                    ) {
                      ;(
                        (holder.value as StringSearchType).addeditemsref[
                          inpagepageindexandpos.pos
                        ] as HTMLDivElement
                      ).style.backgroundColor = '#fff'
                      ;(
                        (holder.value as StringSearchType).addeditemsref[
                          inpagepageindexandpos.pos
                        ] as HTMLDivElement
                      ).style.color = 'black'
                      triggerRef(holder)
                    }
                  }
                  clearTimeout(time2)
                }, 800)
              }
              ;(holder.value as StringSearchType).single = ''
              triggerRef(holder)
            }
          }
          break
        }
        case 'EQUAL-TO': {
          if (typeof newinputentry === 'string') {
            if (newinputentry.trim().length > 0) {
              const inpagepageindexandpos = await isAlreadyInPageArray(
                newinputentry,
                holder,
                'DIRECT',
                inputtype,
                from
              )
              if (!inpagepageindexandpos.inpage) {
                ;(
                  (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                    ? (holder.value as NumberType['search']['multiple'])
                    : (holder.value as AtNumber<NumberSearchType>).search
                  )?.equalto as NumberSearchExcludeEqualToType
                ).enteredwhennotinpage = true
                ;(
                  (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                    ? (holder.value as NumberType['search']['multiple'])
                    : (holder.value as AtNumber<NumberSearchType>).search
                  )?.equalto as NumberSearchExcludeEqualToType
                ).addloading = true
                triggerRef(holder)
                const time1: ReturnType<typeof setTimeout> = setTimeout(() => {
                  scrollToElement(
                    (
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.equalto as NumberSearchExcludeEqualToType
                    ).endoflistitemref as HTMLLIElement
                  )
                  clearTimeout(time1)
                }, 110)
                const time2: ReturnType<typeof setTimeout> = setTimeout(async () => {
                  ;(
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.equalto as NumberSearchExcludeEqualToType
                  ).addloading = false
                  triggerRef(holder)
                  if (
                    (
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.equalto as NumberSearchExcludeEqualToType
                    ).pages.length > 0
                  ) {
                    if (
                      (
                        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                          ? (holder.value as NumberType['search']['multiple'])
                          : (holder.value as AtNumber<NumberSearchType>).search
                        )?.equalto as NumberSearchExcludeEqualToType
                      ).pages[
                        (
                          (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                            ? (holder.value as NumberType['search']['multiple'])
                            : (holder.value as AtNumber<NumberSearchType>).search
                          )?.equalto as NumberSearchExcludeEqualToType
                        ).pages.length - 1
                      ].length < numberlimit
                    ) {
                      ;(
                        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                          ? (holder.value as NumberType['search']['multiple'])
                          : (holder.value as AtNumber<NumberSearchType>).search
                        )?.equalto as NumberSearchExcludeEqualToType
                      ).pages[
                        (
                          (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                            ? (holder.value as NumberType['search']['multiple'])
                            : (holder.value as AtNumber<NumberSearchType>).search
                          )?.equalto as NumberSearchExcludeEqualToType
                        ).pages.length - 1
                      ].push(newinputentry)
                    } else {
                      ;(
                        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                          ? (holder.value as NumberType['search']['multiple'])
                          : (holder.value as AtNumber<NumberSearchType>).search
                        )?.equalto as NumberSearchExcludeEqualToType
                      ).pages = [
                        ...(
                          (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                            ? (holder.value as NumberType['search']['multiple'])
                            : (holder.value as AtNumber<NumberSearchType>).search
                          )?.equalto as NumberSearchExcludeEqualToType
                        ).pages,
                        [newinputentry]
                      ]
                    }
                  } else {
                    ;(
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.equalto as NumberSearchExcludeEqualToType
                    ).pages = [[newinputentry]]
                  }
                  ;(
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.equalto as NumberSearchExcludeEqualToType
                  ).show.push(true)
                  ;(
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.equalto as NumberSearchExcludeEqualToType
                  ).shake.push(false)
                  triggerRef(holder)
                  clearTimeout(time2)
                }, 100)
                const time3: ReturnType<typeof setTimeout> = setTimeout(() => {
                  ;(
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.equalto as NumberSearchExcludeEqualToType
                  ).current =
                    (
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.equalto as NumberSearchExcludeEqualToType
                    ).pages.length - 1
                  ;(
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.equalto as NumberSearchExcludeEqualToType
                  ).signal++
                  triggerRef(holder)
                  clearTimeout(time3)
                }, 120)
              } else {
                ;(
                  (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                    ? (holder.value as NumberType['search']['multiple'])
                    : (holder.value as AtNumber<NumberSearchType>).search
                  )?.equalto as NumberSearchExcludeEqualToType
                ).enteredwheninpage = true
                triggerRef(holder)
                //scroll to element and show effect that word is in page
                const time3: ReturnType<typeof setTimeout> = setTimeout(() => {
                  ;(
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.equalto as NumberSearchExcludeEqualToType
                  ).current = inpagepageindexandpos.pageindex
                  ;(
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.equalto as NumberSearchExcludeEqualToType
                  ).signal++
                  triggerRef(holder)
                  clearTimeout(time3)
                }, 400)
                const time7: ReturnType<typeof setTimeout> = setTimeout(() => {
                  if (
                    (
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.equalto as NumberSearchExcludeEqualToType
                    ).addeditemsref[inpagepageindexandpos.pos] as HTMLDivElement
                  ) {
                    scrollToElement(
                      (
                        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                          ? (holder.value as NumberType['search']['multiple'])
                          : (holder.value as AtNumber<NumberSearchType>).search
                        )?.equalto as NumberSearchExcludeEqualToType
                      ).addeditemsref[inpagepageindexandpos.pos] as HTMLDivElement
                    )
                    ;(
                      (
                        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                          ? (holder.value as NumberType['search']['multiple'])
                          : (holder.value as AtNumber<NumberSearchType>).search
                        )?.equalto as NumberSearchExcludeEqualToType
                      ).inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement
                    ).style.backgroundColor = 'red'
                    ;(
                      (
                        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                          ? (holder.value as NumberType['search']['multiple'])
                          : (holder.value as AtNumber<NumberSearchType>).search
                        )?.equalto as NumberSearchExcludeEqualToType
                      ).inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement
                    ).style.color = '#fff'
                    ;(
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.equalto as NumberSearchExcludeEqualToType
                    ).show[inpagepageindexandpos.pos] = true
                    ;(
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.equalto as NumberSearchExcludeEqualToType
                    ).shake[inpagepageindexandpos.pos] = true
                    triggerRef(holder)
                  }
                  clearTimeout(time7)
                }, 500)
                const time1: ReturnType<typeof setTimeout> = setTimeout(() => {
                  ;(
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.equalto as NumberSearchExcludeEqualToType
                  ).shake[inpagepageindexandpos.pos] = true
                  triggerRef(holder)
                  clearTimeout(time1)
                }, 800)
                const time2: ReturnType<typeof setTimeout> = setTimeout(() => {
                  if (
                    (
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.equalto as NumberSearchExcludeEqualToType
                    ).inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement
                  ) {
                    if (
                      (
                        (
                          (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                            ? (holder.value as NumberType['search']['multiple'])
                            : (holder.value as AtNumber<NumberSearchType>).search
                          )?.equalto as NumberSearchExcludeEqualToType
                        ).inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement
                      ).style.backgroundColor !== '#fff'
                    ) {
                      ;(
                        (
                          (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                            ? (holder.value as NumberType['search']['multiple'])
                            : (holder.value as AtNumber<NumberSearchType>).search
                          )?.equalto as NumberSearchExcludeEqualToType
                        ).inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement
                      ).style.backgroundColor = '#fff'
                      ;(
                        (
                          (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                            ? (holder.value as NumberType['search']['multiple'])
                            : (holder.value as AtNumber<NumberSearchType>).search
                          )?.equalto as NumberSearchExcludeEqualToType
                        ).inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement
                      ).style.color = 'black'
                      ;(
                        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                          ? (holder.value as NumberType['search']['multiple'])
                          : (holder.value as AtNumber<NumberSearchType>).search
                        )?.equalto as NumberSearchExcludeEqualToType
                      ).shake[inpagepageindexandpos.pos] = false
                      triggerRef(holder)
                    }
                  }
                  clearTimeout(time2)
                }, 910)
                const time4: ReturnType<typeof setTimeout> = setTimeout(() => {
                  ;(
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.equalto as NumberSearchExcludeEqualToType
                  ).shake[inpagepageindexandpos.pos] = false
                  triggerRef(holder)
                  clearTimeout(time4)
                }, 915)
              }
              ;(
                (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                  ? (holder.value as NumberType['search']['multiple'])
                  : (holder.value as AtNumber<NumberSearchType>).search
                )?.equalto as NumberSearchExcludeEqualToType
              ).single = ''
              triggerRef(holder)
            }
          }
          break
        }
        case 'NOT-EQUAL-TO': {
          if (typeof newinputentry === 'string') {
            if (newinputentry.trim().length > 0) {
              const inpagepageindexandpos = await isAlreadyInPageArray(
                newinputentry,
                holder,
                'DIRECT',
                inputtype,
                from
              )
              if (!inpagepageindexandpos.inpage) {
                ;(
                  (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                    ? (holder.value as NumberType['search']['multiple'])
                    : (holder.value as AtNumber<NumberSearchType>).search
                  )?.notequalto as NumberSearchExcludeEqualToType
                ).enteredwhennotinpage = true
                ;(
                  (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                    ? (holder.value as NumberType['search']['multiple'])
                    : (holder.value as AtNumber<NumberSearchType>).search
                  )?.notequalto as NumberSearchExcludeEqualToType
                ).addloading = true
                triggerRef(holder)
                const time1: ReturnType<typeof setTimeout> = setTimeout(() => {
                  scrollToElement(
                    (
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.notequalto as NumberSearchExcludeEqualToType
                    ).endoflistitemref as HTMLLIElement
                  )
                  clearTimeout(time1)
                }, 110)
                const time2: ReturnType<typeof setTimeout> = setTimeout(async () => {
                  ;(
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.notequalto as NumberSearchExcludeEqualToType
                  ).addloading = false
                  triggerRef(holder)
                  if (
                    (
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.notequalto as NumberSearchExcludeEqualToType
                    ).pages.length > 0
                  ) {
                    if (
                      (
                        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                          ? (holder.value as NumberType['search']['multiple'])
                          : (holder.value as AtNumber<NumberSearchType>).search
                        )?.notequalto as NumberSearchExcludeEqualToType
                      ).pages[
                        (
                          (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                            ? (holder.value as NumberType['search']['multiple'])
                            : (holder.value as AtNumber<NumberSearchType>).search
                          )?.notequalto as NumberSearchExcludeEqualToType
                        ).pages.length - 1
                      ].length < numberlimit
                    ) {
                      ;(
                        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                          ? (holder.value as NumberType['search']['multiple'])
                          : (holder.value as AtNumber<NumberSearchType>).search
                        )?.notequalto as NumberSearchExcludeEqualToType
                      ).pages[
                        (
                          (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                            ? (holder.value as NumberType['search']['multiple'])
                            : (holder.value as AtNumber<NumberSearchType>).search
                          )?.notequalto as NumberSearchExcludeEqualToType
                        ).pages.length - 1
                      ].push(newinputentry)
                    } else {
                      ;(
                        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                          ? (holder.value as NumberType['search']['multiple'])
                          : (holder.value as AtNumber<NumberSearchType>).search
                        )?.notequalto as NumberSearchExcludeEqualToType
                      ).pages = [
                        ...(
                          (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                            ? (holder.value as NumberType['search']['multiple'])
                            : (holder.value as AtNumber<NumberSearchType>).search
                          )?.notequalto as NumberSearchExcludeEqualToType
                        ).pages,
                        [newinputentry]
                      ]
                    }
                  } else {
                    ;(
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.notequalto as NumberSearchExcludeEqualToType
                    ).pages = [[newinputentry]]
                  }
                  ;(
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.notequalto as NumberSearchExcludeEqualToType
                  ).show.push(true)
                  ;(
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.notequalto as NumberSearchExcludeEqualToType
                  ).shake.push(false)
                  triggerRef(holder)
                  clearTimeout(time2)
                }, 100)
                const time3: ReturnType<typeof setTimeout> = setTimeout(() => {
                  ;(
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.notequalto as NumberSearchExcludeEqualToType
                  ).current =
                    (
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.notequalto as NumberSearchExcludeEqualToType
                    ).pages.length - 1
                  ;(
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.notequalto as NumberSearchExcludeEqualToType
                  ).signal++
                  triggerRef(holder)
                  clearTimeout(time3)
                }, 120)
              } else {
                ;(
                  (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                    ? (holder.value as NumberType['search']['multiple'])
                    : (holder.value as AtNumber<NumberSearchType>).search
                  )?.notequalto as NumberSearchExcludeEqualToType
                ).enteredwheninpage = true
                triggerRef(holder)
                //scroll to element and show effect that word is in page
                const time3: ReturnType<typeof setTimeout> = setTimeout(() => {
                  ;(
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.notequalto as NumberSearchExcludeEqualToType
                  ).current = inpagepageindexandpos.pageindex
                  ;(
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.notequalto as NumberSearchExcludeEqualToType
                  ).signal++
                  triggerRef(holder)
                  clearTimeout(time3)
                }, 400)
                const time7: ReturnType<typeof setTimeout> = setTimeout(() => {
                  if (
                    (
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.notequalto as NumberSearchExcludeEqualToType
                    ).addeditemsref[inpagepageindexandpos.pos] as HTMLDivElement
                  ) {
                    scrollToElement(
                      (
                        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                          ? (holder.value as NumberType['search']['multiple'])
                          : (holder.value as AtNumber<NumberSearchType>).search
                        )?.notequalto as NumberSearchExcludeEqualToType
                      ).addeditemsref[inpagepageindexandpos.pos] as HTMLDivElement
                    )
                    ;(
                      (
                        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                          ? (holder.value as NumberType['search']['multiple'])
                          : (holder.value as AtNumber<NumberSearchType>).search
                        )?.notequalto as NumberSearchExcludeEqualToType
                      ).inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement
                    ).style.backgroundColor = 'red'
                    ;(
                      (
                        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                          ? (holder.value as NumberType['search']['multiple'])
                          : (holder.value as AtNumber<NumberSearchType>).search
                        )?.notequalto as NumberSearchExcludeEqualToType
                      ).inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement
                    ).style.color = '#fff'
                    ;(
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.notequalto as NumberSearchExcludeEqualToType
                    ).show[inpagepageindexandpos.pos] = true
                    ;(
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.notequalto as NumberSearchExcludeEqualToType
                    ).shake[inpagepageindexandpos.pos] = true
                    triggerRef(holder)
                  }
                  clearTimeout(time7)
                }, 500)
                const time1: ReturnType<typeof setTimeout> = setTimeout(() => {
                  ;(
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.notequalto as NumberSearchExcludeEqualToType
                  ).shake[inpagepageindexandpos.pos] = true
                  triggerRef(holder)
                  clearTimeout(time1)
                }, 800)
                const time2: ReturnType<typeof setTimeout> = setTimeout(() => {
                  if (
                    (
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.notequalto as NumberSearchExcludeEqualToType
                    ).inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement
                  ) {
                    if (
                      (
                        (
                          (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                            ? (holder.value as NumberType['search']['multiple'])
                            : (holder.value as AtNumber<NumberSearchType>).search
                          )?.notequalto as NumberSearchExcludeEqualToType
                        ).inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement
                      ).style.backgroundColor !== '#fff'
                    ) {
                      ;(
                        (
                          (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                            ? (holder.value as NumberType['search']['multiple'])
                            : (holder.value as AtNumber<NumberSearchType>).search
                          )?.notequalto as NumberSearchExcludeEqualToType
                        ).inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement
                      ).style.backgroundColor = '#fff'
                      ;(
                        (
                          (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                            ? (holder.value as NumberType['search']['multiple'])
                            : (holder.value as AtNumber<NumberSearchType>).search
                          )?.notequalto as NumberSearchExcludeEqualToType
                        ).inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement
                      ).style.color = 'black'
                      ;(
                        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                          ? (holder.value as NumberType['search']['multiple'])
                          : (holder.value as AtNumber<NumberSearchType>).search
                        )?.notequalto as NumberSearchExcludeEqualToType
                      ).shake[inpagepageindexandpos.pos] = false
                      triggerRef(holder)
                    }
                  }
                  clearTimeout(time2)
                }, 910)
                const time4: ReturnType<typeof setTimeout> = setTimeout(() => {
                  ;(
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.notequalto as NumberSearchExcludeEqualToType
                  ).shake[inpagepageindexandpos.pos] = false
                  triggerRef(holder)
                  clearTimeout(time4)
                }, 915)
              }
              ;(
                (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                  ? (holder.value as NumberType['search']['multiple'])
                  : (holder.value as AtNumber<NumberSearchType>).search
                )?.notequalto as NumberSearchExcludeEqualToType
              ).single = ''
              triggerRef(holder)
            }
          }
          break
        }
        default: {
          //EXCLUDE-EQUAL-TO
          if (typeof newinputentry === 'string') {
            if (newinputentry.trim().length > 0) {
              const inpagepageindexandpos1 = await isAlreadyInPageArray(
                newinputentry,
                holder,
                'INDIRECT-CHECK-WHETHER-NEWINPUTENTRY-WITHIN-RANGE-OF-EXCLUDE-FROMTO',
                undefined,
                from
              )
              if (!inpagepageindexandpos1.inpage) {
                const inpagepageindexandpos2 = await isAlreadyInPageArray(
                  newinputentry,
                  holder,
                  'DIRECT',
                  inputtype,
                  from
                )
                if (!inpagepageindexandpos2.inpage) {
                  ;(
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.exclude?.equalto as NumberSearchExcludeEqualToType
                  ).enteredwhennotinpage = true
                  ;(
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.exclude?.equalto as NumberSearchExcludeEqualToType
                  ).addloading = true
                  triggerRef(holder)
                  const time1: ReturnType<typeof setTimeout> = setTimeout(() => {
                    scrollToElement(
                      (
                        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                          ? (holder.value as NumberType['search']['multiple'])
                          : (holder.value as AtNumber<NumberSearchType>).search
                        )?.exclude?.equalto as NumberSearchExcludeEqualToType
                      ).endoflistitemref as HTMLLIElement
                    )
                    clearTimeout(time1)
                  }, 110)
                  const time2: ReturnType<typeof setTimeout> = setTimeout(async () => {
                    ;(
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.exclude?.equalto as NumberSearchExcludeEqualToType
                    ).addloading = false
                    triggerRef(holder)
                    if (
                      (
                        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                          ? (holder.value as NumberType['search']['multiple'])
                          : (holder.value as AtNumber<NumberSearchType>).search
                        )?.exclude?.equalto as NumberSearchExcludeEqualToType
                      ).pages.length > 0
                    ) {
                      if (
                        (
                          (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                            ? (holder.value as NumberType['search']['multiple'])
                            : (holder.value as AtNumber<NumberSearchType>).search
                          )?.exclude?.equalto as NumberSearchExcludeEqualToType
                        ).pages[
                          (
                            (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                              ? (holder.value as NumberType['search']['multiple'])
                              : (holder.value as AtNumber<NumberSearchType>).search
                            )?.exclude?.equalto as NumberSearchExcludeEqualToType
                          ).pages.length - 1
                        ].length < numberlimit
                      ) {
                        ;(
                          (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                            ? (holder.value as NumberType['search']['multiple'])
                            : (holder.value as AtNumber<NumberSearchType>).search
                          )?.exclude?.equalto as NumberSearchExcludeEqualToType
                        ).pages[
                          (
                            (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                              ? (holder.value as NumberType['search']['multiple'])
                              : (holder.value as AtNumber<NumberSearchType>).search
                            )?.exclude?.equalto as NumberSearchExcludeEqualToType
                          ).pages.length - 1
                        ].push(newinputentry)
                      } else {
                        ;(
                          (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                            ? (holder.value as NumberType['search']['multiple'])
                            : (holder.value as AtNumber<NumberSearchType>).search
                          )?.exclude?.equalto as NumberSearchExcludeEqualToType
                        ).pages = [
                          ...(
                            (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                              ? (holder.value as NumberType['search']['multiple'])
                              : (holder.value as AtNumber<NumberSearchType>).search
                            )?.exclude?.equalto as NumberSearchExcludeEqualToType
                          ).pages,
                          [newinputentry]
                        ]
                      }
                    } else {
                      ;(
                        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                          ? (holder.value as NumberType['search']['multiple'])
                          : (holder.value as AtNumber<NumberSearchType>).search
                        )?.exclude?.equalto as NumberSearchExcludeEqualToType
                      ).pages = [[newinputentry]]
                    }
                    ;(
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.exclude?.equalto as NumberSearchExcludeEqualToType
                    ).show.push(true)
                    ;(
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.exclude?.equalto as NumberSearchExcludeEqualToType
                    ).shake.push(false)
                    triggerRef(holder)
                    clearTimeout(time2)
                  }, 100)
                  const time3: ReturnType<typeof setTimeout> = setTimeout(() => {
                    ;(
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.exclude?.equalto as NumberSearchExcludeEqualToType
                    ).current =
                      (
                        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                          ? (holder.value as NumberType['search']['multiple'])
                          : (holder.value as AtNumber<NumberSearchType>).search
                        )?.exclude?.equalto as NumberSearchExcludeEqualToType
                      ).pages.length - 1
                    ;(
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.exclude?.equalto as NumberSearchExcludeEqualToType
                    ).signal++
                    triggerRef(holder)
                    clearTimeout(time3)
                  }, 120)
                } else {
                  ;(
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.exclude?.equalto as NumberSearchExcludeEqualToType
                  ).enteredwheninpage = true
                  triggerRef(holder)
                  //scroll to element and show effect that word is in page
                  const time3: ReturnType<typeof setTimeout> = setTimeout(() => {
                    ;(
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.exclude?.equalto as NumberSearchExcludeEqualToType
                    ).current = inpagepageindexandpos2.pageindex
                    ;(
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.exclude?.equalto as NumberSearchExcludeEqualToType
                    ).signal++
                    triggerRef(holder)
                    clearTimeout(time3)
                  }, 400)
                  const time7: ReturnType<typeof setTimeout> = setTimeout(() => {
                    if (
                      (
                        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                          ? (holder.value as NumberType['search']['multiple'])
                          : (holder.value as AtNumber<NumberSearchType>).search
                        )?.exclude?.equalto as NumberSearchExcludeEqualToType
                      ).addeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement
                    ) {
                      scrollToElement(
                        (
                          (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                            ? (holder.value as NumberType['search']['multiple'])
                            : (holder.value as AtNumber<NumberSearchType>).search
                          )?.exclude?.equalto as NumberSearchExcludeEqualToType
                        ).addeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement
                      )
                      ;(
                        (
                          (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                            ? (holder.value as NumberType['search']['multiple'])
                            : (holder.value as AtNumber<NumberSearchType>).search
                          )?.exclude?.equalto as NumberSearchExcludeEqualToType
                        ).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement
                      ).style.backgroundColor = 'red'
                      ;(
                        (
                          (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                            ? (holder.value as NumberType['search']['multiple'])
                            : (holder.value as AtNumber<NumberSearchType>).search
                          )?.exclude?.equalto as NumberSearchExcludeEqualToType
                        ).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement
                      ).style.color = '#fff'
                      ;(
                        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                          ? (holder.value as NumberType['search']['multiple'])
                          : (holder.value as AtNumber<NumberSearchType>).search
                        )?.exclude?.equalto as NumberSearchExcludeEqualToType
                      ).show[inpagepageindexandpos2.pos] = true
                      ;(
                        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                          ? (holder.value as NumberType['search']['multiple'])
                          : (holder.value as AtNumber<NumberSearchType>).search
                        )?.exclude?.equalto as NumberSearchExcludeEqualToType
                      ).shake[inpagepageindexandpos2.pos] = true
                      triggerRef(holder)
                    }
                    clearTimeout(time7)
                  }, 500)
                  const time1: ReturnType<typeof setTimeout> = setTimeout(() => {
                    ;(
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.exclude?.equalto as NumberSearchExcludeEqualToType
                    ).shake[inpagepageindexandpos2.pos] = true
                    triggerRef(holder)
                    clearTimeout(time1)
                  }, 800)
                  const time2: ReturnType<typeof setTimeout> = setTimeout(() => {
                    if (
                      (
                        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                          ? (holder.value as NumberType['search']['multiple'])
                          : (holder.value as AtNumber<NumberSearchType>).search
                        )?.exclude?.equalto as NumberSearchExcludeEqualToType
                      ).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement
                    ) {
                      if (
                        (
                          (
                            (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                              ? (holder.value as NumberType['search']['multiple'])
                              : (holder.value as AtNumber<NumberSearchType>).search
                            )?.exclude?.equalto as NumberSearchExcludeEqualToType
                          ).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement
                        ).style.backgroundColor !== '#fff'
                      ) {
                        ;(
                          (
                            (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                              ? (holder.value as NumberType['search']['multiple'])
                              : (holder.value as AtNumber<NumberSearchType>).search
                            )?.exclude?.equalto as NumberSearchExcludeEqualToType
                          ).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement
                        ).style.backgroundColor = '#fff'
                        ;(
                          (
                            (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                              ? (holder.value as NumberType['search']['multiple'])
                              : (holder.value as AtNumber<NumberSearchType>).search
                            )?.exclude?.equalto as NumberSearchExcludeEqualToType
                          ).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement
                        ).style.color = 'black'
                        ;(
                          (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                            ? (holder.value as NumberType['search']['multiple'])
                            : (holder.value as AtNumber<NumberSearchType>).search
                          )?.exclude?.equalto as NumberSearchExcludeEqualToType
                        ).shake[inpagepageindexandpos2.pos] = false
                        triggerRef(holder)
                      }
                    }
                    clearTimeout(time2)
                  }, 910)
                  const time4: ReturnType<typeof setTimeout> = setTimeout(() => {
                    ;(
                      (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                        ? (holder.value as NumberType['search']['multiple'])
                        : (holder.value as AtNumber<NumberSearchType>).search
                      )?.exclude?.equalto as NumberSearchExcludeEqualToType
                    ).shake[inpagepageindexandpos2.pos] = false
                    triggerRef(holder)
                    clearTimeout(time4)
                  }, 915)
                }
              }
              ;(
                (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                  ? (holder.value as NumberType['search']['multiple'])
                  : (holder.value as AtNumber<NumberSearchType>).search
                )?.exclude?.equalto as NumberSearchExcludeEqualToType
              ).single = ''
              triggerRef(holder)
            }
          }
          break
        }
      }
    } else {
      if (typeof newinputentry !== 'string') {
        await isAlreadyInPageArray(
          newinputentry,
          holder,
          'INDIRECT-CHECK-WHETHER-RANGE-NEWINPUTENTRY-COVERS-EXCLUDE-EQUALTO',
          undefined,
          from
        )
        const inpagepageindexandpos2 = await isAlreadyInPageArray(
          newinputentry,
          holder,
          'DIRECT',
          inputtype,
          from
        )
        if (!inpagepageindexandpos2.inpage) {
          ;(
            (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
              ? (holder.value as NumberType['search']['multiple'])
              : (holder.value as AtNumber<NumberSearchType>).search
            )?.exclude?.fromto as NumberSearchExcludeFromToType
          ).enteredwhennotinpage = true
          ;(
            (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
              ? (holder.value as NumberType['search']['multiple'])
              : (holder.value as AtNumber<NumberSearchType>).search
            )?.exclude?.fromto as NumberSearchExcludeFromToType
          ).addloading = true
          triggerRef(holder)
          const time1: ReturnType<typeof setTimeout> = setTimeout(() => {
            scrollToElement(
              (
                (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                  ? (holder.value as NumberType['search']['multiple'])
                  : (holder.value as AtNumber<NumberSearchType>).search
                )?.exclude?.fromto as NumberSearchExcludeFromToType
              ).endoflistitemref as HTMLLIElement
            )
            clearTimeout(time1)
          }, 110)
          const time2: ReturnType<typeof setTimeout> = setTimeout(async () => {
            ;(
              (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                ? (holder.value as NumberType['search']['multiple'])
                : (holder.value as AtNumber<NumberSearchType>).search
              )?.exclude?.fromto as NumberSearchExcludeFromToType
            ).addloading = false
            triggerRef(holder)
            if (
              (
                (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                  ? (holder.value as NumberType['search']['multiple'])
                  : (holder.value as AtNumber<NumberSearchType>).search
                )?.exclude?.fromto as NumberSearchExcludeFromToType
              ).pages.length > 0
            ) {
              if (
                (
                  (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                    ? (holder.value as NumberType['search']['multiple'])
                    : (holder.value as AtNumber<NumberSearchType>).search
                  )?.exclude?.fromto as NumberSearchExcludeFromToType
                ).pages[
                  (
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.exclude?.fromto as NumberSearchExcludeFromToType
                  ).pages.length - 1
                ].length < numberlimit
              ) {
                ;(
                  (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                    ? (holder.value as NumberType['search']['multiple'])
                    : (holder.value as AtNumber<NumberSearchType>).search
                  )?.exclude?.fromto as NumberSearchExcludeFromToType
                ).pages[
                  (
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.exclude?.fromto as NumberSearchExcludeFromToType
                  ).pages.length - 1
                ].push(newinputentry)
              } else {
                ;(
                  (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                    ? (holder.value as NumberType['search']['multiple'])
                    : (holder.value as AtNumber<NumberSearchType>).search
                  )?.exclude?.fromto as NumberSearchExcludeFromToType
                ).pages = [
                  ...(
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.exclude?.fromto as NumberSearchExcludeFromToType
                  ).pages,
                  [newinputentry]
                ]
              }
            } else {
              ;(
                (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                  ? (holder.value as NumberType['search']['multiple'])
                  : (holder.value as AtNumber<NumberSearchType>).search
                )?.exclude?.fromto as NumberSearchExcludeFromToType
              ).pages = [[newinputentry]]
            }
            ;(
              (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                ? (holder.value as NumberType['search']['multiple'])
                : (holder.value as AtNumber<NumberSearchType>).search
              )?.exclude?.fromto as NumberSearchExcludeFromToType
            ).show.push(true)
            ;(
              (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                ? (holder.value as NumberType['search']['multiple'])
                : (holder.value as AtNumber<NumberSearchType>).search
              )?.exclude?.fromto as NumberSearchExcludeFromToType
            ).shake.push(false)
            triggerRef(holder)
            clearTimeout(time2)
          }, 100)
          const time3: ReturnType<typeof setTimeout> = setTimeout(() => {
            ;(
              (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                ? (holder.value as NumberType['search']['multiple'])
                : (holder.value as AtNumber<NumberSearchType>).search
              )?.exclude?.fromto as NumberSearchExcludeFromToType
            ).current =
              (
                (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                  ? (holder.value as NumberType['search']['multiple'])
                  : (holder.value as AtNumber<NumberSearchType>).search
                )?.exclude?.fromto as NumberSearchExcludeFromToType
              ).pages.length - 1
            ;(
              (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                ? (holder.value as NumberType['search']['multiple'])
                : (holder.value as AtNumber<NumberSearchType>).search
              )?.exclude?.fromto as NumberSearchExcludeFromToType
            ).signal++
            triggerRef(holder)
            clearTimeout(time3)
          }, 120)
          ;(
            (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
              ? (holder.value as NumberType['search']['multiple'])
              : (holder.value as AtNumber<NumberSearchType>).search
            )?.exclude?.fromto as NumberSearchExcludeFromToType
          ).singlefrom = ''
          ;(
            (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
              ? (holder.value as NumberType['search']['multiple'])
              : (holder.value as AtNumber<NumberSearchType>).search
            )?.exclude?.fromto as NumberSearchExcludeFromToType
          ).singleto = ''
          triggerRef(holder)
        } else {
          ;(
            (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
              ? (holder.value as NumberType['search']['multiple'])
              : (holder.value as AtNumber<NumberSearchType>).search
            )?.exclude?.fromto as NumberSearchExcludeFromToType
          ).enteredwheninpage = true
          triggerRef(holder)
          //scroll to element and show effect that word is in page
          const time3: ReturnType<typeof setTimeout> = setTimeout(() => {
            ;(
              (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                ? (holder.value as NumberType['search']['multiple'])
                : (holder.value as AtNumber<NumberSearchType>).search
              )?.exclude?.fromto as NumberSearchExcludeFromToType
            ).current = inpagepageindexandpos2.pageindex
            ;(
              (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                ? (holder.value as NumberType['search']['multiple'])
                : (holder.value as AtNumber<NumberSearchType>).search
              )?.exclude?.fromto as NumberSearchExcludeFromToType
            ).signal++
            triggerRef(holder)
            clearTimeout(time3)
          }, 400)
          const time7: ReturnType<typeof setTimeout> = setTimeout(() => {
            if (
              (
                (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                  ? (holder.value as NumberType['search']['multiple'])
                  : (holder.value as AtNumber<NumberSearchType>).search
                )?.exclude?.fromto as NumberSearchExcludeFromToType
              ).addeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement
            ) {
              scrollToElement(
                (
                  (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                    ? (holder.value as NumberType['search']['multiple'])
                    : (holder.value as AtNumber<NumberSearchType>).search
                  )?.exclude?.fromto as NumberSearchExcludeFromToType
                ).addeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement
              )
              ;(
                (
                  (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                    ? (holder.value as NumberType['search']['multiple'])
                    : (holder.value as AtNumber<NumberSearchType>).search
                  )?.exclude?.fromto as NumberSearchExcludeFromToType
                ).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement
              ).style.backgroundColor = 'red'
              ;(
                (
                  (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                    ? (holder.value as NumberType['search']['multiple'])
                    : (holder.value as AtNumber<NumberSearchType>).search
                  )?.exclude?.fromto as NumberSearchExcludeFromToType
                ).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement
              ).style.color = '#fff'
              ;(
                (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                  ? (holder.value as NumberType['search']['multiple'])
                  : (holder.value as AtNumber<NumberSearchType>).search
                )?.exclude?.fromto as NumberSearchExcludeFromToType
              ).show[inpagepageindexandpos2.pos] = true
              ;(
                (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                  ? (holder.value as NumberType['search']['multiple'])
                  : (holder.value as AtNumber<NumberSearchType>).search
                )?.exclude?.fromto as NumberSearchExcludeFromToType
              ).shake[inpagepageindexandpos2.pos] = true
              triggerRef(holder)
            }
            clearTimeout(time7)
          }, 500)
          const time1: ReturnType<typeof setTimeout> = setTimeout(() => {
            ;(
              (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                ? (holder.value as NumberType['search']['multiple'])
                : (holder.value as AtNumber<NumberSearchType>).search
              )?.exclude?.fromto as NumberSearchExcludeFromToType
            ).shake[inpagepageindexandpos2.pos] = true
            triggerRef(holder)
            clearTimeout(time1)
          }, 800)
          const time2: ReturnType<typeof setTimeout> = setTimeout(() => {
            if (
              (
                (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                  ? (holder.value as NumberType['search']['multiple'])
                  : (holder.value as AtNumber<NumberSearchType>).search
                )?.exclude?.fromto as NumberSearchExcludeFromToType
              ).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement
            ) {
              if (
                (
                  (
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.exclude?.fromto as NumberSearchExcludeFromToType
                  ).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement
                ).style.backgroundColor !== '#fff'
              ) {
                ;(
                  (
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.exclude?.fromto as NumberSearchExcludeFromToType
                  ).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement
                ).style.backgroundColor = '#fff'
                ;(
                  (
                    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                      ? (holder.value as NumberType['search']['multiple'])
                      : (holder.value as AtNumber<NumberSearchType>).search
                    )?.exclude?.fromto as NumberSearchExcludeFromToType
                  ).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement
                ).style.color = 'black'
                ;(
                  (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                    ? (holder.value as NumberType['search']['multiple'])
                    : (holder.value as AtNumber<NumberSearchType>).search
                  )?.exclude?.fromto as NumberSearchExcludeFromToType
                ).shake[inpagepageindexandpos2.pos] = false
                triggerRef(holder)
              }
            }
            clearTimeout(time2)
          }, 910)
          const time4: ReturnType<typeof setTimeout> = setTimeout(() => {
            ;(
              (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                ? (holder.value as NumberType['search']['multiple'])
                : (holder.value as AtNumber<NumberSearchType>).search
              )?.exclude?.fromto as NumberSearchExcludeFromToType
            ).shake[inpagepageindexandpos2.pos] = false
            triggerRef(holder)
            clearTimeout(time4)
          }, 915)
        }
      }
    }
    const time10: ReturnType<typeof setTimeout> = setTimeout(() => {
      if (
        (holder.value as StringSearchType).enteredwheninpage &&
        (holder.value as StringSearchType).enteredwhennotinpage
      ) {
        if (inputtype === 'WORD') {
          ;(holder.value as StringSearchType).current =
            (holder.value as StringSearchType).pages.length - 1
          ;(holder.value as StringSearchType).signal++
        } else if (inputtype === 'EQUAL-TO') {
          ;(
            (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
              ? (holder.value as NumberType['search']['multiple'])
              : (holder.value as AtNumber<NumberSearchType>).search
            )?.equalto as NumberSearchExcludeEqualToType
          ).current =
            (
              (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                ? (holder.value as NumberType['search']['multiple'])
                : (holder.value as AtNumber<NumberSearchType>).search
              )?.equalto as NumberSearchExcludeEqualToType
            ).pages.length - 1
          ;(
            (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
              ? (holder.value as NumberType['search']['multiple'])
              : (holder.value as AtNumber<NumberSearchType>).search
            )?.equalto as NumberSearchExcludeEqualToType
          ).signal++
        } else if (inputtype === 'NOT-EQUAL-TO') {
          ;(
            (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
              ? (holder.value as NumberType['search']['multiple'])
              : (holder.value as AtNumber<NumberSearchType>).search
            )?.notequalto as NumberSearchExcludeEqualToType
          ).current =
            (
              (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                ? (holder.value as NumberType['search']['multiple'])
                : (holder.value as AtNumber<NumberSearchType>).search
              )?.notequalto as NumberSearchExcludeEqualToType
            ).pages.length - 1
          ;(
            (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
              ? (holder.value as NumberType['search']['multiple'])
              : (holder.value as AtNumber<NumberSearchType>).search
            )?.notequalto as NumberSearchExcludeEqualToType
          ).signal++
        } else if (inputtype == 'EXCLUDE-EQUAL-TO') {
          ;(
            (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
              ? (holder.value as NumberType['search']['multiple'])
              : (holder.value as AtNumber<NumberSearchType>).search
            )?.exclude?.equalto as NumberSearchExcludeEqualToType
          ).current =
            (
              (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                ? (holder.value as NumberType['search']['multiple'])
                : (holder.value as AtNumber<NumberSearchType>).search
              )?.exclude?.equalto as NumberSearchExcludeEqualToType
            ).pages.length - 1
          ;(
            (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
              ? (holder.value as NumberType['search']['multiple'])
              : (holder.value as AtNumber<NumberSearchType>).search
            )?.exclude?.equalto as NumberSearchExcludeEqualToType
          ).signal++
        } else {
          ;(
            (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
              ? (holder.value as NumberType['search']['multiple'])
              : (holder.value as AtNumber<NumberSearchType>).search
            )?.exclude?.fromto as NumberSearchExcludeFromToType
          ).current =
            (
              (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
                ? (holder.value as NumberType['search']['multiple'])
                : (holder.value as AtNumber<NumberSearchType>).search
              )?.exclude?.fromto as NumberSearchExcludeFromToType
            ).pages.length - 1
          ;(
            (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
              ? (holder.value as NumberType['search']['multiple'])
              : (holder.value as AtNumber<NumberSearchType>).search
            )?.exclude?.fromto as NumberSearchExcludeFromToType
          ).signal++
        }
        triggerRef(holder)
      }
      clearTimeout(time10)
    }, 935)
  })
}

export function deletePastedOrNewInputEntry(
  dindex: number,
  holder: ShallowRef<
    NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType | StringSearchType
  >,
  inputtype:
    | 'DISPLAYER-EQUAL-TO-NOT-EQUAL-TO-OR-EXCLUDE-EQUAL-TO'
    | 'DISPLAYER-EXCLUDE-FROM-TO'
    | 'WORD'
) {
  if (
    !(
      holder.value as
        | NumberSearchExcludeEqualToType
        | NumberSearchExcludeFromToType
        | StringSearchType
    ).deleting
  ) {
    ;(
      holder.value as
        | NumberSearchExcludeEqualToType
        | NumberSearchExcludeFromToType
        | StringSearchType
    ).deleting = true
    delete (
      holder.value as
        | NumberSearchExcludeEqualToType
        | NumberSearchExcludeFromToType
        | StringSearchType
    ).pages[
      (
        holder.value as
          | NumberSearchExcludeEqualToType
          | NumberSearchExcludeFromToType
          | StringSearchType
      ).current
    ][dindex]
    if (inputtype === 'WORD') {
      ;(holder.value as StringSearchType).pages[(holder.value as StringSearchType).current] = [
        ...(holder.value as StringSearchType).pages[
          (holder.value as StringSearchType).current
        ].filter((item: string | undefined | null) => item !== undefined && item !== null)
      ]
    } else if (inputtype === 'DISPLAYER-EQUAL-TO-NOT-EQUAL-TO-OR-EXCLUDE-EQUAL-TO') {
      ;(holder.value as NumberSearchExcludeEqualToType).pages[
        (holder.value as NumberSearchExcludeEqualToType).current
      ] = [
        ...(holder.value as NumberSearchExcludeEqualToType).pages[
          (holder.value as NumberSearchExcludeEqualToType).current
        ].filter((item: string | undefined | null) => item !== undefined && item !== null)
      ]
    } else {
      ;(holder.value as NumberSearchExcludeFromToType).pages[
        (holder.value as NumberSearchExcludeFromToType).current
      ] = [
        ...(holder.value as NumberSearchExcludeFromToType).pages[
          (holder.value as NumberSearchExcludeFromToType).current
        ].filter((item: [string, string] | undefined | null) => item !== undefined && item !== null)
      ]
    }
    delete (
      holder.value as
        | NumberSearchExcludeEqualToType
        | NumberSearchExcludeFromToType
        | StringSearchType
    ).addeditemsref[dindex]
    ;(
      holder.value as
        | NumberSearchExcludeEqualToType
        | NumberSearchExcludeFromToType
        | StringSearchType
    ).addeditemsref = [
      ...(
        holder.value as
          | NumberSearchExcludeEqualToType
          | NumberSearchExcludeFromToType
          | StringSearchType
      ).addeditemsref.filter(
        (item: HTMLDivElement | undefined | null) => item !== undefined && item !== null
      )
    ]
    if (inputtype !== 'WORD') {
      delete (holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType)
        .inneraddeditemsref[dindex]
      ;(
        holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType
      ).inneraddeditemsref = [
        ...(
          holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType
        ).inneraddeditemsref.filter(
          (item: HTMLDivElement | undefined | null) => item !== undefined && item !== null
        )
      ]
      delete (holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType).shake[
        dindex
      ]
      ;(holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType).shake = [
        ...(
          holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType
        ).shake.filter((item: boolean | undefined | null) => item !== undefined && item !== null)
      ]
      delete (holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType).show[
        dindex
      ]
      ;(holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType).show = [
        ...(
          holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType
        ).show.filter((item: boolean | undefined | null) => item !== undefined && item !== null)
      ]
    }

    triggerRef(holder)

    if (
      (
        holder.value as
          | NumberSearchExcludeEqualToType
          | NumberSearchExcludeFromToType
          | StringSearchType
      ).pages[
        (
          holder.value as
            | NumberSearchExcludeEqualToType
            | NumberSearchExcludeFromToType
            | StringSearchType
        ).current
      ].length > 0
    ) {
      const isize = (
        holder.value as
          | NumberSearchExcludeEqualToType
          | NumberSearchExcludeFromToType
          | StringSearchType
      ).pages.length
      for (
        let i = (
          holder.value as
            | NumberSearchExcludeEqualToType
            | NumberSearchExcludeFromToType
            | StringSearchType
        ).current;
        i < isize;
        i++
      ) {
        if (
          i + 1 <
          (
            holder.value as
              | NumberSearchExcludeEqualToType
              | NumberSearchExcludeFromToType
              | StringSearchType
          ).pages.length
        ) {
          inputtype === 'WORD'
            ? (holder.value as StringSearchType).pages[i].push(
                (holder.value as StringSearchType).pages[i + 1][0]
              )
            : inputtype === 'DISPLAYER-EQUAL-TO-NOT-EQUAL-TO-OR-EXCLUDE-EQUAL-TO'
            ? (holder.value as NumberSearchExcludeEqualToType).pages[i].push(
                (holder.value as NumberSearchExcludeEqualToType).pages[i + 1][0]
              )
            : (holder.value as NumberSearchExcludeFromToType).pages[i].push(
                (holder.value as NumberSearchExcludeFromToType).pages[i + 1][0]
              )
          delete (
            holder.value as
              | NumberSearchExcludeEqualToType
              | NumberSearchExcludeFromToType
              | StringSearchType
          ).pages[i + 1][0]
          if (inputtype === 'WORD') {
            ;(holder.value as StringSearchType).pages[i + 1] = [
              ...(holder.value as StringSearchType).pages[i + 1].filter(
                (item: string | undefined | null) => item !== undefined && item !== null
              )
            ]
          } else if (inputtype === 'DISPLAYER-EQUAL-TO-NOT-EQUAL-TO-OR-EXCLUDE-EQUAL-TO') {
            ;(holder.value as NumberSearchExcludeEqualToType).pages[i + 1] = [
              ...(holder.value as NumberSearchExcludeEqualToType).pages[i + 1].filter(
                (item: string | undefined | null) => item !== undefined && item !== null
              )
            ]
          } else {
            ;(holder.value as NumberSearchExcludeFromToType).pages[i + 1] = [
              ...(holder.value as NumberSearchExcludeFromToType).pages[i + 1].filter(
                (item: [string, string] | undefined | null) => item !== undefined && item !== null
              )
            ]
          }
          triggerRef(holder)
          if (
            (
              holder.value as
                | NumberSearchExcludeEqualToType
                | NumberSearchExcludeFromToType
                | StringSearchType
            ).pages[i + 1].length === 0
          ) {
            ;(
              holder.value as
                | NumberSearchExcludeEqualToType
                | NumberSearchExcludeFromToType
                | StringSearchType
            ).pages.splice(i + 1, 1)
            inputtype === 'WORD'
              ? ((holder.value as StringSearchType).pages = [
                  ...(holder.value as StringSearchType).pages.filter(
                    (item: string[] | undefined | null) => item !== undefined && item !== null
                  )
                ])
              : inputtype === 'DISPLAYER-EQUAL-TO-NOT-EQUAL-TO-OR-EXCLUDE-EQUAL-TO'
              ? ((holder.value as NumberSearchExcludeEqualToType).pages = [
                  ...(holder.value as NumberSearchExcludeEqualToType).pages.filter(
                    (item: string[] | undefined | null) => item !== undefined && item !== null
                  )
                ])
              : ((holder.value as NumberSearchExcludeFromToType).pages = [
                  ...(holder.value as NumberSearchExcludeFromToType).pages.filter(
                    (item: [string, string][] | undefined | null) =>
                      item !== undefined && item !== null
                  )
                ])
            triggerRef(holder)
            break
          }
        }
      }
    } else {
      ;(
        holder.value as
          | NumberSearchExcludeEqualToType
          | NumberSearchExcludeFromToType
          | StringSearchType
      ).pages.splice(
        (
          holder.value as
            | NumberSearchExcludeEqualToType
            | NumberSearchExcludeFromToType
            | StringSearchType
        ).current,
        1
      )
      inputtype === 'WORD'
        ? ((holder.value as StringSearchType).pages = [
            ...(holder.value as StringSearchType).pages.filter(
              (item: string[] | undefined | null) => item !== undefined && item !== null
            )
          ])
        : inputtype === 'DISPLAYER-EQUAL-TO-NOT-EQUAL-TO-OR-EXCLUDE-EQUAL-TO'
        ? ((holder.value as NumberSearchExcludeEqualToType).pages = [
            ...(holder.value as NumberSearchExcludeEqualToType).pages.filter(
              (item: string[] | undefined | null) => item !== undefined && item !== null
            )
          ])
        : ((holder.value as NumberSearchExcludeFromToType).pages = [
            ...(holder.value as NumberSearchExcludeFromToType).pages.filter(
              (item: [string, string][] | undefined | null) => item !== undefined && item !== null
            )
          ])
      ;(
        holder.value as
          | NumberSearchExcludeEqualToType
          | NumberSearchExcludeFromToType
          | StringSearchType
      ).current =
        (
          holder.value as
            | NumberSearchExcludeEqualToType
            | NumberSearchExcludeFromToType
            | StringSearchType
        ).pages.length - 1
      ;(
        holder.value as
          | NumberSearchExcludeEqualToType
          | NumberSearchExcludeFromToType
          | StringSearchType
      ).signal++
      triggerRef(holder)
    }
    ;(
      holder.value as
        | NumberSearchExcludeEqualToType
        | NumberSearchExcludeFromToType
        | StringSearchType
    ).deleting = false
    triggerRef(holder)
  }
}

export function setTabAndResetOthers(
  tab: 'GREATER-THAN' | 'LESS-THAN' | 'EQUAL-TO' | 'NOT-EQUAL-TO' | 'FROM-TO',
  holder: ShallowRef<NumberType['search']['multiple'] | AtNumber<NumberSearchType>>,
  from?: 'NUMBER-SEARCHER-MODAL' | 'NUMBER-STRING-OR-SINGLE-WORD-STRING-SEARCHER-MODAL' | undefined
) {
  if (tab === 'GREATER-THAN') {
    if (
      (
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search
        )?.greaterthan as string
      ).trim().length > 0
    ) {
      ;(
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search) as NumberSearchType
      ).lessthan = ''
      ;(
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search) as NumberSearchType
      ).fromto.from = ''
      ;(
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search) as NumberSearchType
      ).fromto.to = ''
      ;(
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search
        )?.equalto as NumberSearchExcludeEqualToType
      ).single = ''
      ;(
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search
        )?.notequalto as NumberSearchExcludeEqualToType
      ).single = ''
      ;(
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search
        )?.equalto as NumberSearchExcludeEqualToType
      ).pages = []
      ;(
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search
        )?.notequalto as NumberSearchExcludeEqualToType
      ).pages = []
    }
  } else if (tab === 'LESS-THAN') {
    if (
      (
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search
        )?.lessthan as string
      ).trim().length > 0
    ) {
      ;(
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search) as NumberSearchType
      ).greaterthan = ''
      ;(
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search) as NumberSearchType
      ).fromto.from = ''
      ;(
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search) as NumberSearchType
      ).fromto.to = ''
      ;(
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search
        )?.equalto as NumberSearchExcludeEqualToType
      ).single = ''
      ;(
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search
        )?.notequalto as NumberSearchExcludeEqualToType
      ).single = ''
      ;(
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search
        )?.equalto as NumberSearchExcludeEqualToType
      ).pages = []
      ;(
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search
        )?.notequalto as NumberSearchExcludeEqualToType
      ).pages = []
    }
  } else if (tab === 'EQUAL-TO') {
    if (
      (
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search
        )?.equalto as NumberSearchExcludeEqualToType
      ).single.trim().length > 0 ||
      (
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search
        )?.equalto as NumberSearchExcludeEqualToType
      ).pages.length > 0
    ) {
      ;(
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search) as NumberSearchType
      ).greaterthan = ''
      ;(
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search) as NumberSearchType
      ).lessthan = ''
      ;(
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search) as NumberSearchType
      ).fromto.from = ''
      ;(
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search) as NumberSearchType
      ).fromto.to = ''
      ;(
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search
        )?.notequalto as NumberSearchExcludeEqualToType
      ).single = ''
      ;(
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search
        )?.notequalto as NumberSearchExcludeEqualToType
      ).pages = []
    }
  } else if (tab === 'NOT-EQUAL-TO') {
    if (
      (
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search
        )?.notequalto as NumberSearchExcludeEqualToType
      ).single.trim().length > 0 ||
      (
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search
        )?.notequalto as NumberSearchExcludeEqualToType
      ).pages.length > 0
    ) {
      ;(
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search) as NumberSearchType
      ).greaterthan = ''
      ;(
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search) as NumberSearchType
      ).lessthan = ''
      ;(
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search) as NumberSearchType
      ).fromto.from = ''
      ;(
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search) as NumberSearchType
      ).fromto.to = ''
      ;(
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search
        )?.equalto as NumberSearchExcludeEqualToType
      ).single = ''
      ;(
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search
        )?.equalto as NumberSearchExcludeEqualToType
      ).pages = []
    }
  } else {
    if (
      (
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search) as NumberSearchType
      ).fromto.from.trim().length > 0 ||
      (
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search) as NumberSearchType
      ).fromto.to.trim().length > 0
    ) {
      ;(
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search) as NumberSearchType
      ).greaterthan = ''
      ;(
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search) as NumberSearchType
      ).lessthan = ''
      ;(
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search
        )?.equalto as NumberSearchExcludeEqualToType
      ).single = ''
      ;(
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search
        )?.notequalto as NumberSearchExcludeEqualToType
      ).single = ''
      ;(
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search
        )?.equalto as NumberSearchExcludeEqualToType
      ).pages = []
      ;(
        (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search
        )?.notequalto as NumberSearchExcludeEqualToType
      ).pages = []
    }
  }

  ;(
    (from === 'NUMBER-SEARCHER-MODAL' || from === undefined
      ? (holder.value as NumberType['search']['multiple'])
      : (holder.value as AtNumber<NumberSearchType>).search) as NumberSearchType
  ).tab = tab
  triggerRef(holder)
}
